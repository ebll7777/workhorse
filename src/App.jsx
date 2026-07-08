import React, { useEffect, useMemo, useRef, useState } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import { products } from "./data/products";

const pageVariants = {
  initial: { opacity: 0.5, scale: 0.22, y: 0, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0.98, scale: 1.025, y: 0, filter: "blur(0px)" },
};

const pageTransition = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1],
};

const logoImageSrc = "/products/banner.webp";
const footerImageSrc = "/products/Workhorse.gmbh.webp";
const footerImageAnimatedSrc = "/output-onlinegiftools.gif";
const aboutImageSrc = "/about-jonjaff.webp";

const fontStyles = `
  .workhorse-sans,
  .workhorse-serif {
    font-family: "Courier New", Courier, monospace;
    font-weight: 300;
    line-height: 1.15;
  }
`;

const stripeCardElementOptions = {
  hidePostalCode: true,
  style: {
    base: {
      color: "#000000",
      fontFamily: "\"Courier New\", Courier, monospace",
      fontSize: "14px",
      fontWeight: "300",
      "::placeholder": {
        color: "rgba(0, 0, 0, 0.45)",
      },
    },
    invalid: {
      color: "#dc2626",
      iconColor: "#dc2626",
    },
  },
};

const siteInfoPages = {
  shipping: {
    title: "Shipping",
    eyebrow: "Site Information",
    sections: [
      {
        heading: "Shipping Area",
        body: "Orders are prepared from Berlin, Germany. Shipping availability and final delivery timing may depend on the destination, artwork size, and carrier requirements.",
      },
      {
        heading: "Shipping Cost",
        body: "Shipping is calculated after order details are reviewed. If a listed checkout price does not include final shipping, the buyer will be contacted before dispatch.",
      },
      {
        heading: "Artwork Handling",
        body: "Original works and fragile pieces are packed carefully before shipment. Larger works may require custom packaging or coordinated delivery.",
      },
    ],
  },
  returns: {
    title: "Returns",
    eyebrow: "Site Information",
    sections: [
      {
        heading: "Return Requests",
        body: "If something arrives damaged or incorrect, contact Jonjaff623@gmail.com with the order details and photos as soon as possible.",
      },
      {
        heading: "Original Works",
        body: "Original artworks and made-to-order pieces may need individual handling. Return options can depend on the item condition, shipping route, and local rules.",
      },
      {
        heading: "Refund Timing",
        body: "Approved refunds are processed through the original payment method after the return or issue is reviewed.",
      },
    ],
  },
  privacy: {
    title: "Privacy",
    eyebrow: "Site Information",
    sections: [
      {
        heading: "Information Collected",
        body: "Checkout collects contact details, shipping details, selected items, and payment status so orders can be fulfilled. Card details are handled by Stripe and are not stored by this website.",
      },
      {
        heading: "Updates",
        body: "If the updates checkbox is selected, the submitted contact details may be saved for future updates and notifications.",
      },
      {
        heading: "Contact",
        body: "Questions about stored information can be sent to Jonjaff623@gmail.com.",
      },
    ],
  },
  terms: {
    title: "Terms",
    eyebrow: "Site Information",
    sections: [
      {
        heading: "Catalog",
        body: "Product images, dimensions, prices, and availability are shown as accurately as possible, but small differences can occur between screen display and the physical work.",
      },
      {
        heading: "Orders",
        body: "An order is considered received after payment succeeds and the order is recorded. If an item becomes unavailable, the buyer will be contacted for a replacement, refund, or cancellation.",
      },
      {
        heading: "Payment",
        body: "Card payments are processed by Stripe. PayPal may be offered when configured for live payments.",
      },
    ],
  },
  impressum: {
    title: "Impressum",
    eyebrow: "Site Information",
    sections: [
      {
        heading: "Responsible Contact",
        body: "Jonathan Jaffrey, Berlin, Germany. Email: Jonjaff623@gmail.com.",
      },
      {
        heading: "Business Details",
        body: "Add any required business registration, VAT, address, and legally required publisher details here before final commercial launch.",
      },
      {
        heading: "Note",
        body: "This page is prepared as a launch structure and should be reviewed before relying on it as legal compliance text.",
      },
    ],
  },
};

const siteInfoLinks = [
  { key: "shipping", label: "Shipping" },
  { key: "returns", label: "Returns" },
  { key: "privacy", label: "Privacy" },
  { key: "terms", label: "Terms" },
];

const COUNTRY_OPTIONS = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const COUNTRY_DIALING_OPTIONS = [
  { country: "Afghanistan", code: "+93" },
  { country: "Albania", code: "+355" },
  { country: "Algeria", code: "+213" },
  { country: "Andorra", code: "+376" },
  { country: "Angola", code: "+244" },
  { country: "Antigua and Barbuda", code: "+1-268" },
  { country: "Argentina", code: "+54" },
  { country: "Armenia", code: "+374" },
  { country: "Australia", code: "+61" },
  { country: "Austria", code: "+43" },
  { country: "Azerbaijan", code: "+994" },
  { country: "Bahamas", code: "+1-242" },
  { country: "Bahrain", code: "+973" },
  { country: "Bangladesh", code: "+880" },
  { country: "Barbados", code: "+1-246" },
  { country: "Belarus", code: "+375" },
  { country: "Belgium", code: "+32" },
  { country: "Belize", code: "+501" },
  { country: "Benin", code: "+229" },
  { country: "Bhutan", code: "+975" },
  { country: "Bolivia", code: "+591" },
  { country: "Bosnia and Herzegovina", code: "+387" },
  { country: "Botswana", code: "+267" },
  { country: "Brazil", code: "+55" },
  { country: "Brunei", code: "+673" },
  { country: "Bulgaria", code: "+359" },
  { country: "Burkina Faso", code: "+226" },
  { country: "Burundi", code: "+257" },
  { country: "Cabo Verde", code: "+238" },
  { country: "Cambodia", code: "+855" },
  { country: "Cameroon", code: "+237" },
  { country: "Canada", code: "+1" },
  { country: "Central African Republic", code: "+236" },
  { country: "Chad", code: "+235" },
  { country: "Chile", code: "+56" },
  { country: "China", code: "+86" },
  { country: "Colombia", code: "+57" },
  { country: "Comoros", code: "+269" },
  { country: "Congo", code: "+242" },
  { country: "Costa Rica", code: "+506" },
  { country: "Croatia", code: "+385" },
  { country: "Cuba", code: "+53" },
  { country: "Cyprus", code: "+357" },
  { country: "Czech Republic", code: "+420" },
  { country: "Democratic Republic of the Congo", code: "+243" },
  { country: "Denmark", code: "+45" },
  { country: "Djibouti", code: "+253" },
  { country: "Dominica", code: "+1-767" },
  { country: "Dominican Republic", code: "+1-809" },
  { country: "Ecuador", code: "+593" },
  { country: "Egypt", code: "+20" },
  { country: "El Salvador", code: "+503" },
  { country: "Equatorial Guinea", code: "+240" },
  { country: "Eritrea", code: "+291" },
  { country: "Estonia", code: "+372" },
  { country: "Eswatini", code: "+268" },
  { country: "Ethiopia", code: "+251" },
  { country: "Fiji", code: "+679" },
  { country: "Finland", code: "+358" },
  { country: "France", code: "+33" },
  { country: "Gabon", code: "+241" },
  { country: "Gambia", code: "+220" },
  { country: "Georgia", code: "+995" },
  { country: "Germany", code: "+49" },
  { country: "Ghana", code: "+233" },
  { country: "Greece", code: "+30" },
  { country: "Grenada", code: "+1-473" },
  { country: "Guatemala", code: "+502" },
  { country: "Guinea", code: "+224" },
  { country: "Guinea-Bissau", code: "+245" },
  { country: "Guyana", code: "+592" },
  { country: "Haiti", code: "+509" },
  { country: "Honduras", code: "+504" },
  { country: "Hungary", code: "+36" },
  { country: "Iceland", code: "+354" },
  { country: "India", code: "+91" },
  { country: "Indonesia", code: "+62" },
  { country: "Iran", code: "+98" },
  { country: "Iraq", code: "+964" },
  { country: "Ireland", code: "+353" },
  { country: "Israel", code: "+972" },
  { country: "Italy", code: "+39" },
  { country: "Jamaica", code: "+1-876" },
  { country: "Japan", code: "+81" },
  { country: "Jordan", code: "+962" },
  { country: "Kazakhstan", code: "+7" },
  { country: "Kenya", code: "+254" },
  { country: "Kiribati", code: "+686" },
  { country: "Kuwait", code: "+965" },
  { country: "Kyrgyzstan", code: "+996" },
  { country: "Laos", code: "+856" },
  { country: "Latvia", code: "+371" },
  { country: "Lebanon", code: "+961" },
  { country: "Lesotho", code: "+266" },
  { country: "Liberia", code: "+231" },
  { country: "Libya", code: "+218" },
  { country: "Liechtenstein", code: "+423" },
  { country: "Lithuania", code: "+370" },
  { country: "Luxembourg", code: "+352" },
  { country: "Madagascar", code: "+261" },
  { country: "Malawi", code: "+265" },
  { country: "Malaysia", code: "+60" },
  { country: "Maldives", code: "+960" },
  { country: "Mali", code: "+223" },
  { country: "Malta", code: "+356" },
  { country: "Marshall Islands", code: "+692" },
  { country: "Mauritania", code: "+222" },
  { country: "Mauritius", code: "+230" },
  { country: "Mexico", code: "+52" },
  { country: "Micronesia", code: "+691" },
  { country: "Moldova", code: "+373" },
  { country: "Monaco", code: "+377" },
  { country: "Mongolia", code: "+976" },
  { country: "Montenegro", code: "+382" },
  { country: "Morocco", code: "+212" },
  { country: "Mozambique", code: "+258" },
  { country: "Myanmar", code: "+95" },
  { country: "Namibia", code: "+264" },
  { country: "Nauru", code: "+674" },
  { country: "Nepal", code: "+977" },
  { country: "Netherlands", code: "+31" },
  { country: "New Zealand", code: "+64" },
  { country: "Nicaragua", code: "+505" },
  { country: "Niger", code: "+227" },
  { country: "Nigeria", code: "+234" },
  { country: "North Korea", code: "+850" },
  { country: "North Macedonia", code: "+389" },
  { country: "Norway", code: "+47" },
  { country: "Oman", code: "+968" },
  { country: "Pakistan", code: "+92" },
  { country: "Palau", code: "+680" },
  { country: "Palestine", code: "+970" },
  { country: "Panama", code: "+507" },
  { country: "Papua New Guinea", code: "+675" },
  { country: "Paraguay", code: "+595" },
  { country: "Peru", code: "+51" },
  { country: "Philippines", code: "+63" },
  { country: "Poland", code: "+48" },
  { country: "Portugal", code: "+351" },
  { country: "Qatar", code: "+974" },
  { country: "Romania", code: "+40" },
  { country: "Russia", code: "+7" },
  { country: "Rwanda", code: "+250" },
  { country: "Saint Kitts and Nevis", code: "+1-869" },
  { country: "Saint Lucia", code: "+1-758" },
  { country: "Saint Vincent and the Grenadines", code: "+1-784" },
  { country: "Samoa", code: "+685" },
  { country: "San Marino", code: "+378" },
  { country: "Sao Tome and Principe", code: "+239" },
  { country: "Saudi Arabia", code: "+966" },
  { country: "Senegal", code: "+221" },
  { country: "Serbia", code: "+381" },
  { country: "Seychelles", code: "+248" },
  { country: "Sierra Leone", code: "+232" },
  { country: "Singapore", code: "+65" },
  { country: "Slovakia", code: "+421" },
  { country: "Slovenia", code: "+386" },
  { country: "Solomon Islands", code: "+677" },
  { country: "Somalia", code: "+252" },
  { country: "South Africa", code: "+27" },
  { country: "South Korea", code: "+82" },
  { country: "South Sudan", code: "+211" },
  { country: "Spain", code: "+34" },
  { country: "Sri Lanka", code: "+94" },
  { country: "Sudan", code: "+249" },
  { country: "Suriname", code: "+597" },
  { country: "Sweden", code: "+46" },
  { country: "Switzerland", code: "+41" },
  { country: "Syria", code: "+963" },
  { country: "Taiwan", code: "+886" },
  { country: "Tajikistan", code: "+992" },
  { country: "Tanzania", code: "+255" },
  { country: "Thailand", code: "+66" },
  { country: "Timor-Leste", code: "+670" },
  { country: "Togo", code: "+228" },
  { country: "Tonga", code: "+676" },
  { country: "Trinidad and Tobago", code: "+1-868" },
  { country: "Tunisia", code: "+216" },
  { country: "Turkey", code: "+90" },
  { country: "Turkmenistan", code: "+993" },
  { country: "Tuvalu", code: "+688" },
  { country: "Uganda", code: "+256" },
  { country: "Ukraine", code: "+380" },
  { country: "United Arab Emirates", code: "+971" },
  { country: "United Kingdom", code: "+44" },
  { country: "United States", code: "+1" },
  { country: "Uruguay", code: "+598" },
  { country: "Uzbekistan", code: "+998" },
  { country: "Vanuatu", code: "+678" },
  { country: "Vatican City", code: "+379" },
  { country: "Venezuela", code: "+58" },
  { country: "Vietnam", code: "+84" },
  { country: "Yemen", code: "+967" },
  { country: "Zambia", code: "+260" },
  { country: "Zimbabwe", code: "+263" },
];
function getCountryNameFromRegionCode(regionCode) {
  if (!regionCode) return "";

  try {
    const displayNames = new Intl.DisplayNames([navigator.language || "en"], {
      type: "region",
    });
    return displayNames.of(regionCode.toUpperCase()) || "";
  } catch {
    return "";
  }
}

