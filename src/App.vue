<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const imageAssets = import.meta.glob("./assets/kashmir/*.jpeg", {
  eager: true,
  query: "?url",
  import: "default",
});

function image(name) {
  return imageAssets[`./assets/kashmir/${name}.jpeg`];
}

function mediaSource(item) {
  return typeof item === "object" && item !== null ? item.image : item;
}

function imageStyle(item) {
  const name = mediaSource(item);
  const source = name?.startsWith("data:") || name?.startsWith("http") || name?.startsWith("/") ? name : image(name);
  return { backgroundImage: `url('${source}')` };
}

const brandName = "Snow Feather";
const logoSrc = "/snow-feather-logo.jpeg";
const mainBackgroundVideoSrc = "/snow-feather-main-bg.mp4";

function loadStoredValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

const navItems = [
  ["Packages", "/packages"],
  ["Destinations", "/destinations"],
  ["Booking", "/booking"],
];

const moreMenuItems = [
  ["Home", "/home"],
  ["About Us", "/about"],
  ["Gallery", "/gallery"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];

const publicRoutes = {
  "/": "about",
  "/home": "home",
  "/about": "about",
  "/packages": "packages",
  "/destinations": "destinations",
  "/booking": "booking",
  "/gallery": "gallery",
  "/blog": "blog",
  "/contact": "contact",
  "/privacy-policy": "privacyPolicy",
  "/terms-of-service": "termsOfService",
};

function normalizePath(path) {
  const cleanPath = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
  if (cleanPath === "/admin/login") return cleanPath;
  if (cleanPath.startsWith("/packages/") && cleanPath.split("/").length === 3) return cleanPath;
  return publicRoutes[cleanPath] ? cleanPath : "/";
}

const currentPath = ref(normalizePath(window.location.pathname));
const isAdminRoute = computed(() => currentPath.value === "/admin/login");
const isMenuOpen = ref(false);
const isMoreMenuOpen = ref(false);
const isInitialLoading = ref(true);
const activeFilter = ref("all");
const activeAdminTab = ref("packages");
const openFaqs = ref([0]);
const currentPage = computed(() => (currentPath.value.startsWith("/packages/") ? "packageDetail" : publicRoutes[currentPath.value] || "home"));
let initialLoadingTimeout = null;

const defaultSiteContent = {
  heroBadge: "Kashmir tour packages, adventure trips, and local travel support",
  heroTitle: "Plan Your Kashmir Trip With Snow Feather",
  heroSubtitle:
    "Book curated Kashmir holiday packages for Srinagar, Gulmarg, Pahalgam, Sonamarg, Dal Lake, skiing, trekking, camping, honeymoon tours, family vacations, and luxury stays with local experts.",
  homeActivitiesEyebrow: "Featured activities",
  homeActivitiesTitle: "Kashmir adventure, snow, lake, and mountain experiences.",
  homeGalleryEyebrow: "Media gallery",
  homeGalleryTitle: "Instagram, video, snowfall, and drone ready layout.",
  packagesHeroEyebrow: "Tour Packages",
  packagesHeroTitle: "Updated Premium Package Structure",
  packagesHeroText:
    "Snow Feather LLP premium packages for skiing, trekking, camping, honeymoon travel, group tours, and airport-to-airport Kashmir support with transparent seasonal pricing.",
  destinationsHeroEyebrow: "Destinations",
  destinationsHeroTitle: "Kashmir routes your guests ask for.",
  bookingHeroEyebrow: "Booking system",
  bookingHeroTitle: "Select, price, pay, confirm.",
  galleryHeroEyebrow: "Gallery",
  galleryHeroTitle: "Kashmir moments from snow peaks to quiet lake mornings.",
  galleryHeroText:
    "Browse destination albums, seasonal travel moods, guest-style photo ideas, and the kind of scenes Snow Feather can plan into your Kashmir journey.",
  galleryHeroImage: "image23",
  galleryStatOneValue: "23+",
  galleryStatOneText: "Kashmir visuals ready for destination and package storytelling.",
  galleryStatTwoValue: "4 seasons",
  galleryStatTwoText: "Snow, gardens, meadows, lakes, autumn colors, and honeymoon frames.",
  galleryCollectionsEyebrow: "Photo collections",
  galleryCollectionsTitle: "Albums for every kind of Kashmir traveler.",
  galleryFullEyebrow: "Full gallery",
  galleryFullTitle: "Explore the current website gallery.",
  galleryContentEyebrow: "Travel media",
  galleryContentTitle: "Use the gallery to choose your mood before you book.",
  galleryContentText:
    "Some guests want snow adventure, some want lake sunsets, and some need relaxed family photographs. The gallery helps match the right route to the right feeling.",
  blogHeroEyebrow: "Blog",
  blogHeroTitle: "Kashmir travel advice before you pack your bags.",
  blogHeroText:
    "Read practical planning notes for snowfall trips, family holidays, honeymoon pacing, houseboat stays, local movement, and booking confidence.",
  blogFeaturedEyebrow: "Featured guide",
  blogFeaturedTitle: "How to build a balanced Kashmir itinerary.",
  blogFeaturedText:
    "Start with Srinagar, add one snow or valley day, keep travel time realistic, and leave space for weather, photos, shopping, and rest.",
  blogFeaturedImage: "image18",
  blogPostsEyebrow: "Latest posts",
  blogPostsTitle: "Helpful reads for smoother Kashmir holidays.",
  blogGuidesEyebrow: "Planner notes",
  blogGuidesTitle: "Quick guides guests ask for most.",
  blogGuidesText:
    "Use these notes as a starting point, then send your dates, traveler count, and preferred comfort level for a custom plan.",
  blogChecklistEyebrow: "Before you travel",
  blogChecklistTitle: "A clear checklist beats last-minute rush.",
  contactHeroEyebrow: "Contact",
  contactHeroTitle: "Instant inquiry, emergency support, and WhatsApp booking.",
  contactPhone: "+91 919055020408",
  contactEmail: "snowfeatheradventures@gmail.com",
  contactAddress: "Karra Building, Court Road, Lal chowk, Srinagar, 190001, Jammu and Kashmir",
  contactSupport: "24/7 during active trips",
  googleRecaptchaSiteKey: "",
};

const siteContent = ref({ ...defaultSiteContent, ...loadStoredValue("kashmir-site-content", defaultSiteContent) });

const premiumStructureDate = "18/05, 2:00 pm";
const premiumSourceNote =
  "Updated Premium Package Structure from Snow Feather LLP - Expeditions & Adventures. These package details follow Kashmir seasonal market trends for skiing, trekking, camping, honeymoon, and airport-to-airport travel.";

const packageCategories = [
  ["Solo Traveler Package", "01 Person", "Solo tourists, ski learners, adventure travelers, backpackers"],
  ["Double Sharing Package", "02 Persons", "Friends, brothers, family members"],
  ["Couple Package", "02 Persons / Honeymoon", "Honeymoon couples, romantic luxury travel"],
  ["Group Package", "04-10 Persons", "Friends group, corporate groups, student groups"],
];

const roomSharingOptions = [
  ["Standard Sharing", "02 persons / room"],
  ["Triple Sharing", "03 persons / room"],
  ["Luxury Private Room", "Private occupancy"],
];

const hotelCategories = [
  ["Budget", "Guest House / Standard Hotel"],
  ["Deluxe", "3 Star Hotels"],
  ["Premium", "4 Star Hotels"],
  ["Luxury", "5 Star Resorts"],
];

const trustMessages = [
  "Transparent Pricing - No Hidden Charges",
  "Legally Registered & Professionally Managed Adventure Company",
  "Experienced Local Team With Safety Commitment",
  "Your Journey, Our Responsibility",
  "We Believe In Commitment, Safety & Genuine Hospitality - Not False Promises.",
  "Adventure Without Fear. Travel Without Doubt.",
];

const winterPricingNote =
  "During peak winter season in Gulmarg and Sonmarg, skiing, accommodation, transportation, and adventure activity prices increase significantly due to heavy tourist demand, snow conditions, equipment logistics, and limited premium availability.";

const premiumFeatureImages = ["image08", "image10", "image19"];

const purposeCards = [
  {
    label: "Our Vision",
    title: "To make Kashmir travel clear, trusted, and unforgettable.",
    text:
      "Snow Feather aims to become a trusted Kashmir tourism company for travelers who want beautiful places, honest guidance, comfortable stays, and reliable local support from inquiry to return.",
  },
  {
    label: "Our Mission",
    title: "To design Kashmir trips that match real travelers.",
    text:
      "Our mission is to build practical Kashmir tour packages for families, honeymoon couples, adventure groups, and luxury guests with clear routes, fair pricing, safe transfers, activity coordination, and 24/7 on-trip assistance.",
  },
  {
    label: "Our Motto",
    title: "Travel Kashmir with confidence.",
    text:
      "Our motto is simple: clear plans, local care, and memorable Kashmir experiences. From Gulmarg snow activities to Dal Lake houseboats, we keep every trip easy to understand and easy to enjoy.",
  },
];

const pageSeo = computed(() => {
  const map = {
    home: {
      title: "Snow Feather | Kashmir Tour Packages, Adventure Trips & Travel Support",
      description:
        "Book Snow Feather Kashmir tour packages for Srinagar, Gulmarg, Pahalgam, Sonamarg, Dal Lake, skiing, trekking, camping, honeymoon tours, family holidays, and luxury travel.",
    },
    about: {
      title: "About Snow Feather | Kashmir Tourism Company & Local Travel Experts",
      description:
        "Learn about Snow Feather, a Kashmir tourism company offering custom tour packages, local travel planning, hotel and houseboat stays, cab transfers, snow activities, and trip support.",
    },
    packages: {
      title: "Kashmir Tour Packages | Gulmarg, Srinagar, Pahalgam & Sonamarg",
      description: siteContent.value.packagesHeroText,
    },
    destinations: {
      title: "Kashmir Destinations | Srinagar, Gulmarg, Pahalgam, Sonamarg & Dal Lake",
      description:
        "Explore Kashmir destinations including Srinagar, Gulmarg, Pahalgam, Sonamarg, Dal Lake, Mughal Gardens, snow points, valleys, and local sightseeing routes.",
    },
    booking: {
      title: "Book Kashmir Tour Package | Snow Feather Booking Inquiry",
      description:
        "Send a Kashmir trip inquiry to Snow Feather for custom packages, hotels, houseboats, cab transfers, adventure activities, honeymoon tours, and family travel plans.",
    },
    gallery: {
      title: "Kashmir Travel Gallery | Snow Feather Photos & Trip Ideas",
      description: siteContent.value.galleryHeroText,
    },
    blog: {
      title: "Kashmir Travel Blog | Snow Feather Travel Tips & Planning Guides",
      description: siteContent.value.blogHeroText,
    },
    contact: {
      title: "Contact Snow Feather | Kashmir Tour Booking Support",
      description:
        "Contact Snow Feather for Kashmir tour packages, WhatsApp booking, hotel and houseboat support, cab transfers, adventure activities, and custom travel planning.",
    },
  };

  return map[currentPage.value] || map.home;
});

function updateMetaTag(selector, attribute, content) {
  const tag = document.head.querySelector(selector);
  if (tag) tag.setAttribute(attribute, content);
}

function updateSeoMeta() {
  const seo = pageSeo.value;
  document.title = seo.title;
  updateMetaTag("meta[name='description']", "content", seo.description);
  updateMetaTag("meta[property='og:title']", "content", seo.title);
  updateMetaTag("meta[property='og:description']", "content", seo.description);
}

const defaultPackages = [
  {
    name: "01 Day Ski Package - Without Food & Accommodation",
    tag: "Skiing",
    price: 18000,
    originalPrice: 22000,
    duration: "1D",
    rating: "4.9",
    types: ["winter", "skiing", "adventure"],
    routeTitle: "Gulmarg / Sonmarg",
    routeDetails: "Beginner ski training, equipment, instructor, local transport",
    cities: ["Gulmarg", "Sonmarg"],
    highlights: ["Ski instructor", "Equipment", "Beginner training", "Local transport"],
    image: image("image08"),
    description:
      "Short skiing course without food and accommodation. Standard: 01 person ₹18,000, 02 persons ₹30,000, group ₹65,000. Deluxe: 01 person ₹28,000, 02 persons ₹50,000, group ₹1,10,000. Luxury: 01 person ₹45,000, 02 persons ₹80,000, group ₹1,80,000.",
  },
  {
    name: "01 Day Ski Package - With Food & Accommodation",
    tag: "Complete",
    price: 28000,
    originalPrice: 34000,
    duration: "1D/1N",
    rating: "4.9",
    types: ["winter", "skiing", "luxury"],
    routeTitle: "Gulmarg / Sonmarg",
    routeDetails: "Hotel stay, meals, ski equipment, instructor, pickup and drop",
    cities: ["Gulmarg", "Sonmarg"],
    highlights: ["Hotel stay", "Breakfast & dinner", "Ski equipment", "Pickup & drop"],
    image: image("image15"),
    description:
      "Complete one day ski package. Standard: solo ₹28,000, couple ₹48,000, group ₹1,20,000. Deluxe: solo ₹45,000, couple ₹78,000, group ₹2,10,000. Luxury: solo ₹75,000, couple ₹1,35,000, group ₹3,80,000.",
  },
  {
    name: "02 Days Ski Course - Without Food & Accommodation",
    tag: "Ski Course",
    price: 35000,
    originalPrice: 42000,
    duration: "2D",
    rating: "4.8",
    types: ["winter", "skiing", "adventure"],
    routeTitle: "Gulmarg / Sonmarg",
    routeDetails: "Two day ski learning course without meals and stay",
    cities: ["Gulmarg", "Sonmarg"],
    highlights: ["Two day training", "Instructor", "Equipment support", "Winter guidance"],
    image: image("image13"),
    description:
      "Two day ski course without food and accommodation. Standard: 01 person ₹35,000, 02 persons ₹58,000. Deluxe: 01 person ₹55,000, 02 persons ₹95,000. Luxury: 01 person ₹95,000, 02 persons ₹1,65,000.",
  },
  {
    name: "02 Days Ski Course - Complete Package",
    tag: "Complete",
    price: 48000,
    originalPrice: 58000,
    duration: "2D/2N",
    rating: "4.9",
    types: ["winter", "skiing", "luxury"],
    routeTitle: "Gulmarg / Sonmarg",
    routeDetails: "Accommodation, meals, ski training, instructor, transfers",
    cities: ["Gulmarg", "Sonmarg"],
    highlights: ["Accommodation", "Meals", "Ski training", "Transfers"],
    image: image("image16"),
    description:
      "Complete two day ski course. Standard: solo ₹48,000, couple ₹85,000. Deluxe: solo ₹78,000, couple ₹1,40,000. Luxury: solo ₹1,35,000, couple ₹2,60,000.",
  },
  {
    name: "03 Days Ski Course - Complete Package",
    tag: "Ski Course",
    price: 75000,
    originalPrice: 90000,
    duration: "3D/3N",
    rating: "5.0",
    types: ["winter", "skiing", "group", "luxury"],
    routeTitle: "Gulmarg / Sonmarg",
    routeDetails: "Three day premium skiing with stay, meals, and instructor",
    cities: ["Gulmarg", "Sonmarg"],
    highlights: ["Ski training", "Accommodation", "Meals", "Group support"],
    image: image("image17"),
    description:
      "Complete three day ski course. Standard: solo ₹75,000, couple ₹1,35,000, group ₹3,20,000. Deluxe: solo ₹1,20,000, couple ₹2,10,000, group ₹5,40,000. Luxury: solo ₹2,00,000, couple ₹3,80,000, group ₹9,00,000.",
  },
  {
    name: "06 Days Professional Ski Course",
    tag: "Premium Winter",
    price: 145000,
    originalPrice: 175000,
    duration: "6D/6N",
    rating: "5.0",
    types: ["winter", "skiing", "group", "luxury"],
    routeTitle: "Gulmarg / Sonmarg",
    routeDetails: "Professional ski training, Gondola guidance, meals, transport, safety support",
    cities: ["Gulmarg", "Sonmarg"],
    highlights: ["Professional instructor", "Gondola guidance", "Snow activities", "Winter safety support"],
    image: image("image10"),
    description:
      "Premium winter professional ski course. Standard: solo ₹1,45,000, couple ₹2,65,000, group ₹6,50,000. Deluxe: solo ₹2,40,000, couple ₹4,20,000, group ₹10,50,000. Luxury: solo ₹4,20,000, couple ₹7,50,000, group ₹18,00,000. Includes ski training, Gondola access guidance, accommodation, meals, transport, snow activities, bonfire, professional instructor, and winter safety support.",
  },
  {
    name: "01 Day Trek - Sonmarg Thajiwas Trek",
    tag: "Trekking",
    price: 8000,
    originalPrice: 10000,
    duration: "1D",
    rating: "4.8",
    types: ["summer", "trekking", "adventure"],
    routeTitle: "Sonmarg",
    routeDetails: "Thajiwas trek with local guidance",
    cities: ["Sonmarg", "Thajiwas"],
    highlights: ["Trek guide", "Scenic route", "Transport support", "Photography spots"],
    image: image("image11"),
    description:
      "One day Sonmarg to Thajiwas trek. Standard: solo ₹8,000, couple ₹14,000, group ₹40,000. Deluxe: solo ₹15,000, couple ₹28,000, group ₹75,000. Luxury: solo ₹30,000, couple ₹55,000, group ₹1,50,000.",
  },
  {
    name: "02 Days Trekking + Camping",
    tag: "Camping",
    price: 18000,
    originalPrice: 22000,
    duration: "2D/1N",
    rating: "4.9",
    types: ["summer", "trekking", "camping", "group"],
    routeTitle: "Aru Valley / Yusmarg",
    routeDetails: "Trekking, camping, meals, bonfire, guide, transport",
    cities: ["Aru Valley", "Yusmarg"],
    highlights: ["Camping", "Meals", "Trek guide", "Bonfire"],
    image: image("image01"),
    description:
      "Two days trekking plus camping in Aru Valley or Yusmarg. Standard: solo ₹18,000, couple ₹32,000, group ₹85,000. Deluxe: solo ₹35,000, couple ₹62,000, group ₹1,70,000. Luxury: solo ₹65,000, couple ₹1,25,000, group ₹3,50,000. Includes camping, meals, trek guide, bonfire, transport, and photography spots.",
  },
  {
    name: "03 Days Trekking Package",
    tag: "Expedition",
    price: 35000,
    originalPrice: 42000,
    duration: "3D/2N",
    rating: "4.9",
    types: ["summer", "trekking", "group", "luxury"],
    routeTitle: "Pahalgam / Sonmarg",
    routeDetails: "Expedition route with guide, stay, meals, and support",
    cities: ["Pahalgam", "Sonmarg"],
    highlights: ["Expedition guide", "Meals", "Stay support", "Transport"],
    image: image("image19"),
    description:
      "Three days trekking expedition in Pahalgam or Sonmarg. Standard: solo ₹35,000, couple ₹65,000, group ₹1,80,000. Deluxe: solo ₹68,000, couple ₹1,25,000, group ₹3,50,000. Luxury: solo ₹1,30,000, couple ₹2,45,000, group ₹7,00,000.",
  },
  {
    name: "06 Days Great Lakes Trek",
    tag: "Great Lakes",
    price: 75000,
    originalPrice: 90000,
    duration: "6D/5N",
    rating: "5.0",
    types: ["summer", "trekking", "group", "luxury"],
    routeTitle: "Kashmir Great Lakes",
    routeDetails: "Multi-day trek with complete route support",
    cities: ["Sonmarg", "Kashmir Great Lakes"],
    highlights: ["Great Lakes route", "Guide", "Meals", "Camping support"],
    image: image("image09"),
    description:
      "Six days Kashmir Great Lakes trek. Standard: solo ₹75,000, couple ₹1,40,000, group ₹4,50,000. Deluxe: solo ₹1,45,000, couple ₹2,75,000, group ₹8,50,000. Luxury: solo ₹2,90,000, couple ₹5,50,000, group ₹18,00,000.",
  },
  {
    name: "01 Night Camping",
    tag: "Camping",
    price: 7500,
    originalPrice: 9500,
    duration: "1N",
    rating: "4.8",
    types: ["summer", "camping", "adventure"],
    routeTitle: "Kashmir",
    routeDetails: "One night camping complete package",
    cities: ["Kashmir"],
    highlights: ["Tent stay", "Camp setup", "Outdoor experience", "Local support"],
    image: image("image03"),
    description: "One night camping package. Standard: solo ₹7,500, couple ₹14,000. Deluxe: solo ₹15,000, couple ₹28,000. Luxury: solo ₹35,000, couple ₹65,000.",
  },
  {
    name: "02 Night Camping",
    tag: "Camping",
    price: 15000,
    originalPrice: 18000,
    duration: "2N",
    rating: "4.8",
    types: ["summer", "camping", "adventure"],
    routeTitle: "Kashmir",
    routeDetails: "Two night camping complete package",
    cities: ["Kashmir"],
    highlights: ["Tent stay", "Meals support", "Camp planning", "Outdoor route"],
    image: image("image04"),
    description: "Two night camping package. Standard: solo ₹15,000, couple ₹28,000. Deluxe: solo ₹28,000, couple ₹52,000. Luxury: solo ₹58,000, couple ₹1,10,000.",
  },
  {
    name: "03 Night Camping",
    tag: "Camping",
    price: 22000,
    originalPrice: 27000,
    duration: "3N",
    rating: "4.9",
    types: ["summer", "camping", "group"],
    routeTitle: "Kashmir",
    routeDetails: "Three night camping complete package",
    cities: ["Kashmir"],
    highlights: ["Tent stay", "Bonfire", "Meals support", "Group planning"],
    image: image("image05"),
    description: "Three night camping package. Standard: solo ₹22,000, couple ₹42,000. Deluxe: solo ₹45,000, couple ₹85,000. Luxury: solo ₹95,000, couple ₹1,80,000.",
  },
  {
    name: "06 Night Adventure Camp",
    tag: "Adventure Camp",
    price: 45000,
    originalPrice: 54000,
    duration: "6N",
    rating: "5.0",
    types: ["summer", "camping", "group", "adventure"],
    routeTitle: "Kashmir",
    routeDetails: "Six night adventure camping experience",
    cities: ["Kashmir"],
    highlights: ["Adventure camp", "Meals support", "Bonfire", "Route planning"],
    image: image("image06"),
    description: "Six night adventure camp. Standard: solo ₹45,000, couple ₹85,000. Deluxe: solo ₹85,000, couple ₹1,60,000. Luxury: solo ₹1,80,000, couple ₹3,40,000.",
  },
  {
    name: "03 Days Honeymoon Package",
    tag: "Honeymoon",
    price: 68000,
    originalPrice: 82000,
    duration: "3D/2N",
    rating: "5.0",
    types: ["honeymoon", "luxury"],
    routeTitle: "Kashmir",
    routeDetails: "Romantic hotel setup, private cab, candlelight dinner",
    cities: ["Srinagar", "Gulmarg", "Pahalgam"],
    highlights: ["Private cab", "Romantic hotel setup", "Candlelight dinner", "Houseboat option"],
    image: image("image14"),
    description: "Three days honeymoon package for couples. Standard ₹68,000, Deluxe ₹1,25,000, Luxury ₹2,80,000.",
  },
  {
    name: "06 Days Premium Honeymoon",
    tag: "Premium",
    price: 135000,
    originalPrice: 160000,
    duration: "6D/5N",
    rating: "5.0",
    types: ["honeymoon", "luxury"],
    routeTitle: "Srinagar, Gulmarg, Pahalgam",
    routeDetails: "Airport pickup, private cab, romantic setup, houseboat",
    cities: ["Srinagar", "Gulmarg", "Pahalgam", "Dal Lake"],
    highlights: ["Airport pickup", "Private cab", "Romantic hotel setup", "Srinagar houseboat"],
    image: image("image20"),
    description:
      "Six days premium honeymoon package. Standard ₹1,35,000, Deluxe ₹2,60,000, Luxury ₹5,80,000. Includes airport pickup, private cab, romantic hotel setup, candlelight dinner, Gulmarg, Pahalgam, and Srinagar houseboat.",
  },
  {
    name: "Airport To Airport Kashmir Package",
    tag: "Custom",
    price: 0,
    originalPrice: 0,
    duration: "Custom",
    rating: "5.0",
    types: ["family", "group", "luxury", "custom"],
    routeTitle: "Airport To Airport",
    routeDetails: "Pickup, entire tour, hotels, meals, driver, airport drop",
    cities: ["Srinagar", "Gulmarg", "Pahalgam", "Sonmarg", "Dal Lake"],
    highlights: ["Airport pickup", "Entire tour", "Hotels & meals", "Airport drop"],
    image: image("image21"),
    description: "Airport to airport package includes pickup from airport, entire tour, hotels, meals, driver, and drop at airport. Pricing is customized by travel dates, hotel category, room sharing, destinations, and group size.",
  },
];

function clonePackage(item) {
  return {
    ...item,
    packageDate: item.packageDate || premiumStructureDate,
    types: Array.isArray(item.types) ? [...item.types] : [],
    cities: Array.isArray(item.cities) ? [...item.cities] : [],
    highlights: Array.isArray(item.highlights) ? [...item.highlights] : [],
  };
}

function loadStoredPackages() {
  const savedPackages = loadStoredValue("kashmir-packages-premium-v2", defaultPackages);
  return Array.isArray(savedPackages) ? savedPackages.map(clonePackage) : defaultPackages.map(clonePackage);
}

const packages = ref(loadStoredPackages());
const filters = ["all", "winter", "summer", "honeymoon", "luxury"];
const filteredPackages = computed(() => {
  if (activeFilter.value === "all") return packages.value;
  return packages.value.filter((item) => Array.isArray(item.types) && item.types.includes(activeFilter.value));
});

function slugifyPackageName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const detailPackage = computed(() => {
  const slug = currentPath.value.replace("/packages/", "");
  return packages.value.find((item) => slugifyPackageName(item.name) === slug) || packages.value[0];
});

function textListToArray(value) {
  return String(value || "")
    .split(",")
    .map((part) => part.trim().replace(/\.$/, ""))
    .filter(Boolean);
}

function descriptionHighlights(item) {
  return textListToArray(item?.description).slice(0, 4);
}

const detailHighlights = computed(() => {
  const item = detailPackage.value;
  const savedHighlights = Array.isArray(item?.highlights) ? item.highlights.filter(Boolean).slice(0, 6) : [];
  const descriptionParts = descriptionHighlights(item);

  return savedHighlights.length ? savedHighlights : descriptionParts.length ? descriptionParts : ["Private cab", "Hotel stay", "Local guide", "Trip support"];
});

const detailCities = computed(() => {
  const savedCities = Array.isArray(detailPackage.value?.cities) ? detailPackage.value.cities.filter(Boolean) : [];
  if (savedCities.length) return savedCities;

  const text = `${detailPackage.value?.name || ""} ${detailPackage.value?.description || ""}`.toLowerCase();
  const cityNames = ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg", "Dal Lake", "Mughal Gardens"];
  const matchedCities = cityNames.filter((city) => text.includes(city.toLowerCase()));
  return matchedCities.length ? matchedCities : ["Srinagar", "Gulmarg"];
});

const detailFallbackSaveAmount = computed(() => Math.max(2500, Math.round(Number(detailPackage.value?.price || 0) * 0.18)));
const detailOriginalPrice = computed(() => Math.max(Number(detailPackage.value?.originalPrice || 0), Number(detailPackage.value?.price || 0) + detailFallbackSaveAmount.value));
const detailSaveAmount = computed(() => Math.max(detailFallbackSaveAmount.value, detailOriginalPrice.value - Number(detailPackage.value?.price || 0)));

const packageRouteMap = {
  "Gulmarg Ski & Gondola": ["Gulmarg", "Gondola, Apharwat Peak, Snow Trails"],
  "Srinagar Lake & Gardens": ["Srinagar", "Dal Lake, Mughal Gardens, Houseboat"],
  "Royal Kashmir Honeymoon": ["Kashmir", "Srinagar, Gulmarg, Pahalgam"],
  "Pahalgam Group Trek": ["Pahalgam", "Betaab Valley, Aru Valley, Camps"],
  "Sonamarg Snow Day": ["Sonamarg", "Glacier Point, Snow Activities"],
  "Luxury Kashmir Circuit": ["Kashmir", "Srinagar, Gulmarg, Pahalgam, Sonamarg"],
};

function packageRoute(item) {
  if (item.routeTitle || item.routeDetails) {
    return [item.routeTitle || "Kashmir", item.routeDetails || "Custom route"];
  }

  return packageRouteMap[item.name] || ["Kashmir", "Custom route"];
}

function packageChips(item) {
  const savedHighlights = Array.isArray(item.highlights) ? item.highlights.filter(Boolean).slice(0, 3) : [];
  return savedHighlights.length ? savedHighlights : descriptionHighlights(item).slice(0, 3);
}

function packageOriginalPrice(item) {
  return Math.max(Number(item.originalPrice || 0), Math.round(Number(item.price || 0) * 1.18));
}

function displayDuration(duration) {
  return String(duration || "").replace("/", " / ");
}

const detailWhatsappLink = computed(() => {
  const message = `I want details for ${detailPackage.value?.name || "a Kashmir package"}`;
  return `https://wa.me/919055020408?text=${encodeURIComponent(message)}`;
});

const defaultGalleryImages = ["image03", "image04", "image05", "image06", "image09", "image10", "image11", "image13", "image15", "image16", "image17", "image18"];
const galleryImages = ref(loadStoredValue("kashmir-gallery-images", defaultGalleryImages));

const galleryImageDetails = {
  image03: ["Gulmarg Meadows", "Open valley views with alpine slopes and quiet picnic routes."],
  image04: ["Gulmarg Village", "Green fields, mountain homes, and soft summer light."],
  image05: ["Gulmarg Wildflower Valley", "Flower meadows framed by snow-lined peaks."],
  image06: ["Snow Village", "Winter stays, pine forests, and fresh snowfall scenes."],
  image09: ["Alpine Lake", "High-altitude water, rocky trails, and trekking moods."],
  image10: ["Gulmarg Gondola", "Cable car views above snowfields and pine-covered slopes."],
  image11: ["Sonamarg Glacier", "Glacier routes, rocky terrain, and adventure photography."],
  image13: ["Snow Activity Point", "Snowmobile rides, family fun, and winter adventure stops."],
  image15: ["Gulmarg Snowfield", "Wide ski views, powder trails, and mountain backdrops."],
  image16: ["Winter Pine Valley", "Snow-covered cabins, quiet roads, and frozen forest views."],
  image17: ["Fresh Snow Tracks", "Clean white slopes and scenic walking trails."],
  image18: ["Kashmir Mountain Road", "Forest drives, hill routes, and journey moments."],
  image23: ["Kashmir Panorama", "A wide scenic frame for valleys, peaks, and travel stories."],
};

function galleryImageDetail(source, index = 0) {
  if (typeof source === "object" && source !== null) {
    return [
      source.title || "Kashmir View",
      source.text || "A scenic travel moment from the Snow Feather gallery.",
    ];
  }

  const fallbackPlaces = [
    ["Kashmir View", "A scenic travel moment from the Snow Feather gallery."],
    ["Mountain Escape", "Snow peaks, valleys, and fresh air for your next route."],
    ["Travel Memory", "A guest-style frame to help choose your Kashmir mood."],
  ];

  return galleryImageDetails[source] || fallbackPlaces[index % fallbackPlaces.length];
}

function galleryImageTitle(item, index) {
  return galleryImageDetail(item, index)[0];
}

function galleryImageText(item, index) {
  return galleryImageDetail(item, index)[1];
}

function updateGalleryImageField(index, field, value) {
  const existing = galleryImages.value[index];
  galleryImages.value[index] = {
    image: mediaSource(existing),
    title: field === "title" ? value : galleryImageTitle(existing, index),
    text: field === "text" ? value : galleryImageText(existing, index),
  };
}

const defaultGalleryCollections = [
  { title: "Snow Days", image: "image08", text: "Gulmarg skiing, snowmobile rides, Gondola views, and winter portraits for families, couples, and groups." },
  { title: "Lake Life", image: "image22", text: "Dal Lake houseboats, Shikara rides, floating market mornings, sunset frames, and slow Srinagar evenings." },
  { title: "Valley Routes", image: "image19", text: "Pahalgam meadows, pine roads, Betaab Valley, Aru Valley, and riverside picnic stops." },
  { title: "Golden Hours", image: "image14", text: "Honeymoon shoots, garden walks, private cab pauses, and soft light around Kashmir's best viewpoints." },
];
const galleryCollections = ref(loadStoredValue("kashmir-gallery-collections", defaultGalleryCollections));

const defaultGalleryHighlights = [
  { title: "Drone ready", text: "Wide mountain views, lake movements, resort arrivals, and group moments can be planned into the itinerary." },
  { title: "Guest stories", text: "Real trip photographs, short reels, snowfall clips, and destination albums help travelers choose confidently." },
  { title: "Season albums", text: "Winter, spring, summer, autumn, honeymoon, family, and luxury collections make browsing simple." },
];
const galleryHighlights = ref(loadStoredValue("kashmir-gallery-highlights", defaultGalleryHighlights));

const defaultBlogPosts = [
  {
    title: "Best Time To Visit Kashmir For Snow, Gardens, And Family Trips",
    date: "Travel Guide",
    image: "image12",
    excerpt: "A simple season-by-season guide covering snowfall, Tulip Garden timing, road movement, hotel planning, and what kind of itinerary suits each month.",
  },
  {
    title: "Gulmarg Gondola, Skiing, And Snow Activities: What Guests Should Know",
    date: "Winter Tips",
    image: "image02",
    excerpt: "From tickets and weather windows to warm clothing, local transfers, ski instructors, and activity pacing, this guide helps guests plan a smooth Gulmarg day.",
  },
  {
    title: "Srinagar Houseboat Stay: Dal Lake, Shikara, Markets, And Gardens",
    date: "City Guide",
    image: "image21",
    excerpt: "Plan a relaxed Srinagar stay with lake views, Mughal Gardens, local food, shopping time, airport transfers, and a comfortable houseboat night.",
  },
];
const blogPosts = ref(loadStoredValue("kashmir-blog-posts", defaultBlogPosts));

const defaultBlogGuides = [
  { title: "Packing checklist", text: "Carry thermals in winter, light layers in summer, comfortable shoes, ID documents, basic medicine, sunscreen, power bank, and waterproof covers." },
  { title: "Route planning", text: "Keep Srinagar as the base for flexible movement, add Gulmarg for snow, Pahalgam for valleys, Sonamarg for glacier views, and Dal Lake for slow evenings." },
  { title: "Booking advice", text: "Confirm hotels, cab type, pickup timing, activity costs, permits, and payment schedule before arrival so the trip feels settled from day one." },
  { title: "Family comfort", text: "Choose shorter daily drives, heated winter rooms, clean meal stops, flexible sightseeing, and enough rest time for children and senior travelers." },
  { title: "Honeymoon pacing", text: "Mix private photo stops, houseboat nights, candlelight dinners, light adventure, and premium cab support instead of packing every day too tightly." },
  { title: "Group travel", text: "Lock room sharing, luggage space, guide needs, meal preferences, and activity choices early so everyone moves together without last-minute confusion." },
];
const blogGuides = ref(loadStoredValue("kashmir-blog-guides", defaultBlogGuides));

const defaultBlogChecklist = [
  { number: "01", title: "Share dates", text: "Confirm arrival, departure, room needs, and must-see places." },
  { number: "02", title: "Choose route", text: "Balance sightseeing, activities, drive time, and weather buffers." },
  { number: "03", title: "Book support", text: "Lock hotels, cab, activity coordination, and on-trip assistance." },
];
const blogChecklist = ref(loadStoredValue("kashmir-blog-checklist", defaultBlogChecklist));

const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(90deg, rgba(7, 24, 39, 0.88), rgba(7, 24, 39, 0.52), rgba(7, 24, 39, 0.2)), linear-gradient(0deg, rgba(7, 24, 39, 0.62), transparent 42%), url('${image("image23")}')`,
}));

const activities = [
  ["SKI", "Skiing", "Gulmarg slopes, trainers, gear, and peak-season support."],
  ["TRK", "Trekking", "Pahalgam and Sonamarg trails with certified local guides."],
  ["CMP", "Camping", "Tenting, bonfires, alpine meals, and safety-led routes."],
  ["GND", "Gondola Ride", "Gulmarg Gondola coordination with weather-aware planning."],
  ["HRS", "Horse Riding", "Meadow rides around Betaab Valley and local scenic points."],
  ["FSH", "Fishing", "Calm river days with permit guidance and local experts."],
  ["SNW", "Snow Adventure", "Snowmobile, sledging, snowfall shoots, and winter transfers."],
  ["NTR", "Nature Exploration", "Lakes, gardens, forests, viewpoints, and soft adventure days."],
];

const destinations = [
  ["Srinagar", "image18", "Dal Lake, Mughal Gardens, Shikara rides, houseboats, local markets, and city food trails."],
  ["Gulmarg", "image02", "Skiing, Gondola, snow adventure, hotels, instructors, mountain safety, and winter transfers."],
  ["Pahalgam", "image19", "Betaab Valley, pony rides, trekking, riverside stays, family routes, and camping add-ons."],
  ["Sonamarg", "image11", "Glacier views, snow points, photography, horse routes, and high-altitude travel tips."],
  ["Dal Lake", "image22", "Houseboats, Shikara rides, floating markets, lake-view dining, and sunset experiences."],
  ["Mughal Gardens", "image07", "Nishat, Shalimar, Chashme Shahi, guided history walks, and family photography stops."],
];

const faqs = [
  ["Can pricing change in winter?", "Yes. Gulmarg and Sonamarg peak winter pricing can increase due to demand, weather, transportation limits, activity availability, and hotel inventory."],
  ["Do you support custom packages?", "Yes. Solo, couple, family, group, student, luxury, budget, airport-to-airport, and custom package types are supported."],
  ["Can this connect to real payment and weather APIs?", "The front-end is structured for Razorpay, Stripe, UPI, live weather, AI chatbot, multilingual content, and backend admin integration."],
];

const packageBenefits = [
  ["Private cab", "Airport pickup, intercity transfers, sightseeing stops, and driver coordination are planned before arrival."],
  ["Stay options", "Houseboats, boutique hotels, family rooms, heated winter stays, and luxury resorts can be matched to budget."],
  ["Activity support", "Skiing, Gondola, pony rides, camping, guides, snow activities, and permits are coordinated by local teams."],
  ["Trip safety", "Weather checks, backup timing, route updates, and on-call support help guests travel with confidence."],
];

const seasonalPlans = [
  ["Winter", "December to March", "Gulmarg skiing, snowfall days, snowmobile rides, heated stays, and short scenic routes."],
  ["Spring", "March to May", "Tulip Garden, Mughal Gardens, Dal Lake, soft adventure, and relaxed family sightseeing."],
  ["Summer", "May to September", "Pahalgam, Sonamarg, alpine meadows, pony rides, trekking, camping, and river views."],
  ["Autumn", "October to November", "Chinar colors, quiet stays, premium photography routes, and honeymoon-friendly pacing."],
];

const routeIdeas = [
  ["Classic Kashmir Circuit", "Srinagar -> Gulmarg -> Pahalgam -> Sonamarg", "Best for first-time guests who want lakes, snow points, valleys, and gardens in one balanced plan."],
  ["Honeymoon Slow Route", "Srinagar -> Gulmarg -> Pahalgam", "Premium stays, private cab time, Shikara rides, candlelight dinner, and relaxed late starts."],
  ["Adventure Route", "Gulmarg -> Sonamarg -> Pahalgam", "Built around snow sports, trekking, camping, pony trails, and mountain-view days."],
];

const bookingSteps = [
  ["01", "Share dates", "Send travel month, group size, preferred destinations, and budget range."],
  ["02", "Get route plan", "Receive a practical day-wise Kashmir itinerary with hotel and activity options."],
  ["03", "Confirm booking", "Lock the package with advance payment and receive confirmation details."],
  ["04", "Travel support", "Get pickup coordination, daily check-ins, weather guidance, and emergency help."],
];

const supportCards = [
  ["Fast quote", "Most inquiries can receive a route and price range quickly on WhatsApp."],
  ["Custom changes", "Trips can be adjusted for elders, kids, honeymooners, photographers, and group travel."],
  ["Local guidance", "Get help with timing, snow conditions, clothing, permits, and realistic travel distances."],
];

const selectedPackage = ref(packages.value[0]?.price || 0);
const travelers = ref(2);
const priceClass = ref(1);
const bookingInquiry = ref({ travelDate: "", name: "", email: "", phone: "", notes: "" });
const bookingInquiryStatus = ref("");
const isBookingSubmitting = ref(false);
let bookingInquiryStatusTimeout = null;
const web3FormsAccessKey = "3401ac69-832e-416d-b7e2-499ceed01137";
const googleRecaptchaScriptSrc = "https://www.google.com/recaptcha/api.js?render=explicit";
const recaptchaTokens = ref({ booking: "", contact: "" });
const recaptchaWidgetIds = { booking: null, contact: null };
let recaptchaScriptPromise = null;
const bookingTotalAmount = computed(() => Math.round(Number(selectedPackage.value || 0) * Number(travelers.value || 1) * Number(priceClass.value || 1)));
const bookingTotal = computed(() =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(bookingTotalAmount.value),
);
const selectedPackageName = computed(() => packages.value.find((item) => Number(item.price) === Number(selectedPackage.value))?.name || "Custom Kashmir Package");
const selectedPriceClassName = computed(() => {
  if (Number(priceClass.value) === 1.65) return "Luxury";
  if (Number(priceClass.value) === 1.25) return "Deluxe";
  return "Standard";
});
const googleRecaptchaSiteKey = computed(() => (siteContent.value.googleRecaptchaSiteKey || siteContent.value.recaptchaSiteKey || "").trim());
const isRecaptchaEnabled = computed(() => Boolean(googleRecaptchaSiteKey.value));

const isAdminLoggedIn = ref(localStorage.getItem("kashmir-admin-auth") === "true");
const adminUsername = ref("");
const adminPassword = ref("");
const adminError = ref("");
const adminSaved = ref("");

const adminTabs = [
  ["packages", "Package Management"],
  ["bookings", "Booking Management"],
  ["content", "Content & SEO"],
  ["reports", "Reports"],
];

function navigateTo(path) {
  const nextPath = normalizePath(path);

  if (currentPath.value !== nextPath) {
    window.history.pushState({}, "", nextPath);
    currentPath.value = nextPath;
  }

  isMenuOpen.value = false;
  isMoreMenuOpen.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function viewPackageDetails(item) {
  navigateTo(`/packages/${slugifyPackageName(item.name)}`);
}

function bookDetailPackage() {
  selectedPackage.value = detailPackage.value?.price || packages.value[0]?.price || 0;
  navigateTo("/booking");
}

function handlePopState() {
  currentPath.value = normalizePath(window.location.pathname);
  isMenuOpen.value = false;
  isMoreMenuOpen.value = false;
}

function toggleFaq(index) {
  openFaqs.value = openFaqs.value.includes(index) ? openFaqs.value.filter((item) => item !== index) : [...openFaqs.value, index];
}

const bookingForm = ref({ name: "", email: "", phone: "", details: "" });
const bookingFormStatus = ref("");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[^\d]/g, ""));
}

function loadGoogleRecaptchaScript() {
  if (window.grecaptcha?.render) return Promise.resolve();

  if (!recaptchaScriptPromise) {
    recaptchaScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${googleRecaptchaScriptSrc}"]`);
      if (existingScript) {
        existingScript.addEventListener("load", resolve, { once: true });
        existingScript.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = googleRecaptchaScriptSrc;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return recaptchaScriptPromise;
}

