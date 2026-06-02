<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const imageAssets = import.meta.glob("./assets/kashmir/*.jpeg", {
  eager: true,
  query: "?url",
  import: "default",
});

function image(name) {
  return imageAssets[`./assets/kashmir/${name}.jpeg`];
}

function imageSource(name, fallback = "image23") {
  if (name?.startsWith("data:") || name?.startsWith("http") || name?.startsWith("/")) return name;
  return image(name) || image(fallback);
}

function imageStyle(name) {
  const source = imageSource(name);
  return { backgroundImage: `url('${source}')` };
}

const brandName = "Snow Feather";
const logoSrc = "/snow-feather-logo.svg";
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
  ["Home", "/"],
  ["About Us", "/about"],
  ["Gallery", "/gallery"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];

const publicRoutes = {
  "/": "home",
  "/about": "about",
  "/packages": "packages",
  "/destinations": "destinations",
  "/booking": "booking",
  "/gallery": "gallery",
  "/blog": "blog",
  "/contact": "contact",
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
const activeFilter = ref("all");
const activeAdminTab = ref("packages");
const openFaqs = ref([0]);
const currentPage = computed(() => (currentPath.value.startsWith("/packages/") ? "packageDetail" : publicRoutes[currentPath.value] || "home"));

const defaultSiteContent = {
  heroBadge: "Premium Kashmir adventure tourism",
  heroTitle: "Adventure Without Fear. Travel Without Doubt.",
  heroSubtitle:
    "Curated skiing, trekking, camping, houseboat, honeymoon, family, and luxury journeys across Srinagar, Gulmarg, Pahalgam, Sonamarg, Dal Lake, and beyond.",
};

const siteContent = ref(loadStoredValue("kashmir-site-content", defaultSiteContent));

const defaultPackages = [
  {
    name: "Gulmarg Ski & Gondola",
    tag: "Winter",
    price: 18500,
    duration: "4D/3N",
    rating: "4.9",
    types: ["winter", "luxury"],
    image: image("image08"),
    description: "Ski lessons, Gondola, snowmobile, heated stay, transfers, permits, and on-ground support.",
  },
  {
    name: "Srinagar Lake & Gardens",
    tag: "Summer",
    price: 12900,
    duration: "3D/2N",
    rating: "4.8",
    types: ["summer", "family"],
    image: image("image21"),
    description: "Dal Lake, Mughal Gardens, Shikara, houseboat stay, city tour, and family-friendly pacing.",
  },
  {
    name: "Royal Kashmir Honeymoon",
    tag: "Luxury",
    price: 34500,
    duration: "5D/4N",
    rating: "5.0",
    types: ["honeymoon", "luxury"],
    image: image("image14"),
    description: "Candlelight dinner, premium houseboat, private cab, photoshoot, Gulmarg day, and romantic add-ons.",
  },
  {
    name: "Pahalgam Group Trek",
    tag: "Group",
    price: 21800,
    duration: "6D/5N",
    rating: "4.7",
    types: ["summer", "group"],
    image: image("image01"),
    description: "Guides, camping, meals, route planning, activity permits, and student or corporate group support.",
  },
  {
    name: "Sonamarg Snow Day",
    tag: "Family",
    price: 6500,
    duration: "1D",
    rating: "4.8",
    types: ["winter", "family"],
    image: image("image12"),
    description: "Scenic drive, snow activities, local guide, family transfers, and real snowfall video stops.",
  },
  {
    name: "Luxury Kashmir Circuit",
    tag: "Premium",
    price: 68000,
    duration: "7D/6N",
    rating: "5.0",
    types: ["luxury", "summer"],
    image: image("image20"),
    description: "Deluxe hotels, premium cab, houseboat, concierge planning, custom route, and private experiences.",
  },
];

const packages = ref(loadStoredValue("kashmir-packages", defaultPackages));
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

const detailHighlights = computed(() => {
  const item = detailPackage.value;
  const descriptionParts = String(item?.description || "")
    .split(",")
    .map((part) => part.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .slice(0, 4);

  return descriptionParts.length ? descriptionParts : ["Private cab", "Hotel stay", "Local guide", "Trip support"];
});

const detailCities = computed(() => {
  const text = `${detailPackage.value?.name || ""} ${detailPackage.value?.description || ""}`.toLowerCase();
  const cityNames = ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg", "Dal Lake", "Mughal Gardens"];
  const matchedCities = cityNames.filter((city) => text.includes(city.toLowerCase()));
  return matchedCities.length ? matchedCities : ["Srinagar", "Gulmarg"];
});

const detailSaveAmount = computed(() => Math.max(2500, Math.round(Number(detailPackage.value?.price || 0) * 0.18)));

const packageRouteMap = {
  "Gulmarg Ski & Gondola": ["Gulmarg", "Gondola, Apharwat Peak, Snow Trails"],
  "Srinagar Lake & Gardens": ["Srinagar", "Dal Lake, Mughal Gardens, Houseboat"],
  "Royal Kashmir Honeymoon": ["Kashmir", "Srinagar, Gulmarg, Pahalgam"],
  "Pahalgam Group Trek": ["Pahalgam", "Betaab Valley, Aru Valley, Camps"],
  "Sonamarg Snow Day": ["Sonamarg", "Glacier Point, Snow Activities"],
  "Luxury Kashmir Circuit": ["Kashmir", "Srinagar, Gulmarg, Pahalgam, Sonamarg"],
};

function packageRoute(item) {
  return packageRouteMap[item.name] || ["Kashmir", "Custom route"];
}

function packageChips(item) {
  return String(item.description || "")
    .split(",")
    .map((part) => part.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .slice(0, 3);
}

function packageOriginalPrice(item) {
  return Math.round(Number(item.price || 0) * 1.18);
}

function displayDuration(duration) {
  return String(duration || "").replace("/", " / ");
}

const detailWhatsappLink = computed(() => {
  const message = `I want details for ${detailPackage.value?.name || "a Kashmir package"}`;
  return `https://wa.me/919055020408?text=${encodeURIComponent(message)}`;
});

const defaultGalleryImages = ["image03", "image04", "image05", "image06", "image09", "image10", "image11", "image13", "image15", "image16", "image17", "image18", "image19", "image20"];
const galleryImages = ref(loadStoredValue("kashmir-gallery-images", defaultGalleryImages));
const displayGalleryImages = computed(() => {
  const savedImages = Array.isArray(galleryImages.value) ? galleryImages.value.filter((item) => Boolean(item) && imageSource(item)) : [];
  const fallbackImages = defaultGalleryImages.filter((item) => !savedImages.includes(item));
  return [...savedImages, ...fallbackImages].slice(0, 12);
});
const homeGalleryImages = ["image03", "image04", "image05", "image06", "image09", "image10", "image18", "image20"];

const galleryCollections = [
  ["Snow Days", "image08", "Gulmarg skiing, snowmobile rides, Gondola views, and winter portraits for families, couples, and groups."],
  ["Lake Life", "image22", "Dal Lake houseboats, Shikara rides, floating market mornings, sunset frames, and slow Srinagar evenings."],
  ["Valley Routes", "image19", "Pahalgam meadows, pine roads, Betaab Valley, Aru Valley, and riverside picnic stops."],
  ["Golden Hours", "image14", "Honeymoon shoots, garden walks, private cab pauses, and soft light around Kashmir's best viewpoints."],
];

const galleryHighlights = [
  ["Drone ready", "Wide mountain views, lake movements, resort arrivals, and group moments can be planned into the itinerary."],
  ["Guest stories", "Real trip photographs, short reels, snowfall clips, and destination albums help travelers choose confidently."],
  ["Season albums", "Winter, spring, summer, autumn, honeymoon, family, and luxury collections make browsing simple."],
];

const blogPosts = [
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

const blogGuides = [
  ["Packing checklist", "Carry thermals in winter, light layers in summer, comfortable shoes, ID documents, basic medicine, sunscreen, power bank, and waterproof covers."],
  ["Route planning", "Keep Srinagar as the base for flexible movement, add Gulmarg for snow, Pahalgam for valleys, Sonamarg for glacier views, and Dal Lake for slow evenings."],
  ["Booking advice", "Confirm hotels, cab type, pickup timing, activity costs, permits, and payment schedule before arrival so the trip feels settled from day one."],
  ["Family comfort", "Choose shorter daily drives, heated winter rooms, clean meal stops, flexible sightseeing, and enough rest time for children and senior travelers."],
  ["Honeymoon pacing", "Mix private photo stops, houseboat nights, candlelight dinners, light adventure, and premium cab support instead of packing every day too tightly."],
  ["Group travel", "Lock room sharing, luggage space, guide needs, meal preferences, and activity choices early so everyone moves together without last-minute confusion."],
];

const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(90deg, rgba(7, 24, 39, 0.88), rgba(7, 24, 39, 0.52), rgba(7, 24, 39, 0.2)), linear-gradient(0deg, rgba(7, 24, 39, 0.62), transparent 42%), url('${image("image23")}')`,
}));

const activities = [
  ["SKI", "Skiing", "Gulmarg slopes, trainers, gear, and peak-season support."],
  ["TRK", "Trekking", "Great Lakes, Tarsar-Marsar, Gangbal, Aru, Sonamarg, and Pahalgam guided routes."],
  ["CMP", "Camping", "Sonamarg, Aru Valley, Doodhpathri, Yusmarg, and Great Lakes camp setups."],
  ["GND", "Gondola Ride", "Gulmarg Gondola ticket guidance, transfers, weather checks, and view-point timing."],
  ["HRS", "Horse Riding", "Meadow rides around Betaab Valley, Baisaran, Sonamarg, and local scenic points."],
  ["PIC", "Photography", "Lake, garden, snow, meadow, glacier, and honeymoon photo routes with local timing."],
  ["SNW", "Snow Adventure", "Snowmobile, sledging, snowboarding, ice skating, ski lessons, and winter transfers."],
  ["NTR", "Nature Exploration", "Lakes, gardens, forests, alpine meadows, glaciers, and soft adventure days."],
];

const destinations = [
  {
    name: "Gulmarg",
    image: "image10",
    imageLabel: "Gulmarg Gondola and Apharwat snow slopes",
    price: "From Rs 6,500 / person",
    bestFor: "Skiing, Gondola, snow photos, meadows",
    season: "December-March for snow, May-September for meadows",
    description: "A signature Kashmir mountain resort known for the Gulmarg Gondola, Apharwat Peak, ski slopes, snowmobile routes, and wide summer meadows.",
    details: ["Gondola Phase 1 and Phase 2 planning", "Ski instructors and rental gear", "Khellanmarg meadow walk", "Tangmarg transfers and hotel options"],
  },
  {
    name: "Pahalgam",
    image: "image19",
    imageLabel: "Pahalgam alpine trail and mountain approach",
    price: "From Rs 5,500 / person",
    bestFor: "Aru Valley, Betaab Valley, trekking, riverside stays",
    season: "April-October",
    description: "A relaxed valley base for families and groups, with Lidder River views, pine routes, pony rides, Aru Valley treks, and camping add-ons.",
    details: ["Aru Valley and Betaab Valley sightseeing", "Baisaran pony ride coordination", "Family picnic and river-view stops", "Tarsar-Marsar and Aru trek starts"],
  },
  {
    name: "Sonamarg",
    image: "image11",
    imageLabel: "Thajiwas Glacier route near Sonamarg",
    price: "From Rs 5,900 / person",
    bestFor: "Glacier visits, horse riding, snow points, camping",
    season: "May-October, winter subject to road access",
    description: "The Meadow of Gold is loved for Thajiwas Glacier, Sindh River views, high-altitude photography, pony routes, and access to Great Lakes trekking.",
    details: ["Thajiwas Glacier day route", "Great Lakes trek base support", "Riverside camping and meals", "Snow point guidance in shoulder season"],
  },
  {
    name: "Yusmarg",
    image: "image02",
    imageLabel: "Yusmarg-style meadow with snow peaks and open grassland",
    price: "From Rs 4,800 / person",
    bestFor: "Quiet meadows, pine walks, family nature days",
    season: "April-November",
    description: "A peaceful meadow destination for guests who want a softer day away from crowded routes, with pine forests, open grassland, and horse trails.",
    details: ["Nilnag and meadow walks", "Pony ride support", "Picnic-style day plan", "Soft photography route"],
  },
  {
    name: "Doodhpathri",
    image: "image05",
    imageLabel: "Doodhpathri-style green meadow below snow-lined mountains",
    price: "From Rs 4,500 / person",
    bestFor: "Alpine meadow exploration, family photos, picnic days",
    season: "May-October",
    description: "A lush meadow escape with rolling grasslands, mountain views, stream-side pauses, and relaxed day-trip pacing from Srinagar.",
    details: ["Meadow viewpoint stops", "Stream-side leisure time", "Family-friendly cab route", "Camp and picnic add-ons"],
  },
  {
    name: "Aru Valley",
    image: "image08",
    imageLabel: "Aru Valley village and pine-covered mountain bowl",
    price: "From Rs 5,200 / person",
    bestFor: "Treks, camping, village views, nature walks",
    season: "May-September",
    description: "Aru Valley is a photogenic Pahalgam-side base for alpine treks, tent stays, meadow walks, and quieter village scenery.",
    details: ["Aru Valley camp nights", "Tarsar-Marsar route support", "Short meadow hikes", "Guide, porter, and meal planning"],
  },
  {
    name: "Khellanmarg",
    image: "image04",
    imageLabel: "Khellanmarg and Gulmarg meadow route below snow peaks",
    price: "From Rs 4,900 / person",
    bestFor: "Short hikes, skiing add-ons, meadow photography",
    season: "January-March for snow, May-August for hikes",
    description: "A scenic Gulmarg-side meadow route for guests who want a short adventure, ski training support, or a quieter snow-and-peak viewpoint.",
    details: ["Short meadow hike", "Ski training support in season", "Apharwat view points", "Guide and snow gear coordination"],
  },
  {
    name: "Seven Springs",
    image: "image01",
    imageLabel: "Seven Springs-style reflective meadow and mountain panorama",
    price: "From Rs 4,700 / person",
    bestFor: "Viewpoints, Gondola add-on, soft hikes",
    season: "May-September",
    description: "A beautiful Gulmarg viewpoint route where guests can connect meadow scenery, mountain reflections, and Gondola-area sightseeing.",
    details: ["Viewpoint walk", "Gulmarg day pairing", "Photography pauses", "Flexible family pacing"],
  },
  {
    name: "Srinagar City",
    image: "image18",
    imageLabel: "Srinagar heritage and mountain travel gateway",
    price: "From Rs 3,500 / person",
    bestFor: "Markets, heritage, gardens, airport arrivals",
    season: "Year-round",
    description: "The main arrival base for Kashmir trips, ideal for heritage walks, old-city markets, local food, Mughal Gardens, and smooth airport transfers.",
    details: ["Lal Chowk and old-city route", "Airport pickup and hotel check-in", "Local food and shopping stops", "Garden and lake pairing"],
  },
  {
    name: "Dal Lake",
    image: "image22",
    imageLabel: "Dal Lake houseboats and Shikara experience in Srinagar",
    price: "From Rs 1,200 / person",
    bestFor: "Shikara rides, houseboats, floating market, sunsets",
    season: "Year-round",
    description: "Kashmir's most recognized lake experience, with Shikara rides, houseboat stays, floating shops, Nehru Park views, and sunset photography.",
    details: ["Shikara ride coordination", "Houseboat booking", "Floating market timing", "Lake-view dining and photo route"],
  },
  {
    name: "Nigeen Lake",
    image: "image21",
    imageLabel: "Nigeen Lake-style quiet houseboat stay near Srinagar",
    price: "From Rs 1,500 / person",
    bestFor: "Quiet houseboats, couples, relaxed lake stays",
    season: "Year-round",
    description: "A calmer lake stay option near Srinagar for honeymooners and families who prefer peaceful houseboats and slower evenings.",
    details: ["Premium houseboat options", "Private Shikara add-on", "Quiet sunset route", "Airport and city transfers"],
  },
  {
    name: "Mughal Gardens",
    image: "image07",
    imageLabel: "Mughal Garden mountain-view attraction in Srinagar",
    price: "From Rs 2,200 / person",
    bestFor: "Shalimar, Nishat, Chashme Shahi, Pari Mahal",
    season: "March-November",
    description: "Srinagar's garden circuit connects royal terraces, mountain backdrops, spring blooms, Chinar shade, and easy family photography stops.",
    details: ["Shalimar Garden", "Nishat Garden", "Chashme Shahi", "Pari Mahal, Achabal, Kokernag, and Verinag options"],
  },
];

const adventureCategories = [
  {
    title: "Trekking & Hiking Adventures",
    image: "image09",
    imageLabel: "Kashmir Great Lakes alpine lake trek",
    price: "From Rs 14,500 / person",
    description: "Guided routes for Kashmir Great Lakes, Gangbal, Tarsar-Marsar, Kounsarnag, Thajiwas Glacier, Aru Valley, Sonamarg, and Pahalgam trails.",
    places: ["Kashmir Great Lakes", "Gangbal", "Tarsar-Marsar", "Kounsarnag", "Thajiwas Glacier", "Aru Valley"],
    inclusions: ["Certified local guides", "Camping equipment and meals", "Route permits and safety checks", "Porter and transport options"],
  },
  {
    title: "Camping Experiences",
    image: "image18",
    imageLabel: "Real tent camping setup in Kashmir meadows",
    price: "From Rs 2,800 / person / night",
    description: "Tent stays in Sonamarg, Pahalgam, Aru Valley, Doodhpathri, Yusmarg, and Great Lakes region with meals and guided movement.",
    places: ["Sonamarg", "Pahalgam", "Aru Valley", "Doodhpathri", "Yusmarg", "Great Lakes Region"],
    inclusions: ["Dome tents and sleeping bags", "Bonfire where permitted", "Camp meals and support staff", "Weather-aware campsite selection"],
  },
  {
    title: "Winter Adventure Activities",
    image: "image15",
    imageLabel: "Gulmarg ski slope below Apharwat snow peaks",
    price: "From Rs 3,500 / activity",
    description: "Skiing in Gulmarg, Khellanmarg, and Sonamarg, plus snowboarding courses, ice skating, short ski training, and winter snow expeditions.",
    places: ["Skiing in Gulmarg", "Khellanmarg", "Sonamarg", "Snowboarding", "Ice skating", "Snow expeditions"],
    inclusions: ["Instructor and gear coordination", "Snowmobile and sledging add-ons", "Warm stay and transfer planning", "Weather and road updates"],
  },
  {
    title: "Summer Adventure Activities",
    image: "image05",
    imageLabel: "Summer meadow exploration below Kashmir snow peaks",
    price: "From Rs 2,500 / activity",
    description: "Camping, trekking, mountain climbing, nature walks, alpine meadow exploration, glacier visits, and photography tours in peak green season.",
    places: ["Camping", "Trekking", "Mountain climbing", "Nature walks", "Alpine meadows", "Glacier visits"],
    inclusions: ["Day hikes and soft adventure", "Glacier and meadow routes", "Photography timing guidance", "Family and group pacing"],
  },
  {
    title: "Leisure & Sightseeing",
    image: "image10",
    imageLabel: "Gulmarg Gondola ride and snow viewpoint",
    price: "From Rs 1,200 / person",
    description: "Shikara rides, Gulmarg Gondola rides, horse riding, nature tours, cultural heritage tours, and photography excursions.",
    places: ["Shikara rides", "Gulmarg Gondola", "Horse riding", "Nature tours", "Cultural tours", "Photography excursions"],
    inclusions: ["Lake and garden sightseeing", "Gondola and horse ride guidance", "Private cab add-ons", "Cultural and heritage route planning"],
  },
  {
    title: "Gardens & Heritage Attractions",
    image: "image02",
    imageLabel: "Srinagar garden-style mountain lawn and open valley view",
    price: "From Rs 2,200 / person",
    description: "Mughal Gardens, Shalimar, Nishat, Chashme Shahi, Pari Mahal, Achabal Garden, Kokernag Garden, and Verinag Garden.",
    places: ["Mughal Gardens", "Shalimar", "Nishat", "Chashme Shahi", "Pari Mahal", "Achabal, Kokernag, Verinag"],
    inclusions: ["Garden circuit planning", "Family photography stops", "Entry timing support", "Srinagar city pairing"],
  },
];

const faqs = [
  ["Can pricing change in winter?", "Yes. Gulmarg and Sonamarg peak winter pricing can increase due to demand, weather, transportation limits, activity availability, and hotel inventory."],
  ["Do you support custom packages?", "Yes. Solo, couple, family, group, student, luxury, budget, airport-to-airport, and custom package types are supported."],
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

const bookingSteps = [
  ["01", "Send details", "Send travel month, group size, preferred destinations, and budget range."],
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
const selectedPaymentMethod = ref("");
const bookingTotalAmount = computed(() => Math.round(Number(selectedPackage.value || 0) * Number(travelers.value || 1) * Number(priceClass.value || 1)));
const bookingTotal = computed(() =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(bookingTotalAmount.value),
);

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

function choosePayment(method) {
  selectedPaymentMethod.value = method;
  if (method === "UPI") {
    window.location.href = `upi://pay?pa=9055020408@upi&pn=Snow%20Feather&am=${bookingTotalAmount.value}&cu=INR&tn=Kashmir%20tour%20booking%20advance`;
  }
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
  localStorage.setItem("kashmir-packages", JSON.stringify(packages.value));
  localStorage.setItem("kashmir-gallery-images", JSON.stringify(galleryImages.value));
  adminSaved.value = "Saved. Website content updated in this browser.";
  window.setTimeout(() => {
    adminSaved.value = "";
  }, 3000);
}

function resetAdminChanges() {
  siteContent.value = { ...defaultSiteContent };
  packages.value = defaultPackages.map((item) => ({ ...item }));
  galleryImages.value = [...defaultGalleryImages];
  selectedPackage.value = packages.value[0]?.price || 0;
  localStorage.removeItem("kashmir-site-content");
  localStorage.removeItem("kashmir-packages");
  localStorage.removeItem("kashmir-gallery-images");
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

function updatePackageTypes(item, value) {
  item.types = value
    .split(",")
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean);
}

function addPackage() {
  packages.value.unshift({
    name: "New Kashmir Package",
    tag: "Custom",
    price: 15000,
    duration: "3D/2N",
    rating: "4.8",
    types: ["summer", "family"],
    image: image("image18"),
    description: "Add the package details, inclusions, route, and customer benefits here.",
  });
  selectedPackage.value = packages.value[0].price;
  saveAdminChanges();
}

function deletePackage(index) {
  packages.value.splice(index, 1);
  selectedPackage.value = packages.value[0]?.price || 0;
  saveAdminChanges();
}

function updateGalleryImage(event, index) {
  readImageFile(event, (result) => {
    galleryImages.value[index] = result;
    saveAdminChanges();
  });
}

function addGalleryImage(event) {
  readImageFile(event, (result) => {
    galleryImages.value.unshift(result);
    saveAdminChanges();
  });
}

function deleteGalleryImage(index) {
  galleryImages.value.splice(index, 1);
  saveAdminChanges();
}

onMounted(() => {
  window.addEventListener("popstate", handlePopState);
});

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
});
</script>