async function detectVisitorCountry() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (response.ok) {
      const payload = await response.json();
      if (typeof payload?.country_name === "string" && payload.country_name.trim()) {
        return payload.country_name.trim();
      }
      if (typeof payload?.country === "string" && payload.country.trim()) {
        return getCountryNameFromRegionCode(payload.country.trim());
      }
    }
  } catch {
    // Fallback to browser locale below when IP lookup is unavailable.
  }

  try {
    const locale = navigator.languages?.[0] || navigator.language || "";
    const regionCode = new Intl.Locale(locale).region;
    return getCountryNameFromRegionCode(regionCode);
  } catch {
    return "";
  }
}
function chunkProducts(items, size = 2) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function sortItemsAlphabetically(items) {
  return [...items].sort((leftItem, rightItem) =>
    leftItem.title.localeCompare(rightItem.title, undefined, {
      sensitivity: "base",
    })
  );
}

function sortHomeGridItems(items) {
  const visibleItems = items.filter((item) => !item.hideFromHome);
  const paintings = visibleItems.filter((item) => item.category === "Paintings");
  const rest = visibleItems.filter((item) => item.category !== "Paintings");
  return [...sortItemsAlphabetically(paintings), ...sortItemsAlphabetically(rest)];
}

const minArtworkZoom = 1;
const maxArtworkZoom = 4;

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getTouchDistance(touches) {
  const [firstTouch, secondTouch] = touches;
  const deltaX = secondTouch.clientX - firstTouch.clientX;
  const deltaY = secondTouch.clientY - firstTouch.clientY;

  return Math.hypot(deltaX, deltaY);
}

function getTouchCenter(touches) {
  const [firstTouch, secondTouch] = touches;

  return {
    x: (firstTouch.clientX + secondTouch.clientX) / 2,
    y: (firstTouch.clientY + secondTouch.clientY) / 2,
  };
}

function clampArtworkPan(offset, scale, bounds) {
  if (scale <= minArtworkZoom || !bounds) {
    return { x: 0, y: 0 };
  }

  const maxX = (bounds.width * (scale - 1)) / 2;
  const maxY = (bounds.height * (scale - 1)) / 2;

  return {
    x: clampValue(offset.x, -maxX, maxX),
    y: clampValue(offset.y, -maxY, maxY),
  };
}

function ProductImage({
  src: initialSrc,
  fallbackSrc,
  alt,
  className,
  loading = "lazy",
  decoding = "async",
  sizes,
  fetchPriority,
}) {
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    setSrc(initialSrc);
  }, [initialSrc]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      fetchPriority={fetchPriority}
      onError={() => {
        if (fallbackSrc && src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
      }}
    />
  );
}

const ProductCard = React.memo(function ProductCard({ product, onOpen, imageClassName }) {
  const previewSrc = product.thumbnail || product.image;
  const fallbackSrc = product.fallbackThumbnail || product.fallbackImage;

  return (
    <button
      onClick={() => onOpen(product)}
      className="group block h-full w-full bg-white text-left"
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white">
        <ProductImage
          src={previewSrc}
          fallbackSrc={fallbackSrc}
          alt={product.title}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={imageClassName}
        />
      </div>
    </button>
  );
});