function renderRecaptchaWidget(formName, elementId) {
  if (!isRecaptchaEnabled.value || !window.grecaptcha?.render) return;

  const element = document.getElementById(elementId);
  if (!element || element.dataset.recaptchaRendered === "true") return;

  recaptchaWidgetIds[formName] = window.grecaptcha.render(element, {
    sitekey: googleRecaptchaSiteKey.value,
    callback: (token) => {
      recaptchaTokens.value = { ...recaptchaTokens.value, [formName]: token };
    },
    "expired-callback": () => {
      recaptchaTokens.value = { ...recaptchaTokens.value, [formName]: "" };
    },
    "error-callback": () => {
      recaptchaTokens.value = { ...recaptchaTokens.value, [formName]: "" };
    },
  });
  element.dataset.recaptchaRendered = "true";
}

function initializeRecaptchaWidgets() {
  if (!isRecaptchaEnabled.value) return;

  window.setTimeout(async () => {
    try {
      await loadGoogleRecaptchaScript();
      window.grecaptcha.ready(() => {
        if (currentPage.value === "booking") {
          renderRecaptchaWidget("booking", "booking-recaptcha");
        }
        if (currentPage.value === "contact") {
          renderRecaptchaWidget("contact", "contact-recaptcha");
        }
      });
    } catch {
      setBookingInquiryStatus("Google reCAPTCHA could not load. Please refresh and try again.");
    }
  }, 0);
}

