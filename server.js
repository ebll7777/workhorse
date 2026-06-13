import "dotenv/config";
import crypto from "node:crypto";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import Stripe from "stripe";
import { products } from "./src/data/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scryptAsync = promisify(crypto.scrypt);

const app = express();
const port = Number(process.env.PORT || 4242);
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const paypalClientId = process.env.PAYPAL_CLIENT_ID;
const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;
const paypalEnvironment = (process.env.PAYPAL_ENVIRONMENT || "sandbox").toLowerCase();
const paypalApiBaseUrl =
  paypalEnvironment === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const productMap = new Map(products.map((product) => [product.id, product]));

const AUTH_STORE_DIR = path.resolve(process.env.AUTH_STORE_DIR || path.join(__dirname, "data"));
const AUTH_STORE_PATH = path.join(AUTH_STORE_DIR, "auth-store.json");
const AUTH_COOKIE_NAME = "workhorse_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const DEFAULT_AUTH_STORE = {
  users: [],
  sessions: [],
  subscribers: [],
};
const FRONTEND_DIST_PATH = path.join(__dirname, "dist");
const FRONTEND_ENTRY_PATH = path.join(FRONTEND_DIST_PATH, "index.html");
const SHOULD_USE_SECURE_COOKIES =
  process.env.NODE_ENV === "production" ||
  /^https:\/\//i.test(process.env.PUBLIC_SITE_URL || "") ||
  /^https:\/\//i.test(process.env.SERVER_PUBLIC_URL || "");

if (!stripeSecretKey) {
  console.warn("Missing STRIPE_SECRET_KEY. Stripe checkout endpoints will return an error until it is set.");
}

if (!paypalClientId || !paypalClientSecret) {
  console.warn("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET. PayPal checkout endpoints will return an error until they are set.");
}

app.set("trust proxy", 1);
app.use(express.json());