<template>
  <section v-if="isAdminRoute" class="min-h-screen bg-night text-white">
    <div v-if="!isAdminLoggedIn" class="grid min-h-screen place-items-center px-4 py-10 sm:px-6">
      <div class="w-full max-w-md rounded-lg border border-white/[0.12] bg-white/[0.08] p-6 shadow-premium backdrop-blur sm:p-8">
        <a href="/" class="mb-7 inline-flex items-center gap-3 rounded-lg border border-white/[0.18] px-4 py-2 text-sm font-black text-white hover:bg-white/[0.12]">
          <img :src="logoSrc" :alt="`${brandName} logo`" class="h-10 w-10 rounded bg-white object-contain p-1" />
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
        </form>
      </div>
    </div>

    <div v-else class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div class="flex items-center gap-4">
            <span class="grid h-16 w-16 place-items-center overflow-hidden rounded-lg bg-white p-2">
              <img :src="logoSrc" :alt="`${brandName} logo`" class="h-full w-full object-contain" />
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
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Duration
                  <input v-model="item.duration" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Tag
                  <input v-model="item.tag" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Rating
                  <input v-model="item.rating" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Filter types
                  <input :value="packageTypesText(item)" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updatePackageTypes(item, $event.target.value)" />
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
              <div v-for="(galleryImage, index) in galleryImages" :key="`${galleryImage}-${index}`" class="rounded-lg border border-white/[0.12] bg-white/[0.08] p-2">
                <div class="image-cover h-36 rounded-lg" :style="imageStyle(galleryImage)"></div>
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
        <a href="/" class="flex items-center gap-3" :aria-label="`${brandName} home`" @click.prevent="navigateTo('/')">
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

      <section v-if="currentPage === 'home'" class="section-band py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Featured activities</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Adventure, snow, lake, and mountain experiences.</h2>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article v-for="[icon, title, text] in activities" :key="title" class="premium-card rounded-lg p-5">
              <p class="text-xs font-black tracking-[0.24em] text-lake">{{ icon }}</p>
              <h3 class="mt-4 text-xl font-black">{{ title }}</h3>
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

        <div class="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl gap-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[0.52fr_0.48fr] lg:items-center">
          <div>
            <div class="flex flex-wrap gap-3">
              <span class="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/18 px-4 py-2 text-sm font-black text-white shadow-lift">
                <span class="text-xs uppercase text-gold">IATA</span>
                Certified
              </span>
              <span class="inline-flex items-center gap-2 rounded-full border border-lake/30 bg-lake/18 px-4 py-2 text-sm font-black text-white shadow-lift">
                <span class="text-xs uppercase text-lake">ISO</span>
                ISO 9001:2025
              </span>
              <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-black text-white shadow-lift">
                10K+ Happy Travelers
              </span>
            </div>

            <h1 class="mt-10 font-display text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl lg:whitespace-nowrap lg:text-5xl xl:text-6xl">
              Your Journey
              <span class="bg-gradient-to-r from-gold via-[#ff8b6d] to-[#ff6fa8] bg-clip-text text-transparent">Begins Here</span>
            </h1>
            <p class="mt-6 max-w-4xl text-lg font-semibold leading-8 text-white/76 lg:whitespace-nowrap">
              Where Kashmir mountains, lake stays, snow adventures, and premium planning come together with Snow Feather support.
            </p>

            <div class="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-5">
              <button type="button" class="grid min-h-28 place-items-center rounded-lg border border-white/10 bg-black/30 px-4 py-5 text-center text-sm font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:border-lake/60 hover:bg-lake/20" @click="navigateTo('/booking')">
                <span class="text-2xl">AIR</span>
                <span>Flights</span>
              </button>
              <button type="button" class="grid min-h-28 place-items-center rounded-lg border border-white/10 bg-black/30 px-4 py-5 text-center text-sm font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:border-lake/60 hover:bg-lake/20" @click="navigateTo('/destinations')">
                <span class="text-2xl">STAY</span>
                <span>Hotels</span>
              </button>
              <button type="button" class="grid min-h-28 place-items-center rounded-lg border border-white/10 bg-black/30 px-4 py-5 text-center text-sm font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:border-lake/60 hover:bg-lake/20" @click="navigateTo('/contact')">
                <span class="text-2xl">CAB</span>
                <span>Bus</span>
              </button>
              <button type="button" class="grid min-h-28 place-items-center rounded-lg border border-white/10 bg-black/30 px-4 py-5 text-center text-sm font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:border-lake/60 hover:bg-lake/20" @click="navigateTo('/contact')">
                <span class="text-2xl">DOC</span>
                <span>Visa</span>
              </button>
              <button type="button" class="grid min-h-28 place-items-center rounded-lg border border-white/10 bg-white/18 px-4 py-5 text-center text-sm font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:border-lake/60 hover:bg-lake/25" @click="navigateTo('/packages')">
                <span class="text-2xl">TRIP</span>
                <span>Packages</span>
              </button>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <span class="rounded-full border border-gold/24 bg-gold/16 px-4 py-2 text-sm font-bold text-white">Beaches</span>
              <span class="rounded-full border border-lake/24 bg-lake/16 px-4 py-2 text-sm font-bold text-white">Mountains</span>
              <span class="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-bold text-white">Culture</span>
              <span class="rounded-full border border-lake/24 bg-lake/12 px-4 py-2 text-sm font-bold text-white">Lakes</span>
            </div>

            <div class="mt-9 flex flex-col gap-4 sm:flex-row">
              <button type="button" class="rounded-lg bg-lake px-8 py-4 text-base font-black text-white shadow-premium transition hover:-translate-y-1 hover:bg-white hover:text-night" @click="navigateTo('/packages')">
                Explore Packages
              </button>
              <button type="button" class="rounded-lg bg-white/12 px-8 py-4 text-base font-black text-white shadow-lift backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-night" @click="navigateTo('/contact')">
                Contact Us
              </button>
            </div>
          </div>

          <!-- <div class="rounded-lg border border-white/10 bg-black/52 p-6 shadow-premium backdrop-blur md:p-8">
            <div class="flex items-start justify-between gap-4">
              <span class="rounded-full border border-lake/40 bg-lake/16 px-4 py-2 text-sm font-black text-white">Premium</span>
              <span class="text-sm font-black uppercase tracking-[0.12em] text-white/50">Best Now</span>
            </div>
            <h2 class="mt-7 font-display text-4xl font-extrabold text-white">Gulmarg</h2>
            <p class="mt-3 text-lg font-black text-white/78">Alpine meadows, gondola views, and snow-season adventure</p>
            <div class="mt-6 flex flex-wrap items-center gap-2 text-sm font-black">
              <span class="text-gold">★★★★</span>
              <span class="text-white/35">★</span>
              <span>4.9</span>
              <span class="text-white/42">(4.2k)</span>
            </div>
            <p class="mt-7 text-sm font-black text-white/48">Popular experiences:</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white/72">Gondola Ride</span>
              <span class="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white/72">Snowmobile</span>
              <span class="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white/72">Ski Lessons</span>
            </div>
            <div class="mt-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-sm font-bold text-white/42">Starting from</p>
                <p class="mt-1 font-display text-4xl font-extrabold text-white">INR 18,500 <span class="text-base font-bold text-white/46">/person</span></p>
              </div>
              <button type="button" class="rounded-lg bg-lake px-6 py-3 text-sm font-black text-white shadow-lift hover:bg-white hover:text-night" @click="navigateTo('/packages/gulmarg-ski-and-gondola')">View Details</button>
            </div>
          </div> -->
        </div>
      </section>

      <section v-if="currentPage === 'about'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Why choose us?</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">More benefits for every Snow Feather guest.</h2>
          </div>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article class="premium-card rounded-lg p-5">
              <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">Personalized travel</p>
              <h3 class="mt-4 text-xl font-black text-night">Plans made for your route</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Family, honeymoon, group, luxury, and budget plans are shaped around travel dates, pace, and comfort.</p>
            </article>
            <article class="premium-card rounded-lg p-5">
              <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">Simple booking</p>
              <h3 class="mt-4 text-xl font-black text-night">Clear steps, no confusion</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Send traveler count and timing, receive a practical itinerary, confirm, and travel with support.</p>
            </article>
            <article class="premium-card rounded-lg p-5">
              <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">Exciting deals</p>
              <h3 class="mt-4 text-xl font-black text-night">Season-wise offers</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Get value-led options for winter snow, summer valleys, honeymoon stays, and premium circuits.</p>
            </article>
            <article class="premium-card rounded-lg p-5">
              <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">24/7 support</p>
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
            <div class="rounded-lg bg-white p-5 shadow-lift">
              <h3 class="text-xl font-black text-night">Holiday Packages</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Winter, summer, honeymoon, family, group, and custom Kashmir packages.</p>
            </div>
            <div class="rounded-lg bg-white p-5 shadow-lift">
              <h3 class="text-xl font-black text-night">Hotels & Houseboats</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Comfort hotels, premium stays, heated winter rooms, and houseboat options.</p>
            </div>
            <div class="rounded-lg bg-white p-5 shadow-lift">
              <h3 class="text-xl font-black text-night">Cab & Transfers</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Airport pickup, local sightseeing, intercity movement, and day-trip support.</p>
            </div>
            <div class="rounded-lg bg-white p-5 shadow-lift">
              <h3 class="text-xl font-black text-night">Adventure Activities</h3>
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
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'packageDetail' && detailPackage" class="bg-white py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.48fr]">
          <div>
            <h2 class="font-display text-3xl font-extrabold text-night sm:text-4xl">About This Package</h2>
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
              <p class="pb-1 text-lg font-bold text-night/45 line-through">₹{{ (detailPackage.price + detailSaveAmount).toLocaleString("en-IN") }}</p>
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
        v-if="currentPage === 'packages' || currentPage === 'about'"
        id="packages"
        class="bg-white pb-16"
        :class="currentPage === 'packages' ? 'min-h-screen pt-32' : 'pt-16'"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mx-auto mb-12 max-w-3xl text-center">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Tour Packages</p>
            <h2 class="mt-4 font-display text-4xl font-extrabold text-night sm:text-5xl">Featured Holiday Packages</h2>
            <p class="mt-4 text-base font-semibold leading-7 text-night/[0.62]">Handpicked Kashmir tour packages at practical prices. Book your dream vacation today.</p>
          </div>

          <div class="mb-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Package filters">
            <button v-for="filter in filters" :key="filter" class="rounded-lg border px-4 py-2 text-sm font-black capitalize" :class="activeFilter === filter ? 'border-lake bg-lake text-white' : 'border-night/[0.12] bg-white text-night hover:border-lake hover:text-lake'" @click="activeFilter = filter">
              {{ filter }}
            </button>
          </div>

          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="item in filteredPackages" :key="item.name" class="overflow-hidden rounded-lg bg-white shadow-premium">
              <div class="relative h-72 overflow-hidden">
                <div class="image-cover h-full transition duration-500 hover:scale-105" :style="{ backgroundImage: `linear-gradient(180deg, rgba(7, 24, 39, 0.02), rgba(7, 24, 39, 0.56)), url('${item.image}')` }"></div>
                <span class="absolute left-4 top-4 rounded-full bg-gold px-4 py-2 text-sm font-black text-night">{{ item.tag }}</span>
                <span class="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-night shadow-lift">{{ displayDuration(item.duration) }}</span>
              </div>

              <div class="p-6">
                <p class="text-sm font-semibold text-night/[0.58]">{{ packageRoute(item)[0] }} - {{ packageRoute(item)[1] }}</p>
                <h3 class="mt-3 font-display text-2xl font-extrabold text-night">{{ item.name }}</h3>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="chip in packageChips(item)" :key="`${item.name}-${chip}`" class="rounded-full bg-frost px-3 py-1 text-xs font-semibold text-night/[0.62]">{{ chip }}</span>
                </div>

                <div class="mt-5 border-t border-night/[0.08] pt-5">
                  <p class="text-sm font-semibold text-night/[0.58]">Starting From</p>
                  <div class="mt-2 flex flex-wrap items-end gap-3">
                    <p class="font-display text-3xl font-extrabold text-lake">INR {{ item.price.toLocaleString("en-IN") }}</p>
                    <p class="pb-1 text-base font-bold text-night/40 line-through">INR {{ packageOriginalPrice(item).toLocaleString("en-IN") }}</p>
                  </div>
                  <div class="mt-4 flex items-center justify-between gap-4">
                    <p class="text-xs font-semibold uppercase text-night/[0.52]">Taxes incl/person</p>
                    <button type="button" class="rounded-lg bg-lake px-5 py-3 text-sm font-black text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-night" @click="viewPackageDetails(item)">
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
            <article v-for="[title, text] in packageBenefits" :key="title" class="premium-card rounded-lg p-5">
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
            <article v-for="[season, months, text] in seasonalPlans" :key="season" class="premium-card rounded-lg p-5">
              <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">{{ months }}</p>
              <h3 class="mt-3 text-2xl font-black text-night">{{ season }}</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'destinations'" id="destinations" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-5xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Destinations</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Kashmir places guests can recognize from the photographs.</h2>
            <p class="mt-5 text-base font-semibold leading-8 text-night/[0.64]">Each destination now carries its own image, location cue, starting price, best season, activity fit, and clear planning notes so visitors understand what they are seeing and why it belongs in their itinerary.</p>
          </div>
          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="place in destinations" :key="place.name" class="destination-card group overflow-hidden rounded-lg">
              <div class="image-cover destination-card__media relative h-56" :style="imageStyle(place.image)">
                <div class="absolute inset-0 bg-gradient-to-t from-night/68 via-night/12 to-transparent"></div>
                <div class="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <p class="text-[11px] font-black uppercase tracking-[0.16em] text-gold">Location</p>
                    <h3 class="mt-1 font-display text-3xl font-extrabold leading-none text-white">{{ place.name }}</h3>
                  </div>
                  <span class="rounded bg-white/95 px-3 py-2 text-right text-[11px] font-black uppercase tracking-[0.1em] text-night">{{ place.season }}</span>
                </div>
              </div>
              <div class="destination-card__body p-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <p class="rounded bg-lake/[0.1] px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-lake">{{ place.price }}</p>
                  <p class="text-[11px] font-black uppercase tracking-[0.12em] text-night/42">Premium route</p>
                </div>
                <p class="mt-3 text-xs font-bold leading-5 text-night/52">{{ place.imageLabel }}</p>
                <p class="mt-3 text-sm font-black leading-6 text-night">{{ place.bestFor }}</p>
                <p class="mt-2 text-sm leading-6 text-night/[0.62]">{{ place.description }}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="detail in place.details.slice(0, 3)" :key="`${place.name}-${detail}`" class="rounded border border-night/[0.08] bg-frost px-3 py-2 text-xs font-bold leading-5 text-night/[0.62]">{{ detail }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'destinations'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-5xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Adventure & experiences</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Photographs, prices, and details for every major activity.</h2>
            <p class="mt-5 text-base font-semibold leading-8 text-night/[0.64]">Use these cards to sell trekking, camping, winter sport, summer adventure, leisure sightseeing, and heritage attractions with a relevant picture and practical inclusions.</p>
          </div>
          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="experience in adventureCategories" :key="experience.title" class="destination-card group overflow-hidden rounded-lg">
              <div class="image-cover destination-card__media relative h-56" :style="imageStyle(experience.image)">
                <div class="absolute inset-0 bg-gradient-to-t from-night/68 via-night/12 to-transparent"></div>
                <div class="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <p class="text-[11px] font-black uppercase tracking-[0.16em] text-gold">Experience</p>
                    <h3 class="mt-1 font-display text-2xl font-extrabold leading-tight text-white">{{ experience.title }}</h3>
                  </div>
                  <span class="rounded bg-white/95 px-3 py-2 text-right text-[11px] font-black uppercase tracking-[0.1em] text-night">{{ experience.price }}</span>
                </div>
              </div>
              <div class="destination-card__body p-4">
                <p class="text-xs font-bold leading-5 text-night/52">{{ experience.imageLabel }}</p>
                <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ experience.description }}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="place in experience.places.slice(0, 4)" :key="`${experience.title}-${place}`" class="rounded bg-lake/[0.1] px-3 py-2 text-xs font-black leading-5 text-lake">{{ place }}</span>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="item in experience.inclusions.slice(0, 2)" :key="`${experience.title}-${item}`" class="rounded border border-night/[0.08] bg-frost px-3 py-2 text-xs font-bold leading-5 text-night/[0.62]">{{ item }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'booking'" id="booking" class="min-h-screen bg-white pb-16 pt-32">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Booking system</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Select, price, pay, confirm.</h2>
            <div class="mt-6 grid gap-3 text-sm font-black">
              <span class="rounded-lg bg-frost p-4 shadow-lift">Home -> Select Package</span>
              <span class="rounded-lg bg-frost p-4 shadow-lift">View Details -> Choose Date</span>
              <span class="rounded-lg bg-frost p-4 shadow-lift">Add Travelers -> Payment</span>
            </div>
          </div>

          <form class="premium-card rounded-lg p-5">
            <div class="grid gap-4 md:grid-cols-2">
              <label class="grid gap-2 text-sm font-bold">Package
                <select v-model="selectedPackage" class="rounded-lg border border-night/10 px-3 py-3">
                  <option v-for="item in packages" :key="item.name" :value="item.price">{{ item.name }}</option>
                </select>
              </label>
              <label class="grid gap-2 text-sm font-bold">Travel date
                <input type="date" class="rounded-lg border border-night/10 px-3 py-3" />
              </label>
              <label class="grid gap-2 text-sm font-bold">Travelers
                <input v-model.number="travelers" type="number" min="1" class="rounded-lg border border-night/10 px-3 py-3" />
              </label>
              <label class="grid gap-2 text-sm font-bold">Pricing class
                <select v-model.number="priceClass" class="rounded-lg border border-night/10 px-3 py-3">
                  <option :value="1">Standard</option>
                  <option :value="1.25">Deluxe</option>
                  <option :value="1.65">Luxury</option>
                </select>
              </label>
              <label class="grid gap-2 text-sm font-bold md:col-span-2">Customer details
                <input type="text" placeholder="Name, email, phone" class="rounded-lg border border-night/10 px-3 py-3" />
              </label>
            </div>

            <div class="mt-5 rounded-lg bg-frost p-4">
              <div class="flex items-center justify-between gap-3"><p class="text-sm font-black text-night/60">Estimated total</p><p class="text-3xl font-black text-night">{{ bookingTotal }}</p></div>
            </div>

            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              <button type="button" class="rounded-lg bg-night px-5 py-3 text-sm font-black text-white hover:bg-alpine" @click="choosePayment('Razorpay')">Razorpay</button>
              <button type="button" class="rounded-lg border border-night/[0.12] px-5 py-3 text-sm font-black text-night hover:border-lake hover:text-lake" @click="choosePayment('Stripe')">Stripe</button>
              <button type="button" class="rounded-lg border border-night/[0.12] px-5 py-3 text-sm font-black text-night hover:border-lake hover:text-lake" @click="choosePayment('UPI')">UPI</button>
            </div>

            <div v-if="selectedPaymentMethod" class="mt-4 rounded-lg border border-lake/[0.22] bg-lake/[0.08] p-4 text-sm font-semibold leading-6 text-night">
              {{ selectedPaymentMethod }} selected for {{ bookingTotal }}.
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
            <article v-for="[step, title, text] in bookingSteps" :key="step" class="premium-card rounded-lg p-5">
              <p class="text-3xl font-black text-lake">{{ step }}</p>
              <h3 class="mt-4 text-xl font-black text-night">{{ title }}</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'booking'" class="bg-white py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Payment options</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Advance, balance, and confirmation details stay clear.</h2>
            <p class="mt-5 text-base leading-7 text-night/[0.62]">Use this page to explain advance amount, cancellation notes, pickup timing, guest details, and what the team sends after payment.</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-lg bg-frost p-5 shadow-lift"><p class="text-2xl font-black text-night">UPI</p><p class="mt-2 text-sm leading-6 text-night/[0.62]">Instant domestic advance collection.</p></div>
            <div class="rounded-lg bg-frost p-5 shadow-lift"><p class="text-2xl font-black text-night">Card</p><p class="mt-2 text-sm leading-6 text-night/[0.62]">Razorpay or Stripe ready layout.</p></div>
            <div class="rounded-lg bg-frost p-5 shadow-lift"><p class="text-2xl font-black text-night">Manual</p><p class="mt-2 text-sm leading-6 text-night/[0.62]">Offline confirmation and invoice support.</p></div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" id="gallery" class="section-band py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Media gallery</p>
            <h2 class="mt-2 font-display text-3xl font-extrabold leading-tight text-night sm:text-4xl lg:text-5xl">Instagram, video, snowfall, and drone ready layout.</h2>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="(galleryImage, index) in homeGalleryImages" :key="`${galleryImage}-${index}`" class="image-cover h-64 rounded-lg shadow-lift" :style="imageStyle(galleryImage)"></div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'gallery'" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Gallery</p>
            <h1 class="mt-2 font-display text-4xl font-extrabold leading-tight text-night sm:text-6xl">Kashmir moments from snow peaks to quiet lake mornings.</h1>
            <p class="mt-5 max-w-2xl text-base font-semibold leading-8 text-night/[0.64]">Browse destination albums, seasonal travel moods, guest-style photo ideas, and the kind of scenes Snow Feather can plan into your Kashmir journey.</p>
            <div class="mt-7 flex flex-wrap gap-3">
              <button type="button" class="rounded-lg bg-night px-6 py-3 text-sm font-black text-white shadow-lift hover:bg-lake" @click="navigateTo('/booking')">Plan Photo Trip</button>
              <button type="button" class="rounded-lg border border-night/[0.12] bg-white px-6 py-3 text-sm font-black text-night hover:border-lake hover:text-lake" @click="navigateTo('/contact')">Ask For Albums</button>
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="image-cover h-80 rounded-lg sm:col-span-2 lg:h-[28rem]" :style="imageStyle('image23')"></div>
            <div class="premium-card rounded-lg p-5">
              <p class="text-3xl font-black text-lake">23+</p>
              <p class="mt-2 text-sm font-bold leading-6 text-night/[0.62]">Kashmir visuals ready for destination and package storytelling.</p>
            </div>
            <div class="premium-card rounded-lg p-5">
              <p class="text-3xl font-black text-lake">4 seasons</p>
              <p class="mt-2 text-sm font-bold leading-6 text-night/[0.62]">Snow, gardens, meadows, lakes, autumn colors, and honeymoon frames.</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'gallery'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Photo collections</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Albums for every kind of Kashmir traveler.</h2>
          </div>
          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <article v-for="[title, imageName, text] in galleryCollections" :key="title" class="premium-card overflow-hidden rounded-lg">
              <div class="image-cover h-64" :style="imageStyle(imageName)"></div>
              <div class="p-5">
                <h3 class="text-2xl font-black text-night">{{ title }}</h3>
                <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'gallery'" class="section-band py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-4xl">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Full gallery</p>
              <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Explore the current website gallery.</h2>
            </div>
            <button type="button" class="rounded-lg bg-night px-6 py-3 text-sm font-black text-white hover:bg-lake" @click="navigateTo('/packages')">View Packages</button>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="(galleryImage, index) in displayGalleryImages" :key="`gallery-page-${galleryImage}-${index}`" class="image-cover h-72 rounded-lg shadow-lift" :class="index === 0 || index === 7 ? 'lg:col-span-2' : ''" :style="imageStyle(galleryImage)"></div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'gallery'" class="bg-night py-16 text-white">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Travel media</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-white sm:text-5xl">Use the gallery to choose your mood before you book.</h2>
            <p class="mt-5 text-base font-semibold leading-8 text-white/70">Some guests want snow adventure, some want lake sunsets, and some need relaxed family photographs. The gallery helps match the right route to the right feeling.</p>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <article v-for="[title, text] in galleryHighlights" :key="title" class="rounded-lg bg-white/10 p-5">
              <h3 class="text-xl font-black text-white">{{ title }}</h3>
              <p class="mt-3 text-sm leading-6 text-white/70">{{ text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'blog'" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Blog</p>
            <h1 class="mt-2 font-display text-4xl font-extrabold leading-tight text-night sm:text-6xl">Kashmir travel advice before you pack your bags.</h1>
            <p class="mt-5 max-w-2xl text-base font-semibold leading-8 text-night/[0.64]">Read practical planning notes for snowfall trips, family holidays, honeymoon pacing, houseboat stays, local movement, and booking confidence.</p>
            <div class="mt-7 flex flex-wrap gap-3">
              <button type="button" class="rounded-lg bg-night px-6 py-3 text-sm font-black text-white shadow-lift hover:bg-lake" @click="navigateTo('/packages')">Explore Packages</button>
              <button type="button" class="rounded-lg border border-night/[0.12] bg-white px-6 py-3 text-sm font-black text-night hover:border-lake hover:text-lake" @click="navigateTo('/contact')">Ask A Question</button>
            </div>
          </div>
          <div class="premium-card overflow-hidden rounded-lg">
            <div class="image-cover h-[30rem]" :style="imageStyle('image18')"></div>
            <div class="p-5">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Featured guide</p>
              <h2 class="mt-2 text-3xl font-black text-night">How to build a balanced Kashmir itinerary.</h2>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">Start with Srinagar, add one snow or valley day, keep travel time realistic, and leave space for weather, photos, shopping, and rest.</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'blog'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Latest posts</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Helpful reads for smoother Kashmir holidays.</h2>
          </div>
          <div class="grid gap-5 lg:grid-cols-3">
            <article v-for="post in blogPosts" :key="post.title" class="premium-card overflow-hidden rounded-lg">
              <div class="image-cover h-64" :style="imageStyle(post.image)"></div>
              <div class="p-5">
                <p class="text-xs font-black uppercase tracking-[0.18em] text-lake">{{ post.date }}</p>
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
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Planner notes</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Quick guides guests ask for most.</h2>
            <p class="mt-5 text-base font-semibold leading-8 text-night/[0.64]">Use these notes as a starting point, then send your dates, traveler count, and preferred comfort level for a custom plan.</p>
            <div class="image-cover mt-8 h-72 rounded-lg shadow-lift lg:h-[26rem]" :style="imageStyle('image19')"></div>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <article v-for="[title, text] in blogGuides" :key="title" class="premium-card rounded-lg p-5">
              <h3 class="text-xl font-black text-night">{{ title }}</h3>
              <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'blog'" class="bg-night py-16 text-white">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3">
          <div class="lg:col-span-1">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Before you travel</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-white">A clear checklist beats last-minute rush.</h2>
          </div>
          <div class="grid gap-4 md:grid-cols-3 lg:col-span-2">
            <div class="rounded-lg bg-white/10 p-5">
              <p class="text-3xl font-black text-gold">01</p>
              <h3 class="mt-4 text-xl font-black">Send details</h3>
              <p class="mt-3 text-sm leading-6 text-white/70">Confirm arrival, departure, room needs, and must-see places.</p>
            </div>
            <div class="rounded-lg bg-white/10 p-5">
              <p class="text-3xl font-black text-gold">02</p>
              <h3 class="mt-4 text-xl font-black">Choose route</h3>
              <p class="mt-3 text-sm leading-6 text-white/70">Balance sightseeing, activities, drive time, and weather buffers.</p>
            </div>
            <div class="rounded-lg bg-white/10 p-5">
              <p class="text-3xl font-black text-gold">03</p>
              <h3 class="mt-4 text-xl font-black">Book support</h3>
              <p class="mt-3 text-sm leading-6 text-white/70">Lock hotels, cab, activity coordination, and on-trip assistance.</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'contact'" id="contact" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Contact</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Instant inquiry, emergency support, and WhatsApp booking.</h2>
            <div class="mt-6 grid gap-3 text-sm font-bold text-night/[0.68]">
              <p class="rounded-lg bg-white p-4">Phone: +91 9055020408</p>
              <p class="rounded-lg bg-white p-4">Email: snowfeatheradventures@gmail.com</p>
              <p class="rounded-lg bg-white p-4">
                Address: Karra Building<br />
                Court Road, Lal chowk<br />
                Srinagar, 190001<br />
                Jammu and Kashmir
              </p>
              <p class="rounded-lg bg-white p-4">Emergency Support: 24/7 during active trips</p>
            </div>
          </div>
          <form class="premium-card rounded-lg p-5">
            <div class="grid gap-4 md:grid-cols-2">
              <input type="text" placeholder="Full name" class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold" />
              <input type="tel" placeholder="Phone / WhatsApp" class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold" />
              <input type="email" placeholder="Email" class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold" />
              <select class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold"><option>Winter Package</option><option>Summer Package</option><option>Honeymoon Package</option><option>Custom Package</option></select>
              <textarea placeholder="Tell us your dates, travelers, budget, and preferred destinations" class="min-h-36 rounded-lg border border-night/10 px-4 py-3 text-sm font-bold md:col-span-2"></textarea>
            </div>
            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" class="rounded-lg bg-night px-5 py-3 text-sm font-black text-white hover:bg-alpine">Send Inquiry</button>
              <a href="https://wa.me/919055020408?text=I%20want%20to%20book%20a%20Kashmir%20tour" class="rounded-lg border border-night/[0.12] px-5 py-3 text-center text-sm font-black text-night hover:border-lake hover:text-lake">WhatsApp Live Chat</a>
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
            <article v-for="[title, text] in supportCards" :key="title" class="premium-card rounded-lg p-5">
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
            <div class="border-b border-night/10 bg-white p-4 text-sm font-bold leading-6 text-night">
              <p class="text-xs font-black uppercase tracking-[0.16em] text-lake">Office address</p>
              <p class="mt-2">Karra Building, Court Road, Lal chowk, Srinagar, 190001, Jammu and Kashmir</p>
            </div>
            <iframe title="Snow Feather office map" class="h-[32rem] w-full" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Karra%20Building%2C%20Court%20Road%2C%20Lal%20chowk%2C%20Srinagar%2C%20190001%2C%20Jammu%20and%20Kashmir&output=embed"></iframe>
          </div>
        </div>
      </section>
    </main>

    <footer class="bg-night px-4 py-14 text-white sm:px-6 lg:py-20">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 xl:grid-cols-[1.15fr_0.9fr_0.9fr_1.15fr]">
          <div>
            <button type="button" class="inline-flex items-center gap-3 text-left" @click="navigateTo('/')">
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
              <a href="https://www.instagram.com/" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm font-black text-white hover:bg-lake" aria-label="Instagram">IG</a>
              <a href="https://www.facebook.com/" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm font-black text-white hover:bg-lake" aria-label="Facebook">FB</a>
              <a href="https://wa.me/919055020408?text=I%20want%20to%20book%20a%20Kashmir%20tour" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm font-black text-white hover:bg-lake" aria-label="WhatsApp">WA</a>
              <a href="mailto:snowfeatheradventures@gmail.com" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm font-black text-white hover:bg-lake" aria-label="Email">ML</a>
            </div>
          </div>

          <div>
            <h2 class="font-display text-2xl font-extrabold text-lake">Services</h2>
            <div class="mt-6 grid gap-3 text-base font-semibold text-white/78">
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/packages')">Holiday Packages</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/destinations')">Hotels</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/booking')">Booking</button>
            </div>
          </div>

          <div>
            <h2 class="font-display text-2xl font-extrabold text-lake">Quick Links</h2>
            <div class="mt-6 grid gap-3 text-base font-semibold text-white/78">
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/about')">About Us</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/packages')">All Packages</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/booking')">My Bookings</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/contact')">Privacy Policy</button>
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/contact')">Terms of Service</button>
            </div>
          </div>

          <div>
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
          </div>
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