function resetRecaptchaWidget(formName) {
  recaptchaTokens.value = { ...recaptchaTokens.value, [formName]: "" };

  try {
    const widgetId = recaptchaWidgetIds[formName];
    if (widgetId !== null && window.grecaptcha?.reset) {
      window.grecaptcha.reset(widgetId);
    }
  } catch {
    recaptchaWidgetIds[formName] = null;
  }
}

function setBookingInquiryStatus(message, shouldClear = true) {
  if (bookingInquiryStatusTimeout) {
    window.clearTimeout(bookingInquiryStatusTimeout);
  }

  bookingInquiryStatus.value = message;

  if (shouldClear) {
    bookingInquiryStatusTimeout = window.setTimeout(() => {
      bookingInquiryStatus.value = "";
      bookingInquiryStatusTimeout = null;
    }, 3000);
  }
}

async function submitBookingInquiry() {
  if (!bookingInquiry.value.name.trim() || !bookingInquiry.value.email.trim() || !bookingInquiry.value.phone.trim()) {
    setBookingInquiryStatus("Please fill name, email, and phone.");
    return;
  }

  if (!validateEmail(bookingInquiry.value.email)) {
    setBookingInquiryStatus("Please enter a valid email address.");
    return;
  }

  if (!validatePhone(bookingInquiry.value.phone)) {
    setBookingInquiryStatus("Please enter a valid 10-digit phone number.");
    return;
  }

  if (web3FormsAccessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
    setBookingInquiryStatus("Add your Web3Forms access key in App.vue before using the booking form.");
    return;
  }

  if (!isRecaptchaEnabled.value) {
    setBookingInquiryStatus("Add your Google reCAPTCHA site key in the admin panel before using the booking form.");
    return;
  }

  if (!recaptchaTokens.value.booking) {
    setBookingInquiryStatus("Please complete the Google reCAPTCHA verification.");
    return;
  }

  isBookingSubmitting.value = true;
  setBookingInquiryStatus("Sending booking inquiry...", false);

  const formData = new FormData();
  formData.append("access_key", web3FormsAccessKey);
  formData.append("subject", "New Snow Feather Booking Inquiry");
  formData.append("from_name", "Snow Feather Website");
  formData.append("Package", selectedPackageName.value);
  formData.append("Travel Date", bookingInquiry.value.travelDate || "Not selected");
  formData.append("Travelers", String(travelers.value));
  formData.append("Pricing Class", selectedPriceClassName.value);
  formData.append("Name", bookingInquiry.value.name);
  formData.append("Email", bookingInquiry.value.email);
  formData.append("Phone", bookingInquiry.value.phone);
  formData.append("Notes", bookingInquiry.value.notes || "No extra notes");
  formData.append("g-recaptcha-response", recaptchaTokens.value.booking);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Unable to send booking inquiry.");
    }

    setBookingInquiryStatus("Booking inquiry sent. We will contact you shortly.");
    bookingInquiry.value = { travelDate: "", name: "", email: "", phone: "", notes: "" };
    resetRecaptchaWidget("booking");
  } catch (error) {
    setBookingInquiryStatus(error?.message || "Something went wrong. Please try again.");
    resetRecaptchaWidget("booking");
  } finally {
    isBookingSubmitting.value = false;
  }
}

function submitContactForm() {
  if (!bookingForm.value.name.trim() || !bookingForm.value.email.trim() || !bookingForm.value.phone.trim()) {
    bookingFormStatus.value = "Please fill all required fields.";
    window.setTimeout(() => { bookingFormStatus.value = ""; }, 3000);
    return;
  }

  if (!validateEmail(bookingForm.value.email)) {
    bookingFormStatus.value = "Please enter a valid email address.";
    window.setTimeout(() => { bookingFormStatus.value = ""; }, 3000);
    return;
  }

  if (!validatePhone(bookingForm.value.phone)) {
    bookingFormStatus.value = "Please enter a valid 10-digit phone number.";
    window.setTimeout(() => { bookingFormStatus.value = ""; }, 3000);
    return;
  }

  if (!isRecaptchaEnabled.value) {
    bookingFormStatus.value = "Add your Google reCAPTCHA site key in the admin panel before using the contact form.";
    window.setTimeout(() => { bookingFormStatus.value = ""; }, 3000);
    return;
  }

  if (!recaptchaTokens.value.contact) {
    bookingFormStatus.value = "Please complete the Google reCAPTCHA verification.";
    window.setTimeout(() => { bookingFormStatus.value = ""; }, 3000);
    return;
  }

  const message = `
  Contact Form Submission:
  Name: ${bookingForm.value.name}
  Email: ${bookingForm.value.email}
  Phone: ${bookingForm.value.phone}
  Details: ${bookingForm.value.details}
  `;

  window.location.href = `https://wa.me/919055020408?text=${encodeURIComponent(message)}`;
  bookingForm.value = { name: "", email: "", phone: "", details: "" };
  resetRecaptchaWidget("contact");
}

function loginAdmin() {
  if (adminUsername.value.trim().toLowerCase() === "admin" && adminPassword.value === "admin123") {
    isAdminLoggedIn.value = true;
    adminUsername.value = "";
    adminPassword.value = "";
    adminError.value = "";
    localStorage.setItem("kashmir-admin-auth", "true");
    return;
  }

  adminError.value = "Wrong username or password.";
}

function logoutAdmin() {
  isAdminLoggedIn.value = false;
  localStorage.removeItem("kashmir-admin-auth");
}

function saveAdminChanges() {
  localStorage.setItem("kashmir-site-content", JSON.stringify(siteContent.value));
  localStorage.setItem("kashmir-packages-premium-v2", JSON.stringify(packages.value));
  localStorage.setItem("kashmir-gallery-images", JSON.stringify(galleryImages.value));
  localStorage.setItem("kashmir-gallery-collections", JSON.stringify(galleryCollections.value));
  localStorage.setItem("kashmir-gallery-highlights", JSON.stringify(galleryHighlights.value));
  localStorage.setItem("kashmir-blog-posts", JSON.stringify(blogPosts.value));
  localStorage.setItem("kashmir-blog-guides", JSON.stringify(blogGuides.value));
  localStorage.setItem("kashmir-blog-checklist", JSON.stringify(blogChecklist.value));
  adminSaved.value = "Saved. Website content updated in this browser.";
  window.setTimeout(() => {
    adminSaved.value = "";
  }, 3000);
}

function resetAdminChanges() {
  siteContent.value = { ...defaultSiteContent };
  packages.value = defaultPackages.map(clonePackage);
  galleryImages.value = [...defaultGalleryImages];
  galleryCollections.value = defaultGalleryCollections.map((item) => ({ ...item }));
  galleryHighlights.value = defaultGalleryHighlights.map((item) => ({ ...item }));
  blogPosts.value = defaultBlogPosts.map((item) => ({ ...item }));
  blogGuides.value = defaultBlogGuides.map((item) => ({ ...item }));
  blogChecklist.value = defaultBlogChecklist.map((item) => ({ ...item }));
  selectedPackage.value = packages.value[0]?.price || 0;
  localStorage.removeItem("kashmir-site-content");
  localStorage.removeItem("kashmir-packages");
  localStorage.removeItem("kashmir-packages-premium-v2");
  localStorage.removeItem("kashmir-gallery-images");
  localStorage.removeItem("kashmir-gallery-collections");
  localStorage.removeItem("kashmir-gallery-highlights");
  localStorage.removeItem("kashmir-blog-posts");
  localStorage.removeItem("kashmir-blog-guides");
  localStorage.removeItem("kashmir-blog-checklist");
  adminSaved.value = "Reset to default content.";
}

function readImageFile(event, callback) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    callback(reader.result);
    event.target.value = "";
  };
  reader.readAsDataURL(file);
}

function updatePackageImage(event, index) {
  readImageFile(event, (result) => {
    packages.value[index].image = result;
    saveAdminChanges();
  });
}

function packageTypesText(item) {
  return Array.isArray(item.types) ? item.types.join(", ") : "";
}

function packageCitiesText(item) {
  return Array.isArray(item.cities) ? item.cities.join(", ") : "";
}

function packageHighlightsText(item) {
  return Array.isArray(item.highlights) ? item.highlights.join(", ") : "";
}

function updatePackageTypes(item, value) {
  item.types = textListToArray(value).map((type) => type.toLowerCase());
}

function updatePackageCities(item, value) {
  item.cities = textListToArray(value);
}

function updatePackageHighlights(item, value) {
  item.highlights = textListToArray(value);
}