function normalizeEmail(value = "") {
  return String(value).trim().toLowerCase();
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    createdAt: user.createdAt,
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeCheckoutDetails(checkoutDetails = {}, customerEmail = "") {
  return {
    email: normalizeEmail(checkoutDetails?.email || customerEmail),
    firstName: String(checkoutDetails?.firstName || "").trim(),
    lastName: String(checkoutDetails?.lastName || "").trim(),
    country: String(checkoutDetails?.country || "").trim(),
    stateRegion: String(checkoutDetails?.stateRegion || "").trim(),
    postalCode: String(checkoutDetails?.postalCode || "").trim(),
    street: String(checkoutDetails?.street || "").trim(),
    streetNumber: String(checkoutDetails?.streetNumber || "").trim(),
    phoneCountryCode: String(checkoutDetails?.phoneCountryCode || "").trim(),
    phoneNumber: String(checkoutDetails?.phoneNumber || "").trim(),
  };
}

function validateCheckoutDetails(checkoutDetails) {
  if (!isValidEmail(checkoutDetails.email)) {
    return "Enter a valid email address before paying.";
  }

  if (!checkoutDetails.firstName) {
    return "Enter the shipping first name.";
  }

  if (!checkoutDetails.lastName) {
    return "Enter the shipping last name.";
  }

  if (!checkoutDetails.street) {
    return "Enter the shipping street.";
  }

  if (!checkoutDetails.streetNumber) {
    return "Enter the shipping street number.";
  }

  if (!checkoutDetails.country) {
    return "Enter the shipping country.";
  }

  if (!checkoutDetails.stateRegion) {
    return "Enter the shipping state or region.";
  }

  if (!checkoutDetails.postalCode) {
    return "Enter the shipping postal code.";
  }

  if (!checkoutDetails.phoneCountryCode) {
    return "Select the phone country code.";
  }

  if (!checkoutDetails.phoneNumber) {
    return "Enter the phone number.";
  }

  return "";
}

function buildCartEntries(items) {
  return items.map((item) => {
    const productId = Number(item.id);
    const quantity = Number(item.quantity);
    const product = productMap.get(productId);

    if (!product || !Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("One or more cart items are invalid.");
    }

    return {
      product,
      quantity,
      unitAmount: Math.round(product.price * 100),
    };
  });
}

function getOrderMetadata(checkoutDetails, user, subscribeToUpdates) {
  return {
    subscriberOptIn: subscribeToUpdates ? "yes" : "no",
    customerEmail: checkoutDetails.email,
    firstName: checkoutDetails.firstName,
    lastName: checkoutDetails.lastName,
    country: checkoutDetails.country,
    stateRegion: checkoutDetails.stateRegion,
    postalCode: checkoutDetails.postalCode,
    street: checkoutDetails.street,
    streetNumber: checkoutDetails.streetNumber,
    phoneCountryCode: checkoutDetails.phoneCountryCode,
    phoneNumber: checkoutDetails.phoneNumber,
    userId: user?.id || "guest",
  };
}

function getServerOrigin(req) {
  const configuredOrigin = process.env.SERVER_PUBLIC_URL || process.env.API_PUBLIC_URL;
  if (configuredOrigin) {
    return configuredOrigin.replace(/\/$/, "");
  }

  const forwardedProtoHeader = req.headers["x-forwarded-proto"];
  const forwardedProto = Array.isArray(forwardedProtoHeader)
    ? forwardedProtoHeader[0]
    : String(forwardedProtoHeader || "").split(",")[0].trim();
  const protocol = forwardedProto || "http";
  const host = req.headers.host || `localhost:${port}`;
  return `${protocol}://${host}`;
}

async function getPayPalAccessToken() {
  if (!paypalClientId || !paypalClientSecret) {
    throw new Error("PayPal is not configured yet. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to your .env file.");
  }

  const authHeader = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString("base64");
  const response = await fetch(`${paypalApiBaseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.access_token) {
    throw new Error(payload?.error_description || payload?.error || "Unable to authenticate with PayPal.");
  }

  return payload.access_token;
}

async function createPayPalOrder({ cartEntries, checkoutDetails, origin, serverOrigin }) {
  const accessToken = await getPayPalAccessToken();
  const orderTotal = cartEntries.reduce((sum, entry) => sum + entry.unitAmount * entry.quantity, 0) / 100;

  const response = await fetch(`${paypalApiBaseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      payment_source: {
        paypal: {
          email_address: checkoutDetails.email,
          experience_context: {
            brand_name: "Workhorse",
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
            return_url: `${serverOrigin}/api/paypal/return?origin=${encodeURIComponent(origin)}`,
            cancel_url: `${origin}/?checkout=cancel&view=checkout`,
          },
        },
      },
      purchase_units: [
        {
          description: "Workhorse order",
          custom_id: checkoutDetails.email,
          amount: {
            currency_code: "EUR",
            value: orderTotal.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "EUR",
                value: orderTotal.toFixed(2),
              },
            },
          },
          items: cartEntries.map((entry) => ({
            name: entry.product.title.slice(0, 127),
            quantity: String(entry.quantity),
            category: "PHYSICAL_GOODS",
            unit_amount: {
              currency_code: "EUR",
              value: (entry.unitAmount / 100).toFixed(2),
            },
          })),
        },
      ],
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || payload?.details?.[0]?.description || "Unable to create the PayPal order.");
  }

  const approvalLink = payload?.links?.find((link) => link.rel === "approve" || link.rel === "payer-action")?.href;

  if (!approvalLink) {
    throw new Error("PayPal did not return an approval URL.");
  }

  return approvalLink;
}

async function capturePayPalOrder(orderId) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${paypalApiBaseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || payload?.details?.[0]?.description || "Unable to capture the PayPal order.");
  }

  return payload;
}

function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function serializeCookie(name, value, options = {}) {
  const segments = [`${name}=${value}`];

  if (options.maxAge !== undefined) {
    segments.push(`Max-Age=${options.maxAge}`);
  }

  if (options.path) {
    segments.push(`Path=${options.path}`);
  }

  if (options.httpOnly) {
    segments.push("HttpOnly");
  }

  if (options.sameSite) {
    segments.push(`SameSite=${options.sameSite}`);
  }

  if (options.secure) {
    segments.push("Secure");
  }

  return segments.join("; ");
}

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((allCookies, part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex === -1) {
        return allCookies;
      }

      const name = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();
      allCookies[name] = decodeURIComponent(value);
      return allCookies;
    }, {});
}

async function ensureAuthStore() {
  await fs.mkdir(AUTH_STORE_DIR, { recursive: true });

  try {
    await fs.access(AUTH_STORE_PATH);
  } catch {
    await fs.writeFile(AUTH_STORE_PATH, JSON.stringify(DEFAULT_AUTH_STORE, null, 2));
  }
}

async function readAuthStore() {
  await ensureAuthStore();
  const raw = await fs.readFile(AUTH_STORE_PATH, "utf8");
  const parsed = JSON.parse(raw || "{}");

  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : [],
  };
}

