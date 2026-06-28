import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "../src/data/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(projectRoot, "public");

const problems = [];
const warnings = [];

function addProblem(message) {
  problems.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function looksLikeDimension(value = "") {
  return /\b\d+(?:[.,]\d+)?\s*(?:cm|m|mm|in|inch|inches|x|wide|tall|deep)\b/i.test(value);
}

function isTitleCaseWord(word) {
  const firstLetter = word.match(/[A-Za-z]/)?.[0];
  return !firstLetter || firstLetter === firstLetter.toUpperCase();
}

function isTitleCased(title = "") {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .every(isTitleCaseWord);
}

function localPublicPath(assetUrl = "") {
  if (!assetUrl || !assetUrl.startsWith("/")) {
    return "";
  }

  const [pathname] = assetUrl.split("?");
  return path.join(publicRoot, decodeURIComponent(pathname.replace(/^\/+/, "")));
}

function checkAsset(product, label, assetUrl) {
  const assetPath = localPublicPath(assetUrl);

  if (!assetPath) {
    addProblem(`${product.code} ${product.title}: ${label} is missing or not a local public asset.`);
    return;
  }

  if (!existsSync(assetPath)) {
    addProblem(`${product.code} ${product.title}: ${label} does not exist at ${assetPath}.`);
  }
}

const ids = new Map();
const codes = new Map();

for (const product of products) {
  if (ids.has(product.id)) {
    addProblem(`Duplicate product id ${product.id}: ${ids.get(product.id)} and ${product.title}.`);
  }
  ids.set(product.id, product.title);

  if (codes.has(product.code)) {
    addProblem(`Duplicate product code ${product.code}: ${codes.get(product.code)} and ${product.title}.`);
  }
  codes.set(product.code, product.title);

  if (!product.title || !product.title.trim()) {
    addProblem(`${product.code}: missing title.`);
  } else if (!isTitleCased(product.title)) {
    addProblem(`${product.code} ${product.title}: title should use capitalized words.`);
  }

  if (!Array.isArray(product.details) || product.details.length < 2) {
    addProblem(`${product.code} ${product.title}: details must include material first and dimensions second.`);
  } else {
    const [material, dimensions] = product.details;

    if (!String(material || "").trim()) {
      addProblem(`${product.code} ${product.title}: material line is empty.`);
    }

    if (!String(dimensions || "").trim()) {
      addProblem(`${product.code} ${product.title}: dimensions line is empty.`);
    }

    if (looksLikeDimension(material) && !looksLikeDimension(dimensions)) {
      addProblem(`${product.code} ${product.title}: material/dimensions lines appear reversed.`);
    }

    if (!looksLikeDimension(dimensions) && !/to be confirmed/i.test(dimensions)) {
      addWarning(`${product.code} ${product.title}: dimensions line may need a real measurement.`);
    }
  }

  checkAsset(product, "image", product.image);

  if (product.thumbnail) {
    checkAsset(product, "thumbnail", product.thumbnail);
  }

  if (Array.isArray(product.media)) {
    product.media.forEach((media, index) => {
      checkAsset(product, `media ${index + 1}`, media.src);
      if (media.thumbnail) {
        checkAsset(product, `media ${index + 1} thumbnail`, media.thumbnail);
      }
    });
  }
}

console.log(`Audited ${products.length} products.`);

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (problems.length) {
  console.error(`Problems (${problems.length}):`);
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exit(1);
}

console.log("Product audit passed.");