function addPackage() {
  packages.value.unshift({
    name: "",
    tag: "",
    price: "",
    originalPrice: "",
    duration: "",
    rating: "",
    packageDate: premiumStructureDate,
    types: [],
    routeTitle: "",
    routeDetails: "",
    cities: [],
    highlights: [],
    image: image("image18"),
    description: "",
  });
  selectedPackage.value = "";
  saveAdminChanges();
}

function deletePackage(index) {
  packages.value.splice(index, 1);
  selectedPackage.value = packages.value[0]?.price || 0;
  saveAdminChanges();
}

function updateGalleryImage(event, index) {
  readImageFile(event, (result) => {
    const existing = galleryImages.value[index];
    galleryImages.value[index] = {
      image: result,
      title: galleryImageTitle(existing, index),
      text: galleryImageText(existing, index),
    };
    saveAdminChanges();
  });
}

function addGalleryImage(event) {
  readImageFile(event, (result) => {
    galleryImages.value.unshift({
      image: result,
      title: "New Gallery Photo",
      text: "Describe this Kashmir photo, location, season, or travel mood.",
    });
    saveAdminChanges();
  });
}

function updateSiteImage(event, key) {
  readImageFile(event, (result) => {
    siteContent.value[key] = result;
    saveAdminChanges();
  });
}

function deleteGalleryImage(index) {
  galleryImages.value.splice(index, 1);
  saveAdminChanges();
}

function updateGalleryCollectionImage(event, index) {
  readImageFile(event, (result) => {
    galleryCollections.value[index].image = result;
    saveAdminChanges();
  });
}

function addGalleryCollection() {
  galleryCollections.value.unshift({
    title: "New Collection",
    image: "image23",
    text: "Describe this collection and the kind of Kashmir traveler it is for.",
  });
  saveAdminChanges();
}

function deleteGalleryCollection(index) {
  galleryCollections.value.splice(index, 1);
  saveAdminChanges();
}

function addGalleryHighlight() {
  galleryHighlights.value.unshift({
    title: "New Highlight",
    text: "Add the gallery content point guests should understand before booking.",
  });
  saveAdminChanges();
}

function deleteGalleryHighlight(index) {
  galleryHighlights.value.splice(index, 1);
  saveAdminChanges();
}

function updateBlogPostImage(event, index) {
  readImageFile(event, (result) => {
    blogPosts.value[index].image = result;
    saveAdminChanges();
  });
}

function addBlogPost() {
  blogPosts.value.unshift({
    title: "New Kashmir Travel Blog",
    date: "Travel Guide",
    image: "image18",
    excerpt: "Write a short blog excerpt that appears on the public blog page.",
  });
  saveAdminChanges();
}

function deleteBlogPost(index) {
  blogPosts.value.splice(index, 1);
  saveAdminChanges();
}

function addBlogGuide() {
  blogGuides.value.unshift({
    title: "New Planner Note",
    text: "Add the planning advice guests should read before sending an inquiry.",
  });
  saveAdminChanges();
}

function deleteBlogGuide(index) {
  blogGuides.value.splice(index, 1);
  saveAdminChanges();
}

function addBlogChecklistItem() {
  blogChecklist.value.push({
    number: String(blogChecklist.value.length + 1).padStart(2, "0"),
    title: "New Step",
    text: "Add the checklist step details here.",
  });
  saveAdminChanges();
}

function deleteBlogChecklistItem(index) {
  blogChecklist.value.splice(index, 1);
  saveAdminChanges();
}

onMounted(() => {
  window.addEventListener("popstate", handlePopState);
  updateSeoMeta();
  initialLoadingTimeout = window.setTimeout(() => {
    isInitialLoading.value = false;
    initialLoadingTimeout = null;
  }, 1200);
});

watch(pageSeo, updateSeoMeta);

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
  if (initialLoadingTimeout) {
    window.clearTimeout(initialLoadingTimeout);
  }
});
</script>