async function writeAuthStore(store) {
  await ensureAuthStore();
  const tempPath = `${AUTH_STORE_PATH}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(store, null, 2));
  await fs.rename(tempPath, AUTH_STORE_PATH);
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password, storedHash) {
  const [salt, key] = String(storedHash).split(":");
  if (!salt || !key) {
    return false;
  }

  const derivedKey = await scryptAsync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(key, "hex"), derivedKey);
}

function pruneExpiredSessions(store) {
  const now = Date.now();
  store.sessions = store.sessions.filter((session) => new Date(session.expiresAt).getTime() > now);
}

function attachSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    serializeCookie(AUTH_COOKIE_NAME, encodeURIComponent(token), {
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
      maxAge: Math.floor(SESSION_TTL_MS / 1000),
      secure: SHOULD_USE_SECURE_COOKIES,
    })
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    serializeCookie(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
      maxAge: 0,
      secure: SHOULD_USE_SECURE_COOKIES,
    })
  );
}

async function createSession(store, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS).toISOString();

  store.sessions.push({
    id: crypto.randomUUID(),
    userId,
    tokenHash: hashSessionToken(token),
    createdAt: now.toISOString(),
    expiresAt,
  });

  await writeAuthStore(store);
  return token;
}

function upsertSubscriber(store, checkoutDetails) {
  const email = normalizeEmail(checkoutDetails.email);
  const existingIndex = store.subscribers.findIndex((entry) => entry.email === email);
  const subscriberRecord = {
    id: existingIndex >= 0 ? store.subscribers[existingIndex].id : crypto.randomUUID(),
    email,
    firstName: checkoutDetails.firstName,
    lastName: checkoutDetails.lastName,
    country: checkoutDetails.country,
    stateRegion: checkoutDetails.stateRegion,
    postalCode: checkoutDetails.postalCode,
    street: checkoutDetails.street,
    streetNumber: checkoutDetails.streetNumber,
    phoneCountryCode: checkoutDetails.phoneCountryCode,
    phoneNumber: checkoutDetails.phoneNumber,
    updatedAt: new Date().toISOString(),
    subscribedAt:
      existingIndex >= 0
        ? store.subscribers[existingIndex].subscribedAt
        : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    store.subscribers[existingIndex] = subscriberRecord;
  } else {
    store.subscribers.push(subscriberRecord);
  }
}
async function getAuthContext(req) {
  const store = await readAuthStore();
  pruneExpiredSessions(store);

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[AUTH_COOKIE_NAME];

  if (!token) {
    await writeAuthStore(store);
    return { store, user: null, session: null };
  }

  const tokenHash = hashSessionToken(token);
  const session = store.sessions.find((entry) => entry.tokenHash === tokenHash);

  if (!session) {
    await writeAuthStore(store);
    return { store, user: null, session: null };
  }

  const user = store.users.find((entry) => entry.id === session.userId) || null;
  await writeAuthStore(store);

  return { store, user, session };
}

app.get("/api/stripe-config", async (_req, res) => {
  if (!stripePublishableKey) {
    return res.status(500).json({
      error: "Stripe is missing STRIPE_PUBLISHABLE_KEY. Add it to your .env file to enable embedded card payments.",
    });
  }

  return res.json({ publishableKey: stripePublishableKey });
});

app.get("/api/auth/session", async (req, res) => {
  try {
    const { user } = await getAuthContext(req);
    return res.json({ user: user ? sanitizeUser(user) : null });
  } catch {
    return res.status(500).json({ error: "Unable to load the current session." });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    const address = {
      country: String(req.body?.address?.country || "").trim(),
      stateRegion: String(req.body?.address?.stateRegion || "").trim(),
      postalCode: String(req.body?.address?.postalCode || "").trim(),
      street: String(req.body?.address?.street || "").trim(),
      streetNumber: String(req.body?.address?.streetNumber || "").trim(),
    };

    if (!name) {
      return res.status(400).json({ error: "Enter a name to create an account." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Passwords must be at least 8 characters long." });
    }

    if (!address.country) {
      return res.status(400).json({ error: "Enter the shipping country for this account." });
    }

    if (!address.stateRegion) {
      return res.status(400).json({ error: "Enter the shipping state or region for this account." });
    }

    if (!address.postalCode) {
      return res.status(400).json({ error: "Enter the shipping postal code for this account." });
    }

    if (!address.street) {
      return res.status(400).json({ error: "Enter the shipping street for this account." });
    }

    if (!address.streetNumber) {
      return res.status(400).json({ error: "Enter the shipping street number for this account." });
    }

    const store = await readAuthStore();
    pruneExpiredSessions(store);

    if (store.users.some((user) => user.email === email)) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      address,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    store.users.push(user);
    const token = await createSession(store, user.id);
    attachSessionCookie(res, token);

    return res.status(201).json({ user: sanitizeUser(user) });
  } catch {
    return res.status(500).json({ error: "Unable to create that account right now." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ error: "Enter your email and password to sign in." });
    }

    const store = await readAuthStore();
    pruneExpiredSessions(store);
    const user = store.users.find((entry) => entry.email === email);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: "That email or password is incorrect." });
    }

    const token = await createSession(store, user.id);
    attachSessionCookie(res, token);

    return res.json({ user: sanitizeUser(user) });
  } catch {
    return res.status(500).json({ error: "Unable to sign in right now." });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  try {
    const store = await readAuthStore();
    pruneExpiredSessions(store);
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[AUTH_COOKIE_NAME];

    if (token) {
      const tokenHash = hashSessionToken(token);
      store.sessions = store.sessions.filter((entry) => entry.tokenHash !== tokenHash);
      await writeAuthStore(store);
    } else {
      await writeAuthStore(store);
    }

    clearSessionCookie(res);
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Unable to sign out right now." });
  }
});

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { items, customerEmail, checkoutDetails, subscribeToUpdates } = req.body ?? {};
    const { store, user } = await getAuthContext(req);

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Your cart is empty." });
    }

    if (!stripe) {
      return res.status(500).json({
        error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to your .env file.",
      });
    }

    const normalizedCheckoutDetails = normalizeCheckoutDetails(checkoutDetails, customerEmail);
    const validationError = validateCheckoutDetails(normalizedCheckoutDetails);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const cartEntries = buildCartEntries(items);
    const totalAmount = cartEntries.reduce((sum, entry) => sum + entry.unitAmount * entry.quantity, 0);

    if (subscribeToUpdates) {
      upsertSubscriber(store, normalizedCheckoutDetails);
      await writeAuthStore(store);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "eur",
      payment_method_types: ["card"],
      receipt_email: normalizedCheckoutDetails.email,
      description: "Workhorse order",
      metadata: getOrderMetadata(normalizedCheckoutDetails, user, subscribeToUpdates),
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to initialize the card payment.",
    });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const {
      items,
      customerEmail,
      checkoutDetails,
      subscribeToUpdates,
      paymentMethod = "stripe",
    } = req.body ?? {};
    const { store, user } = await getAuthContext(req);

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Your cart is empty." });
    }

    const normalizedCheckoutDetails = normalizeCheckoutDetails(checkoutDetails, customerEmail);
    const validationError = validateCheckoutDetails(normalizedCheckoutDetails);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const cartEntries = buildCartEntries(items);

    const origin = req.headers.origin || process.env.PUBLIC_SITE_URL || "http://localhost:5173";
    const serverOrigin = getServerOrigin(req);

    if (subscribeToUpdates) {
      upsertSubscriber(store, normalizedCheckoutDetails);
      await writeAuthStore(store);
    }

    if (paymentMethod === "paypal") {
      const approvalUrl = await createPayPalOrder({
        cartEntries,
        checkoutDetails: normalizedCheckoutDetails,
        origin,
        serverOrigin,
      });

      return res.json({ url: approvalUrl });
    }

    return res.status(400).json({
      error: "Stripe card payments now run directly inside the checkout page.",
    });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to create the payment session.",
    });
  }
});

app.get("/api/paypal/return", async (req, res) => {
  const origin =
    typeof req.query.origin === "string" && req.query.origin
      ? req.query.origin
      : process.env.PUBLIC_SITE_URL || "http://localhost:5173";
  const orderId = String(req.query.token || req.query.orderId || "").trim();

  if (!orderId) {
    return res.redirect(`${origin}/?checkout=cancel&view=checkout`);
  }

  try {
    await capturePayPalOrder(orderId);
    return res.redirect(`${origin}/?checkout=success&provider=paypal`);
  } catch (error) {
    console.error("PayPal capture failed:", error);
    return res.redirect(`${origin}/?checkout=cancel&view=checkout`);
  }
});

app.get("/healthz", (_req, res) => {
  return res.status(200).json({ ok: true });
});

app.use(express.static(FRONTEND_DIST_PATH));

app.get("/{*frontendPath}", async (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  try {
    await fs.access(FRONTEND_ENTRY_PATH);
    return res.sendFile(FRONTEND_ENTRY_PATH);
  } catch {
    return res
      .status(503)
      .send("Frontend build not found. Run npm run build before starting the production server.");
  }
});

app.listen(port, () => {
  console.log(`Workhorse server listening on http://localhost:${port}`);
});