function ProductPage({ product, onBack, onPrevious, onNext, onAddToCart }) {
  if (!product) return null;

  const [imageSrc, setImageSrc] = useState(product.image);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [touchZoom, setTouchZoom] = useState({ scale: 1, x: 0, y: 0 });
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const imageViewportRef = useRef(null);
  const zoomTargetRef = useRef({ x: 50, y: 50 });
  const zoomFrameRef = useRef(null);
  const touchZoomRef = useRef({ scale: 1, x: 0, y: 0 });
  const touchGestureRef = useRef({
    mode: null,
    startDistance: 0,
    startScale: 1,
    startCenter: { x: 0, y: 0 },
    startPoint: { x: 0, y: 0 },
    startOffset: { x: 0, y: 0 },
  });
  const lastTouchInteractionRef = useRef(0);
  const setTouchZoomState = (nextZoom) => {
    touchZoomRef.current = nextZoom;
    setTouchZoom(nextZoom);
  };
  const mediaItems = product.media?.length
    ? product.media
    : [
        {
          src: product.image,
          thumbnail: product.thumbnail,
          fallbackSrc: product.fallbackImage,
          label: product.title,
        },
      ];
  const activeMediaIndex = Math.min(selectedMediaIndex, mediaItems.length - 1);
  const activeMedia = mediaItems[activeMediaIndex] ?? mediaItems[0];

  useEffect(() => {
    setSelectedMediaIndex(0);
    setImageSrc(product.media?.[0]?.src ?? product.image);
    setIsZoomActive(false);
    setZoomPosition({ x: 50, y: 50 });
    setTouchZoomState({ scale: 1, x: 0, y: 0 });
    setPurchaseQuantity(1);
    zoomTargetRef.current = { x: 50, y: 50 };
    touchGestureRef.current.mode = null;
  }, [product]);

  useEffect(() => {
    if (!isZoomActive) {
      if (zoomFrameRef.current !== null) {
        cancelAnimationFrame(zoomFrameRef.current);
        zoomFrameRef.current = null;
      }
      return undefined;
    }

    const tick = () => {
      setZoomPosition((current) => {
        const nextX = current.x + (zoomTargetRef.current.x - current.x) * 0.16;
        const nextY = current.y + (zoomTargetRef.current.y - current.y) * 0.16;

        return {
          x: Math.abs(nextX - zoomTargetRef.current.x) < 0.1 ? zoomTargetRef.current.x : nextX,
          y: Math.abs(nextY - zoomTargetRef.current.y) < 0.1 ? zoomTargetRef.current.y : nextY,
        };
      });

      zoomFrameRef.current = requestAnimationFrame(tick);
    };

    zoomFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (zoomFrameRef.current !== null) {
        cancelAnimationFrame(zoomFrameRef.current);
        zoomFrameRef.current = null;
      }
    };
  }, [isZoomActive]);

  const handleZoomMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    zoomTargetRef.current = {
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    };
  };

  const handleZoomEnter = () => {
    if (Date.now() - lastTouchInteractionRef.current < 700) return;
    setIsZoomActive(true);
  };

  const handleZoomLeave = () => {
    setIsZoomActive(false);
    zoomTargetRef.current = { x: 50, y: 50 };
    setZoomPosition({ x: 50, y: 50 });
  };

  const handleMediaSelect = (index) => {
    const nextMedia = mediaItems[index];

    if (!nextMedia) return;

    setSelectedMediaIndex(index);
    setImageSrc(nextMedia.src);
    setTouchZoomState({ scale: 1, x: 0, y: 0 });
    touchGestureRef.current.mode = null;
    handleZoomLeave();
  };

  const getViewportBounds = () => imageViewportRef.current?.getBoundingClientRect();

  const settleTouchZoom = (nextZoom) => {
    if (nextZoom.scale <= 1.02) {
      setTouchZoomState({ scale: 1, x: 0, y: 0 });
      return;
    }

    const nextScale = clampValue(nextZoom.scale, minArtworkZoom, maxArtworkZoom);

    setTouchZoomState({
      scale: nextScale,
      ...clampArtworkPan(
        { x: nextZoom.x, y: nextZoom.y },
        nextScale,
        getViewportBounds()
      ),
    });
  };

  const handleTouchStart = (event) => {
    lastTouchInteractionRef.current = Date.now();
    setIsZoomActive(false);

    if (event.touches.length >= 2) {
      if (event.cancelable) event.preventDefault();

      const touches = Array.from(event.touches).slice(0, 2);
      const currentTouchZoom = touchZoomRef.current;
      touchGestureRef.current = {
        mode: "pinch",
        startDistance: getTouchDistance(touches),
        startScale: currentTouchZoom.scale,
        startCenter: getTouchCenter(touches),
        startPoint: { x: 0, y: 0 },
        startOffset: { x: currentTouchZoom.x, y: currentTouchZoom.y },
      };
      return;
    }

    if (event.touches.length === 1 && touchZoomRef.current.scale > 1.01) {
      if (event.cancelable) event.preventDefault();

      const [touch] = event.touches;
      touchGestureRef.current = {
        ...touchGestureRef.current,
        mode: "pan",
        startPoint: { x: touch.clientX, y: touch.clientY },
        startOffset: { x: touchZoomRef.current.x, y: touchZoomRef.current.y },
      };
    }
  };

  const handleTouchMove = (event) => {
    lastTouchInteractionRef.current = Date.now();

    if (event.touches.length >= 2) {
      if (event.cancelable) event.preventDefault();

      const touches = Array.from(event.touches).slice(0, 2);
      const gesture = touchGestureRef.current;
      const startDistance = gesture.startDistance || getTouchDistance(touches);
      const nextScale = clampValue(
        gesture.startScale * (getTouchDistance(touches) / startDistance),
        minArtworkZoom,
        maxArtworkZoom
      );
      const center = getTouchCenter(touches);
      const nextOffset = {
        x: gesture.startOffset.x + center.x - gesture.startCenter.x,
        y: gesture.startOffset.y + center.y - gesture.startCenter.y,
      };
      const clampedOffset = clampArtworkPan(nextOffset, nextScale, getViewportBounds());

      setTouchZoomState({
        scale: nextScale,
        x: clampedOffset.x,
        y: clampedOffset.y,
      });
      return;
    }

    if (event.touches.length === 1 && touchZoomRef.current.scale > 1.01) {
      if (event.cancelable) event.preventDefault();

      const [touch] = event.touches;
      const gesture = touchGestureRef.current;
      const nextOffset = {
        x: gesture.startOffset.x + touch.clientX - gesture.startPoint.x,
        y: gesture.startOffset.y + touch.clientY - gesture.startPoint.y,
      };
      const currentTouchZoom = touchZoomRef.current;
      const clampedOffset = clampArtworkPan(nextOffset, currentTouchZoom.scale, getViewportBounds());

      setTouchZoomState({
        ...currentTouchZoom,
        x: clampedOffset.x,
        y: clampedOffset.y,
      });
    }
  };

  const handleTouchEnd = (event) => {
    lastTouchInteractionRef.current = Date.now();

    if (event.touches.length >= 2) {
      const touches = Array.from(event.touches).slice(0, 2);
      touchGestureRef.current = {
        ...touchGestureRef.current,
        mode: "pinch",
        startDistance: getTouchDistance(touches),
        startScale: touchZoomRef.current.scale,
        startCenter: getTouchCenter(touches),
        startOffset: { x: touchZoomRef.current.x, y: touchZoomRef.current.y },
      };
      return;
    }

    if (event.touches.length === 1 && touchZoomRef.current.scale > 1.01) {
      const [touch] = event.touches;
      touchGestureRef.current = {
        ...touchGestureRef.current,
        mode: "pan",
        startPoint: { x: touch.clientX, y: touch.clientY },
        startOffset: { x: touchZoomRef.current.x, y: touchZoomRef.current.y },
      };
      return;
    }

    touchGestureRef.current.mode = null;
    settleTouchZoom(touchZoomRef.current);
  };

  const isShopProduct = product.category === "Stickers" || product.category === "Prints";
  const detailLines = product.details?.length
    ? product.details
    : ["Customize this field", "Customize this field"];
  const isTouchZoomed = touchZoom.scale > 1.01;
  const isTouchGestureActive = touchGestureRef.current.mode !== null;
  const artworkTransform = isTouchZoomed
    ? `translate3d(${touchZoom.x}px, ${touchZoom.y}px, 0) scale(${touchZoom.scale})`
    : isZoomActive
      ? "scale(2.35)"
      : "scale(1)";

  const handleAddToCart = () => {
    onAddToCart(product, purchaseQuantity);
  };

  return (
    <section className="relative min-h-[calc(100svh-92px)] bg-white sm:min-h-[calc(100vh-97px)]">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="View previous item"
        className="fixed left-1 top-[38svh] z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-transparent text-black transition hover:opacity-50 sm:left-5 sm:top-[calc(50%-64px)] sm:h-10 sm:w-10"
      >
        <span aria-hidden="true" className="text-2xl leading-none">{"<"}</span>
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="View next item"
        className="fixed right-1 top-[38svh] z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-transparent text-black transition hover:opacity-50 sm:right-5 sm:top-[calc(50%-64px)] sm:h-10 sm:w-10"
      >
        <span aria-hidden="true" className="text-2xl leading-none">{">"}</span>
      </button>
      <div className="grid min-h-[calc(100svh-92px)] grid-cols-1 sm:min-h-[calc(100vh-97px)]">
        <div className="bg-white">
          <div className="flex h-full flex-col items-center justify-center px-10 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
            <div
              ref={imageViewportRef}
              className={`relative mx-auto flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden bg-white sm:max-w-[38rem] lg:max-w-[44rem] ${
                isTouchZoomed || isZoomActive ? "cursor-grab" : "cursor-zoom-in"
              }`}
              style={{
                touchAction: "none",
                overscrollBehavior: "contain",
              }}
              onMouseEnter={handleZoomEnter}
              onMouseLeave={handleZoomLeave}
              onMouseMove={handleZoomMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              <img
                src={imageSrc}
                alt={activeMedia?.label || product.title}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="max-h-[38svh] w-full object-contain sm:max-h-[56vh] lg:max-h-[60vh]"
                style={{
                  transform: artworkTransform,
                  transformOrigin: isTouchZoomed ? "center center" : `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transition: isTouchGestureActive
                    ? "none"
                    : isZoomActive
                      ? "transform 120ms ease-out"
                      : "transform 220ms ease-out",
                  willChange: "transform",
                }}
                onError={() => {
                  const fallbackSrc = activeMedia?.fallbackSrc || product.fallbackImage;

                  if (fallbackSrc && imageSrc !== fallbackSrc) {
                    setImageSrc(fallbackSrc);
                  }
                }}
              />
            </div>

            {mediaItems.length > 1 ? (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-2 text-[10px] uppercase tracking-[0.18em] text-black/55 sm:mt-5">
                {mediaItems.map((media, index) => (
                  <button
                    key={`${media.src}-${index}`}
                    type="button"
                    onClick={() => handleMediaSelect(index)}
                    aria-label={`View ${media.label || `media ${index + 1}`}`}
                    aria-current={index === activeMediaIndex ? "true" : undefined}
                    className={`h-2.5 w-2.5 rounded-full border border-black transition ${
                      index === activeMediaIndex ? "bg-black" : "bg-white hover:bg-black/20"
                    }`}
                  />
                ))}
                <span className="ml-2">{activeMediaIndex + 1}/{mediaItems.length}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-full flex-col justify-between bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <div className="mx-auto mb-8 w-full max-w-2xl space-y-4 text-center sm:mb-10 sm:space-y-6">
              <h1 className="workhorse-serif text-3xl tracking-[0.08em] sm:text-5xl">
                {product.title}
              </h1>

              <div className="pt-3 text-[11px] uppercase tracking-[0.18em] text-black/65 sm:pt-6">
                {isShopProduct ? (
                  <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-3 pb-3 min-[380px]:flex-row min-[380px]:gap-6">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="transition hover:opacity-50"
                    >
                      ADD TO CART
                    </button>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setPurchaseQuantity((current) => Math.max(1, current - 1))}
                        className="transition hover:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{purchaseQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setPurchaseQuantity((current) => current + 1)}
                        className="transition hover:opacity-50"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : null}
                {detailLines.map((detail, index) => (
                  <div key={`${detail}-${index}`} className="flex justify-center py-2 sm:py-3">
                    <span className="break-words px-2">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CartPage({ cartItems, onBack, onUpdateQuantity, onRemoveItem, onCheckout }) {
  return (
    <section className="min-h-[calc(100vh-97px)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {cartItems.length === 0 ? (
          <div className="py-12 text-center text-[11px] uppercase tracking-[0.2em] text-black/60">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[96px_1fr] gap-4 py-5 sm:grid-cols-[120px_1fr] sm:gap-6"
                >
                  <div className="flex h-[122px] items-center justify-center bg-white sm:h-[162px]">
                    <ProductImage
                      src={item.thumbnail || item.image}
                      fallbackSrc={item.fallbackThumbnail || item.fallbackImage}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-black/60">{item.category}</p>
                      <h2 className="workhorse-serif text-2xl tracking-[0.06em]">{item.title}</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.2em]">
                      <div className="flex items-center border border-black">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-2 transition hover:bg-black hover:text-white"
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          -
                        </button>
                        <span className="min-w-10 px-3 py-2 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 transition hover:bg-black hover:text-white"
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-black/65 transition hover:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-5">
              <button
                onClick={onCheckout}
                className="w-full border border-black bg-black px-4 py-4 text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-white hover:text-black"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
function InlineStripeCardForm({ amountLabel, checkoutState, onSubmit }) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  const handleCardChange = (event) => {
    setCardError(event.error?.message || "");
  };

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      setCardError("Card fields are still loading.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setCardError("Card fields are unavailable right now.");
      return;
    }

    setCardError("");

    try {
      await onSubmit({ stripe, cardElement });
    } catch {
      // Parent checkout state already carries the visible error message.
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.2em]">Card Details</p>
        <div className="border border-black px-4 py-4">
          <CardElement options={stripeCardElementOptions} onChange={handleCardChange} />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={checkoutState.loading}
        className="w-full border border-black bg-black px-4 py-4 text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {checkoutState.loading ? "Processing..." : `Pay EUR ${amountLabel}`}
      </button>

      {cardError ? (
        <p className="text-[11px] uppercase tracking-[0.18em] text-red-600">
          {cardError}
        </p>
      ) : null}
    </div>
  );
}

function CheckoutPage({
  cartItems,
  checkoutDetails,
  checkoutState,
  paymentMethod,
  subscribeToUpdates,
  stripePromise,
  stripePublishableKeyError,
  onCheckoutFieldChange,
  onSubscribeChange,
  onPaymentMethodChange,
  onUpdateQuantity,
  onStartCheckout,
  onStripePayment,
}) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fieldLabelClass = "text-[10px] uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.2em]";
  const fieldClass =
    "min-h-12 w-full min-w-0 border border-black px-3 py-3 text-base outline-none sm:px-4 sm:py-4 sm:text-sm";
  const selectClass = `workhorse-sans bg-white ${fieldClass}`;

  return (
    <section className="min-h-[calc(100svh-92px)] bg-white sm:min-h-[calc(100vh-97px)]">
      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div className="pt-2 sm:pt-5">
            <div className="mb-6 grid w-full max-w-xl grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:mb-8">
              <button
                type="button"
                onClick={() => onPaymentMethodChange("stripe")}
                className={`border px-3 py-3 text-[11px] uppercase tracking-[0.18em] transition sm:px-4 sm:py-4 sm:tracking-[0.2em] ${
                  paymentMethod === "stripe" ? "border-black bg-black text-white" : "border-black bg-white text-black hover:opacity-70"
                }`}
              >
                Stripe
              </button>
              <button
                type="button"
                onClick={() => onPaymentMethodChange("paypal")}
                className={`border px-3 py-3 text-[11px] uppercase tracking-[0.18em] transition sm:px-4 sm:py-4 sm:tracking-[0.2em] ${
                  paymentMethod === "paypal" ? "border-black bg-black text-white" : "border-black bg-white text-black hover:opacity-70"
                }`}
              >
                PayPal
              </button>
            </div>

            <div className="w-full max-w-xl space-y-7 sm:space-y-8">
              <div className="space-y-4">
                <p className={fieldLabelClass}>Contact Information</p>
                <label className="block space-y-2">
                  <span className={fieldLabelClass}>Email Address</span>
                  <input
                    type="email"
                    value={checkoutDetails.email}
                    onChange={(event) => onCheckoutFieldChange("email", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="flex items-start gap-3 text-[10px] uppercase tracking-[0.14em] text-black/70 sm:items-center sm:text-[11px] sm:tracking-[0.18em]">
                  <input
                    type="checkbox"
                    checked={subscribeToUpdates}
                    onChange={(event) => onSubscribeChange(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded-none border border-black accent-black sm:mt-0"
                  />
                  <span>Subscribe to updates and notifications</span>
                </label>
              </div>

              <div className="space-y-4">
                <p className={fieldLabelClass}>Shipping Address</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className={fieldLabelClass}>First Name</span>
                    <input
                      type="text"
                      value={checkoutDetails.firstName}
                      onChange={(event) => onCheckoutFieldChange("firstName", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className={fieldLabelClass}>Last Name</span>
                    <input
                      type="text"
                      value={checkoutDetails.lastName}
                      onChange={(event) => onCheckoutFieldChange("lastName", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                </div>
                <label className="block space-y-2">
                  <span className={fieldLabelClass}>Street</span>
                  <input
                    type="text"
                    value={checkoutDetails.street}
                    onChange={(event) => onCheckoutFieldChange("street", event.target.value)}
                    autoComplete="street-address"
                    className={fieldClass}
                  />
                </label>
                <label className="block space-y-2">
                  <span className={fieldLabelClass}>House Number</span>
                  <input
                    type="text"
                    value={checkoutDetails.streetNumber}
                    onChange={(event) => onCheckoutFieldChange("streetNumber", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className={fieldLabelClass}>Country</span>
                    <select
                      value={checkoutDetails.country}
                      onChange={(event) => onCheckoutFieldChange("country", event.target.value)}
                      className={selectClass}
                      style={{ fontFamily: "inherit" }}
                    >
                      {COUNTRY_OPTIONS.map((country) => (
                        <option key={country} value={country} style={{ fontFamily: "inherit" }}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <span className={fieldLabelClass}>State / Region</span>
                    <input
                      type="text"
                      value={checkoutDetails.stateRegion}
                      onChange={(event) => onCheckoutFieldChange("stateRegion", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                </div>
                <label className="block space-y-2">
                  <span className={fieldLabelClass}>Postal Code</span>
                  <input
                    type="text"
                    value={checkoutDetails.postalCode}
                    onChange={(event) => onCheckoutFieldChange("postalCode", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <label className="block space-y-2">
                    <span className={fieldLabelClass}>Phone Code</span>
                    <select
                      value={checkoutDetails.phoneCountryCode}
                      onChange={(event) => onCheckoutFieldChange("phoneCountryCode", event.target.value)}
                      className={selectClass}
                      style={{ fontFamily: "inherit" }}
                    >
                      {COUNTRY_DIALING_OPTIONS.map((entry) => (
                        <option key={`${entry.country}-${entry.code}`} value={entry.code} style={{ fontFamily: "inherit" }}>
                          {`${entry.country} (${entry.code})`}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <span className={fieldLabelClass}>Phone Number</span>
                    <input
                      type="tel"
                      value={checkoutDetails.phoneNumber}
                      onChange={(event) => onCheckoutFieldChange("phoneNumber", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>
            </div>

            {paymentMethod === "stripe" ? (
              stripePromise ? (
                <div className="mt-8 w-full max-w-xl">
                  <Elements stripe={stripePromise}>
                    <InlineStripeCardForm
                      amountLabel={subtotal.toFixed(2)}
                      checkoutState={checkoutState}
                      onSubmit={onStripePayment}
                    />
                  </Elements>
                </div>
              ) : (
                <div className="mt-8 w-full max-w-xl">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-red-600">
                    {stripePublishableKeyError || "Add STRIPE_PUBLISHABLE_KEY to your .env file to enable embedded card payments."}
                  </p>
                </div>
              )
            ) : (
              <button
                onClick={onStartCheckout}
                disabled={cartItems.length === 0 || checkoutState.loading}
                className="mt-8 w-full max-w-xl border border-black bg-black px-4 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60 sm:tracking-[0.24em]"
              >
                {checkoutState.loading ? "Redirecting..." : "Continue with PayPal"}
              </button>
            )}
            {checkoutState.error ? (
              <p className="mt-3 max-w-xl text-[11px] uppercase tracking-[0.18em] text-red-600">
                {checkoutState.error}
              </p>
            ) : null}
          </div>

          <div className="pt-2 lg:pt-5">
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] sm:mb-6">Order Summary</p>
            <div className="space-y-6 sm:space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-3 text-[10px] uppercase tracking-[0.16em] sm:grid-cols-[72px_1fr_auto] sm:gap-4 sm:text-[11px] sm:tracking-[0.2em]">
                  <div className="flex h-[81px] items-center justify-center bg-white sm:h-[91px]">
                    <ProductImage
                      src={item.thumbnail || item.image}
                      fallbackSrc={item.fallbackThumbnail || item.fallbackImage}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="break-words text-black">{item.title}</p>
                    <p className="text-black/60">Qty</p>
                  </div>
                  <div className="col-span-2 flex items-center justify-between gap-4 space-y-0 text-right sm:col-span-1 sm:block sm:space-y-2">
                    <p className="text-black">EUR {item.price * item.quantity}</p>
                    <div className="flex items-center justify-end gap-3 text-black">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="transition hover:opacity-50"
                        aria-label={`Decrease quantity of ${item.title}`}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="transition hover:opacity-50"
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-3 border-t border-black pt-5 text-[10px] uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.2em]">
                <div className="flex items-center justify-between gap-5">
                  <span>Subtotal</span>
                  <span>EUR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-start justify-between gap-5">
                  <span>Shipping</span>
                  <span className="text-right">Calculated at next step</span>
                </div>
                <div className="flex items-center justify-between gap-5">
                  <span>Taxes</span>
                  <span>EUR 0.00</span>
                </div>
                <div className="flex items-center justify-between gap-5 text-black">
                  <span>Total</span>
                  <span>EUR {subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function OrderSuccessPage({ onContinueShopping }) {
  return (
    <section className="min-h-[calc(100vh-97px)] bg-white">
      <div className="mx-auto flex min-h-[calc(100vh-97px)] max-w-3xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-[11px] uppercase tracking-[0.24em]">Payment complete</p>
        <h1 className="workhorse-serif mb-6 text-4xl tracking-[0.08em] sm:text-5xl">Thank you</h1>
        <p className="mb-10 max-w-xl text-sm leading-7 text-black/75">
          Payment completed successfully. Your order has been recorded.
        </p>
        <button
          onClick={onContinueShopping}
          className="border border-black bg-black px-6 py-4 text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-white hover:text-black"
        >
          Continue shopping
        </button>
      </div>
    </section>
  );
}

function SiteInfoPage({ page }) {
  if (!page) return null;

  return (
    <section className="min-h-[calc(100svh-92px)] bg-white sm:min-h-[calc(100vh-97px)]">
      <div className="mx-auto max-w-4xl px-5 py-9 sm:px-8 sm:py-14 lg:px-10">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] text-black/60">{page.eyebrow}</p>
            <h1 className="workhorse-serif text-4xl tracking-[0.08em] sm:text-6xl">{page.title}</h1>
          </div>

          <div className="mx-auto max-w-2xl space-y-7 text-sm leading-7 text-black/75">
            {page.sections.map((section) => (
              <section key={section.heading} className="space-y-2">
                <h2 className="text-[11px] uppercase tracking-[0.22em] text-black">{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default function App() {
  useEffect(() => {
    document.title = "Jonathan Jaffrey";
  }, []);

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentView, setCurrentView] = useState("shop");
  const [siteInfoPageKey, setSiteInfoPageKey] = useState("shipping");
  const [zoomLevel, setZoomLevel] = useState(0);
  const [zoomDirection, setZoomDirection] = useState("in");
  const [pendingRowIndex, setPendingRowIndex] = useState(null);
  const [shopReturnRowIndex, setShopReturnRowIndex] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutDetails, setCheckoutDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "",
    stateRegion: "",
    postalCode: "",
    street: "",
    streetNumber: "",
    phoneCountryCode: "",
    phoneNumber: "",
  });
  const [subscribeToUpdates, setSubscribeToUpdates] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState("guest");
  const [authView, setAuthView] = useState("signup");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    stateRegion: "",
    postalCode: "",
    street: "",
    streetNumber: "",
    phoneCountryCode: "",
    phoneNumber: "",
  });
  const [authState, setAuthState] = useState({
    loading: false,
    user: null,
    error: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [checkoutState, setCheckoutState] = useState({
    loading: false,
    error: "",
  });
  const [stripePublishableKey, setStripePublishableKey] = useState(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");
  const [stripePublishableKeyError, setStripePublishableKeyError] = useState("");
  const [isFooterAnimated, setIsFooterAnimated] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 639px)").matches : false
  );
  const shopViewportRef = useRef(null);
  const visibleRowRefs = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const query = window.matchMedia("(max-width: 639px)");
    const handleViewportChange = (event) => {
      setIsMobileViewport(event.matches);
    };

    setIsMobileViewport(query.matches);
    if (query.addEventListener) {
      query.addEventListener("change", handleViewportChange);
    } else {
      query.addListener(handleViewportChange);
    }

    return () => {
      if (query.removeEventListener) {
        query.removeEventListener("change", handleViewportChange);
      } else {
        query.removeListener(handleViewportChange);
      }
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "All") {
      return sortHomeGridItems(products);
    }

    if (activeFilter === "Shop") {
      return sortItemsAlphabetically(
        products.filter((item) => item.category === "Stickers" || item.category === "Prints")
      );
    }

    if (activeFilter === "Artwork") {
      return sortHomeGridItems(
        products.filter((item) => item.category === "Paintings" || item.category === "Drawings")
      );
    }

    return sortItemsAlphabetically(products.filter((item) => item.category === activeFilter));
  }, [activeFilter]);

  const stripePromise = useMemo(() => {
    if (!stripePublishableKey || (currentView !== "checkout" && currentView !== "cart")) {
      return null;
    }

    return import("@stripe/stripe-js").then(({ loadStripe }) => loadStripe(stripePublishableKey));
  }, [currentView, stripePublishableKey]);

  const columnsPerRowByZoom = isMobileViewport ? [2, 2, 1, 1] : [4, 2, 2, 1];
  const rowsPerScreenByZoom = isMobileViewport ? [4, 3, 1, 1] : [3, 2, 1, 1];
  const columnsPerRow = columnsPerRowByZoom[zoomLevel];
  const rowsPerScreen = rowsPerScreenByZoom[zoomLevel];
  const gridColumnsClass =
    columnsPerRow === 4 ? "grid-cols-4" : columnsPerRow === 2 ? "grid-cols-2" : "grid-cols-1";
  const isDenseGrid = columnsPerRow === 4;
  const gridGapClass = isDenseGrid ? "gap-x-[7px] gap-y-[6px] sm:gap-x-[9px] sm:gap-y-[7px]" : "gap-2 sm:gap-3";
  const rowPaddingClass = isDenseGrid
    ? "snap-start px-[5px] pb-[4px] pt-[4px] sm:px-[7px] sm:pb-[5px] sm:pt-[5px]"
    : "snap-start px-3 pb-2 pt-1 sm:px-5 sm:pb-3 sm:pt-2";
  const productImageClass = isDenseGrid
    ? "h-full w-full object-contain transition duration-300 group-hover:scale-[1.01]"
    : "h-full w-full object-contain transition duration-300 group-hover:scale-[1.01]";
  const rowHeightStyle = {
    transformOrigin: "50% 50%",
    height: isDenseGrid
      ? `calc(((100svh - ${isMobileViewport ? "124px" : "96px"}) / ${rowsPerScreen} - ${isMobileViewport ? "8px" : "14px"}) * 1.265)`
      : `calc(((100svh - ${isMobileViewport ? "124px" : "96px"}) / ${rowsPerScreen}) * 1.265)`,
  };
  const rowRenderStyle = {
    ...rowHeightStyle,
    contentVisibility: "auto",
    containIntrinsicSize: rowHeightStyle.height,
  };
  const productGroups = useMemo(
    () => chunkProducts(filteredProducts, columnsPerRow),
    [filteredProducts, columnsPerRow]
  );

  const selectedProductIndex = selectedProduct
    ? filteredProducts.findIndex((item) => item.id === selectedProduct.id)
    : -1;

  const getClosestRowIndex = () => {
    const container = shopViewportRef.current;
    const rows = visibleRowRefs.current.filter(Boolean);

    if (!container || rows.length === 0) return 0;

    const containerCanScroll = container.scrollHeight > container.clientHeight + 1;
    const viewportAnchor = containerCanScroll
      ? 0
      : document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    let currentIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    rows.forEach((row, index) => {
      const distance = containerCanScroll
        ? Math.abs(row.offsetTop - container.scrollTop)
        : Math.abs(row.getBoundingClientRect().top - viewportAnchor);
      if (distance < closestDistance) {
        closestDistance = distance;
        currentIndex = index;
      }
    });

    return currentIndex;
  };

  useEffect(() => {
    if (currentView !== "shop" || selectedProduct) return;

    const handleKeyNavigation = (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      const container = shopViewportRef.current;
      const rows = visibleRowRefs.current.filter(Boolean);
      if (!container || rows.length === 0) return;

      event.preventDefault();

      const currentIndex = getClosestRowIndex();
      const nextIndex =
        event.key === "ArrowDown"
          ? Math.min(currentIndex + 1, rows.length - 1)
          : Math.max(currentIndex - 1, 0);

      if (container.scrollHeight > container.clientHeight + 1) {
        container.scrollTo({ top: rows[nextIndex].offsetTop, behavior: "auto" });
      } else {
        const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
        const nextTop = window.scrollY + rows[nextIndex].getBoundingClientRect().top - headerBottom;
        window.scrollTo({ top: Math.max(0, nextTop), behavior: "auto" });
      }
    };

    window.addEventListener("keydown", handleKeyNavigation, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [currentView, selectedProduct, productGroups.length, zoomLevel]);

  useEffect(() => {
    if (pendingRowIndex === null) return;

    const container = shopViewportRef.current;
    const rows = visibleRowRefs.current.filter(Boolean);
    const safeIndex = Math.max(0, Math.min(pendingRowIndex, rows.length - 1));

    if (container && rows[safeIndex]) {
      if (container.scrollHeight > container.clientHeight + 1) {
        container.scrollTo({ top: rows[safeIndex].offsetTop, behavior: "auto" });
      } else {
        const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
        const nextTop = window.scrollY + rows[safeIndex].getBoundingClientRect().top - headerBottom;
        window.scrollTo({ top: Math.max(0, nextTop), behavior: "auto" });
      }
    }

    setPendingRowIndex(null);
  }, [pendingRowIndex, zoomLevel, productGroups.length]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const checkoutStatus = searchParams.get("checkout");
    const nextView = searchParams.get("view");

    if (checkoutStatus === "success") {
      setCartItems([]);
      setCurrentView("success");
      setCheckoutState({ loading: false, error: "" });
    } else if (checkoutStatus === "cancel") {
      setCurrentView(nextView === "checkout" ? "checkout" : "cart");
      setCheckoutState({
        loading: false,
        error: "Checkout was canceled before payment completed.",
      });
    }

    if (checkoutStatus) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.delete("checkout");
      nextUrl.searchParams.delete("view");
      window.history.replaceState({}, "", nextUrl);
    }
  }, []);

  useEffect(() => {
    if (currentView === "checkout" && cartItems.length === 0) {
      setCurrentView("shop");
      setCheckoutState({ loading: false, error: "" });
      window.scrollTo({ top: 0 });
    }
  }, [cartItems.length, currentView]);

  useEffect(() => {
    let isActive = true;

    const prefillCountry = async () => {
      if (checkoutDetails.country) {
        return;
      }

      const detectedCountry = await detectVisitorCountry();
      if (!isActive || !detectedCountry || !COUNTRY_OPTIONS.includes(detectedCountry)) {
        return;
      }

      setCheckoutDetails((current) => {
        if (current.country) {
          return current;
        }

        const matchingDialing = COUNTRY_DIALING_OPTIONS.find((entry) => entry.country === detectedCountry);

        return {
          ...current,
          country: detectedCountry,
          phoneCountryCode: current.phoneCountryCode || matchingDialing?.code || "",
        };
      });
    };

    prefillCountry();

    return () => {
      isActive = false;
    };
  }, [checkoutDetails.country]);

  useEffect(() => {
    let isActive = true;

    const loadAuthSession = async () => {
      try {
        setAuthState((prev) => ({ ...prev, loading: true, error: "" }));
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const payload = await response.json();

        if (!isActive) {
          return;
        }

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load the current session.");
        }

        setAuthState({
          loading: false,
          user: payload.user ?? null,
          error: "",
        });

        if (payload.user?.email) {
          setCheckoutEmail((current) => current || payload.user.email);
          setCheckoutDetails((current) => ({
            ...current,
            email: current.email || payload.user.email,
          }));
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        setAuthState({
          loading: false,
          user: null,
          error: "",
        });
      }
    };

    loadAuthSession();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const shouldLoadStripeConfig = currentView === "checkout" || currentView === "cart";

    if (!shouldLoadStripeConfig) {
      return () => {
        isActive = false;
      };
    }

    if (stripePublishableKey) {
      setStripePublishableKeyError("");
      return () => {
        isActive = false;
      };
    }

    const loadStripeConfig = async () => {
      try {
        const response = await fetch("/api/stripe-config", {
          credentials: "include",
        });
        const payload = await response.json().catch(() => ({}));

        if (!isActive) {
          return;
        }

        if (!response.ok || !payload.publishableKey) {
          throw new Error(
            payload.error || "Add STRIPE_PUBLISHABLE_KEY to your .env file to enable embedded card payments."
          );
        }

        setStripePublishableKey(payload.publishableKey);
        setStripePublishableKeyError("");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStripePublishableKeyError(
          error instanceof Error
            ? error.message
            : "Add STRIPE_PUBLISHABLE_KEY to your .env file to enable embedded card payments."
        );
      }
    };

    loadStripeConfig();

    return () => {
      isActive = false;
    };
  }, [currentView, stripePublishableKey]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setSelectedProduct(null);
    setCurrentView("shop");
    window.scrollTo({ top: 0 });
    if (shopViewportRef.current) {
      shopViewportRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const handleHomeClick = () => {
    handleFilterClick("All");
  };

  const openAbout = () => {
    setSelectedProduct(null);
    setCurrentView("about");
    window.scrollTo({ top: 0 });
  };

  const openSiteInfoPage = (pageKey) => {
    setSelectedProduct(null);
    setSiteInfoPageKey(pageKey);
    setCurrentView("info");
    window.scrollTo({ top: 0 });
  };

  const openCart = () => {
    setSelectedProduct(null);
    setCurrentView("checkout");
    setCheckoutState({ loading: false, error: "" });
    window.scrollTo({ top: 0 });
  };

  const openCheckout = () => {
    setCurrentView("checkout");
    setCheckoutState({ loading: false, error: "" });
    window.scrollTo({ top: 0 });
  };

  const continueShopping = () => {
    setSelectedProduct(null);
    setCurrentView("shop");
    setCheckoutState({ loading: false, error: "" });
    window.scrollTo({ top: 0 });
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...prev, { ...product, quantity }];
    });
  };

  const buyNow = (product) => {
    setCartItems([{ ...product, quantity: 1 }]);
    setCurrentView("checkout");
    setCheckoutState({ loading: false, error: "" });
    window.scrollTo({ top: 0 });
  };

  const updateCartItemQuantity = (productId, nextQuantity) => {
    if (nextQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const removeCartItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleCheckoutFieldChange = (field, value) => {
    setCheckoutDetails((prev) => ({ ...prev, [field]: value }));
    if (field === "email") {
      setCheckoutEmail(value);
    }
    setCheckoutState((prev) => ({ ...prev, error: "" }));
  };


  const handleSubscribeChange = (checked) => {
    setSubscribeToUpdates(checked);
  };

  const handleCheckoutModeChange = (mode) => {
    setCheckoutMode(mode);
    setCheckoutState((prev) => ({ ...prev, error: "" }));
    setAuthState((prev) => ({ ...prev, error: "" }));
  };

  const handleAuthViewChange = (view) => {
    setAuthView(view);
    setAuthState((prev) => ({ ...prev, error: "" }));
  };

  const handleAuthFieldChange = (field, value) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
    setAuthState((prev) => ({ ...prev, error: "" }));
  };

  const handleAuthSubmit = async () => {
    const email = authForm.email.trim();
    const password = authForm.password;

    if (authView === "signup") {
      if (!authForm.name.trim()) {
        setAuthState((prev) => ({ ...prev, error: "Enter your name to create an account." }));
        return;
      }

      if (!email) {
        setAuthState((prev) => ({ ...prev, error: "Enter your email to create an account." }));
        return;
      }

      if (password.length < 8) {
        setAuthState((prev) => ({ ...prev, error: "Passwords must be at least 8 characters long." }));
        return;
      }

      if (password !== authForm.confirmPassword) {
        setAuthState((prev) => ({ ...prev, error: "Passwords do not match." }));
        return;
      }

      if (!authForm.country.trim()) {
        setAuthState((prev) => ({ ...prev, error: "Enter the shipping country for this account." }));
        return;
      }

      if (!authForm.stateRegion.trim()) {
        setAuthState((prev) => ({ ...prev, error: "Enter the shipping state or region for this account." }));
        return;
      }

      if (!authForm.postalCode.trim()) {
        setAuthState((prev) => ({ ...prev, error: "Enter the shipping postal code for this account." }));
        return;
      }

      if (!authForm.street.trim()) {
        setAuthState((prev) => ({ ...prev, error: "Enter the shipping street for this account." }));
        return;
      }

      if (!authForm.streetNumber.trim()) {
        setAuthState((prev) => ({ ...prev, error: "Enter the shipping house number for this account." }));
        return;
      }
    } else if (!email || !password) {
      setAuthState((prev) => ({ ...prev, error: "Enter your email and password to sign in." }));
      return;
    }

    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: "" }));

      const response = await fetch(`/api/auth/${authView === "signup" ? "signup" : "login"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(
          authView === "signup"
            ? {
                name: authForm.name.trim(),
                email,
                password,
              }
            : {
                email,
                password,
              }
        ),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to complete authentication.");
      }

      setAuthState({
        loading: false,
        user: payload.user,
        error: "",
      });
      setCheckoutMode("account");
      setCheckoutEmail(payload.user.email);
      setAuthForm((prev) => ({
        ...prev,
        name: payload.user.name || prev.name,
        email: payload.user.email,
        password: "",
        confirmPassword: "",
        country: payload.user.address?.country || prev.country,
        stateRegion: payload.user.address?.stateRegion || prev.stateRegion,
        postalCode: payload.user.address?.postalCode || prev.postalCode,
        street: payload.user.address?.street || prev.street,
        streetNumber: payload.user.address?.streetNumber || prev.streetNumber,
      }));
      setCheckoutState((prev) => ({ ...prev, error: "" }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unable to complete authentication.",
      }));
    }
  };

  const handleAuthLogout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: "" }));
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to sign out right now.");
      }

      setAuthState({
        loading: false,
        user: null,
        error: "",
      });
      setCheckoutMode("guest");
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unable to sign out right now.",
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setCheckoutState((prev) => ({ ...prev, error: "" }));
  };

  const getResolvedCheckoutDetails = () => {
    const resolvedEmail = checkoutMode === "account" ? authState.user?.email : checkoutEmail.trim();

    return {
      email: (checkoutDetails.email || resolvedEmail || "").trim(),
      firstName: checkoutDetails.firstName.trim(),
      lastName: checkoutDetails.lastName.trim(),
      street: checkoutDetails.street.trim(),
      streetNumber: checkoutDetails.streetNumber.trim(),
      country: checkoutDetails.country.trim(),
      stateRegion: checkoutDetails.stateRegion.trim(),
      postalCode: checkoutDetails.postalCode.trim(),
      phoneCountryCode: checkoutDetails.phoneCountryCode.trim(),
      phoneNumber: checkoutDetails.phoneNumber.trim(),
    };
  };

  const validateCheckoutDetails = (details) => {
    if (checkoutMode === "account" && !authState.user) {
      setCheckoutState({
        loading: false,
        error: "Create an account or sign in before checking out.",
      });
      return false;
    }

    if (cartItems.length === 0) {
      setCheckoutState({
        loading: false,
        error: "Add at least one item before paying.",
      });
      return false;
    }

    if (!details.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      setCheckoutState({
        loading: false,
        error: "Enter a valid email before paying.",
      });
      return false;
    }

    if (!details.firstName) {
      setCheckoutState({
        loading: false,
        error: "Enter the shipping first name.",
      });
      return false;
    }

    if (!details.lastName) {
      setCheckoutState({
        loading: false,
        error: "Enter the shipping last name.",
      });
      return false;
    }

    if (!details.street) {
      setCheckoutState({
        loading: false,
        error: "Enter the shipping street.",
      });
      return false;
    }

    if (!details.streetNumber) {
      setCheckoutState({
        loading: false,
        error: "Enter the shipping house number.",
      });
      return false;
    }

    if (!details.country) {
      setCheckoutState({
        loading: false,
        error: "Select the shipping country.",
      });
      return false;
    }

    if (!details.stateRegion) {
      setCheckoutState({
        loading: false,
        error: "Enter the shipping state or region.",
      });
      return false;
    }

    if (!details.postalCode) {
      setCheckoutState({
        loading: false,
        error: "Enter the shipping postal code.",
      });
      return false;
    }

    if (!details.phoneCountryCode) {
      setCheckoutState({
        loading: false,
        error: "Select the phone country code.",
      });
      return false;
    }

    if (!details.phoneNumber) {
      setCheckoutState({
        loading: false,
        error: "Enter the phone number.",
      });
      return false;
    }

    return true;
  };

  const createStripePaymentIntent = async (details) => {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        customerEmail: details.email,
        checkoutDetails: details,
        subscribeToUpdates,
      }),
    });

    const payload = await response.json();

    if (!response.ok || !payload.clientSecret) {
      throw new Error(payload.error || "Unable to initialize the card payment.");
    }

    return {
      clientSecret: payload.clientSecret,
      orderId: payload.order?.id || "",
    };
  };

  const handleStripePayment = async ({ stripe, cardElement }) => {
    const details = getResolvedCheckoutDetails();

    if (!validateCheckoutDetails(details)) {
      throw new Error("Checkout details are incomplete.");
    }

    setCheckoutState({ loading: true, error: "" });

    try {
      const { clientSecret, orderId } = await createStripePaymentIntent(details);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${details.firstName} ${details.lastName}`.trim(),
            email: details.email,
            phone: `${details.phoneCountryCode} ${details.phoneNumber}`.trim(),
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Unable to process the card payment.");
      }

      if (result.paymentIntent?.status !== "succeeded") {
        throw new Error("Card payment did not complete.");
      }

      const confirmationResponse = await fetch("/api/orders/confirm-stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          paymentIntentId: result.paymentIntent.id,
        }),
      });

      const confirmationPayload = await confirmationResponse.json();

      if (!confirmationResponse.ok) {
        throw new Error(confirmationPayload.error || "Payment completed, but the order could not be recorded.");
      }

      setCartItems([]);
      setCurrentView("success");
      setCheckoutState({ loading: false, error: "" });
      window.scrollTo({ top: 0 });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to process the card payment.";

      setCheckoutState({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  };

  const startCheckout = async () => {
    const details = getResolvedCheckoutDetails();

    if (!validateCheckoutDetails(details)) {
      return;
    }

    try {
      setCheckoutState({ loading: true, error: "" });

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          customerEmail: details.email,
          checkoutDetails: details,
          subscribeToUpdates,
          paymentMethod,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Unable to start PayPal checkout.");
      }

      window.location.href = payload.url;
    } catch (error) {
      setCheckoutState({
        loading: false,
        error: error instanceof Error ? error.message : "Unable to start PayPal checkout.",
      });
    }
  };
  const openProductPage = (product) => {
    const currentIndex = getClosestRowIndex();
    setShopReturnRowIndex(currentIndex);
    setSelectedProduct(product);
    setCurrentView("product");
    window.scrollTo({ top: 0 });
  };

  const closeProductPage = () => {
    setCurrentView("shop");
    setPendingRowIndex(shopReturnRowIndex);
    setSelectedProduct(null);
    window.scrollTo({ top: 0 });
  };

  const navigateSelectedProduct = (direction) => {
    if (filteredProducts.length === 0 || selectedProductIndex === -1) {
      return;
    }

    const nextIndex =
      (selectedProductIndex + direction + filteredProducts.length) % filteredProducts.length;

    setSelectedProduct(filteredProducts[nextIndex]);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const openPreviousProduct = () => navigateSelectedProduct(-1);
  const openNextProduct = () => navigateSelectedProduct(1);

  const handleZoomToggle = () => {
    if (currentView !== "shop") {
      return;
    }

    const currentIndex = getClosestRowIndex();
    let nextZoomLevel = zoomLevel;
    let nextZoomDirection = zoomDirection;
    let nextRowIndex = currentIndex;

    if (zoomDirection === "in") {
      nextZoomLevel = Math.min(zoomLevel + 1, 3);
      nextZoomDirection = nextZoomLevel === 3 ? "out" : "in";
    } else {
      nextZoomLevel = Math.max(zoomLevel - 1, 0);
      nextZoomDirection = nextZoomLevel === 0 ? "in" : "out";
    }

    const currentFirstItemIndex = currentIndex * columnsPerRowByZoom[zoomLevel];
    nextRowIndex = Math.floor(currentFirstItemIndex / columnsPerRowByZoom[nextZoomLevel]);

    setZoomLevel(nextZoomLevel);
    setZoomDirection(nextZoomDirection);
    setPendingRowIndex(nextRowIndex);
  };

  const navItems = [
    { label: "Artwork", action: () => handleFilterClick("Artwork") },
    { label: "Shop", action: () => handleFilterClick("Shop") },
    { label: "Furniture", action: () => handleFilterClick("Furniture") },
    { label: "About", action: openAbout },
  ];

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const viewKey =
    currentView === "about"
      ? "about"
      : currentView === "info"
        ? `info-${siteInfoPageKey}`
      : currentView === "cart"
          ? "cart"
          : currentView === "checkout"
            ? "checkout"
            : currentView === "success"
              ? "success"
              : currentView === "product" && selectedProduct
                ? `product-${selectedProduct.id}`
                : `shop-${activeFilter}`;

  return (
    <div className="workhorse-sans flex min-h-screen flex-col bg-white text-black antialiased">
      <style>{fontStyles}</style>
      <header className="sticky top-0 z-40 bg-white">
        <div className="relative flex justify-center px-3 pb-0 pt-2 sm:px-5 sm:pb-1 sm:pt-3">
          <button
            onClick={handleHomeClick}
            aria-label="Go to top"
            className="flex items-center justify-center"
          >
            <div className="flex h-14 w-48 items-center justify-center overflow-hidden bg-white sm:h-24 sm:w-[28rem]">
              <img src={logoImageSrc} alt="Workhorse home" className="h-full w-full object-contain" />
            </div>
          </button>
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center sm:hidden">
            <AnimatePresence initial={false}>
              {cartItemCount > 0 ? (
                <motion.button
                  key="mobile-cart-button"
                  type="button"
                  onClick={openCart}
                  initial={{ opacity: 0, scale: 0.45, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.45, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-9 w-9 items-center justify-center transition hover:opacity-50"
                  aria-label={`Open cart with ${cartItemCount} item${cartItemCount === 1 ? "" : "s"}`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="20" r="1.25" />
                    <circle cx="18" cy="20" r="1.25" />
                    <path d="M3 4h2.2l2.1 10.2a1 1 0 0 0 1 .8h9.9a1 1 0 0 0 1-.8L21 7H7" />
                  </svg>
                  <span className="absolute -right-1 -top-1 min-w-[1rem] rounded-full border border-black bg-white px-1 text-center text-[9px] leading-4">
                    {cartItemCount}
                  </span>
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative flex items-center justify-center px-3 py-2 sm:px-5 sm:py-3">
          <div className="absolute left-3 flex items-center gap-3 sm:left-5">
            {currentView === "shop" ? (
              <button
                type="button"
                onClick={handleZoomToggle}
                className="hidden h-10 w-10 items-center justify-center transition hover:opacity-50 sm:flex"
                aria-label="Toggle grid layout"
              >
                {zoomDirection === "out" ? (
                  <span aria-hidden="true" className="block h-0.5 w-5 bg-black" />
                ) : (
                  <span aria-hidden="true" className="relative block h-5 w-5">
                    <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-black" />
                    <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-black" />
                  </span>
                )}
              </button>
            ) : currentView === "product" ? (
              <button
                type="button"
                onClick={closeProductPage}
                className="flex h-9 w-9 items-center justify-center transition hover:opacity-50 sm:h-10 sm:w-10"
                aria-label="Back to home"
              >
                <span aria-hidden="true" className="block h-3 w-3 rounded-full border-2 border-black"></span>
              </button>
            ) : currentView === "checkout" || currentView === "cart" ? (
              <button
                type="button"
                onClick={continueShopping}
                className="flex h-9 w-9 items-center justify-center transition hover:opacity-50 sm:h-10 sm:w-10"
                aria-label="Back to shop"
              >
                <span aria-hidden="true" className="text-2xl leading-none">{"<"}</span>
              </button>
            ) : null}
          </div>

          <nav className="workhorse-serif grid w-full max-w-[16rem] grid-cols-2 gap-x-10 gap-y-0.5 text-base tracking-[0.01em] sm:max-w-[18rem] sm:gap-x-12">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-center leading-tight transition hover:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute right-3 hidden items-center gap-3 sm:right-5 sm:flex">
            <AnimatePresence initial={false}>
              {cartItemCount > 0 ? (
                <motion.button
                  key="cart-button"
                  type="button"
                  onClick={openCart}
                  initial={{ opacity: 0, scale: 0.45, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.45, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-9 w-9 items-center justify-center transition hover:opacity-50 sm:h-10 sm:w-10"
                  aria-label={`Open cart with ${cartItemCount} item${cartItemCount === 1 ? "" : "s"}`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="20" r="1.25" />
                    <circle cx="18" cy="20" r="1.25" />
                    <path d="M3 4h2.2l2.1 10.2a1 1 0 0 0 1 .8h9.9a1 1 0 0 0 1-.8L21 7H7" />
                  </svg>
                  <span className="absolute -right-1 -top-1 min-w-[1rem] rounded-full border border-black bg-white px-1 text-center text-[9px] leading-4">
                    {cartItemCount}
                  </span>
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main
        ref={shopViewportRef}
        className={
          currentView === "shop"
            ? "flex-1 overflow-y-auto overflow-x-hidden snap-y snap-mandatory"
            : "flex-1 overflow-y-auto overflow-x-hidden"
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          {currentView === "shop" ? (
            <motion.section
              key={viewKey}
              style={{ transformOrigin: "50% 50%" }}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className=""
            >
              {productGroups.length > 0 ? (
                <div>
                  {productGroups.map((group, index) => (
                    <div
                      ref={(element) => {
                        visibleRowRefs.current[index] = element;
                      }}
                      key={`${activeFilter}-${index}`}
                      style={rowRenderStyle}
                      className={rowPaddingClass}
                    >
                      <div className={`grid h-full auto-rows-fr ${gridColumnsClass} ${gridGapClass}`}>
                        {group.map((product) => (
                          <div key={product.id} className="min-h-0">
                            <ProductCard product={product} onOpen={openProductPage} imageClassName={productImageClass} />
                          </div>
                        ))}
                        {Array.from({ length: Math.max(0, columnsPerRow - group.length) }).map((_, fillerIndex) => (
                          <div
                            key={`empty-${activeFilter}-${index}-${fillerIndex}`}
                            className="min-h-0 bg-white"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-20 text-center text-[11px] uppercase tracking-[0.2em] text-black/60">
                  No items in this category yet.
                </div>
              )}
            </motion.section>
          ) : currentView === "product" && selectedProduct ? (
            <motion.div key={viewKey} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <ProductPage
                product={selectedProduct}
                onBack={closeProductPage}
                onPrevious={openPreviousProduct}
                onNext={openNextProduct}
                onAddToCart={addToCart}
              />
            </motion.div>
          ) : currentView === "checkout" || currentView === "cart" ? (
            <motion.div key={viewKey} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <CheckoutPage
                cartItems={cartItems}
                checkoutDetails={checkoutDetails}
                checkoutState={checkoutState}
                paymentMethod={paymentMethod}
                subscribeToUpdates={subscribeToUpdates}
                stripePromise={stripePromise}
                stripePublishableKeyError={stripePublishableKeyError}
                onCheckoutFieldChange={handleCheckoutFieldChange}
                onSubscribeChange={handleSubscribeChange}
                onPaymentMethodChange={handlePaymentMethodChange}
                onUpdateQuantity={updateCartItemQuantity}
                onStartCheckout={startCheckout}
                onStripePayment={handleStripePayment}
              />
            </motion.div>
          ) : currentView === "success" ? (
            <motion.div key={viewKey} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <OrderSuccessPage onContinueShopping={continueShopping} />
            </motion.div>
          ) : currentView === "info" ? (
            <motion.div key={viewKey} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <SiteInfoPage page={siteInfoPages[siteInfoPageKey]} />
            </motion.div>
          ) : (
            <motion.section
              key={viewKey}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              id="about"
              className="min-h-[calc(100svh-92px)] sm:min-h-[calc(100vh-97px)]"
            >
              <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
                <div className="max-w-3xl space-y-8 sm:space-y-10">
                  <p className="text-[11px] uppercase tracking-[0.24em]">About</p>
                  <div className="space-y-5 sm:space-y-6">
                    <h1 className="workhorse-serif text-3xl tracking-[0.08em] sm:text-5xl">Jonathan Jaffrey</h1>
                    <figure className="mx-auto w-full max-w-[22rem] overflow-hidden bg-white sm:mx-0 sm:max-w-[26rem]">
                      <img
                        src={aboutImageSrc}
                        alt="Jonathan Jaffrey in front of his artwork"
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full object-cover"
                      />
                    </figure>
                    <div className="space-y-5 text-sm leading-7 text-black/75">
                      <p>
                        Feet dangling off the chair scribbling at his tiny desk, sketching drawings on the side of notebooks distracted in class, creating novels with pen, brushes, and on screen, from lived to fiction. For Jonathan Jaffrey, drawing has always been part of his life. It started from a young age. His dad told him stories, sketching characters that remain with him to this day. Jon took what was a natural born hobby and used it as a tool to express experiences, cultures, and characters, all from a truthfully raw point of view.
                      </p>
                      <p>
                        Born in San Diego, and raised in Bakersfield, California, he spent the majority of his life under the sun, finding every moment he could to escape to the beach. After graduating high school, Jon made his way back to San Diego to begin his college education. From there, he moved to Los Angeles to finish his degree in English at UCLA. In his time in LA, he reflected on his past, the city's nature, and the characters surrounding him, and found his way back to art through sketches based on lived reality. These were the first several chapters of Swim, a fictional graphic short novel (loosely an autobiography). From this point forward, he chose to reflect reality as both purely honest and entirely imagined; mixing art styles from unhinged and abstract, to precisely detailed pen work. All while nodding to his inner child who once began the same journey.
                      </p>
                      <p>
                        Jon Jaff works on many different media: painting on canvas, creating digital art, sketching with pencil or markers, film and editing, and all of the above simultaneously. Because why not. With that same mindset, Jon approaches every craft with a ruthless sense of will. Nothing remains unexplored. His collection varies in style, shape, and form, keeping every door cracked and every perspective explored. You should never feel as though you are limited in what you can express and how you choose to do so.
                      </p>
                      <p>
                        The artist now resides in Berlin, Germany exploring entirely new media, different cultures, and various perspectives yet to be illustrated. His newest collection, The Tourist, features a series of original characters adding to the universe he creates with his art. And there's so much more left to see, and many more stories to tell.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="workhorse-serif text-2xl tracking-[0.06em] sm:text-3xl">Contact</h2>
                    <div className="space-y-1 text-[11px] tracking-[0.2em]">
                      <a
                        href="mailto:Jonjaff623@gmail.com"
                        className="flex flex-col gap-2 border-b border-black py-4 hover:opacity-50 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="uppercase">Email</span>
                        <span className="break-all text-black/60 sm:text-right">Jonjaff623@gmail.com</span>
                      </a>
                      <div className="flex items-center justify-between gap-4 border-b border-black py-4 uppercase">
                        <span>Socials</span>
                        <span className="text-black/60">@JONJAFF</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="flex flex-col items-center justify-center gap-3 px-4 py-4 sm:px-6">
        <img
          src={isFooterAnimated ? footerImageAnimatedSrc : footerImageSrc}
          alt="Workhorse"
          onMouseEnter={() => setIsFooterAnimated(true)}
          onMouseLeave={() => setIsFooterAnimated(false)}
          className="h-auto w-full max-w-[3.6rem] object-contain sm:max-w-[4.8rem]"
        />
      </footer>
    </div>
  );
}


























































