<template>
  <section v-if="isInitialLoading" class="fixed inset-0 z-[100] grid min-h-screen place-items-center bg-white px-4 text-night" role="status" aria-live="polite">
    <div class="grid justify-items-center text-center">
      <span class="h-12 w-12 animate-spin rounded-full border-4 border-frost border-t-lake"></span>
      <p class="mt-5 text-sm font-black uppercase tracking-[0.18em] text-night/58">Loading</p>
      <p class="mt-1 text-sm font-semibold text-night/48">{{ brandName }}</p>
    </div>
  </section>

  <section v-else-if="isAdminRoute" class="min-h-screen bg-night text-white">
    <div v-if="!isAdminLoggedIn" class="grid min-h-screen place-items-center px-4 py-10 sm:px-6">
      <div class="w-full max-w-md rounded-lg border border-white/[0.12] bg-white/[0.08] p-6 shadow-premium backdrop-blur sm:p-8">
        <a href="/" class="mb-7 inline-flex items-center gap-3 rounded-lg border border-white/[0.18] px-4 py-2 text-sm font-black text-white hover:bg-white/[0.12]">
          <img :src="logoSrc" :alt="`${brandName} logo`" class="h-8 w-12 rounded bg-white object-contain p-1" />
          View Website
        </a>
        <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">{{ brandName }} login</p>
        <h1 class="mt-2 font-display text-4xl font-extrabold">Admin Login</h1>
        <p class="mt-3 text-sm leading-6 text-white/[0.68]">Sign in to manage website packages, content, and gallery images.</p>

        <form class="mt-7 grid gap-4" @submit.prevent="loginAdmin">
          <label class="grid gap-2 text-sm font-bold">Username
            <input v-model="adminUsername" type="text" autocomplete="username" placeholder="Enter username" class="h-12 rounded-lg border border-white/[0.18] bg-white px-4 text-sm font-bold text-night" />
          </label>
          <label class="grid gap-2 text-sm font-bold">Password
            <input v-model="adminPassword" type="password" autocomplete="current-password" placeholder="Enter password" class="h-12 rounded-lg border border-white/[0.18] bg-white px-4 text-sm font-bold text-night" />
          </label>
          <button type="submit" class="mt-2 h-12 rounded-lg bg-gold px-6 text-sm font-black text-night hover:bg-white">Login</button>
          <p v-if="adminError" class="rounded-lg bg-gold/[0.16] p-3 text-sm font-bold text-gold">{{ adminError }}</p>
          <p class="text-xs font-semibold leading-5 text-white/[0.52]">Demo credentials: username admin, password admin123.</p>
        </form>
      </div>
    </div>

    <div v-else class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div class="flex items-center gap-4">
            <span class="flex h-20 w-20 items-center justify-center rounded-lg bg-white p-2">
              <img :src="logoSrc" :alt="`${brandName} logo`" class="max-h-full max-w-full object-contain" />
            </span>
            <div>
              <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Private manager dashboard</p>
              <h1 class="mt-2 font-display text-4xl font-extrabold sm:text-5xl">{{ brandName }} Admin</h1>
            </div>
          </div>
        </div>
        <a href="/" class="rounded-lg border border-white/[0.18] px-5 py-3 text-sm font-black text-white hover:bg-white/[0.12]">View Website</a>
      </div>

      <div class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-5">
        <div class="flex flex-col justify-between gap-4 border-b border-white/[0.12] pb-5 md:flex-row md:items-center">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Manager panel</p>
            <h2 class="mt-2 text-3xl font-black">Change hero content, packages, and images.</h2>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="rounded-lg bg-gold px-5 py-3 text-sm font-black text-night hover:bg-white" @click="saveAdminChanges">Save Changes</button>
            <button type="button" class="rounded-lg border border-white/[0.18] px-5 py-3 text-sm font-black text-white hover:bg-white/[0.12]" @click="resetAdminChanges">Reset</button>
            <button type="button" class="rounded-lg border border-white/[0.18] px-5 py-3 text-sm font-black text-white hover:bg-white/[0.12]" @click="logoutAdmin">Logout</button>
          </div>
        </div>

        <p v-if="adminSaved" class="mt-4 rounded-lg bg-lake/[0.18] p-3 text-sm font-bold text-white">{{ adminSaved }}</p>

        <div class="mt-5 grid gap-4 lg:grid-cols-3">
          <label class="grid gap-2 text-sm font-bold">Hero badge
            <input v-model="siteContent.heroBadge" class="rounded-lg border border-white/[0.18] bg-white px-4 py-3 text-night" />
          </label>
          <label class="grid gap-2 text-sm font-bold lg:col-span-2">Hero title
            <input v-model="siteContent.heroTitle" class="rounded-lg border border-white/[0.18] bg-white px-4 py-3 text-night" />
          </label>
          <label class="grid gap-2 text-sm font-bold lg:col-span-3">Hero subtitle
            <textarea v-model="siteContent.heroSubtitle" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-4 py-3 text-night"></textarea>
          </label>
        </div>

        <div class="mt-6 rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
          <h3 class="text-xl font-black">Page content manager</h3>
          <p class="mt-1 text-sm text-white/[0.68]">Edit the headings and intro text used across gallery, blog, package, booking, destination, and contact pages.</p>

          <div class="mt-4 grid gap-4 lg:grid-cols-3">
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Home activities label
              <input v-model="siteContent.homeActivitiesEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Home activities title
              <input v-model="siteContent.homeActivitiesTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Home gallery label
              <input v-model="siteContent.homeGalleryEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Home gallery title
              <input v-model="siteContent.homeGalleryTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>

            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Packages label
              <input v-model="siteContent.packagesHeroEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Packages title
              <input v-model="siteContent.packagesHeroTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Destinations title
              <input v-model="siteContent.destinationsHeroTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-3">Packages intro
              <textarea v-model="siteContent.packagesHeroText" class="min-h-20 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
            </label>

            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Gallery label
              <input v-model="siteContent.galleryHeroEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Gallery title
              <input v-model="siteContent.galleryHeroTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-3">Gallery intro
              <textarea v-model="siteContent.galleryHeroText" class="min-h-20 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Gallery stat 1 value
              <input v-model="siteContent.galleryStatOneValue" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Gallery stat 1 text
              <input v-model="siteContent.galleryStatOneText" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Gallery stat 2 value
              <input v-model="siteContent.galleryStatTwoValue" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Gallery stat 2 text
              <input v-model="siteContent.galleryStatTwoText" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Collections label
              <input v-model="siteContent.galleryCollectionsEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Collections title
              <input v-model="siteContent.galleryCollectionsTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Full gallery label
              <input v-model="siteContent.galleryFullEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Full gallery title
              <input v-model="siteContent.galleryFullTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Gallery content label
              <input v-model="siteContent.galleryContentEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Gallery content title
              <input v-model="siteContent.galleryContentTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-3">Gallery content text
              <textarea v-model="siteContent.galleryContentText" class="min-h-20 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
            </label>
            <div class="lg:col-span-3">
              <div class="image-cover h-36 rounded-lg" :style="imageStyle(siteContent.galleryHeroImage)"></div>
              <label class="mt-2 inline-block cursor-pointer rounded-lg border border-white/[0.18] px-3 py-2 text-xs font-black text-white hover:bg-white/[0.12]">
                Change gallery hero image
                <input type="file" accept="image/*" class="hidden" @change="updateSiteImage($event, 'galleryHeroImage')" />
              </label>
            </div>

            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Blog label
              <input v-model="siteContent.blogHeroEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Blog title
              <input v-model="siteContent.blogHeroTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-3">Blog intro
              <textarea v-model="siteContent.blogHeroText" class="min-h-20 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Featured blog label
              <input v-model="siteContent.blogFeaturedEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Featured blog title
              <input v-model="siteContent.blogFeaturedTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-3">Featured blog text
              <textarea v-model="siteContent.blogFeaturedText" class="min-h-20 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Blog posts label
              <input v-model="siteContent.blogPostsEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Blog posts title
              <input v-model="siteContent.blogPostsTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Planner notes label
              <input v-model="siteContent.blogGuidesEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Planner notes title
              <input v-model="siteContent.blogGuidesTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-3">Planner notes text
              <textarea v-model="siteContent.blogGuidesText" class="min-h-20 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Checklist label
              <input v-model="siteContent.blogChecklistEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-2">Checklist title
              <input v-model="siteContent.blogChecklistTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <div class="lg:col-span-3">
              <div class="image-cover h-36 rounded-lg" :style="imageStyle(siteContent.blogFeaturedImage)"></div>
              <label class="mt-2 inline-block cursor-pointer rounded-lg border border-white/[0.18] px-3 py-2 text-xs font-black text-white hover:bg-white/[0.12]">
                Change featured blog image
                <input type="file" accept="image/*" class="hidden" @change="updateSiteImage($event, 'blogFeaturedImage')" />
              </label>
            </div>

            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Contact phone
              <input v-model="siteContent.contactPhone" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Contact label
              <input v-model="siteContent.contactHeroEyebrow" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Contact title
              <input v-model="siteContent.contactHeroTitle" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Contact email
              <input v-model="siteContent.contactEmail" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Support text
              <input v-model="siteContent.contactSupport" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-3">Contact address
              <textarea v-model="siteContent.contactAddress" class="min-h-20 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
            </label>
          </div>
        </div>

        <div class="mt-6 grid gap-4">
          <div class="flex flex-col justify-between gap-3 rounded-lg border border-white/[0.12] bg-white/[0.08] p-4 sm:flex-row sm:items-center">
            <div>
              <h3 class="text-xl font-black">Package manager</h3>
              <p class="mt-1 text-sm text-white/[0.68]">Add, edit, delete, and upload images for packages.</p>
            </div>
            <button type="button" class="rounded-lg bg-white px-5 py-3 text-sm font-black text-night hover:bg-gold" @click="addPackage">Add Package</button>
          </div>

          <article v-for="(item, index) in packages" :key="`${item.name}-${index}`" class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
            <div class="grid gap-4 lg:grid-cols-[11rem_1fr]">
              <div>
                <div class="image-cover h-36 rounded-lg" :style="{ backgroundImage: `url('${item.image}')` }"></div>
                <label class="mt-3 block cursor-pointer rounded-lg border border-white/[0.18] px-3 py-2 text-center text-xs font-black text-white hover:bg-white/[0.12]">
                  Change image
                  <input type="file" accept="image/*" class="hidden" @change="updatePackageImage($event, index)" />
                </label>
                <button type="button" class="mt-2 w-full rounded-lg border border-gold/[0.42] px-3 py-2 text-xs font-black text-gold hover:bg-gold hover:text-night" @click="deletePackage(index)">Delete package</button>
              </div>
              <div class="grid gap-3 md:grid-cols-4">
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Package name
                  <input v-model="item.name" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Price
                  <input v-model.number="item.price" type="number" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Original price
                  <input v-model.number="item.originalPrice" type="number" placeholder="Auto" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Duration
                  <input v-model="item.duration" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Tag
                  <input v-model="item.tag" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Rating
                  <input v-model="item.rating" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Package date
                  <input v-model="item.packageDate" placeholder="18/05, 2:00 pm" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Filter types
                  <input :value="packageTypesText(item)" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updatePackageTypes(item, $event.target.value)" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Route location
                  <input v-model="item.routeTitle" placeholder="Example: Srinagar" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Route details
                  <input v-model="item.routeDetails" placeholder="Example: Dal Lake, Gulmarg, Pahalgam" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Cities covered
                  <input :value="packageCitiesText(item)" placeholder="Srinagar, Gulmarg" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updatePackageCities(item, $event.target.value)" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Highlights
                  <input :value="packageHighlightsText(item)" placeholder="Hotel stay, Cab, Guide" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updatePackageHighlights(item, $event.target.value)" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-4">Description
                  <textarea v-model="item.description" class="min-h-20 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
              </div>
            </div>
          </article>

          <div class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 class="text-xl font-black">Gallery image manager</h3>
                <p class="mt-1 text-sm text-white/[0.68]">Add, replace, or delete photos from the public gallery.</p>
              </div>
              <label class="cursor-pointer rounded-lg bg-white px-5 py-3 text-center text-sm font-black text-night hover:bg-gold">
                Add Gallery Image
                <input type="file" accept="image/*" class="hidden" @change="addGalleryImage" />
              </label>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div v-for="(galleryImage, index) in galleryImages" :key="`${mediaSource(galleryImage)}-${index}`" class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-2">
                <div class="image-cover h-36 rounded-lg" :style="imageStyle(galleryImage)"></div>
                <label class="mt-2 grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Title
                  <input :value="galleryImageTitle(galleryImage, index)" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updateGalleryImageField(index, 'title', $event.target.value)" />
                </label>
                <label class="mt-2 grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Caption
                  <textarea :value="galleryImageText(galleryImage, index)" class="min-h-20 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updateGalleryImageField(index, 'text', $event.target.value)"></textarea>
                </label>
                <div class="mt-2 grid grid-cols-2 gap-2">
                  <label class="cursor-pointer rounded-lg border border-white/[0.18] px-3 py-2 text-center text-xs font-black text-white hover:bg-white/[0.12]">
                    Replace
                    <input type="file" accept="image/*" class="hidden" @change="updateGalleryImage($event, index)" />
                  </label>
                  <button type="button" class="rounded-lg border border-gold/[0.42] px-3 py-2 text-xs font-black text-gold hover:bg-gold hover:text-night" @click="deleteGalleryImage(index)">Delete</button>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 class="text-xl font-black">Photo collection manager</h3>
                <p class="mt-1 text-sm text-white/[0.68]">Edit the gallery page collection cards, images, titles, and descriptions.</p>
              </div>
              <button type="button" class="rounded-lg bg-white px-5 py-3 text-sm font-black text-night hover:bg-gold" @click="addGalleryCollection">Add Collection</button>
            </div>

            <div class="mt-4 grid gap-4 lg:grid-cols-2">
              <article v-for="(collection, index) in galleryCollections" :key="`admin-collection-${index}`" class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-3">
                <div class="grid gap-3 sm:grid-cols-[9rem_1fr]">
                  <div>
                    <div class="image-cover h-32 rounded-lg" :style="imageStyle(collection.image)"></div>
                    <label class="mt-2 block cursor-pointer rounded-lg border border-white/[0.18] px-3 py-2 text-center text-xs font-black text-white hover:bg-white/[0.12]">
                      Image
                      <input type="file" accept="image/*" class="hidden" @change="updateGalleryCollectionImage($event, index)" />
                    </label>
                    <button type="button" class="mt-2 w-full rounded-lg border border-gold/[0.42] px-3 py-2 text-xs font-black text-gold hover:bg-gold hover:text-night" @click="deleteGalleryCollection(index)">Delete</button>
                  </div>
                  <div class="grid gap-3">
                    <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Title
                      <input v-model="collection.title" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                    </label>
                    <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Description
                      <textarea v-model="collection.text" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                    </label>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 class="text-xl font-black">Gallery content manager</h3>
                <p class="mt-1 text-sm text-white/[0.68]">Edit the dark gallery content cards near the footer.</p>
              </div>
              <button type="button" class="rounded-lg bg-white px-5 py-3 text-sm font-black text-night hover:bg-gold" @click="addGalleryHighlight">Add Content Card</button>
            </div>
            <div class="mt-4 grid gap-4 lg:grid-cols-3">
              <article v-for="(highlight, index) in galleryHighlights" :key="`admin-highlight-${index}`" class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-3">
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Title
                  <input v-model="highlight.title" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="mt-3 grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Text
                  <textarea v-model="highlight.text" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
                <button type="button" class="mt-3 rounded-lg border border-gold/[0.42] px-3 py-2 text-xs font-black text-gold hover:bg-gold hover:text-night" @click="deleteGalleryHighlight(index)">Delete</button>
              </article>
            </div>
          </div>

          <div class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 class="text-xl font-black">Blog manager</h3>
                <p class="mt-1 text-sm text-white/[0.68]">Add, edit, delete, and upload images for blog cards.</p>
              </div>
              <button type="button" class="rounded-lg bg-white px-5 py-3 text-sm font-black text-night hover:bg-gold" @click="addBlogPost">Add Blog Post</button>
            </div>

            <div class="mt-4 grid gap-4 lg:grid-cols-3">
              <article v-for="(post, index) in blogPosts" :key="`admin-blog-${index}`" class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-3">
                <div class="image-cover h-36 rounded-lg" :style="imageStyle(post.image)"></div>
                <label class="mt-2 block cursor-pointer rounded-lg border border-white/[0.18] px-3 py-2 text-center text-xs font-black text-white hover:bg-white/[0.12]">
                  Change image
                  <input type="file" accept="image/*" class="hidden" @change="updateBlogPostImage($event, index)" />
                </label>
                <label class="mt-3 grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Category
                  <input v-model="post.date" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="mt-3 grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Title
                  <input v-model="post.title" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="mt-3 grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Excerpt
                  <textarea v-model="post.excerpt" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
                <button type="button" class="mt-3 rounded-lg border border-gold/[0.42] px-3 py-2 text-xs font-black text-gold hover:bg-gold hover:text-night" @click="deleteBlogPost(index)">Delete blog</button>
              </article>
            </div>
          </div>

          <div class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 class="text-xl font-black">Blog planner notes</h3>
                <p class="mt-1 text-sm text-white/[0.68]">Edit the quick guide cards shown on the blog page.</p>
              </div>
              <button type="button" class="rounded-lg bg-white px-5 py-3 text-sm font-black text-night hover:bg-gold" @click="addBlogGuide">Add Planner Note</button>
            </div>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <article v-for="(guide, index) in blogGuides" :key="`admin-guide-${index}`" class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-3">
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Title
                  <input v-model="guide.title" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="mt-3 grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Text
                  <textarea v-model="guide.text" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
                <button type="button" class="mt-3 rounded-lg border border-gold/[0.42] px-3 py-2 text-xs font-black text-gold hover:bg-gold hover:text-night" @click="deleteBlogGuide(index)">Delete note</button>
              </article>
            </div>
          </div>

          <div class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 class="text-xl font-black">Blog checklist manager</h3>
                <p class="mt-1 text-sm text-white/[0.68]">Edit the dark checklist section at the end of the blog page.</p>
              </div>
              <button type="button" class="rounded-lg bg-white px-5 py-3 text-sm font-black text-night hover:bg-gold" @click="addBlogChecklistItem">Add Checklist Step</button>
            </div>
            <div class="mt-4 grid gap-4 lg:grid-cols-3">
              <article v-for="(item, index) in blogChecklist" :key="`admin-checklist-${index}`" class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-3">
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Number
                  <input v-model="item.number" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="mt-3 grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Title
                  <input v-model="item.title" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="mt-3 grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Text
                  <textarea v-model="item.text" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
                <button type="button" class="mt-3 rounded-lg border border-gold/[0.42] px-3 py-2 text-xs font-black text-gold hover:bg-gold hover:text-night" @click="deleteBlogChecklistItem(index)">Delete step</button>
              </article>
            </div>
          </div>
        </div>

        <div class="mt-6 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <aside class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
            <div class="grid gap-2 text-sm font-black">
              <button v-for="[key, label] in adminTabs" :key="key" class="rounded-lg border px-4 py-3 text-left" :class="activeAdminTab === key ? 'border-night bg-white text-night' : 'border-white/[0.12]'" @click="activeAdminTab = key">{{ label }}</button>
            </div>
          </aside>
          <div class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-5">
            <div v-if="activeAdminTab === 'packages'">
              <h3 class="text-2xl font-black">Unlimited Package Fields</h3>
              <div class="mt-4 grid gap-3 md:grid-cols-3">
                <div v-for="text in ['Name, category, package type, duration, description.', 'Featured image, multiple images, videos, gallery slider.', 'Solo, couple, group, standard, deluxe, luxury, seasonal pricing.']" :key="text" class="rounded-lg bg-white/10 p-4 text-sm leading-6">{{ text }}</div>
              </div>
            </div>
            <div v-else-if="activeAdminTab === 'bookings'">
              <h3 class="text-2xl font-black">Booking Queue</h3>
              <div class="mt-4 overflow-hidden rounded-lg border border-white/[0.12]">
                <div class="grid grid-cols-4 bg-white/10 p-3 text-xs font-black uppercase tracking-wide"><span>ID</span><span>Guest</span><span>Package</span><span>Status</span></div>
                <div class="admin-cell grid grid-cols-4 p-3 text-sm"><span>SF-260530-001</span><span>Sarah</span><span>Honeymoon</span><span class="text-gold">Pending</span></div>
                <div class="grid grid-cols-4 p-3 text-sm"><span>SF-260530-002</span><span>Rohan</span><span>Gulmarg Ski</span><span class="text-lake">Confirmed</span></div>
              </div>
            </div>
            <div v-else-if="activeAdminTab === 'content'">
              <h3 class="text-2xl font-black">Content, Gallery, Blog, SEO</h3>
              <p class="mt-3 text-sm leading-6 text-white/[0.68]">Manage destination pages, blogs, travel tips, meta titles, meta descriptions, gallery, FAQ, and banners.</p>
            </div>
            <div v-else>
              <h3 class="text-2xl font-black">Analytics & Revenue</h3>
              <div class="mt-4 grid gap-3 md:grid-cols-3">
                <div class="rounded-lg bg-white/10 p-4"><p class="text-3xl font-black">INR 8.4L</p><p class="text-sm text-white/[0.62]">Monthly revenue</p></div>
                <div class="rounded-lg bg-white/10 p-4"><p class="text-3xl font-black">142</p><p class="text-sm text-white/[0.62]">Bookings</p></div>
                <div class="rounded-lg bg-white/10 p-4"><p class="text-3xl font-black">38%</p><p class="text-sm text-white/[0.62]">Winter demand</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <template v-else>
    <header class="fixed inset-x-0 top-0 z-50 px-4 py-3">
      <nav class="glass-nav mx-auto flex max-w-7xl items-center justify-between rounded-lg px-4 py-3">
        <a href="/home" class="flex items-center gap-3" :aria-label="`${brandName} home`" @click.prevent="navigateTo('/home')">
          <span class="grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-white p-1.5 shadow-lift">
            <img :src="logoSrc" :alt="`${brandName} logo`" class="h-full w-full object-contain" />
          </span>
          <span class="text-base font-black tracking-tight text-night">{{ brandName }}</span>
        </a>

        <div class="hidden items-center gap-2 text-sm font-bold text-night/[0.78] lg:flex">
          <a
            v-for="[label, href] in navItems"
            :key="label"
            :href="href"
            class="rounded-lg px-4 py-2 transition"
            :class="currentPath === href || (href === '/packages' && currentPage === 'packageDetail') ? 'bg-night text-white shadow-lift' : 'hover:bg-white/[0.55] hover:text-lake'"
            @click.prevent="navigateTo(href)"
          >
            {{ label }}
          </a>

          <div class="relative">
            <button
              type="button"
              class="rounded-lg px-4 py-2 transition hover:bg-white/[0.55] hover:text-lake"
              aria-haspopup="true"
              :aria-expanded="isMoreMenuOpen"
              @click="isMoreMenuOpen = !isMoreMenuOpen"
            >
              More
            </button>
            <div v-if="isMoreMenuOpen" class="absolute right-0 top-full z-50 mt-2 w-44 rounded-lg border border-white/70 bg-white p-2 text-sm font-bold text-night shadow-premium">
              <a
                v-for="[label, href] in moreMenuItems"
                :key="label"
                :href="href"
                class="block rounded-lg px-3 py-2 transition"
                :class="currentPath === href ? 'bg-night text-white' : 'hover:bg-frost hover:text-lake'"
                @click.prevent="navigateTo(href)"
              >
                {{ label }}
              </a>
            </div>
          </div>
        </div>

        <div class="hidden items-center gap-2 sm:flex">
          <a href="https://wa.me/919055020408?text=I%20want%20to%20book%20a%20Kashmir%20tour" class="rounded-lg border border-night/10 px-4 py-2 text-sm font-extrabold text-night hover:border-lake hover:text-lake">WhatsApp</a>
          <a href="/booking" class="rounded-lg bg-gold px-4 py-2 text-sm font-extrabold text-night shadow-lift hover:bg-white" @click.prevent="navigateTo('/booking')">Book Now</a>
        </div>

        <button class="grid h-10 w-10 place-items-center rounded-lg border border-night/10 text-night lg:hidden" aria-label="Open menu" @click="isMenuOpen = !isMenuOpen">
          <span class="text-xl leading-none">=</span>
        </button>
      </nav>

      <div v-if="isMenuOpen" class="glass-nav mx-auto mt-2 grid max-w-7xl rounded-lg px-4 py-4 text-sm font-bold text-night">
        <a v-for="[label, href] in navItems" :key="label" :href="href" class="rounded-lg px-3 py-2" :class="currentPath === href || (href === '/packages' && currentPage === 'packageDetail') ? 'bg-night text-white' : ''" @click.prevent="navigateTo(href)">
          {{ label }}
        </a>
        <div class="mt-2 border-t border-night/10 pt-2">
          <p class="px-3 pb-1 text-xs font-black uppercase tracking-[0.16em] text-night/45">More</p>
          <a v-for="[label, href] in moreMenuItems" :key="label" :href="href" class="block rounded-lg px-3 py-2" :class="currentPath === href ? 'bg-night text-white' : ''" @click.prevent="navigateTo(href)">
            {{ label }}
          </a>
        </div>
      </div>
    </header>

    <main>
      <section v-if="currentPage === 'home'" class="hero-media relative flex min-h-screen overflow-hidden pt-28 text-white" :style="heroStyle">
        <div class="mx-auto flex w-full max-w-7xl flex-col justify-end gap-8 px-4 pb-14 pt-16 sm:px-6 lg:pb-20">
          <div class="max-w-3xl">
            <p class="mb-5 inline-flex rounded-lg border border-white/20 bg-white/[0.12] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] backdrop-blur">{{ siteContent.heroBadge }}</p>
            <h1 class="font-display text-4xl font-extrabold leading-[1.04] sm:text-5xl lg:text-6xl xl:text-7xl">{{ siteContent.heroTitle }}</h1>
            <p class="mt-5 max-w-xl text-base leading-7 text-white/[0.86] sm:text-lg">{{ siteContent.heroSubtitle }}</p>

            <div class="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="/booking" class="rounded-lg bg-gold px-6 py-3.5 text-center text-sm font-black text-night shadow-premium hover:bg-white" @click.prevent="navigateTo('/booking')">Book Now</a>
              <a href="/packages" class="rounded-lg border border-white/[0.24] bg-white/[0.12] px-6 py-3.5 text-center text-sm font-black text-white backdrop-blur hover:bg-white/[0.18]" @click.prevent="navigateTo('/packages')">Explore Packages</a>
              <a href="https://wa.me/919055020408?text=I%20want%20instant%20Kashmir%20booking%20support" class="rounded-lg border border-white/[0.24] bg-white px-6 py-3.5 text-center text-sm font-black text-night hover:bg-frost">WhatsApp Now</a>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-3 lg:max-w-3xl">
            <div class="rounded-lg border border-white/20 bg-white/[0.12] p-4 backdrop-blur"><p class="text-2xl font-black">4.9</p><p class="mt-1 text-xs font-bold text-white/70">Guest rating</p></div>
            <div class="rounded-lg border border-white/20 bg-white/[0.12] p-4 backdrop-blur"><p class="text-2xl font-black">24/7</p><p class="mt-1 text-xs font-bold text-white/70">Support</p></div>
            <div class="rounded-lg border border-white/20 bg-white/[0.12] p-4 backdrop-blur"><p class="text-2xl font-black">120+</p><p class="mt-1 text-xs font-bold text-white/70">Tour plans</p></div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Why Snow Feather</p>
              <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Kashmir travel planning with a clear purpose.</h2>
              <p class="mt-5 text-base leading-8 text-night/[0.64]">
                Snow Feather is a Kashmir tourism and adventure travel company helping guests book practical, beautiful, and well-supported trips across Srinagar, Gulmarg, Pahalgam, Sonamarg, Dal Lake, and beyond.
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              <article v-for="item in purposeCards" :key="`home-${item.label}`" class="premium-card rounded-lg p-5 hover-lift">
                <p class="text-xs font-black uppercase tracking-[0.18em] text-lake">{{ item.label }}</p>
                <h3 class="mt-4 text-xl font-black text-night">{{ item.title }}</h3>
                <p class="mt-3 text-sm leading-6 text-night/[0.64]">{{ item.text }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="section-band py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.homeActivitiesEyebrow }}</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">{{ siteContent.homeActivitiesTitle }}</h2>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article v-for="[icon, title, text] in activities" :key="title" class="premium-card rounded-lg p-5 hover-lift">
              <p class="text-xs font-black tracking-[0.24em] text-transparent bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text">{{ icon }}</p>
              <h3 class="mt-4 text-xl font-black bg-gradient-to-r from-night to-alpine bg-clip-text text-transparent">{{ title }}</h3>
              <p class="mt-2 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section
        v-if="currentPage === 'about'"
        id="about"
        class="relative min-h-screen overflow-hidden bg-night pt-28 text-white"
      >
        <div
          class="absolute inset-0 image-cover"
          :style="{ backgroundImage: `url('${image('image20')}')` }"
        ></div>
        <video
          class="absolute inset-0 h-full w-full object-cover"
          :src="mainBackgroundVideoSrc"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
        ></video>
        <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,11,18,0.88),rgba(3,20,31,0.64),rgba(3,22,34,0.28)),linear-gradient(0deg,rgba(3,11,18,0.78),rgba(3,11,18,0.08))]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(9,165,213,0.24),transparent_34%)]"></div>

        <div class="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center px-4 pb-14 pt-8 sm:px-6">
          <div class="max-w-5xl">
            <div class="flex flex-wrap gap-3">
              <span class="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/18 px-4 py-2 text-sm font-black text-white shadow-lift">
               <!-- <span class="text-xs uppercase text-gold">IATA</span> -->
               ✨ Premium Experiences
              </span>
              <span class="inline-flex items-center gap-2 rounded-full border border-lake/30 bg-lake/18 px-4 py-2 text-sm font-black text-white shadow-lift">
              <!--  <span class="text-xs uppercase text-lake">ISO</span> -->
                🤝 Dedicated Travel Concierge
              </span>
              <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-black text-white shadow-lift">
               😊 Hassle-Free Travel
              </span>
            </div>

            <h1 class="mt-10 font-display text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl lg:text-5xl xl:text-6xl">
              About
              <span class="bg-gradient-to-r from-gold via-[#ff8b6d] to-[#ff6fa8] bg-clip-text text-transparent">Snow Feather</span>
            </h1>
            <p class="mt-6 max-w-2xl text-lg font-semibold leading-8 text-white/76">
              We are a Kashmir travel team helping guests plan honest routes, comfortable stays, local transfers, snow activities, family holidays, honeymoon trips, and smooth on-trip support.
            </p>

            <div class="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-5">
              <button type="button" class="grid min-h-28 place-items-center rounded-lg border border-white/10 bg-black/30 px-4 py-5 text-center text-sm font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:border-lake/60 hover:bg-lake/20" @click="navigateTo('/booking')">
                <span class="text-2xl">TREK</span>
                <span>Mountain Trails</span>
              </button>
              <button type="button" class="grid min-h-28 place-items-center rounded-lg border border-white/10 bg-black/30 px-4 py-5 text-center text-sm font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:border-lake/60 hover:bg-lake/20" @click="navigateTo('/destinations')">
                <span class="text-2xl">STAY</span>
                <span>Hotels</span>
              </button>
              <button type="button" class="grid min-h-28 place-items-center rounded-lg border border-white/10 bg-black/30 px-4 py-5 text-center text-sm font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:border-lake/60 hover:bg-lake/20" @click="navigateTo('/contact')">
                <span class="text-2xl">CAMP</span>
                <span>Camping</span>
              </button>
              <button type="button" class="grid min-h-28 place-items-center rounded-lg border border-white/10 bg-black/30 px-4 py-5 text-center text-sm font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:border-lake/60 hover:bg-lake/20" @click="navigateTo('/contact')">
                <span class="text-2xl">SNOW</span>
                <span>Snow Activities</span>
              </button>
              <button type="button" class="grid min-h-28 place-items-center rounded-lg border border-white/10 bg-white/18 px-4 py-5 text-center text-sm font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:border-lake/60 hover:bg-lake/25" @click="navigateTo('/packages')">
                <span class="text-2xl">TRIP</span>
                <span>Packages</span>
              </button>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <span class="rounded-full border border-gold/24 bg-gold/16 px-4 py-2 text-sm font-bold text-white">Kashmir Tour Packages</span>
              <span class="rounded-full border border-lake/24 bg-lake/16 px-4 py-2 text-sm font-bold text-white">Gulmarg Snow Trips</span>
              <span class="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-bold text-white">Dal Lake Houseboats</span>
              <span class="rounded-full border border-lake/24 bg-lake/12 px-4 py-2 text-sm font-bold text-white">Pahalgam & Sonamarg</span>
            </div>

            <div class="mt-9 flex flex-col gap-4 sm:flex-row">
              <button type="button" class="rounded-lg bg-lake px-8 py-4 text-base font-black text-white shadow-premium transition hover:-translate-y-1 hover:bg-white hover:text-night" @click="navigateTo('/booking')">
                Start Planning
              </button>
              <button type="button" class="rounded-lg bg-white/12 px-8 py-4 text-base font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-night" @click="navigateTo('/contact')">
                Contact Us
              </button>
            </div>
          </div>

        </div>
      </section>

      <section v-if="currentPage === 'about'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mx-auto mb-10 max-w-4xl text-center">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Vision, mission, and motto</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">The promise behind every Snow Feather Kashmir tour.</h2>
            <p class="mt-5 text-base leading-8 text-night/[0.64]">
              Our work is built around trusted Kashmir travel planning, local destination knowledge, clear package details, and responsive support for families, couples, groups, and adventure travelers.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <article v-for="item in purposeCards" :key="`about-${item.label}`" class="premium-card rounded-lg p-6 hover-lift">
              <p class="text-sm font-black uppercase tracking-[0.18em] bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">{{ item.label }}</p>
              <h3 class="mt-4 text-2xl font-black text-night">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'about'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Why choose us?</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">More benefits for every Snow Feather guest.</h2>
          </div>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article class="rounded-lg bg-gradient-to-br from-white via-[#fbfdff] to-white shadow-lift hover-lift p-5 transition">
              <p class="text-sm font-black uppercase tracking-[0.18em] bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">Personalized travel</p>
              <h3 class="mt-4 text-xl font-black text-night">Plans made for your route</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Family, honeymoon, group, luxury, and budget plans are shaped around travel dates, pace, and comfort.</p>
            </article>
            <article class="rounded-lg bg-gradient-to-br from-white via-[#fbfdff] to-white shadow-lift hover-lift p-5 transition">
              <p class="text-sm font-black uppercase tracking-[0.18em] bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">Simple booking</p>
              <h3 class="mt-4 text-xl font-black text-night">Clear steps, no confusion</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Share dates and traveler count, receive a practical itinerary, confirm, and travel with support.</p>
            </article>
            <article class="rounded-lg bg-gradient-to-br from-white via-[#fbfdff] to-white shadow-lift hover-lift p-5 transition">
              <p class="text-sm font-black uppercase tracking-[0.18em] bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">Exciting deals</p>
              <h3 class="mt-4 text-xl font-black text-night">Season-wise offers</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Get value-led options for winter snow, summer valleys, honeymoon stays, and premium circuits.</p>
            </article>
            <article class="rounded-lg bg-gradient-to-br from-white via-[#fbfdff] to-white shadow-lift hover-lift p-5 transition">
              <p class="text-sm font-black uppercase tracking-[0.18em] bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">24/7 support</p>
              <h3 class="mt-4 text-xl font-black text-night">Help when it matters</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Assistance for pickup, weather, timing changes, hotel coordination, and on-trip questions.</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'about'" class="section-band py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Travel services</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Flights, hotels, buses, cabs, and holiday package support.</h2>
            <p class="mt-5 text-base leading-8 text-night/[0.62]">
              Inspired by full-service travel desks, Snow Feather brings the essentials together for Kashmir guests: stay planning, transfers, local sightseeing, activity booking, package comparison, and quick contact support.
            </p>
            <button type="button" class="mt-7 rounded-lg bg-night px-6 py-3 text-sm font-black text-white shadow-lift hover:bg-lake" @click="navigateTo('/contact')">Contact & Support</button>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-lg bg-gradient-to-br from-white via-[#fbfdff] to-white shadow-lift hover-lift p-5 transition">
              <h3 class="text-xl font-black bg-gradient-to-r from-lake to-alpine bg-clip-text text-transparent">Holiday Packages</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Winter, summer, honeymoon, family, group, and custom Kashmir packages.</p>
            </div>
            <div class="rounded-lg bg-gradient-to-br from-white via-[#fbfdff] to-white shadow-lift hover-lift p-5 transition">
              <h3 class="text-xl font-black bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">Hotels & Houseboats</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Comfort hotels, premium stays, heated winter rooms, and houseboat options.</p>
            </div>
            <div class="rounded-lg bg-gradient-to-br from-white via-[#fbfdff] to-white shadow-lift hover-lift p-5 transition">
              <h3 class="text-xl font-black bg-gradient-to-r from-lake to-gold bg-clip-text text-transparent">Cab & Transfers</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Airport pickup, local sightseeing, intercity movement, and day-trip support.</p>
            </div>
            <div class="rounded-lg bg-gradient-to-br from-white via-[#fbfdff] to-white shadow-lift hover-lift p-5 transition">
              <h3 class="text-xl font-black bg-gradient-to-r from-alpine to-[#ff8b6d] bg-clip-text text-transparent">Adventure Activities</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Gondola, skiing, snowmobile, camping, trekking, pony rides, and Shikara rides.</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'about'" class="bg-white py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="image-cover h-72 rounded-lg sm:h-96" :style="imageStyle('image21')"></div>
            <div class="grid gap-4">
              <div class="image-cover h-44 rounded-lg" :style="imageStyle('image14')"></div>
              <div class="image-cover h-44 rounded-lg" :style="imageStyle('image18')"></div>
            </div>
            <div class="image-cover h-56 rounded-lg sm:col-span-2 sm:h-72" :style="imageStyle('image08')"></div>
            <div class="image-cover h-56 rounded-lg sm:h-64" :style="imageStyle('image12')"></div>
            <div class="image-cover h-56 rounded-lg sm:h-64" :style="imageStyle('image22')"></div>
          </div>

          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">About Snow Feather</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">A Kashmir travel partner focused on easy, honest planning.</h2>
            <p class="mt-5 text-base leading-8 text-night/[0.62]">
              We listen to your needs, recommend realistic routes, and coordinate the small details that make a trip smoother. Whether you want snow days in Gulmarg, lakeside stays in Srinagar, family sightseeing, or a slow honeymoon route, the plan stays clear before you arrive.
            </p>
            <div class="mt-7 grid gap-4">
              <div v-for="[step, title, text] in bookingSteps" :key="`about-${step}`" class="rounded-lg bg-frost p-5 shadow-lift">
                <div class="flex gap-4">
                  <p class="text-2xl font-black text-lake">{{ step }}</p>
                  <div>
                    <h3 class="text-lg font-black text-night">{{ title }}</h3>
                    <p class="mt-2 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'packageDetail' && detailPackage" class="relative flex min-h-[34rem] items-end overflow-hidden pt-28 text-white">
        <div class="absolute inset-0 image-cover" :style="{ backgroundImage: `url('${detailPackage.image}')` }"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/10"></div>
        <div class="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:pb-16">
          <button type="button" class="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/12 px-4 py-2 text-sm font-black text-white backdrop-blur hover:bg-white/20" @click="navigateTo('/packages')">
            <span aria-hidden="true">&larr;</span> All Packages
          </button>
          <div class="max-w-4xl">
            <span class="inline-flex rounded-lg bg-gold px-4 py-2 text-xs font-black text-night">{{ detailPackage.tag }}</span>
            <h1 class="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{{ detailPackage.name }}</h1>
            <div class="mt-4 flex flex-wrap gap-4 text-sm font-black text-white/88 sm:text-base">
              <span>{{ detailCities.join(", ") }}</span>
              <span>{{ detailPackage.duration }}</span>
              <span>{{ detailPackage.rating }} guest rating</span>
              <span>Updated {{ detailPackage.packageDate }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'packageDetail' && detailPackage" class="bg-white py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.48fr]">
          <div>
            <h2 class="font-display text-3xl font-extrabold text-night sm:text-4xl">About This Package</h2>
            <p class="mt-3 text-sm font-black uppercase tracking-[0.16em] text-lake">Package date: {{ detailPackage.packageDate }}</p>
            <p class="mt-5 max-w-4xl text-base leading-8 text-night/65 sm:text-lg">{{ detailPackage.description }} The route can be adjusted for arrival time, guest comfort, weather, and travel style.</p>

            <div class="mt-9">
              <h3 class="font-display text-3xl font-extrabold text-night">Highlights</h3>
              <div class="mt-5 grid gap-4 text-base font-semibold text-night/70 sm:grid-cols-2">
                <div v-for="highlight in detailHighlights" :key="highlight" class="flex items-center gap-3">
                  <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-lake text-sm font-black text-lake">✓</span>
                  <span>{{ highlight }}</span>
                </div>
              </div>
            </div>

            <div class="mt-9">
              <h3 class="font-display text-3xl font-extrabold text-night">Cities Covered</h3>
              <div class="mt-5 flex flex-wrap gap-3">
                <span v-for="city in detailCities" :key="city" class="rounded-full bg-frost px-5 py-3 text-sm font-bold text-night/70">{{ city }}</span>
              </div>
            </div>
          </div>

          <aside class="premium-card rounded-lg p-6 lg:sticky lg:top-28 lg:self-start">
            <p class="text-sm font-bold text-night/55">Starting From</p>
            <div class="mt-2 flex flex-wrap items-end gap-3">
              <p class="font-display text-4xl font-extrabold text-lake">₹{{ detailPackage.price.toLocaleString("en-IN") }}</p>
              <p class="pb-1 text-lg font-bold text-night/45 line-through">₹{{ detailOriginalPrice.toLocaleString("en-IN") }}</p>
            </div>
            <p class="mt-2 text-xs font-semibold text-night/55">Per person, taxes included</p>
            <p class="mt-6 rounded-lg bg-gold/15 px-4 py-3 text-center text-base font-black text-gold">Save ₹{{ detailSaveAmount.toLocaleString("en-IN") }}!</p>
            <button type="button" class="mt-5 w-full rounded-lg bg-lake px-5 py-4 text-base font-black text-white shadow-lift hover:bg-night" @click="bookDetailPackage">
              Book & Pay Now
            </button>
            <a :href="detailWhatsappLink" class="mt-3 block rounded-lg bg-frost px-5 py-4 text-center text-base font-black text-night hover:text-lake">
              Enquire on WhatsApp
            </a>
            <p class="mt-4 text-center text-xs font-semibold text-night/45">Secure payment ready layout</p>
          </aside>
        </div>
      </section>

      <section
        v-if="currentPage === 'packages'"
        id="packages"
        class="min-h-screen bg-white pb-16 pt-32"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="relative mb-8 overflow-hidden rounded-lg bg-night text-white shadow-premium">
            <div class="image-cover absolute inset-0" :style="imageStyle('image23')"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-night/92 via-night/64 to-lake/20"></div>
            <div class="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_0.78fr] lg:p-9">
              <div class="max-w-3xl">
                <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">{{ siteContent.packagesHeroEyebrow }}</p>
                <h2 class="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{{ siteContent.packagesHeroTitle }}</h2>
                <p class="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/76">{{ siteContent.packagesHeroText }}</p>
                <div class="mt-5 flex flex-wrap gap-3">
                  <span class="rounded-lg border border-white/18 bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] backdrop-blur-xl">Updated {{ premiumStructureDate }}</span>
                  <span class="rounded-lg border border-gold/30 bg-gold/18 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-gold backdrop-blur-xl">No hidden charges</span>
                </div>
              </div>
              
            </div>
          </div>

          <div class="mb-8 rounded-lg border border-white/60 bg-white/42 p-3 shadow-premium backdrop-blur-2xl">
            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <article v-for="[title, meta, text] in packageCategories" :key="title" class="relative min-h-36 overflow-hidden rounded-lg border border-white/70 bg-white/24 p-4 shadow-lift backdrop-blur-xl">
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-lake to-alpine"></div>
                <p class="text-sm font-black text-night">{{ title }}</p>
                <p class="mt-2 text-xs font-black uppercase tracking-[0.14em] text-gold">{{ meta }}</p>
                <p class="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-night/[0.62]">{{ text }}</p>
              </article>
            </div>
          </div>

          <div class="mb-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div class="relative overflow-hidden rounded-lg bg-night p-5 text-white shadow-premium sm:p-6">
              <div class="image-cover absolute inset-0 opacity-30" :style="imageStyle('image15')"></div>
              <div class="absolute inset-0 bg-gradient-to-br from-night/96 via-night/80 to-night/42"></div>
              <div class="relative">
                <p class="text-xs font-black uppercase tracking-[0.18em] text-gold">Winter pricing policy</p>
                <p class="mt-4 text-sm font-semibold leading-7 text-white/76">{{ winterPricingNote }}</p>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-lg border border-white/70 bg-white/54 p-5 shadow-lift backdrop-blur-xl">
                <p class="text-xs font-black uppercase tracking-[0.18em] text-lake">Room sharing</p>
                <div class="mt-4 grid gap-2">
                  <div v-for="[title, text] in roomSharingOptions" :key="title" class="flex items-center justify-between gap-3 rounded-lg bg-frost/80 px-3 py-3 text-sm">
                    <span class="font-black text-night">{{ title }}</span>
                    <span class="text-right font-semibold text-night/58">{{ text }}</span>
                  </div>
                </div>
              </div>
              <div class="rounded-lg border border-white/70 bg-white/54 p-5 shadow-lift backdrop-blur-xl">
                <p class="text-xs font-black uppercase tracking-[0.18em] text-lake">Hotel categories</p>
                <div class="mt-4 grid gap-2">
                  <div v-for="[title, text] in hotelCategories" :key="title" class="flex items-center justify-between gap-3 rounded-lg bg-frost/80 px-3 py-3 text-sm">
                    <span class="font-black text-night">{{ title }}</span>
                    <span class="text-right font-semibold text-night/58">{{ text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="message in trustMessages" :key="message" class="flex min-h-20 items-center gap-3 rounded-lg border border-white/70 bg-white/52 p-4 text-sm font-black leading-6 text-night shadow-lift backdrop-blur-xl">
              <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lake text-xs text-white">✓</span>
              <span>{{ message }}</span>
            </div>
          </div>

          <div class="mb-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Package filters">
            <button v-for="filter in filters" :key="filter" class="rounded-lg border px-4 py-2 text-sm font-black capitalize" :class="activeFilter === filter ? 'border-lake bg-lake text-white' : 'border-night/[0.12] bg-white text-night hover:border-lake hover:text-lake'" @click="activeFilter = filter">
              {{ filter }}
            </button>
          </div>

          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="item in filteredPackages" :key="item.name" class="overflow-hidden rounded-lg bg-white shadow-premium hover-lift">
              <div class="relative h-72 overflow-hidden">
                <div class="image-cover h-full transition duration-500 hover:scale-110" :style="{ backgroundImage: `linear-gradient(180deg, rgba(7, 24, 39, 0.02), rgba(7, 24, 39, 0.56)), url('${item.image}')` }"></div>
                <span class="absolute left-4 top-4 rounded-full bg-gradient-to-r from-gold to-[#ff8b6d] px-4 py-2 text-sm font-black text-white shadow-lift">{{ item.tag }}</span>
                <span class="absolute right-4 top-4 rounded-full bg-white/95 backdrop-blur px-4 py-2 text-sm font-black text-night shadow-lift">{{ displayDuration(item.duration) }}</span>
              </div>

              <div class="p-6">
                <p class="text-sm font-semibold text-night/[0.58]">{{ packageRoute(item)[0] }} - {{ packageRoute(item)[1] }}</p>
                <p class="mt-2 text-xs font-black uppercase tracking-[0.14em] text-lake">Updated {{ item.packageDate }}</p>
                <h3 class="mt-3 font-display text-2xl font-extrabold text-night">{{ item.name }}</h3>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="chip in packageChips(item)" :key="`${item.name}-${chip}`" class="rounded-full bg-gradient-to-r from-frost to-lake/10 px-3 py-1 text-xs font-semibold text-night/[0.62]">{{ chip }}</span>
                </div>

                <div class="mt-5 border-t border-night/[0.08] pt-5">
                  <p class="text-sm font-semibold text-night/[0.58]">Starting From</p>
                  <div class="mt-2 flex flex-wrap items-end gap-3">
                    <p class="font-display text-3xl font-extrabold bg-gradient-to-r from-lake to-alpine bg-clip-text text-transparent">INR {{ item.price.toLocaleString("en-IN") }}</p>
                    <p class="pb-1 text-base font-bold text-night/40 line-through">INR {{ packageOriginalPrice(item).toLocaleString("en-IN") }}</p>
                  </div>
                  <div class="mt-4 flex items-center justify-between gap-4">
                    <p class="text-xs font-semibold uppercase text-night/[0.52]">Taxes incl/person</p>
                    <button type="button" class="rounded-lg bg-gradient-to-r from-lake to-alpine px-5 py-3 text-sm font-black text-white shadow-lift transition hover:-translate-y-0.5 hover:shadow-premium hover:from-alpine hover:to-lake" @click="viewPackageDetails(item)">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'packages'" class="section-band py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">What is included</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Packages built around the full trip, not only rooms.</h2>
            <p class="mt-5 text-base leading-7 text-night/[0.62]">Every package can combine stay, cab, activities, route planning, and local support so guests know what they are paying for before they arrive.</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <article v-for="[title, text] in packageBenefits" :key="title" class="premium-card rounded-lg p-5 hover-lift">
              <h3 class="text-xl font-black text-night">{{ title }}</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'packages'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Season planning</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Choose the right Kashmir package by month.</h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article v-for="[season, months, text] in seasonalPlans" :key="season" class="premium-card rounded-lg p-5 hover-lift">
              <p class="text-sm font-black uppercase tracking-[0.18em] bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">{{ months }}</p>
              <h3 class="mt-3 text-2xl font-black bg-gradient-to-r from-lake to-alpine bg-clip-text text-transparent">{{ season }}</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'destinations'" id="destinations" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.destinationsHeroEyebrow }}</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">{{ siteContent.destinationsHeroTitle }}</h2>
          </div>
          <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article v-for="[name, img, text] in destinations" :key="name" class="premium-card overflow-hidden rounded-lg hover-lift">
              <div class="image-cover h-56 relative overflow-hidden" :style="imageStyle(img)">
                <div class="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div class="p-5">
                <h3 class="text-2xl font-black bg-gradient-to-r from-alpine to-lake bg-clip-text text-transparent">{{ name }}</h3>
                <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'destinations'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Route builder</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Plan destinations in a route that actually works.</h2>
          </div>
          <div class="grid gap-5 lg:grid-cols-3">
            <article v-for="[title, route, text] in routeIdeas" :key="title" class="premium-card rounded-lg p-5 hover-lift">
              <p class="text-sm font-black bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">{{ route }}</p>
              <h3 class="mt-3 text-2xl font-black bg-gradient-to-r from-lake to-alpine bg-clip-text text-transparent">{{ title }}</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'destinations'" class="section-band py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="image-cover h-80 rounded-lg sm:h-96" :style="imageStyle('image23')"></div>
            <div class="grid gap-4">
              <div class="image-cover h-44 rounded-lg" :style="imageStyle('image10')"></div>
              <div class="image-cover h-44 rounded-lg" :style="imageStyle('image22')"></div>
            </div>
          </div>
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Travel style</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Lake, snow, garden, valley, and adventure days can all feel different.</h2>
            <p class="mt-5 text-base leading-7 text-night/[0.62]">Use Destinations to sell more than names. Show guests which places are best for families, honeymooners, winter sports, photography, and relaxed sightseeing.</p>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'booking'" id="booking" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div class="relative min-h-[38rem] overflow-hidden rounded-lg shadow-premium">
            <div class="image-cover absolute inset-0" :style="imageStyle('image20')"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-night/92 via-night/62 to-lake/30"></div>
            <div class="relative flex min-h-[38rem] flex-col justify-between p-5 text-white sm:p-7">
              <div>
                <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">{{ siteContent.bookingHeroEyebrow }}</p>
                <h2 class="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{{ siteContent.bookingHeroTitle }}</h2>
                <p class="mt-5 max-w-xl text-sm font-semibold leading-7 text-white/78">Share your travel date, group size, and comfort level. The Snow Feather team can confirm route, stay, cab, and activity details from one clear inquiry.</p>
              </div>

              <div class="mt-8 grid gap-3 sm:grid-cols-3">
                <div class="rounded-lg border border-white/18 bg-white/12 p-4 backdrop-blur-xl">
                  <p class="text-2xl font-black text-gold">01</p>
                  <p class="mt-2 text-sm font-black">Select Package</p>
                  <p class="mt-1 text-xs leading-5 text-white/68">Pick route and price class.</p>
                </div>
                <div class="rounded-lg border border-white/18 bg-white/12 p-4 backdrop-blur-xl">
                  <p class="text-2xl font-black text-gold">02</p>
                  <p class="mt-2 text-sm font-black">Add Dates</p>
                  <p class="mt-1 text-xs leading-5 text-white/68">Tell us when you arrive.</p>
                </div>
                <div class="rounded-lg border border-white/18 bg-white/12 p-4 backdrop-blur-xl">
                  <p class="text-2xl font-black text-gold">03</p>
                  <p class="mt-2 text-sm font-black">Confirm Plan</p>
                  <p class="mt-1 text-xs leading-5 text-white/68">Receive final trip support.</p>
                </div>
              </div>

              <div class="mt-5 rounded-lg border border-white/18 bg-white/14 p-5 backdrop-blur-xl">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p class="text-xs font-black uppercase tracking-[0.18em] text-white/58">Estimated total</p>
                    <p class="mt-1 text-3xl font-black text-white">INR {{ bookingTotal }}</p>
                  </div>
                  <span class="rounded-lg bg-gold px-4 py-2 text-xs font-black text-night">{{ selectedPriceClassName }}</span>
                </div>
                <div class="mt-4 grid gap-2 text-sm font-semibold text-white/74">
                  <p>{{ selectedPackageName }}</p>
                  <p>{{ travelers }} traveler{{ Number(travelers) === 1 ? "" : "s" }} with private planning support</p>
                </div>
              </div>
            </div>
          </div>

          <form class="booking-form premium-card rounded-lg p-5 shadow-premium sm:p-6" @submit.prevent="submitBookingInquiry">
            <div class="mb-5 flex flex-col gap-3 border-b border-night/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">Trip request</p>
                <h3 class="mt-1 text-2xl font-black text-night">Build your Kashmir booking</h3>
              </div>
              <span class="rounded-lg bg-night px-4 py-2 text-xs font-black text-white">Secure inquiry</span>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <label class="grid min-w-0 gap-2 text-sm font-bold"><span>Package <span class="text-red-600">*</span></span>
                <select v-model="selectedPackage" required class="w-full min-w-0 truncate rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20">
                  <option v-for="item in packages" :key="item.name" :value="item.price">{{ item.name }}</option>
                </select>
              </label>
              <label class="grid min-w-0 gap-2 text-sm font-bold"><span>Travel date <span class="text-red-600">*</span></span>
                <input v-model="bookingInquiry.travelDate" type="date" required class="w-full min-w-0 rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              </label>
              <label class="grid min-w-0 gap-2 text-sm font-bold"><span>Travelers <span class="text-red-600">*</span></span>
                <input v-model.number="travelers" type="number" min="1" required class="w-full min-w-0 rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              </label>
              <label class="grid min-w-0 gap-2 text-sm font-bold"><span>Pricing class <span class="text-red-600">*</span></span>
                <select v-model.number="priceClass" required class="w-full min-w-0 rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20">
                  <option :value="1">Standard</option>
                  <option :value="1.25">Deluxe</option>
                  <option :value="1.65">Luxury</option>
                </select>
              </label>
              <label class="grid gap-2 text-sm font-bold md:col-span-2"><span>Name <span class="text-red-600">*</span></span>
                <input v-model="bookingInquiry.name" type="text" placeholder="Name" required class="rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              </label>
              <label class="grid gap-2 text-sm font-bold md:col-span-2"><span>Email <span class="text-red-600">*</span></span>
                <input v-model="bookingInquiry.email" type="email" placeholder="email" required class="rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              </label>
              <label class="grid gap-2 text-sm font-bold md:col-span-2"><span>Phone <span class="text-red-600">*</span></span>
                <input v-model="bookingInquiry.phone" type="tel" placeholder="phone" required class="rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              </label>
              <label class="grid gap-2 text-sm font-bold md:col-span-2"><span>Trip notes</span>
                <textarea v-model="bookingInquiry.notes" placeholder="Tell us preferred hotels, pickup point, must-see places, or special requests" class="min-h-28 rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20"></textarea>
              </label>
            </div>

            <p v-if="bookingInquiryStatus" :class="bookingInquiryStatus.includes('sent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'" class="mt-5 rounded-lg p-3 text-sm font-semibold">
              {{ bookingInquiryStatus }}
            </p>

            <div class="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <button type="submit" :disabled="isBookingSubmitting" class="w-full rounded-lg bg-night px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-alpine disabled:cursor-not-allowed disabled:opacity-60">
                {{ isBookingSubmitting ? "Submitting..." : "Submit" }}
              </button>
              <p class="rounded-lg bg-frost px-4 py-3 text-center text-xs font-black text-night/58">Reply within active hours</p>
            </div>
          </form>
        </div>
      </section>

      <section v-if="currentPage === 'booking'" class="section-band py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">How booking works</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">A simple flow from inquiry to confirmed Kashmir trip.</h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article v-for="[step, title, text] in bookingSteps" :key="step" class="premium-card rounded-lg p-5 hover-lift">
              <p class="text-3xl font-black bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">{{ step }}</p>
              <h3 class="mt-4 text-xl font-black text-night">{{ title }}</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'booking'" class="bg-white py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Scan and pay</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Pay your advance with the Snow Feather UPI scanner.</h2>
            <p class="mt-5 text-base leading-7 text-night/[0.62]">After submitting your booking inquiry, scan the QR code, complete the advance payment, and share the payment screenshot on WhatsApp for faster confirmation.</p>
          </div>

          <div class="rounded-lg bg-frost p-5 shadow-lift">
            <div class="grid gap-5 sm:grid-cols-[13rem_1fr] sm:items-center">
              <img src="/upi-img.jpeg" alt="Snow Feather UPI payment QR scanner" class="mx-auto aspect-square w-full max-w-52 rounded-lg border border-night/10 bg-white object-contain p-3 shadow-lift" />
              <div>
                <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">UPI payment</p>
                <h3 class="mt-2 text-2xl font-black text-night">Scan QR to pay</h3>
                <p class="mt-3 text-sm leading-6 text-night/[0.62]">Use any UPI app to scan the code. Mention your name, package, and travel date when sending the payment screenshot.</p>
                <a href="https://wa.me/919055020408?text=I%20have%20completed%20the%20UPI%20payment%20for%20my%20Snow%20Feather%20booking" class="mt-5 inline-flex rounded-lg bg-night px-5 py-3 text-sm font-black text-white hover:bg-lake">Send Screenshot</a>
              </div>
            </div>

            <!-- Payment gateway layout kept for later integration.
            <div class="grid gap-4 sm:grid-cols-3">
              <div class="rounded-lg bg-frost p-5 shadow-lift"><p class="text-2xl font-black text-night">UPI</p><p class="mt-2 text-sm leading-6 text-night/[0.62]">Instant domestic advance collection.</p></div>
              <div class="rounded-lg bg-frost p-5 shadow-lift"><p class="text-2xl font-black text-night">Card</p><p class="mt-2 text-sm leading-6 text-night/[0.62]">Razorpay or Stripe ready layout.</p></div>
              <div class="rounded-lg bg-frost p-5 shadow-lift"><p class="text-2xl font-black text-night">Manual</p><p class="mt-2 text-sm leading-6 text-night/[0.62]">Offline confirmation and invoice support.</p></div>
            </div>
            -->
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" id="gallery" class="section-band py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.homeGalleryEyebrow }}</p>
            <h2 class="mt-2 font-display text-3xl font-extrabold leading-tight text-night sm:text-4xl lg:text-5xl">{{ siteContent.homeGalleryTitle }}</h2>
          </div>
          <div class="grid gap-4 md:grid-cols-4">
            <div v-for="(galleryImage, index) in galleryImages" :key="`${mediaSource(galleryImage)}-${index}`" class="group relative h-72 overflow-hidden rounded-lg shadow-lift" :class="index % 5 === 0 ? 'md:col-span-2' : ''">
              <div class="image-cover absolute inset-0 transition duration-500 group-hover:scale-105 group-hover:opacity-70" :style="imageStyle(galleryImage)"></div>
              <div class="absolute inset-0 flex items-end bg-gradient-to-t from-night/86 via-night/28 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                <div>
                  <p class="text-xl font-black text-white">{{ galleryImageDetail(galleryImage, index)[0] }}</p>
                  <p class="mt-2 max-w-sm text-sm font-semibold leading-6 text-white/78">{{ galleryImageDetail(galleryImage, index)[1] }}</p>
                </div>
              </div>
            </div>
            <!-- <div class="dark-panel grid h-72 place-items-center rounded-lg p-6 text-center text-white"><div><p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Video Gallery</p><p class="mt-3 text-3xl font-black">Play reels, drone shots, and customer clips here.</p></div></div> -->
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'gallery'" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.galleryHeroEyebrow }}</p>
            <h1 class="mt-2 font-display text-4xl font-extrabold leading-tight text-night sm:text-6xl">{{ siteContent.galleryHeroTitle }}</h1>
            <p class="mt-5 max-w-2xl text-base font-semibold leading-8 text-night/[0.64]">{{ siteContent.galleryHeroText }}</p>
            <div class="mt-7 flex flex-wrap gap-3">
              <button type="button" class="rounded-lg bg-night px-6 py-3 text-sm font-black text-white shadow-lift hover:bg-lake" @click="navigateTo('/booking')">Plan Photo Trip</button>
              <button type="button" class="rounded-lg border border-night/[0.12] bg-white px-6 py-3 text-sm font-black text-night hover:border-lake hover:text-lake" @click="navigateTo('/contact')">Ask For Albums</button>
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="group relative h-80 overflow-hidden rounded-lg shadow-lift sm:col-span-2 lg:h-[28rem]">
              <div class="image-cover absolute inset-0 transition duration-500 group-hover:scale-105 group-hover:opacity-70" :style="imageStyle(siteContent.galleryHeroImage)"></div>
              <div class="absolute inset-0 flex items-end bg-gradient-to-t from-night/86 via-night/24 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                <div>
                  <p class="text-2xl font-black text-white">{{ galleryImageDetail(siteContent.galleryHeroImage)[0] }}</p>
                  <p class="mt-2 max-w-md text-sm font-semibold leading-6 text-white/78">{{ galleryImageDetail(siteContent.galleryHeroImage)[1] }}</p>
                </div>
              </div>
            </div>
            <div class="premium-card rounded-lg p-5">
              <p class="text-3xl font-black text-lake">{{ siteContent.galleryStatOneValue }}</p>
              <p class="mt-2 text-sm font-bold leading-6 text-night/[0.62]">{{ siteContent.galleryStatOneText }}</p>
            </div>
            <div class="premium-card rounded-lg p-5">
              <p class="text-3xl font-black text-lake">{{ siteContent.galleryStatTwoValue }}</p>
              <p class="mt-2 text-sm font-bold leading-6 text-night/[0.62]">{{ siteContent.galleryStatTwoText }}</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'gallery'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.galleryCollectionsEyebrow }}</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">{{ siteContent.galleryCollectionsTitle }}</h2>
          </div>
          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <article v-for="collection in galleryCollections" :key="collection.title" class="premium-card overflow-hidden rounded-lg hover-lift">
              <div class="group relative h-64 overflow-hidden">
                <div class="image-cover absolute inset-0 transition duration-500 group-hover:scale-105 group-hover:opacity-70" :style="imageStyle(collection.image)"></div>
                <div class="absolute inset-0 flex items-end bg-gradient-to-t from-night/86 via-night/28 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div>
                    <p class="text-lg font-black text-white">{{ collection.title }}</p>
                    <p class="mt-1 text-xs font-semibold leading-5 text-white/78">{{ collection.text }}</p>
                  </div>
                </div>
              </div>
              <div class="p-5">
                <h3 class="text-2xl font-black bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">{{ collection.title }}</h3>
                <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ collection.text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'gallery'" class="section-band py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-4xl">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.galleryFullEyebrow }}</p>
              <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">{{ siteContent.galleryFullTitle }}</h2>
            </div>
            <button type="button" class="rounded-lg bg-night px-6 py-3 text-sm font-black text-white hover:bg-lake" @click="navigateTo('/packages')">View Packages</button>
          </div>
          <div class="grid gap-4 md:grid-cols-4">
            <div v-for="(galleryImage, index) in galleryImages" :key="`gallery-page-${mediaSource(galleryImage)}-${index}`" class="group relative h-72 overflow-hidden rounded-lg shadow-lift" :class="index % 6 === 0 ? 'md:col-span-2 md:row-span-2 md:h-full min-h-[36rem]' : ''">
              <div class="image-cover absolute inset-0 transition duration-500 group-hover:scale-105 group-hover:opacity-70" :style="imageStyle(galleryImage)"></div>
              <div class="absolute inset-0 flex items-end bg-gradient-to-t from-night/86 via-night/24 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                <div>
                  <p class="text-xl font-black text-white">{{ galleryImageDetail(galleryImage, index)[0] }}</p>
                  <p class="mt-2 max-w-sm text-sm font-semibold leading-6 text-white/78">{{ galleryImageDetail(galleryImage, index)[1] }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'gallery'" class="relative overflow-hidden bg-white py-20 text-night lg:py-24">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.galleryContentEyebrow }}</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">{{ siteContent.galleryContentTitle }}</h2>
            <p class="mt-5 text-base font-semibold leading-8 text-night/[0.64]">{{ siteContent.galleryContentText }}</p>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <article v-for="highlight in galleryHighlights" :key="highlight.title" class="premium-card rounded-lg p-5 hover-lift">
              <h3 class="text-xl font-black text-night">{{ highlight.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ highlight.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'blog'" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.blogHeroEyebrow }}</p>
            <h1 class="mt-2 font-display text-4xl font-extrabold leading-tight text-night sm:text-6xl">{{ siteContent.blogHeroTitle }}</h1>
            <p class="mt-5 max-w-2xl text-base font-semibold leading-8 text-night/[0.64]">{{ siteContent.blogHeroText }}</p>
            <div class="mt-7 flex flex-wrap gap-3">
              <button type="button" class="rounded-lg bg-night px-6 py-3 text-sm font-black text-white shadow-lift hover:bg-lake" @click="navigateTo('/packages')">Explore Packages</button>
              <button type="button" class="rounded-lg border border-night/[0.12] bg-white px-6 py-3 text-sm font-black text-night hover:border-lake hover:text-lake" @click="navigateTo('/contact')">Ask A Question</button>
            </div>
          </div>
          <div class="premium-card overflow-hidden rounded-lg">
            <div class="image-cover h-[30rem]" :style="imageStyle(siteContent.blogFeaturedImage)"></div>
            <div class="p-5">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.blogFeaturedEyebrow }}</p>
              <h2 class="mt-2 text-3xl font-black text-night">{{ siteContent.blogFeaturedTitle }}</h2>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ siteContent.blogFeaturedText }}</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'blog'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.blogPostsEyebrow }}</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">{{ siteContent.blogPostsTitle }}</h2>
          </div>
          <div class="grid gap-5 lg:grid-cols-3">
            <article v-for="post in blogPosts" :key="post.title" class="premium-card overflow-hidden rounded-lg hover-lift">
              <div class="image-cover h-64 relative overflow-hidden" :style="imageStyle(post.image)">
                <div class="absolute inset-0 bg-gradient-to-t from-alpine/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div class="p-5">
                <p class="text-xs font-black uppercase tracking-[0.18em] bg-gradient-to-r from-gold to-[#ff8b6d] bg-clip-text text-transparent">{{ post.date }}</p>
                <h3 class="mt-3 text-2xl font-black leading-tight text-night">{{ post.title }}</h3>
                <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ post.excerpt }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'blog'" class="section-band py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.blogGuidesEyebrow }}</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">{{ siteContent.blogGuidesTitle }}</h2>
            <p class="mt-5 text-base font-semibold leading-8 text-night/[0.64]">{{ siteContent.blogGuidesText }}</p>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <article v-for="guide in blogGuides" :key="guide.title" class="premium-card rounded-lg p-5 hover-lift">
              <h3 class="text-xl font-black text-night">{{ guide.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ guide.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'blog'" class="relative overflow-hidden bg-night py-20 text-white lg:py-24">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3">
          <div class="lg:col-span-1">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">{{ siteContent.blogChecklistEyebrow }}</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-white">{{ siteContent.blogChecklistTitle }}</h2>
          </div>
          <div class="grid gap-4 md:grid-cols-3 lg:col-span-2">
            <div v-for="item in blogChecklist" :key="`${item.number}-${item.title}`" class="rounded-lg bg-white/10 p-5">
              <p class="text-3xl font-black text-gold">{{ item.number }}</p>
              <h3 class="mt-4 text-xl font-black">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-white/70">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'contact'" id="contact" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div class="relative min-h-[37rem] overflow-hidden rounded-lg shadow-premium">
            <div class="image-cover absolute inset-0" :style="imageStyle('image22')"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-night/92 via-night/64 to-lake/28"></div>
            <div class="relative flex min-h-[37rem] flex-col justify-between p-5 text-white sm:p-7">
              <div>
                <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">{{ siteContent.contactHeroEyebrow }}</p>
                <h2 class="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{{ siteContent.contactHeroTitle }}</h2>
                <p class="mt-5 max-w-xl text-sm font-semibold leading-7 text-white/76">Reach us for package planning, booking changes, route suggestions, emergency coordination, or quick WhatsApp support.</p>
              </div>

              <div class="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div class="min-w-0 rounded-lg border border-white/18 bg-white/12 p-3 backdrop-blur-xl">
                  <p class="text-[0.62rem] font-black uppercase leading-4 tracking-[0.14em] text-gold">Call / WhatsApp</p>
                  <p class="mt-2 break-words text-xs font-black leading-5 text-white sm:text-[0.8rem]">{{ siteContent.contactPhone }}</p>
                </div>
                <div class="min-w-0 rounded-lg border border-white/18 bg-white/12 p-3 backdrop-blur-xl">
                  <p class="text-[0.62rem] font-black uppercase leading-4 tracking-[0.14em] text-gold">Email</p>
                  <p class="mt-2 break-all text-xs font-black leading-5 text-white sm:text-[0.8rem]">{{ siteContent.contactEmail }}</p>
                </div>
                <div class="min-w-0 rounded-lg border border-white/18 bg-white/12 p-3 backdrop-blur-xl">
                  <p class="text-[0.62rem] font-black uppercase leading-4 tracking-[0.14em] text-gold">Office</p>
                  <p class="mt-2 line-clamp-5 text-xs font-semibold leading-5 text-white/78 sm:text-[0.8rem]">{{ siteContent.contactAddress }}</p>
                </div>
                <div class="min-w-0 rounded-lg border border-white/18 bg-white/12 p-3 backdrop-blur-xl">
                  <p class="text-[0.62rem] font-black uppercase leading-4 tracking-[0.14em] text-gold">Support</p>
                  <p class="mt-2 text-xs font-semibold leading-5 text-white/78 sm:text-[0.8rem]">{{ siteContent.contactSupport }}</p>
                </div>
              </div>
            </div>
          </div>

          <form class="premium-card rounded-lg p-5 shadow-premium sm:p-6" @submit.prevent="submitContactForm">
            <div class="mb-5 flex flex-col gap-3 border-b border-night/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">Send message</p>
                <h3 class="mt-1 text-2xl font-black text-night">Tell us what you need</h3>
              </div>
              <span class="rounded-lg bg-gold px-4 py-2 text-xs font-black text-night">Fast response</span>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <input v-model="bookingForm.name" type="text" placeholder="Full name" required class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              <input v-model="bookingForm.phone" type="tel" placeholder="Phone / WhatsApp" required class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              <input v-model="bookingForm.email" type="email" placeholder="Email" required class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold md:col-span-2 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              <select class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold md:col-span-2 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20">
                <option>Winter Package</option>
                <option>Summer Package</option>
                <option>Honeymoon Package</option>
                <option>Custom Package</option>
              </select>
              <textarea v-model="bookingForm.details" placeholder="Tell us your dates, travelers, budget, and preferred destinations" class="min-h-36 rounded-lg border border-night/10 px-4 py-3 text-sm font-bold md:col-span-2 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20"></textarea>
            </div>
            <p v-if="bookingFormStatus" :class="bookingFormStatus.includes('valid') ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'" class="mt-4 rounded-lg p-3 text-sm font-semibold">{{ bookingFormStatus }}</p>
            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="submit" class="rounded-lg bg-night px-5 py-3 text-sm font-black text-white transition hover:bg-alpine hover:-translate-y-0.5">Send Inquiry</button>
              <a href="https://wa.me/919055020408?text=I%20want%20to%20book%20a%20Kashmir%20tour" class="rounded-lg border border-night/[0.12] px-5 py-3 text-center text-sm font-black text-night transition hover:border-lake hover:text-lake hover:bg-frost">WhatsApp Live Chat</a>
            </div>
            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              <div class="rounded-lg bg-frost p-3 text-center text-xs font-black text-night/62">Hotels</div>
              <div class="rounded-lg bg-frost p-3 text-center text-xs font-black text-night/62">Cabs</div>
              <div class="rounded-lg bg-frost p-3 text-center text-xs font-black text-night/62">Activities</div>
            </div>
          </form>
        </div>
      </section>

      <section v-if="currentPage === 'contact'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Guest support</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Help before booking, during travel, and after arrival.</h2>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <article v-for="[title, text] in supportCards" :key="title" class="premium-card rounded-lg p-5 hover-lift">
              <h3 class="text-2xl font-black text-night">{{ title }}</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'contact'" class="section-band py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Common questions</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Answer the important details before guests message.</h2>
            <div class="mt-6 grid gap-3">
              <div v-for="([question, answer], index) in faqs" :key="question" class="premium-card rounded-lg p-5">
                <button class="flex w-full items-center justify-between gap-4 text-left text-lg font-black" @click="toggleFaq(index)">{{ question }}<span>+</span></button>
                <p v-if="openFaqs.includes(index)" class="mt-3 text-sm leading-6 text-night/[0.64]">{{ answer }}</p>
              </div>
            </div>
          </div>
          <div class="premium-card overflow-hidden rounded-lg">
            <iframe title="Kashmir contact map" class="h-[32rem] w-full" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Srinagar%20Kashmir&output=embed"></iframe>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'privacyPolicy'" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto max-w-5xl px-4 sm:px-6">
          <div class="max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Privacy Policy</p>
            <h1 class="mt-3 font-display text-4xl font-extrabold text-night sm:text-5xl">How Snow Feather handles guest information.</h1>
            <p class="mt-5 text-base leading-8 text-night/[0.64]">
              We respect guest privacy and collect only the information needed to plan, confirm, and support your Kashmir travel inquiry or booking. This policy explains what we collect, how we use it, and how guests can contact us about their data.
            </p>
            <p class="mt-3 text-sm font-bold text-night/50">Last updated: June 15, 2026</p>
          </div>

          <div class="mt-9 grid gap-4 md:grid-cols-2">
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Information We Collect</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">We may collect your name, phone number, email, travel dates, group size, destination preferences, budget, pickup details, hotel preferences, ID-related booking details, and special travel notes when you contact us through forms, WhatsApp, phone, or email.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">How We Use It</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">Your details help us prepare itineraries, share package options, compare hotel and cab availability, coordinate activities, send payment updates, issue booking confirmations, and provide trip support before and during travel.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">WhatsApp And Calls</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">When you message or call us, we may keep conversation history so our team can follow your trip requirements, respond faster, and avoid asking for the same details again.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Payments</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">Payment details are handled through the selected payment method or processor. We may keep transaction references, paid amounts, pending balances, and invoice details for booking records.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Sharing And Security</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">We share booking details only with relevant service partners such as hotels, drivers, activity providers, and payment processors when needed for your trip. We do not sell guest information.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Photos And Reviews</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">If you share photos, videos, testimonials, or reviews with us, we may request permission before using them for website, gallery, or social media promotion.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Data Retention</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">We keep inquiry and booking records for a reasonable period to manage support, accounting, repeat bookings, and service history. Guests can request corrections or removal where applicable.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Contact</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">For privacy questions or correction requests, contact us at snowfeatheradventures@gmail.com or +91 919055020408.</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'termsOfService'" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto max-w-5xl px-4 sm:px-6">
          <div class="max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Terms of Service</p>
            <h1 class="mt-3 font-display text-4xl font-extrabold text-night sm:text-5xl">Booking terms for Snow Feather guests.</h1>
            <p class="mt-5 text-base leading-8 text-night/[0.64]">
              These terms explain the conditions for inquiries, package planning, booking confirmation, payment, route changes, cancellations, and travel coordination with Snow Feather.
            </p>
            <p class="mt-3 text-sm font-bold text-night/50">Last updated: June 15, 2026</p>
          </div>

          <div class="mt-9 grid gap-4 md:grid-cols-2">
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Packages And Availability</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">Package prices, hotel availability, activities, permits, and routes may change based on season, weather, local conditions, and partner availability. Final details are confirmed before booking.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Payments And Confirmation</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">A booking is treated as confirmed after the agreed payment or advance is received. Payment timelines, inclusions, and balance amounts will be shared with the guest before confirmation.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Package Inclusions</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">Only services clearly mentioned in the final itinerary or confirmation message are included. Meals, entry tickets, guides, activities, heaters, pony rides, tips, and personal expenses may be separate unless stated.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Weather And Local Conditions</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">Snowfall, road closures, traffic, strikes, government restrictions, safety instructions, and local conditions can affect routes and timing. We help adjust plans where possible, but some changes may require extra cost.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Changes And Cancellations</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">Date changes, cancellations, refunds, and service changes depend on hotel, cab, activity, and permit partner policies. We help coordinate changes where possible.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Hotel And Cab Coordination</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">Hotel room categories, check-in rules, cab types, pickup points, and sightseeing limits follow partner policies and local travel norms. Any upgrade or route extension may be charged separately.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Adventure Activities</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">Activities such as Gondola rides, skiing, snowmobile, trekking, camping, pony rides, and Shikara rides depend on weather, permits, crowd levels, and operator availability. Safety instructions must be followed.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Guest Responsibility</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">Guests are responsible for sharing accurate traveler details, carrying valid ID, following local safety guidance, and informing us early about health, accessibility, or special travel requirements.</p>
            </article>
            <article class="rounded-lg bg-white p-6 shadow-lift">
              <h2 class="text-2xl font-black text-night">Support And Contact</h2>
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">For booking support, itinerary changes, or service questions, contact Snow Feather at snowfeatheradventures@gmail.com or +91 919055020408.</p>
            </article>
          </div>
        </div>
      </section>
    </main>

    <footer class="bg-night px-4 py-12 text-white sm:px-6 lg:py-16">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 xl:grid-cols-[1.35fr_0.9fr_1fr] xl:gap-16">
          <div>
            <button type="button" class="inline-flex items-center gap-3 text-left" @click="navigateTo('/home')">
              <span class="grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-lake/30 bg-white p-2">
                <img :src="logoSrc" :alt="`${brandName} logo`" class="h-full w-full object-contain" />
              </span>
              <span>
                <span class="block font-display text-2xl font-extrabold text-lake">{{ brandName }}</span>
                <span class="block text-xs font-semibold text-white/60">where every journey begins</span>
              </span>
            </button>
            <p class="mt-6 max-w-sm text-sm font-semibold leading-7 text-white/72">
              Your trusted Kashmir travel partner for holiday packages, hotels, cabs, activities, honeymoon trips, and visa guidance.
            </p>
            <div class="mt-6 flex gap-3">
              <a href="https://www.instagram.com/" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 transition hover:-translate-y-1 hover:border-lake/40 hover:bg-white/15" aria-label="Instagram">
                <img src="/social/instagram.svg" alt="" class="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 transition hover:-translate-y-1 hover:border-lake/40 hover:bg-white/15" aria-label="Facebook">
                <img src="/social/facebook.svg" alt="" class="h-5 w-5" />
              </a>
              <a href="https://wa.me/919055020408?text=I%20want%20to%20book%20a%20Kashmir%20tour" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 transition hover:-translate-y-1 hover:border-lake/40 hover:bg-white/15" aria-label="WhatsApp">
                <img src="/social/whatsapp.svg" alt="" class="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 transition hover:-translate-y-1 hover:border-lake/40 hover:bg-white/15" aria-label="YouTube">
                <img src="/social/youtube.svg" alt="" class="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h2 class="font-display text-2xl font-extrabold text-lake">Services</h2>
            <div class="mt-6 grid gap-3 text-base font-semibold text-white/78">
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/packages')">Holiday Packages</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/destinations')">Hotels</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/booking')">Booking</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/contact')">Visa Processing</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/contact')">Travel Insurance</button>
            </div>
          </div>

          <div>
            <h2 class="font-display text-2xl font-extrabold text-lake">Quick Links</h2>
            <div class="mt-6 grid gap-3 text-base font-semibold text-white/78">
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/about')">About Us</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/packages')">All Packages</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/gallery')">Gallery</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/blog')">Blog</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/booking')">My Bookings</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/contact')">Contact Us</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/privacy-policy')">Privacy Policy</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/terms-of-service')">Terms of Service</button>
            </div>
          </div>

        <!--  <div>
            <h2 class="font-display text-2xl font-extrabold text-lake">Newsletter</h2>
            <p class="mt-6 text-base font-semibold text-white/78">Get exclusive deals and offers</p>
            <form class="mt-5 grid gap-3" @submit.prevent>
              <input type="email" placeholder="Email Address" class="h-12 rounded-lg border border-white/10 bg-white/12 px-4 text-sm font-bold text-white placeholder:text-white/40 focus:border-lake focus:outline-none" />
              <button type="submit" class="h-12 rounded-lg bg-lake px-5 text-sm font-black text-white hover:bg-gold hover:text-night">Subscribe</button>
            </form>
            <div class="mt-6 grid gap-3 text-sm font-bold text-white/78">
              <p><span class="text-gold">IATA CODE:</span> 96178504</p>
              <p>ISO CERTIFICATE NO: TSNUK31681</p>
              <div class="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <span class="rounded bg-white/10 px-3 py-2 text-lake">IATA</span>
                <span>Accredited</span>
                <span class="rounded bg-white px-3 py-2 font-black text-lake">ISO 9001:2015</span>
                <span>Certified - TSNUK31681</span>
              </div>
            </div>
          </div> -->
        </div>

        <div class="flex flex-col gap-6 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap items-center gap-3">
            <p class="text-sm font-black text-white/72">100% Secure Payments</p>
            <span class="rounded bg-white px-5 py-2 text-xs font-black text-night">VISA</span>
            <span class="rounded bg-white px-5 py-2 text-xs font-black text-red-600">MasterCard</span>
            <span class="rounded bg-white px-5 py-2 text-xs font-black text-lake">UPI</span>
            <span class="rounded bg-white px-5 py-2 text-xs font-black text-blue-500">Razorpay</span>
          </div>
          <p class="text-sm font-semibold text-white/50">© 2026 Snow Feather. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <a
      href="https://wa.me/919055020408?text=I%20want%20instant%20Kashmir%20booking%20support"
      class="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-premium transition hover:-translate-y-1 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      aria-label="WhatsApp instant booking"
      title="WhatsApp instant booking"
    >
      <svg class="h-7 w-7" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path
          d="M16.04 3C9.02 3 3.32 8.7 3.32 15.72c0 2.24.58 4.41 1.69 6.33L3.2 28.67l6.78-1.78a12.63 12.63 0 0 0 6.06 1.54h.01c7.01 0 12.72-5.7 12.72-12.72C28.76 8.7 23.06 3 16.04 3Zm0 23.28h-.01c-1.93 0-3.83-.52-5.48-1.5l-.39-.23-4.02 1.05 1.07-3.92-.25-.4a10.5 10.5 0 0 1-1.6-5.56c0-5.9 4.79-10.69 10.69-10.69 2.85 0 5.54 1.11 7.55 3.13a10.62 10.62 0 0 1 3.13 7.55c-.01 5.88-4.8 10.67-10.69 10.67Zm5.86-8c-.32-.16-1.9-.94-2.19-1.05-.29-.11-.51-.16-.72.16-.21.32-.83 1.05-1.02 1.26-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.61-1.91-1.8-2.23-.19-.32-.02-.49.14-.65.15-.15.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.39-.26-.62-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.15 3.09 1.31 3.3.16.21 2.26 3.45 5.48 4.84.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z"
        />
      </svg>
    </a>
  </template>
</template>
