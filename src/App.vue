<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

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

const brandName = "Snow Feather Adventures";
const brandTagline = "Tours & Travels Kashmir";
const logoSrc = "/snow-feather-adventures-logo-v2.png";
const phoneDisplay = "+91 90550 20408";
const phoneTel = "tel:+919055020408";
const whatsappBase = "https://wa.me/919055020408";

function whatsappLink(message = "") {
  return message ? `${whatsappBase}?text=${encodeURIComponent(message)}` : whatsappBase;
}

const kashmirWebImages = {
  gulmarg: "/kashmir-gulmarg-vibrant-v2.png",
  sonmarg: image("image11"),
  pahalgam: "/kashmir-pahalgam-vibrant-v2.png",
  dalLake: "/kashmir-dal-lake-vibrant-v2.png",
  gurez: image("image06"),
  yusmarg: image("image03"),
  doodhpathri: image("image05"),
  leh: image("image18"),
  wular: image("image09"),
};

function loadStoredValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

const navItems = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Packages", "/packages"],
  ["Honeymoon", "/honeymoon-packages"],
  ["Destinations", "/destinations"],
];

const moreMenuItems = [
  ["Gallery", "/gallery"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];

const publicRoutes = {
  "/": "home",
  "/about": "about",
  "/packages": "packages",
  "/honeymoon-packages": "packages",
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
  if (cleanPath === "/home") return "/";
  if (cleanPath === "/admin/login") return cleanPath;
  if (cleanPath.startsWith("/packages/") && cleanPath.split("/").length === 3) return cleanPath;
  return publicRoutes[cleanPath] ? cleanPath : "/";
}

const currentPath = ref(normalizePath(window.location.pathname));
const isAdminRoute = computed(() => currentPath.value === "/admin/login");
const isMenuOpen = ref(false);
const isMoreMenuOpen = ref(false);
const isInitialLoading = ref(true);
const isTripPlannerOpen = ref(false);
const tripPlannerMode = ref("plan");
const isCallbackOpen = ref(false);
const activeExperience = ref("All");
const activeJourneyMoment = ref(0);
const activeFilter = ref("all");
const activeGalleryFilter = ref("All");
const galleryLightboxImage = ref(null);
const activePriceRange = ref("all");
const activeAdminTab = ref("packages");
const openFaqs = ref([0]);
const currentPage = computed(() => (currentPath.value.startsWith("/packages/") ? "packageDetail" : publicRoutes[currentPath.value] || "home"));
let initialLoadingTimeout = null;

const defaultSiteContent = {
  heroBadge: "Born in Kashmir · Guided by locals",
  heroTitle: "Discover The Soul Of Kashmir",
  heroSubtitle:
    "Premium adventures, hidden valleys, luxury stays, and unforgettable Kashmir journeys designed by local travel experts.",
  homeActivitiesEyebrow: "Featured activities",
  homeActivitiesTitle: "Kashmir adventure, snow, lake, and mountain experiences.",
  homeGalleryEyebrow: "Media gallery",
  homeGalleryTitle: "Instagram, video, snowfall, and drone ready layout.",
  packagesHeroEyebrow: "Tour Packages",
  packagesHeroTitle: "Clear Kashmir Packages With Real Price Tiers",
  packagesHeroText:
    "Compare Standard, Premium, Luxurious, and VIP options with destinations, day-wise route ideas, inclusions, and starting prices. Final quotes depend on travel dates, hotel inventory, cab type, and seasonal activity rates.",
  destinationsHeroEyebrow: "Destinations",
  destinationsHeroTitle: "The Kashmir places travelers expect to see.",
  bookingHeroEyebrow: "Booking system",
  bookingHeroTitle: "Select, price, pay, confirm.",
  galleryHeroEyebrow: "Gallery",
  galleryHeroTitle: "Kashmir moments from snow peaks to quiet lake mornings.",
  galleryHeroText:
    "Browse destination albums, seasonal travel moods, guest-style photo ideas, and the kind of scenes Snow Feather Adventures can plan into your Kashmir journey.",
  galleryHeroImage: "image23",
  galleryStatOneValue: "40+",
  galleryStatOneText: "New Kashmir destination and experience photographs available in the gallery.",
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
  contactPhone: phoneDisplay,
  contactEmail: "snowfeatheradventures@gmail.com",
  contactAddress: "Karra Building, Court Road, Lal chowk, Srinagar, 190001, Jammu and Kashmir",
  contactSupport: "24/7 during active trips",
  experienceLine: "25+ Years Across Kashmir Tourism, Skiing, Mountaineering, Trekking & Adventure",
  trustPromise: "No hidden charges. No false promises. No cheating—only transparent pricing and genuine local expertise.",
  mapQuery: "Karra Building Court Road Lal Chowk Srinagar Kashmir",
  googleRecaptchaSiteKey: "",
};

const storedSiteContent = loadStoredValue("kashmir-site-content-v4", defaultSiteContent);
const siteContent = ref({
  ...defaultSiteContent,
  ...storedSiteContent,
  heroBadge:
    storedSiteContent.heroBadge === "30+ Years of Excellence in Tourism, Adventure, Skiing & Hospitality"
      ? defaultSiteContent.heroBadge
      : storedSiteContent.heroBadge,
  heroTitle:
    storedSiteContent.heroTitle === "Discover the soul of Kashmir"
      ? defaultSiteContent.heroTitle
      : storedSiteContent.heroTitle,
  heroSubtitle:
    storedSiteContent.heroSubtitle === "Snow adventures, hidden valleys, luxury stays, and unforgettable memories—crafted around the way you want to feel."
      ? defaultSiteContent.heroSubtitle
      : storedSiteContent.heroSubtitle,
  experienceLine:
    storedSiteContent.experienceLine === "Creating Unforgettable Kashmir Experiences Since 30 Years"
      ? defaultSiteContent.experienceLine
      : storedSiteContent.experienceLine,
  contactPhone: phoneDisplay,
});

const premiumStructureDate = "June 2026";
const premiumSourceNote =
  "Indicative Snow Feather Adventures Kashmir package structure. Final rates are confirmed after checking travel dates, hotel availability, cab category, room sharing, destination access, Gondola/activity tickets, and seasonal winter demand.";

const packageCategories = [
  ["Standard", "Value stays", "Clean hotels or guest houses, private/shared cab planning, key sightseeing, and essential support."],
  ["Premium", "Comfort hotels", "Better hotel locations, private cab, selected activities, smoother pacing, and stronger on-trip support."],
  ["Luxurious", "4-star / boutique", "Premium rooms, houseboat or resort upgrades, private experiences, and curated photography stops."],
  ["VIP", "Top-tier custom", "Best available stays, dedicated concierge, luxury cab, flexible routing, and priority coordination."],
];

const roomSharingOptions = [
  ["Standard Sharing", "02 persons / room"],
  ["Triple Sharing", "03 persons / room"],
  ["Private Room", "Private occupancy"],
];

const hotelCategories = [
  ["Standard", "Guest House / Standard Hotel"],
  ["Premium", "3 Star / Better Located Hotels"],
  ["Luxurious", "4 Star / Boutique / Premium Houseboat"],
  ["VIP", "5 Star / Best Available Resorts"],
];

const trustMessages = [
  "Transparent Pricing - No Hidden Charges",
  "Professionally Managed Kashmir Travel Company",
  "Experienced Local Team With Safety Commitment",
  "Your Journey, Our Responsibility",
  "We Believe In Commitment, Safety & Genuine Hospitality - Not False Promises.",
  "Adventure Without Fear. Travel Without Doubt.",
];

const defaultRegistrationDetails = [
  ["UDYAM Registration", "UDYAM-JK-21-0096543"],
  ["GSTIN", "01AFYFS1763F1ZS"],
  ["Office", "Lal Chowk, Srinagar"],
];
const registrationDetails = ref(loadStoredValue("kashmir-registration-details", defaultRegistrationDetails));

const winterPricingNote =
  "During peak winter season in Gulmarg and Sonmarg, skiing, accommodation, transportation, and adventure activity prices increase significantly due to heavy tourist demand, snow conditions, equipment logistics, and limited premium availability.";

const premiumFeatureImages = ["image08", "image10", "image19"];

const defaultPurposeCards = [
  {
    label: "Our Vision",
    title: "To make Kashmir travel clear, trusted, and unforgettable.",
    text:
      "Snow Feather Adventures aims to become a trusted Kashmir tourism company for travelers who want beautiful places, honest guidance, comfortable stays, and reliable local support from inquiry to return.",
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
const purposeCards = ref(loadStoredValue("kashmir-purpose-cards", defaultPurposeCards));

const defaultExperienceStats = [
  ["25+", "Years of Experience"],
  ["10,000+", "Happy Guests"],
  ["500+", "Successful Tours"],
  ["24/7", "Guest Support"],
];
const experienceStats = ref(
  loadStoredValue("kashmir-experience-stats", defaultExperienceStats).map(([value, label]) =>
    value === "30+" && label === "Years Experience" ? ["25+", "Years of Experience"] : [value, label],
  ),
);

const defaultAccommodationCategories = [
  {
    name: "Standard",
    tagline: "Comfortable & affordable",
    price: "From INR 2,500 / night",
    image: image("image21"),
    features: ["Clean verified rooms", "Breakfast options", "Convenient locations", "Trip support"],
  },
  {
    name: "Premier",
    tagline: "Enhanced comfort",
    price: "From INR 4,500 / night",
    image: image("image04"),
    features: ["Premium facilities", "Better room views", "Heated winter options", "Priority assistance"],
  },
  {
    name: "Luxury",
    tagline: "Elegant Kashmir stays",
    price: "From INR 8,500 / night",
    image: image("image22"),
    features: ["Boutique hotels", "Premium houseboats", "Superior service", "Curated dining"],
  },
  {
    name: "VIP",
    tagline: "Exclusive & personalized",
    price: "Custom quotation",
    image: image("image14"),
    features: ["Best available resorts", "Luxury transport", "Private experiences", "Dedicated concierge"],
  },
];
const accommodationCategories = ref(loadStoredValue("kashmir-accommodation-categories", defaultAccommodationCategories));

const defaultServiceGroups = [
  {
    number: "01",
    title: "Tours",
    text: "Personalized Kashmir journeys designed for every kind of traveler.",
    items: ["Family Tours", "Honeymoon Tours", "Group Tours", "Corporate Tours", "Educational Tours"],
  },
  {
    number: "02",
    title: "Adventure",
    text: "Local specialists, realistic planning, safety guidance, and reliable equipment support.",
    items: ["Skiing", "Snowboarding", "Trekking", "Camping", "Mountaineering", "River Rafting", "Nature Exploration"],
  },
  {
    number: "03",
    title: "Transportation",
    text: "Comfortable movement throughout Kashmir with locally coordinated drivers.",
    items: ["Airport Transfers", "Private Vehicles", "Luxury Transport", "Group Transportation"],
  },
];
const serviceGroups = ref(loadStoredValue("kashmir-service-groups", defaultServiceGroups));

const defaultTrustGuarantees = [
  "25+ Years of Experience",
  "Honest Pricing",
  "No Hidden Charges",
  "Dedicated Support",
  "Professional Team",
  "Comfortable Accommodation",
  "Customized Packages",
  "Adventure Experts",
  "Safe & Secure Travel",
  "Local Knowledge & Expertise",
];
const trustGuarantees = ref(
  loadStoredValue("kashmir-trust-guarantees", defaultTrustGuarantees).map((item) =>
    item === "30 Years Experience" ? "25+ Years of Experience" : item,
  ),
);

const defaultTestimonials = [
  {
    name: "Aarav & Meera",
    trip: "Kashmir Honeymoon",
    rating: "5.0",
    location: "Delhi",
    text: "Everything was clearly explained before our arrival. The hotels, private cab, houseboat, and Gulmarg day were beautifully coordinated.",
    image: image("image14"),
  },
  {
    name: "The Sharma Family",
    trip: "Family Kashmir Circuit",
    rating: "4.9",
    location: "Mumbai",
    text: "The itinerary never felt rushed. The team stayed in contact throughout and handled weather changes with honesty and professionalism.",
    image: image("image21"),
  },
  {
    name: "Adventure Group",
    trip: "Gulmarg Ski Experience",
    rating: "5.0",
    location: "Bengaluru",
    text: "Excellent local instructors, proper equipment guidance, and transparent activity costs. A very dependable adventure team.",
    image: image("image15"),
  },
];
const testimonials = ref(loadStoredValue("kashmir-testimonials", defaultTestimonials));

const reviewForm = ref({ name: "", location: "", rating: "5.0", trip: "", text: "", image: "" });
const reviewFormStatus = ref("");

const reservationInfoCards = [
  ["Calendar", "Reserve 1 month ahead", "For standard and regular Kashmir packages, guests should reserve at least one month in advance."],
  ["Hotel", "Better stays", "Early confirmation helps secure better hotels, houseboats, room views, and service quality."],
  ["Car", "Smoother transport", "Cab category, route timing, activity access, and transfers can be planned more reliably."],
  ["Guide", "Local support", "Guide assistance, food coordination, and on-trip support improve with earlier planning."],
];

const winterReservationInfoCards = [
  ["Snowflake", "Reserve 2 months ahead", "Winter packages should be reserved at least two months in advance due to high seasonal demand."],
  ["Calendar", "Seasonal access", "Snowfall, Gondola demand, road conditions, and hotel inventory change quickly in peak winter."],
  ["Hotel", "Priority quality", "Early reservation helps secure better hotels, transport arrangements, guides, snow activities, and services."],
];

const summerReservationInfoCards = [
  ["Sun", "Summer planning", "Summer packages should be reserved early because May to September brings high demand for Pahalgam, Sonmarg, Gurez, camping, trekking, and meadow routes."],
  ["Route", "Route access", "Early planning helps confirm road access, local stays, cab timing, activity slots, and realistic travel pacing."],
];

const detailSectionNav = [
  ["Overview", "package-overview"],
  ["Itinerary", "package-itinerary"],
  ["Inclusions", "package-inclusions"],
  ["Exclusions", "package-exclusions"],
  ["Accommodation", "package-accommodation"],
  ["Meals", "package-meals"],
  ["Transport", "package-transportation"],
  ["Sightseeing", "package-sightseeing"],
  ["Activities", "package-activities"],
  ["Guide", "package-guide-services"],
  ["Pricing", "package-pricing"],
  ["Reviews", "package-reviews"],
  ["FAQ", "package-faq"],
  ["Book", "package-book"],
];

const detailServiceSections = [
  ["package-accommodation", "Accommodation", "Hotel category can be Standard, Premium, Luxurious, or VIP depending on comfort preference."],
  ["package-meals", "Meal Plan", "Breakfast, dinner, or custom meal plans are confirmed in the final itinerary."],
  ["package-transportation", "Transportation", "Sedan, Innova, Tempo Traveller, or luxury cab options can be matched to group size."],
  ["package-sightseeing", "Sightseeing", "Dal Lake, gardens, valleys, snow points, and route stops are planned as applicable."],
  ["package-activities", "Activities", "Shikara, Gondola, skiing, camping, trekking, photography, and local experiences can be added."],
  ["package-guide-services", "Guide Services", "Local guide or activity instructor support is arranged where applicable."],
];

const packageInclusions = [
  "Accommodation",
  "Meal plan as mentioned",
  "Transportation",
  "Sightseeing tours",
  "Activities as per itinerary",
  "Guide services where applicable",
  "Travel assistance",
  "Support during trip",
];

const packageExclusions = [
  "Flight or train tickets",
  "Personal expenses",
  "Entry tickets unless mentioned",
  "Additional activities",
  "Travel insurance",
  "Anything not mentioned in inclusions",
];

function defaultPackageInclusionsFor(item = {}) {
  const winter = packageIsWinter(item);
  return [
    "Accommodation as per selected category",
    "Meal plan as confirmed in final itinerary",
    "Transportation for planned route",
    "Sightseeing support",
    winter ? "Snow activity coordination where applicable" : "Activity coordination where applicable",
    "Local travel assistance",
    "On-trip support",
  ];
}

function defaultPackageExclusionsFor() {
  return [
    "Flight or train tickets",
    "Personal expenses",
    "Entry tickets unless mentioned",
    "Additional activities",
    "Travel insurance",
    "Anything not mentioned in inclusions",
  ];
}

function defaultPackageServicesFor(item = {}) {
  return {
    accommodation: item.accommodation || "Hotel category can be Standard, Premium, Luxurious, or VIP depending on comfort preference.",
    meals: item.meals || "Breakfast, dinner, or custom meal plans are confirmed in the final itinerary.",
    transportation: item.transportation || "Sedan, Innova, Tempo Traveller, or luxury cab options can be matched to group size.",
    activities: item.activities || "Shikara, Gondola, skiing, camping, trekking, photography, and local experiences can be added.",
    guide: item.guideServices || "Local guide or activity instructor support is arranged where applicable.",
  };
}

const packageFaqs = [
  ["Can the package be customized?", "Yes. Hotel category, cab type, route, meal plan, activities, and pace can be adjusted after we understand your travel month, group size, and comfort preference."],
  ["Are prices final?", "Prices shown are starting estimates. Final pricing depends on season, hotel availability, transportation, activity tickets, customization, and number of travelers."],
  ["How early should we reserve?", "Standard and regular packages should be reserved at least one month in advance. Winter packages should be reserved at least two months in advance due to high seasonal demand. Summer routes should also be planned early for better hotel, cab, and activity availability."],
  ["Can I ask questions before reserving?", "Yes. Use Ask a Question or WhatsApp to confirm route details, inclusions, exclusions, and availability before making a booking decision."],
];

const defaultMentors = [
  {
    name: "Mr. Shabir Ahmad Wani",
    role: "Mentor & Chief Advisor",
    credentials: "Olympic Coach | Master of Winter Games | Adventure Sports Expert",
    image: "/shabir-img.jpeg",
    quote: "International experience, technical excellence, and leadership dedicated to safer, world-class adventure.",
    bio:
      "Mr. Shabir Ahmad Wani is a highly respected Olympic Coach, renowned Skiing and Mountaineering Instructor, and one of India's most accomplished figures in adventure sports and winter games. Known for his exceptional skill, dedication, and leadership, he has represented India at numerous international events and programs across the world, earning recognition and respect within the global adventure sports community.\n\nWith decades of experience in outdoor leadership, athlete development, and adventure education, he has trained, mentored, and guided hundreds of national and international skiers, athletes, and outdoor enthusiasts, inspiring generations to pursue excellence in sports and adventure.\n\nAs Mentor and Chief Advisor to Snow Feather Adventures Tours & Travels, he provides invaluable guidance, expertise, and vision, helping us uphold the highest standards of safety, professionalism, and operational excellence. His leadership continues to shape our adventure programs and strengthen our commitment to delivering world-class outdoor experiences.\n\nHis association with our organization is a source of pride, inspiration, and excellence.",
  },
  {
    name: "Mr. Mushtaq Ahmad Wani",
    role: "Chief Expert Advisor, Mentor & Guide",
    credentials: 'Popularly Known as "Mushtaq Kachoru" | Adventure Sports Pioneer',
    image: "/mushtaq-img.jpeg",
    quote: "A living legend of adventure sports whose legacy inspires explorers, mountaineers, and skiers across the Himalayas.",
    bio:
      "Snow Feather Adventures Tours & Travels is immensely proud to be guided by one of the most respected and legendary figures in the history of adventure sports in Jammu & Kashmir, Mr. Mushtaq Ahmad Wani, affectionately known throughout the sports fraternity as “Mushtaq Kachoru.”\n\nA pioneer, mentor, and visionary, Mr. Wani is widely recognized as one of the founding personalities responsible for introducing, developing, and promoting adventure sports in Jammu & Kashmir. He is a Founder Member of the Jammu & Kashmir Mountaineering Club and has devoted more than three decades of his life to the advancement of mountaineering, skiing, trekking, water sports, and outdoor education.\n\nAmong the earliest batches trained at the prestigious Mountaineering & Skiing Institute (MOI), he successfully completed professional courses in Skiing, Mountaineering, Water Skiing, Swimming, Para-Sailing, and Adventure Leadership. Throughout his remarkable career, he represented Jammu & Kashmir and India in numerous national and international adventure expeditions, competitions, and training programs, including prestigious events across Europe and France.\n\nMr. Wani has successfully summited many of the highest and most challenging peaks of Jammu & Kashmir and has played a pivotal role in shaping generations of adventure enthusiasts. During his distinguished service with the Department of Youth Services & Sports, where he served for over 30 years as the officer in charge of Adventure Sports and Winter Sports, he trained and mentored thousands of students, many of whom went on to achieve national and international recognition.\n\nKnown for his honesty, dedication, professionalism, and selfless commitment to youth development, Mr. Wani also had the distinction of serving as one of India's pioneering Adventure Liaison Officers, coordinating and supporting international adventure groups and foreign expeditions visiting the region.\n\nToday, Snow Feather Adventures Tours & Travels is honored to have Mr. Mushtaq Ahmad Wani as our Chief Expert Advisor, Mentor, and Guide. His unmatched experience, wisdom, and lifelong contribution to adventure sports continue to inspire our team and ensure the highest standards of safety, professionalism, and excellence in every expedition we undertake.",
  },
  {
    name: "Mr. Gul Mustafa Dev",
    role: "Senior Skiing Instructor & Technical Advisor",
    credentials: "India's First Winter Olympian | Asian Coach | Olympic Team Leader",
    image: "/gul-mustafa-img.jpeg",
    quote: "A true icon of Indian skiing whose legacy continues to inspire athletes and adventurers across generations.",
    bio:
      "Mr. Gul Mustafa Dev is one of India's most celebrated skiing legends and a pioneering figure in winter sports. A multiple-time National Skiing Champion, accomplished Racing Skier, and India's First Winter Olympian, he has dedicated his life to the promotion and development of skiing and winter sports at both national and international levels.\n\nRecognized for his exceptional achievements, leadership, and coaching excellence, he has represented India on prestigious international platforms and has served as an Asian and Olympic Coach, mentoring and inspiring generations of athletes and skiers.\n\nAs a Mentor and Technical Advisor to Snow Feather Adventures, Mr. Dev brings unparalleled expertise in skiing, outdoor leadership, adventure training, and winter sports development. His association reflects our commitment to excellence, safety, professionalism, and world-class adventure experiences.",
  },
  {
    name: "Mr. G. M. Hajam",
    role: "Senior Technical Advisor",
    credentials: "International Ski & Mountaineering Instructor",
    image: "/hajam-img.jpeg",
    quote: "International qualifications and mountain-rescue expertise supporting the highest standards of safety.",
    bio:
      "Mr. G. M. Hajam is a highly respected International Ski and Mountaineering Instructor with advanced professional qualifications from France, Austria, and Japan. A pioneer in winter sports and adventure tourism, he possesses extensive expertise in skiing, mountain rescue, outdoor leadership, and expedition management.\n\nHis international credentials include a 1st Degree in Skiing from France, an International Ski Instructor Diploma from Austria, a Mountain & Ski Resort Rescue Management Diploma from France, a Special M.O.T. Ski Diploma from France, and advanced certification from Japan.\n\nAs Senior Technical Advisor to Snow Feather Adventures, he provides expert guidance in skiing, mountaineering, safety management, and adventure training, helping us deliver world-class outdoor experiences with the highest standards of professionalism and safety. His experience, knowledge, and leadership are a valuable asset to our organization.",
  },
  {
    name: "Mrs. Hafeeza Hassan",
    role: "Senior Advisor, Expert Instructor & Mentor",
    credentials: "Pioneer of Women's Skiing & Adventure Sports in Jammu & Kashmir",
    image: "/hafeeza-img.jpeg",
    quote: "A national champion, pioneering instructor, and enduring inspiration for future generations of women adventurers.",
    bio:
      "Snow Feather Adventures is honored to have Mrs. Hafeeza Hassan as our Senior Advisor, Expert Instructor, and Mentor. A legendary skier, educator, and trailblazer in winter sports, she is widely recognized as one of the most accomplished female skiing personalities in Jammu & Kashmir.\n\nWith decades of experience in skiing, mountaineering, coaching, and sports administration, Mrs. Hafeeza Hassan has played a pioneering role in promoting adventure sports and empowering young women through outdoor activities. Throughout her distinguished career, she has trained and inspired hundreds of students, helping shape the future of winter sports in the region.\n\nA multiple-time National Champion, she has won numerous Gold and Silver Medals in National Skiing Championships and has proudly represented India at the First Winter Asian Games in Sapporo, Japan. Her achievements include the prestigious Sher-i-Kashmir Gold Medal, recognition as Best All-Round Skier, and honors as a Top Sportswoman of the Year.\n\nHer contribution extends far beyond medals and championships. As a mentor and role model, she has inspired generations of athletes and played a vital role in expanding opportunities for women in adventure sports across Jammu & Kashmir.\n\nAt Snow Feather Adventures, her expertise, guidance, and vision strengthen our commitment to excellence, safety, and professional adventure training.",
  },
  {
    name: "Mr. Abdul Qayyum Bhat",
    role: "Senior Skiing, Trekking & Mountaineering Expert",
    credentials: "Skiing | Trekking | Mountaineering | Rock Climbing",
    image: "/abdul-img.jpeg",
    quote: "Experience the mountains with confidence under the guidance of one of Kashmir's most experienced adventure professionals.",
    bio:
      "Mr. Abdul Qayyum Bhat is a highly respected skiing professional, accomplished mountaineer, and experienced trekking expert with decades of dedication to adventure sports in Jammu & Kashmir. Known for his exceptional skiing skills, strong leadership, and unwavering commitment to the outdoor community, he has earned recognition as one of the region's most trusted adventure professionals.\n\nA graduate of the prestigious Mountaineering and Skiing Institute (MOI), Mr. Bhat has represented Jammu & Kashmir in numerous National Skiing Championships and has proudly represented India in International Nordic Skiing events. His vast experience spans competitive skiing, mountaineering expeditions, trekking leadership, rock climbing, and outdoor adventure training.\n\nThroughout his distinguished career with the Department of Youth Services & Sports, he has professionally trained and mentored thousands of young skiers, helping them develop technical excellence, discipline, confidence, and a passion for adventure sports.\n\nBeyond his professional achievements, Mr. Bhat is widely admired for his honesty, humility, and generous nature. Always ready to guide, support, and care for others, he has earned the respect and affection of colleagues, students, and adventure enthusiasts alike.\n\nAt Snow Feather Adventures Tours & Travels, Mr. Abdul Qayyum Bhat serves as our Senior Skiing, Trekking, Mountaineering & Rock Climbing Expert, bringing unmatched experience, technical expertise, and a deep love for the mountains. His presence ensures that every adventure is conducted with the highest standards of safety, professionalism, and excellence.",
  },
];
const mentors = ref(loadStoredValue("kashmir-mentors", defaultMentors));
const openMentorProfiles = ref([]);

const defaultInclusionShowcase = {
  eyebrow: "Included in your journey",
  title: "Package Inclusions",
  backgroundImage: "/images/image39.jpeg",
  items: [
    {
      title: "Breakfast & Dinner",
      text: "Meal plan as mentioned in your final hotel and package confirmation.",
      image: "/images/image24.jpeg",
    },
    {
      title: "Cab for Sightseeing",
      text: "Comfortable private or group transport according to the selected package.",
      image: "/images/image17.jpeg",
    },
    {
      title: "Pickup & Drop",
      text: "Airport, railway station, or bus stand transfers as mentioned in the itinerary.",
      image: "/images/image18.jpeg",
    },
  ],
};
const inclusionShowcase = ref(loadStoredValue("kashmir-inclusion-showcase", defaultInclusionShowcase));

const pageSeo = computed(() => {
  const map = {
    home: {
      title: "Snow Feather Adventures | Kashmir Tour Packages & Local Travel Experts",
      description:
        "Book Snow Feather Adventures Kashmir tour packages for Srinagar, Gulmarg, Pahalgam, Sonamarg, Dal Lake, skiing, trekking, camping, honeymoon tours, family holidays, and luxury travel.",
    },
    about: {
      title: "About Snow Feather Adventures | Kashmir Tourism Company & Local Experts",
      description:
        "Learn about Snow Feather Adventures, a Kashmir tourism company offering custom tour packages, local travel planning, hotel and houseboat stays, cab transfers, snow activities, and trip support.",
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
      title: "Book Kashmir Tour Package | Snow Feather Adventures",
      description:
        "Send a Kashmir trip inquiry to Snow Feather Adventures for custom packages, hotels, houseboats, cab transfers, adventure activities, honeymoon tours, and family travel plans.",
    },
    gallery: {
      title: "Kashmir Travel Gallery | Snow Feather Adventures",
      description: siteContent.value.galleryHeroText,
    },
    blog: {
      title: "Kashmir Travel Blog | Snow Feather Adventures",
      description: siteContent.value.blogHeroText,
    },
    contact: {
      title: "Contact Snow Feather Adventures | Kashmir Tour Support",
      description:
        "Contact Snow Feather Adventures for Kashmir tour packages, WhatsApp booking, hotel and houseboat support, cab transfers, adventure activities, and custom travel planning.",
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
    name: "Classic Kashmir Circuit",
    tag: "Best Seller",
    price: 18999,
    originalPrice: 23999,
    duration: "5D/4N",
    rating: "4.9",
    types: ["classic", "family", "premium"],
    routeTitle: "Srinagar -> Gulmarg -> Pahalgam -> Sonmarg",
    routeDetails: "Dal Lake, Mughal Gardens, Gulmarg, Pahalgam, Aru Valley, Chandanwari, Sonmarg",
    cities: ["Srinagar", "Dal Lake", "Gulmarg", "Pahalgam", "Aru Valley", "Chandanwari", "Sonmarg"],
    highlights: ["Hotel stay", "Private cab", "Shikara ride", "Mughal Gardens"],
    image: image("image23"),
    description:
      "A balanced first-time Kashmir holiday covering Srinagar local sightseeing, Dal Lake, Mughal Gardens, Gulmarg, Pahalgam, Aru Valley, Chandanwari, and Sonmarg with clear hotel and cab options.",
    itinerary: ["Arrival, Dal Lake, Shikara ride, local market", "Gulmarg day with Gondola and snow activity options", "Pahalgam with Aru Valley and Chandanwari", "Sonmarg or Doodhpathri day trip", "Airport drop"],
    tiers: [
      ["Standard", "From ₹18,999 pp", "Standard hotel, shared/timed sightseeing support, Sedan/Innova as per group"],
      ["Premium", "From ₹29,999 pp", "3-star hotels, private cab, better room locations, Shikara included"],
      ["Luxurious", "From ₹49,999 pp", "4-star/boutique stays, premium houseboat option, curated photo stops"],
      ["VIP", "Custom quote", "5-star/resort stays, luxury cab, concierge routing, priority assistance"],
    ],
  },
  {
    name: "Gulmarg Skiing Package For Tourists",
    tag: "Skiing",
    price: 6500,
    originalPrice: 8500,
    duration: "1D",
    rating: "4.9",
    types: ["winter", "skiing", "tourists"],
    routeTitle: "Gulmarg",
    routeDetails: "Beginner ski lesson, ski gear, instructor, snow activity coordination",
    cities: ["Gulmarg", "Apharwat", "Kongdoori"],
    highlights: ["Ski instructor", "Ski equipment", "Beginner training", "Gondola guidance"],
    image: image("image15"),
    description:
      "A simple tourist skiing experience for first-time visitors in Gulmarg. Gondola tickets, snowmobile, sledging, guide, and transfers can be added depending on weather and availability.",
    itinerary: ["Pickup or Gulmarg reporting", "Ski equipment fitting and beginner briefing", "Instructor-led practice session", "Optional Gondola or snow activities", "Return transfer or hotel drop"],
    tiers: [
      ["Standard", "From ₹6,500 pp", "Basic ski gear and beginner instructor support"],
      ["Premium", "From ₹12,500 pp", "Private instructor time, gear, local handling, activity guidance"],
      ["Luxurious", "From ₹24,500 pp", "Premium transfer, longer instructor support, meal stop planning"],
      ["VIP", "Custom quote", "Full-day concierge, best available instructor, priority logistics"],
    ],
  },
  {
    name: "Student Skiing Camp",
    tag: "Students",
    price: 9999,
    originalPrice: 12999,
    duration: "2D/1N",
    rating: "4.8",
    types: ["winter", "skiing", "students", "group"],
    routeTitle: "Gulmarg / Sonmarg",
    routeDetails: "Student group ski learning, gear, instructor, basic stay, meals, safety briefing",
    cities: ["Gulmarg", "Sonmarg"],
    highlights: ["Student pricing", "Group instructor", "Basic stay", "Safety briefing"],
    image: image("image13"),
    description:
      "A dedicated skiing package for students and college groups with group pricing, beginner training, equipment, basic stay, meals, and safety-led coordination.",
    itinerary: ["Arrival and room allocation", "Ski gear briefing and beginner lesson", "Group practice and snow activities", "Breakfast and return"],
    tiers: [
      ["Standard", "From ₹9,999 pp", "Group stay, basic meals, shared instructor, gear support"],
      ["Premium", "From ₹15,999 pp", "Better stay, smaller training groups, private cab handling"],
      ["Luxurious", "From ₹25,999 pp", "Premium rooms, upgraded meals, extended training support"],
      ["VIP", "Custom quote", "Institution-level custom camp with dedicated coordinators"],
    ],
  },
  {
    name: "Srinagar Lake, Gardens & Houseboat",
    tag: "Srinagar",
    price: 11999,
    originalPrice: 15999,
    duration: "3D/2N",
    rating: "4.9",
    types: ["classic", "family", "honeymoon"],
    routeTitle: "Srinagar",
    routeDetails: "Dal Lake, Shikara, Houseboat, Chashme Shahi, Mughal Gardens, Pari Mahal, markets",
    cities: ["Srinagar", "Dal Lake", "Chashme Shahi", "Mughal Gardens", "Pari Mahal", "Manasbal Lake", "Wular Lake"],
    highlights: ["Houseboat option", "Shikara ride", "Mughal Gardens", "Local markets"],
    image: image("image22"),
    description:
      "A relaxed Srinagar-focused package for travelers who want Dal Lake, houseboats, Shikara rides, Mughal Gardens, Chashme Shahi, Pari Mahal, Manasbal Lake, Wular Lake, and local market time.",
    itinerary: ["Arrival and Dal Lake evening", "Mughal Gardens, Chashme Shahi, Pari Mahal, markets", "Manasbal or Wular Lake drive and airport drop"],
    tiers: [
      ["Standard", "From ₹11,999 pp", "Standard hotel/houseboat and local sightseeing support"],
      ["Premium", "From ₹19,999 pp", "Premium houseboat/hotel, private cab, Shikara included"],
      ["Luxurious", "From ₹34,999 pp", "Boutique stay, premium lake experience, curated dining"],
      ["VIP", "Custom quote", "Best houseboat/suite, concierge movement, private experiences"],
    ],
  },
  {
    name: "Pahalgam, Aru Valley & Chandanwari",
    tag: "Valleys",
    price: 14999,
    originalPrice: 18999,
    duration: "3D/2N",
    rating: "4.8",
    types: ["classic", "family", "camping"],
    routeTitle: "Pahalgam",
    routeDetails: "Pahalgam, Aru Valley, Betaab Valley, Chandanwari, riverside stays, pony ride options",
    cities: ["Pahalgam", "Aru Valley", "Betaab Valley", "Chandanwari"],
    highlights: ["Valley sightseeing", "Riverside stays", "Pony ride guidance", "Camping add-on"],
    image: image("image19"),
    description:
      "A valley-focused package for families, couples, and nature travelers covering Pahalgam, Aru Valley, Betaab Valley, Chandanwari, riverside viewpoints, and optional camping.",
    itinerary: ["Srinagar to Pahalgam with sightseeing stops", "Aru Valley, Betaab Valley, Chandanwari", "Leisure morning and return to Srinagar"],
    tiers: [
      ["Standard", "From ₹14,999 pp", "Standard stay, cab transfer, essential valley route"],
      ["Premium", "From ₹24,999 pp", "3-star stay, private cab, better sightseeing timing"],
      ["Luxurious", "From ₹42,999 pp", "Boutique/premium resort stay and curated valley stops"],
      ["VIP", "Custom quote", "Top resort, premium cab, flexible private route"],
    ],
  },
  {
    name: "Hidden Kashmir: Yusmarg, Doodhpathri & Gurez",
    tag: "Offbeat",
    price: 24999,
    originalPrice: 31999,
    duration: "5D/4N",
    rating: "4.9",
    types: ["offbeat", "camping", "group", "summer"],
    routeTitle: "Yusmarg - Doodhpathri - Gurez Valley",
    routeDetails: "Meadows, rivers, mountain roads, village stays, camping options, and photography routes",
    cities: ["Yusmarg", "Doodhpathri", "Gurez Valley", "Srinagar"],
    highlights: ["Offbeat routes", "Camping option", "Photography stops", "Local guide"],
    image: image("image03"),
    description:
      "An offbeat Kashmir route for travelers who want quieter meadows, riverside stops, village scenes, camping options, Yusmarg, Doodhpathri, and Gurez Valley with realistic mountain-road pacing.",
    itinerary: ["Srinagar arrival and local evening", "Yusmarg meadow and riverside day", "Doodhpathri day with photography stops", "Gurez Valley route with local stay", "Return to Srinagar"],
    tiers: [
      ["Standard", "From ₹24,999 pp", "Basic stays, cab route, local assistance"],
      ["Premium", "From ₹39,999 pp", "Better stays, private cab, guided stops"],
      ["Luxurious", "From ₹69,999 pp", "Premium available stays and private experience planning"],
      ["VIP", "Custom quote", "Fully custom offbeat route with dedicated support"],
    ],
  },
  {
    name: "Kashmir Honeymoon Signature",
    tag: "Honeymoon",
    price: 34999,
    originalPrice: 44999,
    duration: "6D/5N",
    rating: "5.0",
    types: ["honeymoon", "premium"],
    routeTitle: "Srinagar -> Gulmarg -> Pahalgam",
    routeDetails: "Houseboat, Shikara, candlelight setup, Gulmarg, Pahalgam, private cab",
    cities: ["Srinagar", "Dal Lake", "Gulmarg", "Pahalgam", "Aru Valley"],
    highlights: ["Private cab", "Houseboat option", "Romantic setup", "Candlelight dinner"],
    image: image("image14"),
    description:
      "A honeymoon package with relaxed pacing, private cab, houseboat or premium hotel options, Shikara ride, romantic setup, Gulmarg snow or Gondola planning, and Pahalgam valley time.",
    itinerary: ["Arrival and houseboat/Shikara", "Srinagar gardens and markets", "Gulmarg day", "Pahalgam and Aru Valley", "Leisure day or photoshoot", "Airport drop"],
    tiers: [
      ["Standard", "From ₹34,999 couple", "Clean stays, private cab, basic romantic setup"],
      ["Premium", "From ₹64,999 couple", "3-star hotels, houseboat, candlelight dinner"],
      ["Luxurious", "From ₹1,15,000 couple", "4-star/boutique stays, premium room decor, photoshoot assistance"],
      ["VIP", "Custom quote", "Luxury resorts, private experiences, dedicated concierge"],
    ],
  },
  {
    name: "Kashmir To Leh Road Journey",
    tag: "Leh Add-on",
    price: 42999,
    originalPrice: 54999,
    duration: "7D/6N",
    rating: "4.8",
    types: ["adventure", "group", "premium"],
    routeTitle: "Srinagar -> Sonmarg -> Kargil -> Leh",
    routeDetails: "Sonmarg, Zoji La, Kargil, Leh, mountain roads, acclimatized pacing",
    cities: ["Srinagar", "Sonmarg", "Kargil", "Leh"],
    highlights: ["Kargil halt", "Leh extension", "Mountain road support", "Permit guidance"],
    image: image("image18"),
    description:
      "A road-trip style Kashmir to Leh package covering Srinagar, Sonmarg, Kargil, and Leh with realistic pacing, stopover planning, permit guidance, and mountain-road travel support.",
    itinerary: ["Srinagar arrival", "Srinagar to Sonmarg", "Sonmarg to Kargil", "Kargil to Leh", "Leh local/rest day", "Leh experiences", "Departure"],
    tiers: [
      ["Standard", "From ₹42,999 pp", "Standard stays and route transfers"],
      ["Premium", "From ₹69,999 pp", "Better hotels, private cab, permit guidance"],
      ["Luxurious", "From ₹1,10,000 pp", "Premium stays and upgraded road support"],
      ["VIP", "Custom quote", "Luxury route design, best available stays, concierge"],
    ],
  },
  {
    name: "Camping, Fishing & Outdoor Kashmir",
    tag: "Adventure",
    price: 15999,
    originalPrice: 20999,
    duration: "3D/2N",
    rating: "4.8",
    types: ["camping", "adventure", "students"],
    routeTitle: "Aru Valley / Yusmarg / Sonmarg",
    routeDetails: "Camping, bonfire, fishing guidance, trekking, outdoor meals, group support",
    cities: ["Aru Valley", "Yusmarg", "Sonmarg", "Pahalgam"],
    highlights: ["Camping", "Fishing guidance", "Bonfire", "Trekking"],
    image: image("image05"),
    description:
      "An outdoor package for camping, soft trekking, bonfire evenings, fishing guidance where permitted, and student or group adventure travel across Aru Valley, Yusmarg, Sonmarg, or Pahalgam.",
    itinerary: ["Arrival and camp transfer", "Outdoor activity day with guide", "Breakfast and return"],
    tiers: [
      ["Standard", "From ₹15,999 pp", "Basic camp, meals, guide support"],
      ["Premium", "From ₹25,999 pp", "Better camp setup, private transport, activity coordination"],
      ["Luxurious", "From ₹44,999 pp", "Premium camp/stay blend and curated outdoor experience"],
      ["VIP", "Custom quote", "Private campsite planning and dedicated team"],
    ],
  },
];

function normalizedPackageTiers(item) {
  const fallbackTiers = [
    ["Standard", "On request", "Essential stay, cab, and route support"],
    ["Premium", "On request", "Comfort hotels and private trip planning"],
    ["Luxurious", "On request", "Premium stays and curated experiences"],
    ["VIP", "Custom quote", "Dedicated concierge and best available services"],
  ];
  const tiers = Array.isArray(item?.tiers) ? item.tiers.slice(0, 4).map((tier) => [...tier]) : [];

  while (tiers.length < 4) {
    tiers.push([...fallbackTiers[tiers.length]]);
  }

  return tiers;
}

function clonePackage(item) {
  const packageType = item.packageType || (packageIsWinter(item) ? "winter" : packageIsSummer(item) ? "summer" : "standard");
  return {
    ...item,
    packageDate: item.packageDate || premiumStructureDate,
    category: item.category || item.tag || "Kashmir Package",
    status: item.status || "active",
    featured: Boolean(item.featured ?? /best seller|signature|honeymoon/i.test(item.tag || item.name || "")),
    priority: Number.isFinite(Number(item.priority)) ? Number(item.priority) : 50,
    packageType,
    types: Array.isArray(item.types) ? [...item.types] : [],
    cities: Array.isArray(item.cities) ? [...item.cities] : [],
    highlights: Array.isArray(item.highlights) ? [...item.highlights] : [],
    itinerary: Array.isArray(item.itinerary) && item.itinerary.length ? [...item.itinerary] : ["Add day-wise itinerary"],
    inclusions: Array.isArray(item.inclusions) && item.inclusions.length ? [...item.inclusions] : defaultPackageInclusionsFor(item),
    exclusions: Array.isArray(item.exclusions) && item.exclusions.length ? [...item.exclusions] : defaultPackageExclusionsFor(),
    accommodation: item.accommodation || defaultPackageServicesFor(item).accommodation,
    meals: item.meals || defaultPackageServicesFor(item).meals,
    transportation: item.transportation || defaultPackageServicesFor(item).transportation,
    activities: item.activities || defaultPackageServicesFor(item).activities,
    guideServices: item.guideServices || defaultPackageServicesFor(item).guide,
    reservationNote: item.reservationNote || "",
    relatedPackages: Array.isArray(item.relatedPackages) ? [...item.relatedPackages] : [],
    tiers: normalizedPackageTiers(item),
  };
}

function loadStoredPackages() {
  const savedPackages = loadStoredValue("kashmir-packages-premium-v3", defaultPackages);
  return Array.isArray(savedPackages) ? savedPackages.map(clonePackage) : defaultPackages.map(clonePackage);
}

const packages = ref(loadStoredPackages());
const filters = ["all", "classic", "skiing", "students", "honeymoon", "offbeat", "camping"];
const priceRanges = [
  { value: "all", label: "All prices", min: 0, max: Infinity },
  { value: "under-10000", label: "Under ₹10,000", min: 0, max: 9999 },
  { value: "10000-15000", label: "₹10,000 - ₹15,000", min: 10000, max: 15000 },
  { value: "15001-25000", label: "₹15,001 - ₹25,000", min: 15001, max: 25000 },
  { value: "25001-40000", label: "₹25,001 - ₹40,000", min: 25001, max: 40000 },
  { value: "above-40000", label: "₹40,001 and above", min: 40001, max: Infinity },
];
const publicPackages = computed(() =>
  packages.value
    .filter((item) => item.status !== "inactive")
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const featuredScore = Number(Boolean(b.item.featured)) - Number(Boolean(a.item.featured));
      if (featuredScore) return featuredScore;
      const priorityScore = Number(a.item.priority || 50) - Number(b.item.priority || 50);
      return priorityScore || a.index - b.index;
    })
    .map(({ item }) => item),
);

const filteredPackages = computed(() => {
  const selectedRange = priceRanges.find((range) => range.value === activePriceRange.value) || priceRanges[0];

  return publicPackages.value.filter((item) => {
      const matchesType =
        activeFilter.value === "all" ||
        (Array.isArray(item.types) && item.types.includes(activeFilter.value));
      const price = Number(item.price || 0);
      const matchesPrice = price >= selectedRange.min && price <= selectedRange.max;
      return matchesType && matchesPrice;
    });
});
const aboutPackages = computed(() => filteredPackages.value.slice(0, 6));

function clearPackageFilters() {
  activeFilter.value = "all";
  activePriceRange.value = "all";
}

function slugifyPackageName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const detailPackage = computed(() => {
  const slug = currentPath.value.replace("/packages/", "");
  return publicPackages.value.find((item) => slugifyPackageName(item.name) === slug) || publicPackages.value[0] || packages.value[0];
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
  "VIP Kashmir Circuit": ["Kashmir", "Srinagar, Gulmarg, Pahalgam, Sonamarg"],
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

function packageTiers(item) {
  return normalizedPackageTiers(item);
}

function packageItinerary(item) {
  return Array.isArray(item.itinerary) && item.itinerary.length ? item.itinerary : ["Arrival and route briefing", "Destination sightseeing and activities", "Return or onward transfer"];
}

function packageOriginalPrice(item) {
  return Math.max(Number(item.originalPrice || 0), Math.round(Number(item.price || 0) * 1.18));
}

function packageVisual(item) {
  if (item?.image) return item.image;
  const text = `${item?.name || ""} ${item?.routeTitle || ""} ${item?.routeDetails || ""}`.toLowerCase();
  if (text.includes("leh") || text.includes("kargil")) return kashmirWebImages.leh;
  if (text.includes("gurez")) return kashmirWebImages.gurez;
  if (text.includes("yusmarg")) return kashmirWebImages.yusmarg;
  if (text.includes("doodhpathri")) return kashmirWebImages.doodhpathri;
  if (text.includes("pahalgam") || text.includes("aru") || text.includes("chandanwari")) return kashmirWebImages.pahalgam;
  if (text.includes("sonmarg")) return kashmirWebImages.sonmarg;
  if (text.includes("dal lake") || text.includes("srinagar") || text.includes("houseboat")) return kashmirWebImages.dalLake;
  if (text.includes("gulmarg") || text.includes("ski")) return kashmirWebImages.gulmarg;
  return item?.image || image("image23");
}

function packageDiscount(item) {
  const originalPrice = packageOriginalPrice(item);
  return Math.max(1, Math.round(((originalPrice - Number(item.price || 0)) / originalPrice) * 100));
}

function packageWhatsappLink(item) {
  const message = `I want to talk to an expert about the ${item?.name || "Kashmir tour"} package.`;
  return whatsappLink(message);
}

function displayDuration(duration) {
  return String(duration || "").replace("/", " / ");
}

function displayCurrencyText(value) {
  return String(value || "").replace(/₹\s?/g, "INR ");
}

function packageIsWinter(item) {
  if (item?.packageType === "winter") return true;
  if (item?.packageType === "summer" || item?.packageType === "standard") return false;
  const text = `${item?.name || ""} ${item?.tag || ""} ${item?.types?.join(" ") || ""} ${item?.routeDetails || ""}`.toLowerCase();
  return /winter|ski|snow|gulmarg|gondola/.test(text);
}

function packageIsSummer(item) {
  if (item?.packageType === "summer") return true;
  if (item?.packageType === "winter" || item?.packageType === "standard") return false;
  if (packageIsWinter(item)) return false;
  const text = `${item?.name || ""} ${item?.tag || ""} ${item?.types?.join(" ") || ""} ${item?.routeTitle || ""} ${item?.routeDetails || ""}`.toLowerCase();
  return /summer|camping|trek|rafting|biking|pahalgam|sonmarg|gurez|yusmarg|doodhpathri|offbeat|leh/.test(text);
}

function submitReview() {
  if (!reviewForm.value.name.trim() || !reviewForm.value.trip.trim() || !reviewForm.value.text.trim()) {
    reviewFormStatus.value = "Please add your name, travel experience, and review.";
    return;
  }

  testimonials.value = [
    {
      name: reviewForm.value.name.trim(),
      location: reviewForm.value.location.trim() || "Guest traveler",
      rating: reviewForm.value.rating || "5.0",
      trip: reviewForm.value.trip.trim(),
      text: reviewForm.value.text.trim(),
      image: reviewForm.value.image || image("image23"),
    },
    ...testimonials.value,
  ].slice(0, 8);

  saveAllContent();
  reviewForm.value = { name: "", location: "", rating: "5.0", trip: "", text: "", image: "" };
  reviewFormStatus.value = "Thank you for sharing your Kashmir experience.";
}

function updateReviewPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    reviewForm.value.image = reader.result;
  };
  reader.readAsDataURL(file);
}

const detailWhatsappLink = computed(() => {
  const message = `I want details for ${detailPackage.value?.name || "a Kashmir package"}`;
  return whatsappLink(message);
});

const publicGalleryImages = [
  { image: "/images/image1.jpeg", title: "Pahalgam Valley Park", text: "Lush lawns, walking routes, and family-friendly valley scenery." },
  { image: "/images/image2.jpeg", title: "Kashmir Meadow Village", text: "Traditional mountain homes surrounded by vivid summer meadows." },
  { image: "/images/image3.jpeg", title: "Dal Lake Shikara", text: "A colorful Shikara gliding through the calm waters of Srinagar." },
  { image: "/images/image4.jpeg", title: "Pine Forest Retreat", text: "Quiet forest clearings, mountain streams, and rustic Kashmir stays." },
  { image: "/images/image5.jpeg", title: "Mughal Garden Views", text: "Landscaped gardens, fountains, and mountain-backed Srinagar scenery." },
  { image: "/images/image6.jpeg", title: "River Rafting Adventure", text: "White-water rafting for groups seeking an exciting Kashmir experience." },
  { image: "/images/image7.jpeg", title: "Gulmarg Green Slopes", text: "Summer resort views, open trails, and scenic mountain facilities." },
  { image: "/images/image8.jpeg", title: "High-Altitude Kashmir", text: "Dramatic brown mountains and remote Himalayan settlements." },
  { image: "/images/image9.jpeg", title: "Glacier Valley Trail", text: "Rocky river routes framed by forest and snow-covered peaks." },
  { image: "/images/image10.jpeg", title: "Lidder River Valley", text: "A winding blue river flowing through dense pine forests." },
  { image: "/images/image11.jpeg", title: "Kashmir Mountain Range", text: "Layered Himalayan peaks under soft seasonal light." },
  { image: "/images/image12.jpeg", title: "Pony Crossing", text: "Local pony routes crossing clear mountain water in the valley." },
  { image: "/images/image13.jpeg", title: "Meadow Picnic Shelter", text: "A peaceful wooden shelter beside green meadow streams." },
  { image: "/images/image14.jpeg", title: "Kashmir Saffron", text: "Purple saffron flowers representing Kashmir's prized harvest." },
  { image: "/images/image15.jpeg", title: "Mountain Waterfall Route", text: "A remote waterfall cutting through a dramatic alpine valley." },
  { image: "/images/image16.jpeg", title: "Gulmarg Gondola", text: "Cable-car views above the valley and surrounding mountain ranges." },
  { image: "/images/image17.jpeg", title: "Scenic Kashmir Drive", text: "Private vehicles traveling through landscaped mountain roads." },
  { image: "/images/image18.jpeg", title: "Sonmarg Road", text: "The mountain highway leading toward Sonmarg and high-altitude routes." },
  { image: "/images/image19.jpeg", title: "Alpine Waterfall", text: "Fresh glacier water descending through dark mountain rock." },
  { image: "/images/image20.jpeg", title: "Busy Valley Town", text: "A lively Kashmir destination filled with local movement and color." },
  { image: "/images/image21.jpeg", title: "Forest Garden", text: "Tall trees, flowing water, and picnic-ready green spaces." },
  { image: "/images/image22.jpeg", title: "Snow Mountain Pass", text: "A close view of rugged snow walls and Himalayan travel routes." },
  { image: "/images/image23.jpeg", title: "Mountain Lake Village", text: "A serene lake reflecting colorful homes and green slopes." },
  { image: "/images/image24.jpeg", title: "Kashmir Garden Walk", text: "Curved garden paths, manicured greenery, and peaceful family time." },
  { image: "/images/image25.jpeg", title: "Hazratbal & Dal Lake", text: "Srinagar's iconic waterside landmark against the mountain skyline." },
  { image: "/images/image26.jpeg", title: "River Valley Panorama", text: "A wide aerial view of a river winding through the Himalayas." },
  { image: "/images/image27.jpeg", title: "Terraced Garden", text: "Formal Kashmir gardens with fountains and carefully shaped greenery." },
  { image: "/images/image28.jpeg", title: "Mountain Reservoir", text: "Engineering and turquoise water set against rugged mountain terrain." },
  { image: "/images/image29.jpeg", title: "Open Kashmir Meadow", text: "Visitors enjoying broad green meadows beneath snowy peaks." },
  { image: "/images/image30.jpeg", title: "Highland Snow Valley", text: "Open alpine terrain, melting snow, and crystal-clear streams." },
  { image: "/images/image31.jpeg", title: "Himalayan Trek View", text: "High mountain ridges and trekking landscapes beneath dramatic clouds." },
  { image: "/images/image32.jpeg", title: "Remote Green Valley", text: "Untouched rolling hills and a small mountain shelter." },
  { image: "/images/image33.jpeg", title: "Snow Peaks of Kashmir", text: "A broad mountain skyline viewed from the valley floor." },
  { image: "/images/image34.jpeg", title: "Forest Horse Trail", text: "Horse-riding routes through quiet woodland meadows." },
  { image: "/images/image35.jpeg", title: "Srinagar Panorama", text: "A sunset city view stretching across Srinagar and its surrounding hills." },
  { image: "/images/image36.jpeg", title: "Mountain River Journey", text: "Fast-moving Himalayan water beside forested road routes." },
  { image: "/images/image37.jpeg", title: "Alpine Lake Trek", text: "A spectacular high-altitude lake reached through mountain trekking." },
  { image: "/images/image38.jpeg", title: "Valley Road & Peaks", text: "Open green valley roads with a sweeping Himalayan backdrop." },
  { image: "/images/image39.jpeg", title: "River & Mountain Meadow", text: "A pristine river running through one of Kashmir's remote valleys." },
  { image: "/images/image40.jpeg", title: "Winter Village", text: "Snow-covered homes and trees capturing Kashmir's quiet winter beauty." },
];

const destinationSpotlights = [
  { name: "Gulmarg", image: "/kashmir-gulmarg-vibrant-v2.png", note: "Gondola rides, ski slopes, snow adventures, and summer meadows." },
  { name: "Pahalgam", image: "/kashmir-pahalgam-vibrant-v2.png", note: "Lidder River, pine forests, family stays, and valley walks." },
  { name: "Sonmarg", image: "/images/image18.jpeg", note: "Glacier routes, mountain roads, pony trails, and alpine views." },
  { name: "Doodhpathri", image: "/images/image29.jpeg", note: "Rolling meadows, streams, picnic spaces, and peaceful countryside." },
  { name: "Yousmarg", image: "/images/image32.jpeg", note: "Quiet green hills, pine trails, horse rides, and offbeat scenery." },
  { name: "Dal Lake", image: "/kashmir-dal-lake-vibrant-v2.png", note: "Shikara rides, houseboats, floating markets, and calm lake evenings." },
  { name: "Srinagar", image: "/images/image35.jpeg", note: "Gardens, heritage, local markets, food, and panoramic city views." },
  { name: "Aru Valley", image: "/images/image38.jpeg", note: "Open valley roads, trekking routes, camps, and mountain backdrops." },
  { name: "Chandanwari", image: "/images/image30.jpeg", note: "Highland snow, clear streams, dramatic terrain, and scenic drives." },
  { name: "Gurez Valley", image: "/images/image23.jpeg", note: "Kishanganga landscapes, village life, culture, and remote beauty." },
  { name: "Tulail Valley", image: "/images/image39.jpeg", note: "Pristine rivers, wooden villages, broad meadows, and quiet mountains." },
];

const legacyGalleryImages = ["image03", "image04", "image05", "image06", "image09", "image10", "image11", "image13", "image15", "image16", "image17", "image18"];
const defaultGalleryImages = [...publicGalleryImages, ...legacyGalleryImages];
const galleryImages = ref(loadStoredValue("kashmir-gallery-images-v2", defaultGalleryImages));
const galleryFilters = ["All", "Snow", "Lakes", "Mountains", "Houseboats", "Camping", "Trekking", "Adventure", "Culture", "Couples", "Family"];

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
      source.text || "A scenic travel moment from the Snow Feather Adventures gallery.",
    ];
  }

  const fallbackPlaces = [
    ["Kashmir View", "A scenic travel moment from the Snow Feather Adventures gallery."],
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

function galleryImageTags(item, index) {
  const title = galleryImageTitle(item, index).toLowerCase();
  const text = galleryImageText(item, index).toLowerCase();
  const haystack = `${title} ${text}`;
  const tags = [];
  if (/snow|winter|ski|gondola/.test(haystack)) tags.push("Snow");
  if (/lake|dal|shikara|water/.test(haystack)) tags.push("Lakes");
  if (/mountain|peak|high|himalayan|valley|alpine/.test(haystack)) tags.push("Mountains");
  if (/houseboat/.test(haystack)) tags.push("Houseboats");
  if (/camp|bonfire/.test(haystack)) tags.push("Camping");
  if (/trek|trail|walk/.test(haystack)) tags.push("Trekking");
  if (/rafting|adventure|gondola|horse|pony|ski|snowmobile/.test(haystack)) tags.push("Adventure");
  if (/village|market|heritage|garden|saffron|hazratbal|craft/.test(haystack)) tags.push("Culture");
  if (/couple|honeymoon|romantic|sunset|sunrise/.test(haystack)) tags.push("Couples");
  if (/family|picnic|garden|meadow/.test(haystack)) tags.push("Family");
  return tags.length ? tags : ["Mountains"];
}

const filteredGalleryImages = computed(() =>
  galleryImages.value.filter((item, index) => activeGalleryFilter.value === "All" || galleryImageTags(item, index).includes(activeGalleryFilter.value)),
);

function updateGalleryImageField(index, field, value) {
  const existing = galleryImages.value[index];
  galleryImages.value[index] = {
    image: mediaSource(existing),
    title: field === "title" ? value : galleryImageTitle(existing, index),
    text: field === "text" ? value : galleryImageText(existing, index),
  };
}

const defaultGalleryCollections = [
  { title: "Snow Days", image: "/images/image40.jpeg", text: "Winter villages, Gulmarg skiing, Gondola views, snow activities, and quiet Himalayan mornings." },
  { title: "Lake Life", image: "/images/image3.jpeg", text: "Dal Lake Shikara rides, houseboats, waterfront landmarks, and slow Srinagar evenings." },
  { title: "Valley Routes", image: "/images/image39.jpeg", text: "Pahalgam, Sonmarg, Gurez, pine roads, riverside trails, and broad mountain meadows." },
  { title: "Adventure Kashmir", image: "/images/image6.jpeg", text: "Rafting, trekking, high-altitude lakes, horse trails, Gondola rides, and outdoor experiences." },
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
const visibleBlogCount = ref(6);
const visibleBlogPosts = computed(() => blogPosts.value.slice(0, visibleBlogCount.value));
const hasMoreBlogPosts = computed(() => visibleBlogCount.value < blogPosts.value.length);

function showMoreBlogPosts() {
  visibleBlogCount.value += 6;
}

let blogSyncChannel = null;
let blogSyncTimeout = null;

function loadLatestBlogPosts() {
  const latestPosts = loadStoredValue("kashmir-blog-posts", defaultBlogPosts);
  blogPosts.value = latestPosts.map((post) => ({ ...post }));
}

function notifyBlogUpdate() {
  blogSyncChannel?.postMessage({ type: "blog-posts-updated" });
}

function persistBlogPosts() {
  localStorage.setItem("kashmir-blog-posts", JSON.stringify(blogPosts.value));
  notifyBlogUpdate();
}

function scheduleBlogPostSave() {
  if (blogSyncTimeout) window.clearTimeout(blogSyncTimeout);
  blogSyncTimeout = window.setTimeout(() => {
    persistBlogPosts();
    blogSyncTimeout = null;
  }, 180);
}

function handleContentStorageUpdate(event) {
  if (event.key === "kashmir-blog-posts" && event.newValue) {
    loadLatestBlogPosts();
  }
}

watch(blogPosts, scheduleBlogPostSave, { deep: true });

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
  backgroundImage: `linear-gradient(90deg, rgba(4, 20, 31, 0.9), rgba(4, 32, 43, 0.48), rgba(4, 20, 31, 0.12)), linear-gradient(0deg, rgba(3, 22, 29, 0.76), transparent 58%), url('/kashmir-hero-vibrant-v2.png')`,
}));

const heroStats = [
  ["5,000+", "Happy travelers"],
  ["50+", "Destinations"],
  ["100%", "Local expertise"],
  ["24/7", "Travel support"],
];

const destinationStories = [
  { name: "Gulmarg", image: "/kashmir-gulmarg-vibrant-v2.png", season: "Dec – Mar · May – Sep", activities: "Skiing · Gondola · Meadows", text: "Rise above pine forests into a world of powder snow, open meadows, and Himalayan silence." },
  { name: "Dal Lake", image: "/kashmir-dal-lake-vibrant-v2.png", season: "Mar – Nov", activities: "Shikara · Houseboats · Sunrise", text: "Wake on the water, drift past floating gardens, and watch Srinagar glow in the first light." },
  { name: "Pahalgam", image: "/kashmir-pahalgam-vibrant-v2.png", season: "Apr – Oct", activities: "Valleys · River walks · Horses", text: "Follow the Lidder through pine country where every bend opens into another cinematic valley." },
  { name: "Aru Valley", image: "/images/image38.jpeg", season: "Apr – Oct", activities: "Trekking · Camping · Pine trails", text: "A quiet alpine doorway where campfires, meadow walks, and mountain trails feel beautifully unhurried." },
  { name: "Betaab Valley", image: "/images/image29.jpeg", season: "Apr – Oct", activities: "Family · Couples · Photography", text: "A soft green valley made for slow walks, river photographs, and easy family memories." },
  { name: "Doodhpathri", image: "/images/image32.jpeg", season: "May – Oct", activities: "Meadows · Streams · Picnics", text: "Cold streams, rolling grasslands, and a quieter Kashmir for travelers who want space." },
  { name: "Yusmarg", image: "/images/image34.jpeg", season: "Apr – Oct", activities: "Horse riding · Forests · Fishing", text: "Pine forests and meadow trails where Kashmir still feels hidden, gentle, and personal." },
  { name: "Gurez Valley", image: "/images/image23.jpeg", season: "May – Oct", activities: "Villages · Culture · Photography", text: "Go beyond the familiar into wooden villages, dramatic peaks, and one of Kashmir’s last quiet frontiers." },
  { name: "Srinagar", image: "/images/image35.jpeg", season: "All year", activities: "Gardens · Markets · Heritage", text: "The living heart of Kashmir, with gardens, old-city flavors, lake views, and warm hospitality." },
  { name: "Sonmarg", image: "/images/image18.jpeg", season: "Apr – Oct", activities: "Glaciers · Pony trails · Picnics", text: "Travel the road to the meadow of gold, framed by glaciers, wild rivers, and high mountain passes." },
  { name: "Tulip Garden", image: "/images/image5.jpeg", season: "Mar – Apr", activities: "Spring · Gardens · Couples", text: "Spring opens in color here, with flowers, mountain air, and Srinagar at its most romantic." },
  { name: "Mughal Gardens", image: "/images/image27.jpeg", season: "Mar – Nov", activities: "Heritage · Family · Photos", text: "Terraces, fountains, chinar shade, and garden routes that make Srinagar feel royal." },
  { name: "Houseboats", image: "/images/image3.jpeg", season: "All year", activities: "Lake stay · Kahwa · Shikara", text: "Sleep on Dal Lake, wake to water and mountain light, and let the day begin softly." },
  { name: "Leh", image: "/images/image8.jpeg", season: "Jun – Sep", activities: "Road trip · Monasteries · High passes", text: "A high-altitude extension for travelers who want Kashmir to become a larger Himalayan expedition." },
  { name: "Ladakh", image: "/images/image28.jpeg", season: "Jun – Sep", activities: "Biking · Lakes · Culture", text: "Open roads, moonlike landscapes, monasteries, and the silence of the trans-Himalaya." },
  { name: "Kargil", image: "/images/image22.jpeg", season: "May – Oct", activities: "Transit · History · Mountains", text: "A powerful stop between Kashmir and Ladakh, framed by rugged valleys and road-trip drama." },
];

const experienceStories = [
  { category: "Snow", title: "Ski the Himalayas", eyebrow: "Gulmarg", image: "/images/image40.jpeg", text: "From first turns to powder days with local instructors and mountain experts." },
  { category: "Snow", title: "Snowboarding days", eyebrow: "Apharwat slopes", image: "/images/image22.jpeg", text: "Board-ready snow days, equipment guidance, instructor support, and weather-aware timing." },
  { category: "Slow", title: "Wake up on Dal Lake", eyebrow: "Srinagar", image: "/images/image3.jpeg", text: "Houseboat mornings, kahwa on deck, and a private Shikara through floating gardens." },
  { category: "Slow", title: "Float through sunrise", eyebrow: "Shikara ride", image: "/kashmir-dal-lake-vibrant-v2.png", text: "A calm lake morning with soft light, floating gardens, local stories, and quiet photographs." },
  { category: "Adventure", title: "Walk into the wild", eyebrow: "Aru & Pahalgam", image: "/images/image37.jpeg", text: "High-altitude lakes, pine trails, campfire evenings, and routes shaped to your pace." },
  { category: "Adventure", title: "Ride mountain rivers", eyebrow: "River rafting", image: "/images/image6.jpeg", text: "Summer rafting with local coordination, safety-first operators, and group-friendly adventure." },
  { category: "Adventure", title: "Bike the high roads", eyebrow: "Mountain biking", image: "/images/image38.jpeg", text: "Valley lanes, forest tracks, and road-trip routes for active travelers who want movement." },
  { category: "Adventure", title: "Fly above the valley", eyebrow: "Paragliding", image: "/images/image26.jpeg", text: "Seasonal flying windows, dramatic valley views, and operators selected with safety in mind." },
  { category: "Adventure", title: "Fish quiet waters", eyebrow: "Rivers & lakes", image: "/images/image10.jpeg", text: "Slow river mornings, permit guidance, local knowledge, and peaceful time away from crowds." },
  { category: "Romance", title: "A honeymoon with space", eyebrow: "Across Kashmir", image: "/images/image14.jpeg", text: "Private drives, quiet viewpoints, thoughtful stays, and time that never feels rushed." },
  { category: "Family", title: "Wonder for every age", eyebrow: "Kashmir circuit", image: "/images/image29.jpeg", text: "Comfortable days, playful snow, meadow picnics, and local care for the whole family." },
  { category: "Family", title: "Group adventures", eyebrow: "Friends & teams", image: "/images/image17.jpeg", text: "Coordinated transport, shared rooms, snow days, bonfires, and activities planned for everyone." },
  { category: "Adventure", title: "Camp under Himalayan stars", eyebrow: "Gurez & Sonmarg", image: "/images/image39.jpeg", text: "Remote valleys, riverside camps, warm fires, and nights far from ordinary life." },
  { category: "Luxury", title: "Kashmir, privately curated", eyebrow: "Signature journey", image: "/images/image35.jpeg", text: "Beautiful stays, a dedicated vehicle, flexible days, and experiences arranged around you." },
  { category: "Luxury", title: "Photography route", eyebrow: "Golden hours", image: "/images/image31.jpeg", text: "Sunrise lakes, snow lines, gardens, village roads, and scenic stops timed for better frames." },
  { category: "Slow", title: "Taste the real Srinagar", eyebrow: "Old city", image: "/images/image25.jpeg", text: "Heritage lanes, gardens, artisan workshops, bakeries, saffron, and stories shared by locals." },
];

const experienceFilters = ["All", "Snow", "Slow", "Adventure", "Romance", "Family", "Luxury"];
const filteredExperienceStories = computed(() =>
  activeExperience.value === "All"
    ? experienceStories
    : experienceStories.filter((item) => item.category === activeExperience.value),
);

const journeyMoments = [
  { number: "01", label: "Arrive", title: "The mountains appear", text: "Your driver meets you in Srinagar. The air changes, the ridgelines arrive, and the journey begins without friction.", image: "/images/image35.jpeg" },
  { number: "02", label: "Feel", title: "Kashmir slows time", text: "A quiet Shikara, warm kahwa, cedar-scented roads, and unhurried conversations make the place feel personal.", image: "/images/image3.jpeg" },
  { number: "03", label: "Explore", title: "Choose your wild", text: "Snow slopes, river trails, hidden valleys, houseboats, gardens, and village roads—each day reveals a different Kashmir.", image: "/images/image37.jpeg" },
  { number: "04", label: "Remember", title: "Leave with a story", text: "Not a checklist of sights, but moments that stay vivid long after the flight home.", image: "/images/image39.jpeg" },
];

const adventureSeasons = [
  {
    label: "Winter adventure",
    months: "December to February",
    image: "/images/image40.jpeg",
    title: "Snow, slopes, Gondola views, and winter villages.",
    activities: ["Skiing", "Snowboarding", "Snowmobile", "Sledging", "Ice moments"],
  },
  {
    label: "Summer adventure",
    months: "June to September",
    image: "/images/image37.jpeg",
    title: "Trekking, camping, rafting, biking, and outdoor routes.",
    activities: ["Trekking", "Camping", "River rafting", "Mountain biking", "Paragliding"],
  },
  {
    label: "All-season Kashmir",
    months: "March to November",
    image: "/images/image3.jpeg",
    title: "Lakes, culture, food, photography, and houseboat living.",
    activities: ["Photography", "Houseboats", "Shikara ride", "Local culture", "Kashmiri food"],
  },
];

const reimaginedJourneys = [
  { name: "Romantic Kashmir Escape", duration: "5D / 4N", places: "Srinagar, Dal Lake, Gulmarg, Pahalgam", bestFor: "Honeymoon couples", image: "/images/image14.jpeg", highlights: ["Private Shikara", "Premium stays", "Slow photo stops"] },
  { name: "Snow Adventure Journey", duration: "4D / 3N", places: "Gulmarg, Apharwat, Srinagar", bestFor: "Snow lovers", image: "/images/image40.jpeg", highlights: ["Ski lesson", "Gondola support", "Snow activities"] },
  { name: "Family Kashmir Memories", duration: "6D / 5N", places: "Srinagar, Pahalgam, Sonmarg, Gulmarg", bestFor: "Families", image: "/images/image29.jpeg", highlights: ["Easy pacing", "Private cab", "Kid-friendly stops"] },
  { name: "Offbeat Valley Explorer", duration: "7D / 6N", places: "Doodhpathri, Yusmarg, Gurez, Tulail", bestFor: "Explorers", image: "/images/image39.jpeg", highlights: ["Hidden valleys", "Village culture", "Photography roads"] },
  { name: "Luxury Houseboat & Valley Experience", duration: "5D / 4N", places: "Dal Lake, Mughal Gardens, Pahalgam", bestFor: "Private luxury", image: "/images/image3.jpeg", highlights: ["Houseboat stay", "Boutique hotels", "Concierge routing"] },
  { name: "Leh-Ladakh Expedition", duration: "8D / 7N", places: "Srinagar, Sonmarg, Kargil, Leh, Ladakh", bestFor: "Road-trip seekers", image: "/images/image8.jpeg", highlights: ["High passes", "Acclimatized pace", "Permit guidance"] },
];

const defaultActivities = [
  ["SKI", "Skiing", "Gulmarg slopes, instructors, equipment, and peak-season support.", "image15"],
  ["TRK", "Trekking", "Pahalgam, Aru, Sonmarg, and alpine trails with local guidance.", kashmirWebImages.pahalgam],
  ["CMP", "Camping", "Valley camps, bonfires, outdoor meals, and safety-led routes.", "image05"],
  ["GND", "Gondola Ride", "Gulmarg Gondola coordination with weather-aware planning.", "image10"],
  ["HRS", "Horse Riding", "Meadow rides around Betaab Valley, Yusmarg, and scenic points.", kashmirWebImages.yusmarg],
  ["FSH", "Fishing", "Quiet river and lake days with permit guidance and local experts.", kashmirWebImages.wular],
  ["SNW", "Snow Adventure", "Snowmobile, sledging, snowfall shoots, and winter transfers.", "image13"],
  ["NTR", "Local Kashmir", "Gardens, houseboats, markets, food, crafts, lakes, and village life.", kashmirWebImages.dalLake],
];
const activities = ref(loadStoredValue("kashmir-activities", defaultActivities));

const defaultDestinations = [
  ["Srinagar & Dal Lake", kashmirWebImages.dalLake, "Shikara rides, houseboats, Chashme Shahi, Mughal Gardens, Pari Mahal, Hazratbal, old-city markets, food trails, and airport support."],
  ["Gulmarg", kashmirWebImages.gulmarg, "Gondola rides, Apharwat snow, skiing, snowboarding, snowmobile options, meadow walks, premium hotels, and winter transfers."],
  ["Sonmarg", kashmirWebImages.sonmarg, "Thajiwas Glacier, snow points, Sindh River views, pony routes, fishing, mountain photography, and onward Kargil or Leh journeys."],
  ["Pahalgam, Aru & Chandanwari", kashmirWebImages.pahalgam, "Lidder River, Betaab Valley, Aru Valley, Chandanwari, pony rides, riverside stays, trekking, and camping add-ons."],
  ["Yusmarg", kashmirWebImages.yusmarg, "Quiet meadows, Doodhganga River, pine forests, Nilnag walks, horse riding, fishing, picnics, and offbeat photography."],
  ["Gurez & Tulail Valleys", kashmirWebImages.gurez, "Habba Khatoon peak, Kishanganga River, Dawar, Tulail's wooden villages, remote mountain roads, local culture, and offbeat multi-day itineraries."],
  ["Doodhpathri", kashmirWebImages.doodhpathri, "The Valley of Milk, rolling meadows, cold streams, pine forests, picnic days, family walks, and scenic countryside drives."],
  ["Leh & Kargil", kashmirWebImages.leh, "Srinagar–Sonmarg–Kargil–Leh road journeys, monasteries, high-altitude landscapes, acclimatized pacing, and permit guidance."],
  ["Wular & Manasbal Lakes", kashmirWebImages.wular, "Freshwater lake views, birding, fishing culture, quiet drives, village life, and relaxed extensions from Srinagar or Gurez routes."],
  ["Mughal Gardens & Pari Mahal", "image07", "Nishat Bagh, Shalimar Bagh, Chashme Shahi, Pari Mahal, spring flowers, heritage walks, and family photography."],
  ["Houseboats & Shikara Life", "image22", "Lake-view houseboats, sunrise Shikara rides, floating markets, local crafts, honeymoon evenings, and waterfront dining."],
  ["Kashmir Local Markets", "image12", "Lal Chowk, old Srinagar bazaars, pashmina, papier-mache, dry fruits, saffron, bakeries, cafes, and local food trails."],
];
const destinations = ref(
  loadStoredValue("kashmir-destinations", defaultDestinations).map((item) =>
    item[0] === "Gurez Valley"
      ? [
          "Gurez & Tulail Valleys",
          item[1],
          "Habba Khatoon peak, Kishanganga River, Dawar, Tulail's wooden villages, remote mountain roads, local culture, and offbeat multi-day itineraries.",
        ]
      : item,
  ),
);

const defaultAttractionHighlights = [
  ["Lakes & Shikara", "Dal Lake, Wular Lake, Manasbal Lake, houseboats, floating markets, sunrise and sunset Shikara rides."],
  ["Srinagar Heritage", "Chashme Shahi, Nishat Bagh, Shalimar Bagh, Pari Mahal, Hazratbal, old city lanes, markets, and handicrafts."],
  ["Snow & Gondola", "Gulmarg skiing, beginner lessons, Gondola phases, snowmobile, sledging, winter clothing, and weather-aware transfers."],
  ["Valleys & Outdoors", "Aru Valley, Chandanwari, Yusmarg, Doodhpathri, Gurez, camping, trekking, fishing, pony rides, and bonfires."],
];
const attractionHighlights = ref(loadStoredValue("kashmir-attractions", defaultAttractionHighlights));

const inquiryAssurances = [
  ["1", "Send your requirements", "Share dates, guest count, destinations, budget, and preferred hotel category."],
  ["2", "Receive a clear plan", "Our team confirms the route, stays, cab, activities, inclusions, and estimated price."],
  ["3", "Confirm with confidence", "Review the details, ask questions, and book only after everything is clearly agreed."],
];

const defaultFaqs = [
  ["Can pricing change in winter?", "Yes. Gulmarg and Sonamarg peak winter pricing can increase due to demand, weather, transportation limits, activity availability, and hotel inventory."],
  ["Do you support custom packages?", "Yes. Solo, couple, family, group, student, luxury, budget, airport-to-airport, and custom package types are supported."],
  ["Can this connect to real payment and weather APIs?", "The front-end is structured for Razorpay, Stripe, UPI, live weather, AI chatbot, multilingual content, and backend admin integration."],
];
const faqs = ref(loadStoredValue("kashmir-faqs", defaultFaqs));

const defaultPackageBenefits = [
  ["Private cab", "Airport pickup, intercity transfers, sightseeing stops, and driver coordination are planned before arrival."],
  ["Stay options", "Houseboats, boutique hotels, family rooms, heated winter stays, and luxury resorts can be matched to budget."],
  ["Activity support", "Skiing, Gondola, pony rides, camping, guides, snow activities, and permits are coordinated by local teams."],
  ["Trip safety", "Weather checks, backup timing, route updates, and on-call support help guests travel with confidence."],
];
const packageBenefits = ref(loadStoredValue("kashmir-package-benefits", defaultPackageBenefits));

const defaultSeasonalPlans = [
  ["Winter", "December to March", "Gulmarg skiing, snowfall days, snowmobile rides, heated stays, and short scenic routes."],
  ["Spring", "March to May", "Tulip Garden, Mughal Gardens, Dal Lake, soft adventure, and relaxed family sightseeing."],
  ["Summer", "May to September", "Pahalgam, Sonamarg, alpine meadows, pony rides, trekking, camping, and river views."],
  ["Autumn", "October to November", "Chinar colors, quiet stays, premium photography routes, and honeymoon-friendly pacing."],
];
const seasonalPlans = ref(loadStoredValue("kashmir-seasonal-plans", defaultSeasonalPlans));

const defaultRouteIdeas = [
  ["Classic Kashmir Circuit", "Srinagar -> Gulmarg -> Pahalgam -> Sonamarg", "Best for first-time guests who want lakes, snow points, valleys, and gardens in one balanced plan."],
  ["Honeymoon Slow Route", "Srinagar -> Gulmarg -> Pahalgam", "Premium stays, private cab time, Shikara rides, candlelight dinner, and relaxed late starts."],
  ["Adventure Route", "Gulmarg -> Sonamarg -> Pahalgam", "Built around snow sports, trekking, camping, pony trails, and mountain-view days."],
];
const routeIdeas = ref(loadStoredValue("kashmir-route-ideas", defaultRouteIdeas));

const defaultBookingSteps = [
  ["01", "Share dates", "Send travel month, group size, preferred destinations, and budget range."],
  ["02", "Get route plan", "Receive a practical day-wise Kashmir itinerary with hotel and activity options."],
  ["03", "Confirm booking", "Lock the package with advance payment and receive confirmation details."],
  ["04", "Travel support", "Get pickup coordination, daily check-ins, weather guidance, and emergency help."],
];
const bookingSteps = ref(loadStoredValue("kashmir-booking-steps", defaultBookingSteps));

const supportCards = [
  ["Fast quote", "Most inquiries can receive a route and price range quickly on WhatsApp."],
  ["Custom changes", "Trips can be adjusted for elders, kids, honeymooners, photographers, and group travel."],
  ["Local guidance", "Get help with timing, snow conditions, clothing, permits, and realistic travel distances."],
];

const selectedPackage = ref(packages.value[0]?.price || 0);
const travelers = ref(2);
const priceClass = ref(1);
const bookingInquiry = ref({
  travelDate: "",
  name: "",
  email: "",
  phone: "",
  hotelPreference: "",
  transportPreference: "",
  mealPreference: "",
  activities: "",
  budgetRange: "",
  contactMethod: "WhatsApp",
  notes: "",
});
const bookingInquiryStatus = ref("");
const isBookingSubmitting = ref(false);
const callbackForm = ref({ name: "", phone: "", time: "Today, 6 PM - 9 PM" });
const callbackStatus = ref("");
let bookingInquiryStatusTimeout = null;
const web3FormsAccessKey = "3401ac69-832e-416d-b7e2-499ceed01137";
let revealObserver = null;

function observeRevealElements() {
  if (!revealObserver) return;
  document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
    revealObserver.observe(element);
  });
}

const travelTypes = ["Honeymoon", "Family", "Group", "Adventure", "Luxury"];
const trustBadges = ["Local Kashmir experts", "Verified stays", "Custom itineraries", "Transparent pricing", "24/7 trip support"];
const callbackTimes = ["Today, 6 PM - 9 PM", "Tomorrow morning", "Tomorrow evening"];

const detailQuickFacts = computed(() => [
  ["Duration", displayDuration(detailPackage.value?.duration || "Custom")],
  ["Best For", packageIsWinter(detailPackage.value) ? "Winter & adventure" : detailPackage.value?.tag || "Kashmir holiday"],
  ["Stay Type", packageIsWinter(detailPackage.value) ? "Heated stays / resorts" : "Hotel / houseboat"],
  ["Transport", "Private cab options"],
  ["Season", packageIsWinter(detailPackage.value) ? "Snow season" : "All-season route"],
  ["Support", "Local trip coordinator"],
]);

const detailPackageInclusions = computed(() =>
  Array.isArray(detailPackage.value?.inclusions) && detailPackage.value.inclusions.length
    ? detailPackage.value.inclusions
    : defaultPackageInclusionsFor(detailPackage.value),
);

const detailPackageExclusions = computed(() =>
  Array.isArray(detailPackage.value?.exclusions) && detailPackage.value.exclusions.length
    ? detailPackage.value.exclusions
    : defaultPackageExclusionsFor(),
);

const detailDynamicServiceSections = computed(() => [
  ["package-accommodation", "Accommodation", detailPackage.value?.accommodation || defaultPackageServicesFor(detailPackage.value).accommodation],
  ["package-meals", "Meal Plan", detailPackage.value?.meals || defaultPackageServicesFor(detailPackage.value).meals],
  ["package-transportation", "Transportation", detailPackage.value?.transportation || defaultPackageServicesFor(detailPackage.value).transportation],
  ["package-sightseeing", "Sightseeing", detailPackage.value?.routeDetails || "Dal Lake, gardens, valleys, snow points, and route stops are planned as applicable."],
  ["package-activities", "Activities", detailPackage.value?.activities || defaultPackageServicesFor(detailPackage.value).activities],
  ["package-guide-services", "Guide Services", detailPackage.value?.guideServices || defaultPackageServicesFor(detailPackage.value).guide],
]);

const relatedPackages = computed(() => {
  const current = detailPackage.value?.name;
  const types = detailPackage.value?.types || [];
  const manualNames = Array.isArray(detailPackage.value?.relatedPackages) ? detailPackage.value.relatedPackages : [];
  const manualMatches = manualNames
    .map((name) => publicPackages.value.find((item) => item.name === name || slugifyPackageName(item.name) === slugifyPackageName(name)))
    .filter(Boolean)
    .filter((item) => item.name !== current);
  if (manualMatches.length) return manualMatches.slice(0, 3);
  return publicPackages.value
    .filter((item) => item.name !== current)
    .sort((a, b) => {
      const aScore = (a.types || []).filter((type) => types.includes(type)).length;
      const bScore = (b.types || []).filter((type) => types.includes(type)).length;
      return bScore - aScore;
    })
    .slice(0, 3);
});

watch(detailPackage, (item) => {
  if (currentPage.value === "packageDetail" && item?.price) {
    selectedPackage.value = item.price;
  }
}, { immediate: true });
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
const selectedPackageName = computed(() => publicPackages.value.find((item) => Number(item.price) === Number(selectedPackage.value))?.name || "Custom Kashmir Package");
const selectedPriceClassName = computed(() => {
  if (Number(priceClass.value) === 2.1) return "VIP";
  if (Number(priceClass.value) === 1.65) return "Luxurious";
  if (Number(priceClass.value) === 1.25) return "Premium";
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

  if (nextPath === "/honeymoon-packages") {
    activeFilter.value = "honeymoon";
  } else if (nextPath === "/packages" && currentPath.value !== "/packages") {
    activeFilter.value = "all";
  }

  if (currentPath.value !== nextPath) {
    window.history.pushState({}, "", nextPath);
    currentPath.value = nextPath;
    nextTick(observeRevealElements);
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
  openTripPlanner("reserve", detailPackage.value);
}

function selectPackageAndBook(item) {
  selectedPackage.value = item?.price || packages.value[0]?.price || 0;
  openTripPlanner("reserve", item);
}

function openTripPlanner(mode = "plan", item = null) {
  tripPlannerMode.value = mode;
  if (item?.price) selectedPackage.value = item.price;
  const packageNote = item?.name ? `${mode === "reserve" ? "Reserve package" : "Question about"}: ${item.name}` : "";
  bookingInquiry.value = {
    ...bookingInquiry.value,
    notes: packageNote || bookingInquiry.value.notes,
  };
  isTripPlannerOpen.value = true;
}

function pickPlannerChoice(label) {
  bookingInquiry.value.notes = `${bookingInquiry.value.notes ? `${bookingInquiry.value.notes} | ` : ""}Travel type: ${label}`;
}

function appendPlannerNote(label, value) {
  bookingInquiry.value.notes = `${bookingInquiry.value.notes ? `${bookingInquiry.value.notes} | ` : ""}${label}: ${value}`;
}

function requestCallback() {
  if (!callbackForm.value.name.trim() || !validatePhone(callbackForm.value.phone)) {
    callbackStatus.value = "Please add your name and a valid 10-digit phone number.";
    window.setTimeout(() => { callbackStatus.value = ""; }, 3000);
    return;
  }
  const text = `Please call me back. Name: ${callbackForm.value.name}. Phone: ${callbackForm.value.phone}. Preferred time: ${callbackForm.value.time}.`;
  window.open(whatsappLink(text), "_blank", "noopener");
  callbackStatus.value = "Callback request ready on WhatsApp. Our team will follow up.";
  callbackForm.value = { name: "", phone: "", time: "Today, 6 PM - 9 PM" };
}

function handlePopState() {
  currentPath.value = normalizePath(window.location.pathname);
  if (currentPath.value === "/honeymoon-packages") activeFilter.value = "honeymoon";
  if (currentPath.value === "/packages") activeFilter.value = "all";
  isMenuOpen.value = false;
  isMoreMenuOpen.value = false;
}

function toggleFaq(index) {
  openFaqs.value = openFaqs.value.includes(index) ? openFaqs.value.filter((item) => item !== index) : [...openFaqs.value, index];
}

function toggleMentorProfile(index) {
  openMentorProfiles.value = openMentorProfiles.value.includes(index)
    ? openMentorProfiles.value.filter((item) => item !== index)
    : [...openMentorProfiles.value, index];
}

function mentorParagraphs(profile) {
  return String(profile?.bio || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function mentorPortraitStyle(profile) {
  const needsBorderCrop = String(profile?.name || "").toLowerCase().includes("hafeeza");
  return { transform: `scale(${needsBorderCrop ? 1.035 : 1})` };
}

function moveManagedItem(collection, index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= collection.length) return;
  const [item] = collection.splice(index, 1);
  collection.splice(nextIndex, 0, item);
}

const bookingForm = ref({ name: "", email: "", phone: "", destination: "", travelDate: "", guests: 2, details: "" });
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

  if (isRecaptchaEnabled.value && !recaptchaTokens.value.booking) {
    setBookingInquiryStatus("Please complete the Google reCAPTCHA verification.");
    return;
  }

  isBookingSubmitting.value = true;
  setBookingInquiryStatus("Sending booking inquiry...", false);

  const formData = new FormData();
  formData.append("access_key", web3FormsAccessKey);
  formData.append("subject", "New Snow Feather Adventures Booking Inquiry");
  formData.append("from_name", "Snow Feather Adventures Website");
  formData.append("Package", selectedPackageName.value);
  formData.append("Travel Date", bookingInquiry.value.travelDate || "Not selected");
  formData.append("Travelers", String(travelers.value));
  formData.append("Pricing Class", selectedPriceClassName.value);
  formData.append("Name", bookingInquiry.value.name);
  formData.append("Email", bookingInquiry.value.email);
  formData.append("Phone", bookingInquiry.value.phone);
  formData.append("Hotel Preference", bookingInquiry.value.hotelPreference || "Not selected");
  formData.append("Transportation Preference", bookingInquiry.value.transportPreference || "Not selected");
  formData.append("Meal Preference", bookingInquiry.value.mealPreference || "Not selected");
  formData.append("Activities Interested In", bookingInquiry.value.activities || "Not selected");
  formData.append("Budget Range", bookingInquiry.value.budgetRange || "Not selected");
  formData.append("Preferred Contact Method", bookingInquiry.value.contactMethod || "WhatsApp");
  formData.append("Notes", bookingInquiry.value.notes || "No extra notes");
  if (isRecaptchaEnabled.value) {
    formData.append("g-recaptcha-response", recaptchaTokens.value.booking);
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Unable to send booking inquiry.");
    }

    setBookingInquiryStatus("Thank you. Our Kashmir travel expert will contact you shortly with the best available package options.");
    bookingInquiry.value = {
      travelDate: "",
      name: "",
      email: "",
      phone: "",
      hotelPreference: "",
      transportPreference: "",
      mealPreference: "",
      activities: "",
      budgetRange: "",
      contactMethod: "WhatsApp",
      notes: "",
    };
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
  Destination: ${bookingForm.value.destination || "Not selected"}
  Travel Date: ${bookingForm.value.travelDate || "Not selected"}
  Guests: ${bookingForm.value.guests || "Not specified"}
  Details: ${bookingForm.value.details}
  `;

  window.location.href = whatsappLink(message);
  bookingForm.value = { name: "", email: "", phone: "", destination: "", travelDate: "", guests: 2, details: "" };
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
  localStorage.setItem("kashmir-site-content-v4", JSON.stringify(siteContent.value));
  localStorage.setItem("kashmir-packages-premium-v3", JSON.stringify(packages.value));
  localStorage.setItem("kashmir-gallery-images-v2", JSON.stringify(galleryImages.value));
  localStorage.setItem("kashmir-gallery-collections", JSON.stringify(galleryCollections.value));
  localStorage.setItem("kashmir-gallery-highlights", JSON.stringify(galleryHighlights.value));
  localStorage.setItem("kashmir-blog-posts", JSON.stringify(blogPosts.value));
  notifyBlogUpdate();
  localStorage.setItem("kashmir-blog-guides", JSON.stringify(blogGuides.value));
  localStorage.setItem("kashmir-blog-checklist", JSON.stringify(blogChecklist.value));
  localStorage.setItem("kashmir-purpose-cards", JSON.stringify(purposeCards.value));
  localStorage.setItem("kashmir-activities", JSON.stringify(activities.value));
  localStorage.setItem("kashmir-destinations", JSON.stringify(destinations.value));
  localStorage.setItem("kashmir-attractions", JSON.stringify(attractionHighlights.value));
  localStorage.setItem("kashmir-faqs", JSON.stringify(faqs.value));
  localStorage.setItem("kashmir-package-benefits", JSON.stringify(packageBenefits.value));
  localStorage.setItem("kashmir-seasonal-plans", JSON.stringify(seasonalPlans.value));
  localStorage.setItem("kashmir-route-ideas", JSON.stringify(routeIdeas.value));
  localStorage.setItem("kashmir-booking-steps", JSON.stringify(bookingSteps.value));
  localStorage.setItem("kashmir-registration-details", JSON.stringify(registrationDetails.value));
  localStorage.setItem("kashmir-experience-stats", JSON.stringify(experienceStats.value));
  localStorage.setItem("kashmir-accommodation-categories", JSON.stringify(accommodationCategories.value));
  localStorage.setItem("kashmir-service-groups", JSON.stringify(serviceGroups.value));
  localStorage.setItem("kashmir-trust-guarantees", JSON.stringify(trustGuarantees.value));
  localStorage.setItem("kashmir-testimonials", JSON.stringify(testimonials.value));
  localStorage.setItem("kashmir-mentors", JSON.stringify(mentors.value));
  localStorage.setItem("kashmir-inclusion-showcase", JSON.stringify(inclusionShowcase.value));
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
  purposeCards.value = defaultPurposeCards.map((item) => ({ ...item }));
  activities.value = defaultActivities.map((item) => [...item]);
  destinations.value = defaultDestinations.map((item) => [...item]);
  attractionHighlights.value = defaultAttractionHighlights.map((item) => [...item]);
  faqs.value = defaultFaqs.map((item) => [...item]);
  packageBenefits.value = defaultPackageBenefits.map((item) => [...item]);
  seasonalPlans.value = defaultSeasonalPlans.map((item) => [...item]);
  routeIdeas.value = defaultRouteIdeas.map((item) => [...item]);
  bookingSteps.value = defaultBookingSteps.map((item) => [...item]);
  registrationDetails.value = defaultRegistrationDetails.map((item) => [...item]);
  experienceStats.value = defaultExperienceStats.map((item) => [...item]);
  accommodationCategories.value = defaultAccommodationCategories.map((item) => ({ ...item, features: [...item.features] }));
  serviceGroups.value = defaultServiceGroups.map((item) => ({ ...item, items: [...item.items] }));
  trustGuarantees.value = [...defaultTrustGuarantees];
  testimonials.value = defaultTestimonials.map((item) => ({ ...item }));
  mentors.value = defaultMentors.map((item) => ({ ...item }));
  inclusionShowcase.value = {
    ...defaultInclusionShowcase,
    items: defaultInclusionShowcase.items.map((item) => ({ ...item })),
  };
  selectedPackage.value = packages.value[0]?.price || 0;
  localStorage.removeItem("kashmir-site-content");
  localStorage.removeItem("kashmir-site-content-v2");
  localStorage.removeItem("kashmir-site-content-v3");
  localStorage.removeItem("kashmir-site-content-v4");
  localStorage.removeItem("kashmir-packages");
  localStorage.removeItem("kashmir-packages-premium-v2");
  localStorage.removeItem("kashmir-packages-premium-v3");
  localStorage.removeItem("kashmir-gallery-images");
  localStorage.removeItem("kashmir-gallery-images-v2");
  localStorage.removeItem("kashmir-gallery-collections");
  localStorage.removeItem("kashmir-gallery-highlights");
  localStorage.removeItem("kashmir-blog-posts");
  localStorage.removeItem("kashmir-blog-guides");
  localStorage.removeItem("kashmir-blog-checklist");
  localStorage.removeItem("kashmir-purpose-cards");
  localStorage.removeItem("kashmir-activities");
  localStorage.removeItem("kashmir-destinations");
  localStorage.removeItem("kashmir-attractions");
  localStorage.removeItem("kashmir-faqs");
  localStorage.removeItem("kashmir-package-benefits");
  localStorage.removeItem("kashmir-seasonal-plans");
  localStorage.removeItem("kashmir-route-ideas");
  localStorage.removeItem("kashmir-booking-steps");
  localStorage.removeItem("kashmir-registration-details");
  localStorage.removeItem("kashmir-experience-stats");
  localStorage.removeItem("kashmir-accommodation-categories");
  localStorage.removeItem("kashmir-service-groups");
  localStorage.removeItem("kashmir-trust-guarantees");
  localStorage.removeItem("kashmir-testimonials");
  localStorage.removeItem("kashmir-mentors");
  localStorage.removeItem("kashmir-inclusion-showcase");
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

function packageItineraryText(item) {
  return Array.isArray(item.itinerary) ? item.itinerary.join("\n") : "";
}

function updatePackageItinerary(item, value) {
  item.itinerary = String(value || "")
    .split("\n")
    .map((step) => step.trim())
    .filter(Boolean);
}

function multiLineList(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function updateMultiLineList(target, field, value) {
  target[field] = String(value || "")
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function movePackage(index, direction) {
  moveManagedItem(packages.value, index, direction);
  packages.value.forEach((item, itemIndex) => {
    item.priority = itemIndex + 1;
  });
  saveAdminChanges();
}

function addManagedItem(collection, item) {
  collection.push(item);
}

function deleteManagedItem(collection, index) {
  collection.splice(index, 1);
}

function updateManagedImage(event, collection, index, imageIndex) {
  readImageFile(event, (result) => {
    collection[index][imageIndex] = result;
  });
}

function updateManagedObjectImage(event, collection, index, field = "image") {
  readImageFile(event, (result) => {
    collection[index][field] = result;
  });
}

function updateInclusionImage(event, index = null) {
  readImageFile(event, (result) => {
    if (index === null) inclusionShowcase.value.backgroundImage = result;
    else inclusionShowcase.value.items[index].image = result;
  });
}

function commaList(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function updateCommaList(target, field, value) {
  target[field] = textListToArray(value);
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
    category: "Kashmir Package",
    status: "active",
    featured: false,
    priority: packages.value.length + 1,
    packageType: "standard",
    types: [],
    routeTitle: "",
    routeDetails: "",
    cities: [],
    highlights: [],
    itinerary: ["Add day-wise itinerary"],
    inclusions: defaultPackageInclusionsFor(),
    exclusions: defaultPackageExclusionsFor(),
    accommodation: "Add accommodation details",
    meals: "Add meal plan details",
    transportation: "Add transportation details",
    activities: "Add included or optional activities",
    guideServices: "Add guide service details",
    reservationNote: "Guests should reserve at least one month in advance for better availability.",
    relatedPackages: [],
    tiers: [
      ["Standard", "On request", "Essential stay, cab, and route support"],
      ["Premium", "On request", "Comfort hotels and private trip planning"],
      ["Luxurious", "On request", "Premium stays and curated experiences"],
      ["VIP", "Custom quote", "Dedicated concierge and best available services"],
    ],
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
  if (window.location.pathname === "/home" || window.location.pathname === "/home/") {
    window.history.replaceState({}, "", "/");
  }
  if (currentPath.value === "/honeymoon-packages") {
    activeFilter.value = "honeymoon";
  }
  window.addEventListener("popstate", handlePopState);
  window.addEventListener("storage", handleContentStorageUpdate);
  if ("BroadcastChannel" in window) {
    blogSyncChannel = new BroadcastChannel("snow-feather-live-content");
    blogSyncChannel.addEventListener("message", (event) => {
      if (event.data?.type === "blog-posts-updated") loadLatestBlogPosts();
    });
  }
  updateSeoMeta();
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.14 },
    );
    requestAnimationFrame(observeRevealElements);
  } else {
    requestAnimationFrame(() => {
      document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
    });
  }
  initialLoadingTimeout = window.setTimeout(() => {
    isInitialLoading.value = false;
    initialLoadingTimeout = null;
    nextTick(observeRevealElements);
  }, 1200);
});

watch(pageSeo, updateSeoMeta);

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
  window.removeEventListener("storage", handleContentStorageUpdate);
  blogSyncChannel?.close();
  blogSyncChannel = null;
  if (blogSyncTimeout) {
    window.clearTimeout(blogSyncTimeout);
    blogSyncTimeout = null;
  }
  if (initialLoadingTimeout) {
    window.clearTimeout(initialLoadingTimeout);
  }
  revealObserver?.disconnect();
  revealObserver = null;
});
</script>

<template>
  <Transition name="preloader-fade">
    <section v-if="isInitialLoading" class="premium-preloader fixed inset-0 z-[100] grid min-h-screen place-items-center overflow-hidden px-4 text-white" role="status" aria-live="polite">
      <div class="preloader-sky" aria-hidden="true"></div>
      <div class="preloader-snow" aria-hidden="true"></div>
      <div class="relative grid justify-items-center text-center">
        <div class="preloader-logo-wrap">
          <img :src="logoSrc" :alt="`${brandName} logo`" class="h-20 w-20 rounded-full object-contain" />
          <span class="preloader-feather" aria-hidden="true"></span>
        </div>
        <p class="mt-6 text-xs font-black uppercase tracking-[0.28em] text-gold">{{ brandName }}</p>
        <h1 class="mt-3 font-display text-3xl font-extrabold sm:text-4xl">Crafting your Snow Feather experience...</h1>
        <p class="mt-3 max-w-md text-sm font-semibold leading-6 text-white/62">Preparing your Kashmir journey with local care, mountain calm, and a little snow in the air.</p>
        <div class="preloader-progress mt-7" aria-hidden="true"><span></span></div>
      </div>
    </section>
  </Transition>

  <section v-if="!isInitialLoading && isAdminRoute" class="min-h-screen bg-night text-white">
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
          <label class="grid gap-2 text-sm font-bold lg:col-span-2">Experience line
            <input v-model="siteContent.experienceLine" class="rounded-lg border border-white/[0.18] bg-white px-4 py-3 text-night" />
          </label>
          <label class="grid gap-2 text-sm font-bold lg:col-span-3">Trust promise
            <textarea v-model="siteContent.trustPromise" class="min-h-20 rounded-lg border border-white/[0.18] bg-white px-4 py-3 text-night"></textarea>
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
              <input :value="phoneDisplay" readonly class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
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
            <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] lg:col-span-3">Google Maps search query
              <input v-model="siteContent.mapQuery" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
            </label>
          </div>
        </div>

        <div class="mt-6 rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
          <div>
            <h3 class="text-xl font-black">Website sections manager</h3>
            <p class="mt-1 text-sm text-white/[0.68]">Manage the public destination, experience, planning, FAQ, and business-information sections.</p>
          </div>

          <div class="mt-4 grid gap-4">
            <details class="rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <summary class="cursor-pointer font-black">Vision, mission, and motto</summary>
              <div class="mt-4 grid gap-3">
                <article v-for="(item, index) in purposeCards" :key="`admin-purpose-${index}`" class="grid gap-3 rounded-lg border border-white/[0.12] p-3 md:grid-cols-3">
                  <input v-model="item.label" placeholder="Label" class="bg-white text-night" />
                  <input v-model="item.title" placeholder="Title" class="bg-white text-night md:col-span-2" />
                  <textarea v-model="item.text" placeholder="Description" class="min-h-20 bg-white text-night md:col-span-3"></textarea>
                  <button type="button" class="justify-self-start rounded-lg border border-gold/40 px-3 py-2 text-xs font-black text-gold" @click="deleteManagedItem(purposeCards, index)">Delete</button>
                </article>
                <button type="button" class="justify-self-start rounded-lg bg-white px-4 py-2 text-sm font-black text-night" @click="addManagedItem(purposeCards, { label: 'New value', title: 'New title', text: 'Add description' })">Add Card</button>
              </div>
            </details>

            <details class="rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <summary class="cursor-pointer font-black">Mentors and adventure experts</summary>
              <div class="mt-4">
                <div class="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <p class="text-sm text-white/[0.68]">Add, edit, reorder, replace portraits, or delete profiles shown on the About page.</p>
                  <button type="button" class="rounded-lg bg-white px-4 py-2 text-sm font-black text-night" @click="addManagedItem(mentors, { name: 'New Mentor', role: 'Advisor', credentials: 'Add credentials', image: '/snow-feather-adventures-logo-v2.png', quote: 'Add a short profile quote.', bio: 'Add the full biography here.' })">Add Mentor</button>
                </div>
                <div class="grid gap-4">
                  <article v-for="(mentor, index) in mentors" :key="`admin-mentor-${index}`" class="rounded-lg border border-white/[0.12] bg-white/[0.05] p-4">
                    <div class="grid gap-4 lg:grid-cols-[12rem_1fr]">
                      <div>
                        <div class="image-cover h-56 rounded-lg" :style="imageStyle(mentor.image)"></div>
                        <label class="mt-2 block cursor-pointer rounded-lg border border-white/20 px-3 py-2 text-center text-xs font-black">Replace portrait<input type="file" accept="image/*" class="hidden" @change="updateManagedObjectImage($event, mentors, index)" /></label>
                        <div class="mt-2 grid grid-cols-2 gap-2">
                          <button type="button" :disabled="index === 0" class="rounded-lg border border-white/20 px-2 py-2 text-xs font-black disabled:opacity-30" @click="moveManagedItem(mentors, index, -1)">Move Up</button>
                          <button type="button" :disabled="index === mentors.length - 1" class="rounded-lg border border-white/20 px-2 py-2 text-xs font-black disabled:opacity-30" @click="moveManagedItem(mentors, index, 1)">Move Down</button>
                        </div>
                        <button type="button" class="mt-2 w-full rounded-lg border border-gold/40 px-3 py-2 text-xs font-black text-gold" @click="deleteManagedItem(mentors, index)">Delete Profile</button>
                      </div>
                      <div class="grid gap-3 md:grid-cols-2">
                        <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/70">Full name
                          <input v-model="mentor.name" class="bg-white text-night" />
                        </label>
                        <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/70">Role
                          <input v-model="mentor.role" class="bg-white text-night" />
                        </label>
                        <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/70 md:col-span-2">Credentials
                          <input v-model="mentor.credentials" class="bg-white text-night" />
                        </label>
                        <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/70 md:col-span-2">Featured quote
                          <textarea v-model="mentor.quote" class="min-h-20 bg-white text-night"></textarea>
                        </label>
                        <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/70 md:col-span-2">Full biography
                          <textarea v-model="mentor.bio" class="min-h-72 bg-white text-night"></textarea>
                        </label>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </details>

            <details class="rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <summary class="cursor-pointer font-black">Package inclusions showcase</summary>
              <div class="mt-4 grid gap-4">
                <div class="grid gap-3 md:grid-cols-2">
                  <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/70">Section label
                    <input v-model="inclusionShowcase.eyebrow" class="bg-white text-night" />
                  </label>
                  <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/70">Section title
                    <input v-model="inclusionShowcase.title" class="bg-white text-night" />
                  </label>
                </div>
                <div class="rounded-lg border border-white/12 p-3">
                  <div class="image-cover h-40 rounded-lg" :style="imageStyle(inclusionShowcase.backgroundImage)"></div>
                  <label class="mt-2 inline-block cursor-pointer rounded-lg border border-white/20 px-3 py-2 text-xs font-black">Change background image<input type="file" accept="image/*" class="hidden" @change="updateInclusionImage($event)" /></label>
                </div>
                <div class="grid gap-3 lg:grid-cols-3">
                  <article v-for="(item, index) in inclusionShowcase.items" :key="`admin-inclusion-${index}`" class="rounded-lg border border-white/12 p-3">
                    <div class="image-cover h-32 rounded-lg" :style="imageStyle(item.image)"></div>
                    <label class="mt-3 grid gap-1 text-xs font-black uppercase tracking-wide text-white/70">Title
                      <input v-model="item.title" class="bg-white text-night" />
                    </label>
                    <label class="mt-2 grid gap-1 text-xs font-black uppercase tracking-wide text-white/70">Description
                      <textarea v-model="item.text" class="min-h-20 bg-white text-night"></textarea>
                    </label>
                    <label class="mt-2 inline-block cursor-pointer rounded-lg border border-white/20 px-3 py-2 text-xs font-black">Change image<input type="file" accept="image/*" class="hidden" @change="updateInclusionImage($event, index)" /></label>
                  </article>
                </div>
              </div>
            </details>

            <details class="rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <summary class="cursor-pointer font-black">Homepage experience, stays, services, trust, and reviews</summary>
              <div class="mt-4 grid gap-6">
                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Experience statistics</p>
                  <div class="grid gap-2 md:grid-cols-4">
                    <div v-for="(item, index) in experienceStats" :key="`admin-stat-${index}`" class="grid gap-2 rounded-lg border border-white/12 p-3">
                      <input v-model="item[0]" placeholder="Value" class="bg-white text-night" />
                      <input v-model="item[1]" placeholder="Label" class="bg-white text-night" />
                    </div>
                  </div>
                </div>

                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Accommodation categories</p>
                  <div class="grid gap-3 md:grid-cols-2">
                    <article v-for="(stay, index) in accommodationCategories" :key="`admin-stay-${index}`" class="rounded-lg border border-white/12 p-3">
                      <div class="image-cover h-32 rounded-lg" :style="imageStyle(stay.image)"></div>
                      <div class="mt-3 grid gap-2 sm:grid-cols-2">
                        <input v-model="stay.name" placeholder="Category name" class="bg-white text-night" />
                        <input v-model="stay.tagline" placeholder="Tagline" class="bg-white text-night" />
                        <input v-model="stay.price" placeholder="Sample price" class="bg-white text-night sm:col-span-2" />
                        <textarea :value="commaList(stay.features)" placeholder="Facilities, separated by commas" class="min-h-20 bg-white text-night sm:col-span-2" @input="updateCommaList(stay, 'features', $event.target.value)"></textarea>
                      </div>
                      <label class="mt-2 inline-block cursor-pointer rounded-lg border border-white/20 px-3 py-2 text-xs font-black">Change image<input type="file" accept="image/*" class="hidden" @change="updateManagedObjectImage($event, accommodationCategories, index)" /></label>
                    </article>
                  </div>
                </div>

                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Service groups</p>
                  <div class="grid gap-3 lg:grid-cols-3">
                    <article v-for="(service, index) in serviceGroups" :key="`admin-service-${index}`" class="grid gap-2 rounded-lg border border-white/12 p-3">
                      <input v-model="service.number" placeholder="Number" class="bg-white text-night" />
                      <input v-model="service.title" placeholder="Title" class="bg-white text-night" />
                      <textarea v-model="service.text" placeholder="Description" class="min-h-20 bg-white text-night"></textarea>
                      <textarea :value="commaList(service.items)" placeholder="Services, separated by commas" class="min-h-20 bg-white text-night" @input="updateCommaList(service, 'items', $event.target.value)"></textarea>
                    </article>
                  </div>
                </div>

                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Trust guarantees</p>
                  <div class="grid gap-2 md:grid-cols-2">
                    <div v-for="(item, index) in trustGuarantees" :key="`admin-trust-${index}`" class="flex gap-2">
                      <input v-model="trustGuarantees[index]" class="min-w-0 flex-1 bg-white text-night" />
                      <button type="button" class="text-xs font-black text-gold" @click="deleteManagedItem(trustGuarantees, index)">Delete</button>
                    </div>
                  </div>
                  <button type="button" class="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-night" @click="addManagedItem(trustGuarantees, 'New guarantee')">Add Guarantee</button>
                </div>

                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Testimonials</p>
                  <div class="grid gap-3 lg:grid-cols-3">
                    <article v-for="(review, index) in testimonials" :key="`admin-review-${index}`" class="rounded-lg border border-white/12 p-3">
                      <div class="image-cover h-28 rounded-lg" :style="imageStyle(review.image)"></div>
                      <div class="mt-3 grid gap-2">
                        <input v-model="review.name" placeholder="Guest name" class="bg-white text-night" />
                        <input v-model="review.trip" placeholder="Trip name" class="bg-white text-night" />
                        <input v-model="review.rating" placeholder="Rating" class="bg-white text-night" />
                        <textarea v-model="review.text" placeholder="Review" class="min-h-24 bg-white text-night"></textarea>
                      </div>
                      <label class="mt-2 inline-block cursor-pointer rounded-lg border border-white/20 px-3 py-2 text-xs font-black">Change photo<input type="file" accept="image/*" class="hidden" @change="updateManagedObjectImage($event, testimonials, index)" /></label>
                    </article>
                  </div>
                </div>
              </div>
            </details>

            <details class="rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <summary class="cursor-pointer font-black">Activities and experiences</summary>
              <div class="mt-4 grid gap-3 md:grid-cols-2">
                <article v-for="(item, index) in activities" :key="`admin-activity-${index}`" class="rounded-lg border border-white/[0.12] p-3">
                  <div class="image-cover h-32 rounded-lg" :style="imageStyle(item[3])"></div>
                  <div class="mt-3 grid gap-2 sm:grid-cols-2">
                    <input v-model="item[0]" maxlength="6" placeholder="Short code" class="bg-white text-night" />
                    <input v-model="item[1]" placeholder="Activity title" class="bg-white text-night" />
                    <textarea v-model="item[2]" placeholder="Description" class="min-h-20 bg-white text-night sm:col-span-2"></textarea>
                  </div>
                  <div class="mt-2 flex gap-2">
                    <label class="cursor-pointer rounded-lg border border-white/20 px-3 py-2 text-xs font-black">Change image<input type="file" accept="image/*" class="hidden" @change="updateManagedImage($event, activities, index, 3)" /></label>
                    <button type="button" class="rounded-lg border border-gold/40 px-3 py-2 text-xs font-black text-gold" @click="deleteManagedItem(activities, index)">Delete</button>
                  </div>
                </article>
                <button type="button" class="justify-self-start rounded-lg bg-white px-4 py-2 text-sm font-black text-night" @click="addManagedItem(activities, ['NEW', 'New activity', 'Add activity description', image('image18')])">Add Activity</button>
              </div>
            </details>

            <details class="rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <summary class="cursor-pointer font-black">Destinations</summary>
              <div class="mt-4 grid gap-3 md:grid-cols-2">
                <article v-for="(item, index) in destinations" :key="`admin-destination-${index}`" class="rounded-lg border border-white/[0.12] p-3">
                  <div class="image-cover h-32 rounded-lg" :style="imageStyle(item[1])"></div>
                  <input v-model="item[0]" maxlength="70" placeholder="Destination name" class="mt-3 w-full bg-white text-night" />
                  <textarea v-model="item[2]" placeholder="Destination details" class="mt-2 min-h-24 w-full bg-white text-night"></textarea>
                  <div class="mt-2 flex gap-2">
                    <label class="cursor-pointer rounded-lg border border-white/20 px-3 py-2 text-xs font-black">Change image<input type="file" accept="image/*" class="hidden" @change="updateManagedImage($event, destinations, index, 1)" /></label>
                    <button type="button" class="rounded-lg border border-gold/40 px-3 py-2 text-xs font-black text-gold" @click="deleteManagedItem(destinations, index)">Delete</button>
                  </div>
                </article>
                <button type="button" class="justify-self-start rounded-lg bg-white px-4 py-2 text-sm font-black text-night" @click="addManagedItem(destinations, ['New Destination', image('image18'), 'Add destination details'])">Add Destination</button>
              </div>
            </details>

            <details class="rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <summary class="cursor-pointer font-black">Attractions and package benefits</summary>
              <div class="mt-4 grid gap-5 lg:grid-cols-2">
                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Attractions</p>
                  <div class="grid gap-2">
                    <div v-for="(item, index) in attractionHighlights" :key="`admin-attraction-${index}`" class="grid gap-2 rounded-lg border border-white/[0.12] p-3">
                      <input v-model="item[0]" placeholder="Title" class="bg-white text-night" />
                      <textarea v-model="item[1]" placeholder="Description" class="min-h-20 bg-white text-night"></textarea>
                      <button type="button" class="justify-self-start text-xs font-black text-gold" @click="deleteManagedItem(attractionHighlights, index)">Delete</button>
                    </div>
                    <button type="button" class="justify-self-start rounded-lg bg-white px-3 py-2 text-xs font-black text-night" @click="addManagedItem(attractionHighlights, ['New attraction', 'Add description'])">Add Attraction</button>
                  </div>
                </div>
                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Package benefits</p>
                  <div class="grid gap-2">
                    <div v-for="(item, index) in packageBenefits" :key="`admin-benefit-${index}`" class="grid gap-2 rounded-lg border border-white/[0.12] p-3">
                      <input v-model="item[0]" placeholder="Title" class="bg-white text-night" />
                      <textarea v-model="item[1]" placeholder="Description" class="min-h-20 bg-white text-night"></textarea>
                      <button type="button" class="justify-self-start text-xs font-black text-gold" @click="deleteManagedItem(packageBenefits, index)">Delete</button>
                    </div>
                    <button type="button" class="justify-self-start rounded-lg bg-white px-3 py-2 text-xs font-black text-night" @click="addManagedItem(packageBenefits, ['New benefit', 'Add description'])">Add Benefit</button>
                  </div>
                </div>
              </div>
            </details>

            <details class="rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <summary class="cursor-pointer font-black">Season plans, route ideas, and booking steps</summary>
              <div class="mt-4 grid gap-5">
                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Season plans</p>
                  <div class="grid gap-2 md:grid-cols-2">
                    <div v-for="(item, index) in seasonalPlans" :key="`admin-season-${index}`" class="grid gap-2 rounded-lg border border-white/[0.12] p-3">
                      <input v-model="item[0]" placeholder="Season" class="bg-white text-night" />
                      <input v-model="item[1]" placeholder="Months" class="bg-white text-night" />
                      <textarea v-model="item[2]" placeholder="Description" class="min-h-20 bg-white text-night"></textarea>
                      <button type="button" class="justify-self-start text-xs font-black text-gold" @click="deleteManagedItem(seasonalPlans, index)">Delete</button>
                    </div>
                  </div>
                  <button type="button" class="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-night" @click="addManagedItem(seasonalPlans, ['New season', 'Months', 'Add description'])">Add Season</button>
                </div>
                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Route ideas</p>
                  <div class="grid gap-2 md:grid-cols-2">
                    <div v-for="(item, index) in routeIdeas" :key="`admin-route-${index}`" class="grid gap-2 rounded-lg border border-white/[0.12] p-3">
                      <input v-model="item[0]" placeholder="Route title" class="bg-white text-night" />
                      <input v-model="item[1]" placeholder="Route" class="bg-white text-night" />
                      <textarea v-model="item[2]" placeholder="Description" class="min-h-20 bg-white text-night"></textarea>
                      <button type="button" class="justify-self-start text-xs font-black text-gold" @click="deleteManagedItem(routeIdeas, index)">Delete</button>
                    </div>
                  </div>
                  <button type="button" class="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-night" @click="addManagedItem(routeIdeas, ['New route', 'Srinagar -> Destination', 'Add description'])">Add Route</button>
                </div>
                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Booking steps</p>
                  <div class="grid gap-2 md:grid-cols-2">
                    <div v-for="(item, index) in bookingSteps" :key="`admin-step-${index}`" class="grid gap-2 rounded-lg border border-white/[0.12] p-3">
                      <input v-model="item[0]" placeholder="Number" class="bg-white text-night" />
                      <input v-model="item[1]" placeholder="Title" class="bg-white text-night" />
                      <textarea v-model="item[2]" placeholder="Description" class="min-h-20 bg-white text-night"></textarea>
                      <button type="button" class="justify-self-start text-xs font-black text-gold" @click="deleteManagedItem(bookingSteps, index)">Delete</button>
                    </div>
                  </div>
                  <button type="button" class="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-night" @click="addManagedItem(bookingSteps, [String(bookingSteps.length + 1).padStart(2, '0'), 'New step', 'Add description'])">Add Step</button>
                </div>
              </div>
            </details>

            <details class="rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <summary class="cursor-pointer font-black">FAQs and registered business details</summary>
              <div class="mt-4 grid gap-5 lg:grid-cols-2">
                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">FAQs</p>
                  <div class="grid gap-2">
                    <div v-for="(item, index) in faqs" :key="`admin-faq-${index}`" class="grid gap-2 rounded-lg border border-white/[0.12] p-3">
                      <input v-model="item[0]" placeholder="Question" class="bg-white text-night" />
                      <textarea v-model="item[1]" placeholder="Answer" class="min-h-20 bg-white text-night"></textarea>
                      <button type="button" class="justify-self-start text-xs font-black text-gold" @click="deleteManagedItem(faqs, index)">Delete</button>
                    </div>
                    <button type="button" class="justify-self-start rounded-lg bg-white px-3 py-2 text-xs font-black text-night" @click="addManagedItem(faqs, ['New question?', 'Add answer'])">Add FAQ</button>
                  </div>
                </div>
                <div>
                  <p class="mb-2 text-xs font-black uppercase tracking-wide text-gold">Registered details</p>
                  <div class="grid gap-2">
                    <div v-for="(item, index) in registrationDetails" :key="`admin-registration-${index}`" class="grid gap-2 rounded-lg border border-white/[0.12] p-3">
                      <input v-model="item[0]" placeholder="Label" class="bg-white text-night" />
                      <input v-model="item[1]" placeholder="Value" class="bg-white text-night" />
                      <button type="button" class="justify-self-start text-xs font-black text-gold" @click="deleteManagedItem(registrationDetails, index)">Delete</button>
                    </div>
                    <button type="button" class="justify-self-start rounded-lg bg-white px-3 py-2 text-xs font-black text-night" @click="addManagedItem(registrationDetails, ['New detail', 'Value'])">Add Detail</button>
                  </div>
                </div>
              </div>
            </details>
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

          <article v-for="(item, index) in packages" :key="`${item.name}-${index}`" class="admin-package-card rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
            <div class="grid gap-4 lg:grid-cols-[11rem_1fr]">
              <div>
                <div class="image-cover h-36 rounded-lg" :style="{ backgroundImage: `url('${item.image}')` }"></div>
                <label class="mt-3 block cursor-pointer rounded-lg border border-white/[0.18] px-3 py-2 text-center text-xs font-black text-white hover:bg-white/[0.12]">
                  Change image
                  <input type="file" accept="image/*" class="hidden" @change="updatePackageImage($event, index)" />
                </label>
                <div class="mt-2 grid grid-cols-2 gap-2">
                  <button type="button" :disabled="index === 0" class="rounded-lg border border-white/20 px-3 py-2 text-xs font-black disabled:opacity-30" @click="movePackage(index, -1)">Move Up</button>
                  <button type="button" :disabled="index === packages.length - 1" class="rounded-lg border border-white/20 px-3 py-2 text-xs font-black disabled:opacity-30" @click="movePackage(index, 1)">Move Down</button>
                </div>
                <button type="button" class="mt-2 w-full rounded-lg border border-gold/[0.42] px-3 py-2 text-xs font-black text-gold hover:bg-gold hover:text-night" @click="deletePackage(index)">Delete package</button>
              </div>
              <div class="grid gap-3 md:grid-cols-4">
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Package name
                  <input v-model="item.name" maxlength="72" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
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
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Category
                  <input v-model="item.category" placeholder="Honeymoon / Family / Adventure" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Status
                  <select v-model="item.status" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Package type
                  <select v-model="item.packageType" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night">
                    <option value="standard">Standard</option>
                    <option value="winter">Winter</option>
                    <option value="summer">Summer</option>
                  </select>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72]">Priority
                  <input v-model.number="item.priority" type="number" min="1" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="flex items-center gap-3 rounded-lg border border-white/[0.12] bg-white/[0.06] px-3 py-3 text-xs font-black uppercase tracking-wide text-white/[0.72]">
                  <input v-model="item.featured" type="checkbox" class="h-4 w-4 !p-0 accent-[#e9ba64]" />
                  Featured package
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Filter types
                  <input :value="packageTypesText(item)" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updatePackageTypes(item, $event.target.value)" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Route location
                  <input v-model="item.routeTitle" maxlength="55" placeholder="Example: Srinagar" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Route details
                  <input v-model="item.routeDetails" maxlength="100" placeholder="Example: Dal Lake, Gulmarg, Pahalgam" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
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
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-4">Day-wise itinerary — one day per line
                  <textarea :value="packageItineraryText(item)" class="min-h-28 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updatePackageItinerary(item, $event.target.value)"></textarea>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Inclusions - one per line
                  <textarea :value="multiLineList(item.inclusions)" class="min-h-28 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updateMultiLineList(item, 'inclusions', $event.target.value)"></textarea>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Exclusions - one per line
                  <textarea :value="multiLineList(item.exclusions)" class="min-h-28 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updateMultiLineList(item, 'exclusions', $event.target.value)"></textarea>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Accommodation details
                  <textarea v-model="item.accommodation" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Meal plan
                  <textarea v-model="item.meals" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Transportation details
                  <textarea v-model="item.transportation" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Activities
                  <textarea v-model="item.activities" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Guide services
                  <textarea v-model="item.guideServices" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-2">Booking / reservation note
                  <textarea v-model="item.reservationNote" class="min-h-24 rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night"></textarea>
                </label>
                <label class="grid gap-1 text-xs font-black uppercase tracking-wide text-white/[0.72] md:col-span-4">Related package names - comma separated
                  <input :value="commaList(item.relatedPackages)" placeholder="Classic Kashmir Circuit, Kashmir Honeymoon Signature" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" @input="updateCommaList(item, 'relatedPackages', $event.target.value)" />
                </label>
                <div class="md:col-span-4">
                  <p class="text-xs font-black uppercase tracking-wide text-white/[0.72]">Four price tiers shown on package cards</p>
                  <div class="mt-2 grid gap-3">
                    <div v-for="(tier, tierIndex) in item.tiers" :key="`${index}-tier-${tierIndex}`" class="grid gap-2 rounded-lg border border-white/[0.12] bg-white/[0.06] p-3 md:grid-cols-[0.7fr_0.8fr_1.5fr]">
                      <input v-model="tier[0]" maxlength="20" placeholder="Tier name" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                      <input v-model="tier[1]" maxlength="28" placeholder="From INR 18,999 pp" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                      <input v-model="tier[2]" maxlength="110" placeholder="Tier inclusions" class="rounded-lg border border-white/[0.18] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-night" />
                    </div>
                  </div>
                </div>
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
                <div v-for="text in ['Name, category, package type, duration, description.', 'Featured image, multiple images, videos, gallery slider.', 'Solo, couple, group, Standard, Premium, Luxurious, VIP, seasonal pricing.']" :key="text" class="rounded-lg bg-white/10 p-4 text-sm leading-6">{{ text }}</div>
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

  <template v-if="!isInitialLoading && !isAdminRoute">
    <header class="site-header fixed inset-x-0 top-0 z-50 px-3 py-3 sm:px-5">
      <nav class="glass-nav mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-3 py-2.5 sm:px-4">
        <a href="/" class="flex items-center gap-3" :aria-label="`${brandName} home`" @click.prevent="navigateTo('/')">
          <span class="grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-white p-1.5 shadow-lift">
            <img :src="logoSrc" :alt="`${brandName} logo`" class="h-full w-full object-contain" />
          </span>
          <span class="leading-tight">
            <span class="block text-sm font-black tracking-tight text-night sm:text-base">{{ brandName }}</span>
            <span class="block text-[0.62rem] font-black uppercase tracking-[0.16em] text-lake">{{ brandTagline }}</span>
          </span>
        </a>

        <div class="hidden items-center gap-2 text-sm font-bold text-night/[0.78] lg:flex">
          <a
            v-for="[label, href] in navItems"
            :key="label"
            :href="href"
            class="rounded-lg px-4 py-2 transition"
            :class="currentPath === href || (href === '/packages' && currentPage === 'packageDetail') ? 'bg-night text-white shadow-lift' : 'hover:bg-white/[0.7] hover:text-lake'"
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
          <button type="button" class="rounded-lg border border-night/10 px-4 py-2 text-sm font-extrabold text-night hover:border-lake hover:text-lake" @click="isCallbackOpen = true">Callback</button>
          <button type="button" class="rounded-lg bg-gold px-4 py-2 text-sm font-extrabold text-night shadow-lift hover:bg-white" @click="openTripPlanner('plan')">Plan Trip</button>
        </div>

        <button class="grid h-10 w-10 place-items-center rounded-xl border border-night/10 bg-white/70 text-night lg:hidden" aria-label="Open menu" @click="isMenuOpen = !isMenuOpen">
          <span class="grid gap-1">
            <span class="block h-0.5 w-5 rounded bg-current"></span>
            <span class="block h-0.5 w-5 rounded bg-current"></span>
            <span class="block h-0.5 w-5 rounded bg-current"></span>
          </span>
        </button>
      </nav>

      <div v-if="isMenuOpen" class="glass-nav mx-auto mt-2 grid max-w-7xl rounded-2xl px-4 py-4 text-sm font-bold text-night">
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
      <section v-if="currentPage === 'home'" class="cinematic-hero relative flex min-h-[88vh] overflow-hidden text-white lg:min-h-[92vh]" :style="heroStyle">
        <video class="hero-video absolute inset-0 h-full w-full object-cover" src="/snow-feather-main-bg.mp4" autoplay muted loop playsinline preload="metadata" poster="/kashmir-hero-vibrant-v2.png"></video>
        <div class="hero-vignette absolute inset-0"></div>
        <div class="hero-light-sweep absolute inset-0"></div>
        <div class="hero-grain absolute inset-0"></div>
        <div class="snow-particles absolute inset-0" aria-hidden="true"></div>

        <div class="relative mx-auto flex w-full max-w-7xl flex-col justify-end px-4 pb-6 pt-32 sm:px-6 sm:pb-8 lg:pb-10">
          <div class="max-w-4xl" data-reveal>
            <p class="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white/75">
              <span class="h-px w-10 bg-gold"></span>
              {{ siteContent.heroBadge }}
            </p>
            <h1 class="hero-title max-w-4xl font-display text-5xl font-extrabold leading-[0.96] sm:text-7xl lg:text-[6.5rem]">
              {{ siteContent.heroTitle }}
            </h1>
            <p class="mt-6 max-w-2xl text-base font-medium leading-8 text-white/78 sm:text-xl">
              {{ siteContent.heroSubtitle }}
            </p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" class="luxury-button luxury-button-primary" @click="navigateTo('/packages')">
                Explore Packages <span aria-hidden="true">-></span>
              </button>
              <button type="button" class="luxury-button luxury-button-ghost" @click="openTripPlanner('plan')">
                Plan my trip <span aria-hidden="true">-></span>
              </button>
            </div>
            <div class="mt-6 flex flex-wrap gap-2" data-reveal>
              <span v-for="badge in trustBadges" :key="`hero-${badge}`" class="rounded-full border border-white/18 bg-white/10 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.12em] text-white/74 backdrop-blur-xl">{{ badge }}</span>
            </div>
          </div>

          <div class="mt-8 grid grid-cols-2 border-t border-white/20 pt-5 sm:grid-cols-4 lg:max-w-4xl" data-reveal>
            <div v-for="[value, label] in heroStats" :key="label" class="border-white/15 py-2 pr-4 sm:border-r sm:pl-5 first:pl-0 last:border-r-0">
              <p class="font-display text-2xl font-extrabold text-white sm:text-3xl">{{ value }}</p>
              <p class="mt-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/50">{{ label }}</p>
            </div>
          </div>
        </div>

        <div class="absolute bottom-10 right-8 hidden items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white/55 xl:flex">
          <span>Scroll to wander</span>
          <span class="scroll-line h-14 w-px bg-white/30"></span>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="destination-discovery overflow-hidden bg-[#f3efe7] py-10 sm:py-12">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start" data-reveal>
            <div>
              <p class="editorial-eyebrow">Where will Kashmir take you?</p>
              <h2 class="editorial-title mt-4">Choose a feeling.<br />Find your place.</h2>
            </div>
            <p class="max-w-2xl pt-2 text-base leading-8 text-night/60 lg:justify-self-end lg:pt-10 lg:text-lg">
              Beyond the postcard is a Kashmir of quiet mornings, wild roads, generous people, and landscapes that change your sense of scale.
            </p>
          </div>

          <div class="mt-8 grid gap-5 md:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            <article v-for="place in destinationStories" :key="place.name" class="destination-story group" data-reveal>
              <div class="destination-story-image" :style="imageStyle(place.image)"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-[#061c24]/95 via-[#061c24]/12 to-transparent"></div>
              <div class="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gold">{{ place.season }}</p>
                <h3 class="mt-2 font-display text-4xl font-extrabold">{{ place.name }}</h3>
                <p class="mt-3 max-w-sm text-sm leading-6 text-white/70">{{ place.text }}</p>
                <div class="destination-story-footer">
                  <span>{{ place.activities }}</span>
                  <button type="button" aria-label="Explore destination" @click="navigateTo('/destinations')">-></button>
                </div>
              </div>
            </article>
          </div>

          <div class="mt-12 text-center">
            <button type="button" class="text-link" @click="navigateTo('/destinations')">Explore all 50+ destinations <span>-></span></button>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="bg-[#071d24] py-16 text-white sm:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="max-w-4xl" data-reveal>
            <p class="editorial-eyebrow text-gold">Experience Kashmir</p>
            <h2 class="editorial-title mt-4 text-white">Don’t just visit.<br />Live the story.</h2>
          </div>
          <div class="mt-10 flex gap-2 overflow-x-auto pb-3" data-reveal>
            <button v-for="filter in experienceFilters" :key="filter" type="button" class="experience-filter" :class="{ active: activeExperience === filter }" @click="activeExperience = filter">{{ filter }}</button>
          </div>
          <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <article v-for="story in filteredExperienceStories" :key="story.title" class="experience-card group" data-reveal>
              <div class="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110" :style="imageStyle(story.image)"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent"></div>
              <div class="absolute inset-x-0 bottom-0 p-6">
                <p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gold">{{ story.eyebrow }}</p>
                <h3 class="mt-2 font-display text-2xl font-extrabold">{{ story.title }}</h3>
                <p class="mt-3 translate-y-3 text-sm leading-6 text-white/70 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{{ story.text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="journey-story bg-white py-16 sm:py-20">
        <div class="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div data-reveal>
            <p class="editorial-eyebrow">Why Kashmir?</p>
            <h2 class="editorial-title mt-4">Some places are seen.<br />Kashmir is felt.</h2>
            <div class="mt-10 grid gap-1">
              <button v-for="(moment, index) in journeyMoments" :key="moment.number" type="button" class="journey-step" :class="{ active: activeJourneyMoment === index }" @click="activeJourneyMoment = index">
                <span>{{ moment.number }}</span>
                <span>
                  <small>{{ moment.label }}</small>
                  <strong>{{ moment.title }}</strong>
                </span>
              </button>
            </div>
            <p class="mt-7 max-w-xl text-base leading-8 text-night/60">{{ journeyMoments[activeJourneyMoment].text }}</p>
          </div>
          <div class="journey-image-wrap" data-reveal>
            <img :src="journeyMoments[activeJourneyMoment].image" :alt="journeyMoments[activeJourneyMoment].title" class="h-full w-full object-cover transition duration-700" />
            <div class="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.2em] text-gold">A Kashmir journey</p>
                <p class="mt-2 font-display text-3xl font-extrabold">{{ journeyMoments[activeJourneyMoment].title }}</p>
              </div>
              <span class="font-display text-5xl font-extrabold text-white/35">{{ journeyMoments[activeJourneyMoment].number }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="bg-white py-14 sm:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Established Kashmir expertise</p>
              <h2 class="mt-3 font-display text-4xl font-extrabold leading-tight text-night sm:text-5xl">25+ years of planning journeys people remember for life.</h2>
              <p class="mt-5 text-base font-semibold leading-8 text-night/[0.62]">Our experienced and highly qualified local team brings together tourism planning, skiing, mountaineering, trekking, destination knowledge, dependable transport, and warm Kashmiri hospitality. Every itinerary is personalized around your dates, interests, comfort, and budget.</p>
              <div class="mt-6 rounded-lg border border-gold/25 bg-gold/10 p-5">
                <p class="font-black leading-7 text-night">{{ siteContent.trustPromise }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <article v-for="[value, label] in experienceStats" :key="label" class="rounded-lg border border-night/[0.08] bg-frost p-6 shadow-lift">
                <p class="font-display text-4xl font-extrabold text-lake sm:text-5xl">{{ value }}</p>
                <p class="mt-2 text-sm font-black uppercase tracking-[0.12em] text-night/60">{{ label }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="bg-white py-14 sm:py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Kashmir in motion</p>
            <h2 class="mt-3 font-display text-4xl font-extrabold leading-tight text-night sm:text-5xl">See the landscapes behind the journey.</h2>
            <p class="mt-5 text-base font-semibold leading-8 text-night/[0.62]">A short visual introduction to Kashmir’s mountains, valleys, lakes, and adventure experiences. Playback stays under the visitor’s control for a calm, premium browsing experience.</p>
            <button type="button" class="mt-7 btn-primary" @click="navigateTo('/gallery')">Explore Photo Gallery</button>
          </div>
          <div class="relative overflow-hidden rounded-[2rem] bg-night shadow-premium">
            <video
              class="aspect-video w-full object-cover"
              src="/snow-feather-main-bg.mp4"
              poster="/kashmir-hero-vibrant-v2.png"
              controls
              muted
              loop
              playsinline
              preload="metadata"
              aria-label="Snow Feather Adventures Kashmir travel video"
            ></video>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="adventure-showcase relative overflow-hidden bg-[#061b23] py-16 text-white sm:py-20">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(233,186,100,.18),transparent_22rem),radial-gradient(circle_at_90%_15%,rgba(11,131,165,.2),transparent_26rem)]"></div>
        <div class="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p class="editorial-eyebrow text-gold">Adventure tourism showcase</p>
              <h2 class="editorial-title mt-4 text-white">Every season opens a different Kashmir.</h2>
            </div>
            <p class="max-w-2xl text-base font-semibold leading-8 text-white/68 lg:justify-self-end">
              Winter brings skiing, snowboarding, and ice moments from December to February. Summer opens trekking, camping, rafting, biking, and paragliding from June to September. All year, Kashmir gives lakes, culture, food, photography, and houseboat life.
            </p>
          </div>
          <div class="grid gap-5 lg:grid-cols-3">
            <article v-for="season in adventureSeasons" :key="season.label" class="group relative min-h-[30rem] overflow-hidden rounded-lg border border-white/10 bg-white/8 shadow-premium">
              <div class="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" :style="imageStyle(season.image)"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/92 via-black/28 to-transparent"></div>
              <div class="absolute inset-x-0 bottom-0 p-6">
                <p class="text-[0.68rem] font-black uppercase tracking-[0.22em] text-gold">{{ season.months }}</p>
                <h3 class="mt-3 font-display text-3xl font-extrabold">{{ season.label }}</h3>
                <p class="mt-3 text-sm font-semibold leading-7 text-white/72">{{ season.title }}</p>
                <div class="mt-5 flex flex-wrap gap-2">
                  <span v-for="activity in season.activities" :key="`${season.label}-${activity}`" class="rounded-full border border-white/18 bg-white/10 px-3 py-2 text-xs font-black text-white/86">{{ activity }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="section-band py-14 sm:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-9 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Accommodation categories</p>
            <h2 class="mt-3 font-display text-4xl font-extrabold text-night sm:text-5xl">Stay your way, from trusted value to private luxury.</h2>
            <p class="mt-4 text-base leading-7 text-night/[0.62]">Clear accommodation classes make it easy to compare comfort, facilities, service, and expected pricing before you enquire.</p>
          </div>
          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <article v-for="stay in accommodationCategories" :key="stay.name" class="group flex h-full flex-col overflow-hidden rounded-lg border border-night/[0.08] bg-white shadow-premium">
              <div class="relative h-56 overflow-hidden">
                <div class="image-cover h-full transition duration-500 group-hover:scale-105" :style="imageStyle(stay.image)"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-transparent"></div>
                <div class="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p class="text-xs font-black uppercase tracking-[0.18em] text-gold">{{ stay.tagline }}</p>
                  <h3 class="mt-1 font-display text-3xl font-extrabold">{{ stay.name }}</h3>
                </div>
              </div>
              <div class="flex flex-1 flex-col p-5">
                <div class="grid gap-2 text-sm font-semibold text-night/65">
                  <p v-for="feature in stay.features" :key="`${stay.name}-${feature}`">Check {{ feature }}</p>
                </div>
                <div class="mt-auto border-t border-night/10 pt-5">
                  <p class="font-display text-xl font-extrabold text-lake">{{ stay.price }}</p>
                  <button type="button" class="mt-4 w-full rounded-lg bg-night px-5 py-3 text-sm font-black text-white hover:bg-lake" @click="navigateTo('/booking')">Enquire for {{ stay.name }}</button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="relative overflow-hidden bg-night py-14 text-white sm:py-16">
        <div class="absolute inset-0 opacity-15 image-cover" :style="imageStyle('image20')"></div>
        <div class="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-10 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Everything under one roof</p>
            <h2 class="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Tours, adventure, and transportation professionally coordinated.</h2>
          </div>
          <div class="grid gap-5 lg:grid-cols-3">
            <article v-for="service in serviceGroups" :key="service.title" class="rounded-lg border border-white/12 bg-white/8 p-6 backdrop-blur">
              <p class="font-display text-4xl font-extrabold text-gold">{{ service.number }}</p>
              <h3 class="mt-4 text-3xl font-black">{{ service.title }}</h3>
              <p class="mt-3 text-sm font-semibold leading-6 text-white/62">{{ service.text }}</p>
              <div class="mt-5 flex flex-wrap gap-2">
                <span v-for="item in service.items" :key="item" class="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-bold text-white/80">{{ item }}</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="bg-white py-14 sm:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-3xl">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Packages reimagined</p>
              <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Journeys first. Prices after the dream feels clear.</h2>
              <p class="mt-4 text-base leading-7 text-night/[0.62]">Browse by emotion, pace, places covered, and who the trip is best for. Then ask for a custom itinerary with Standard, Premium, Luxurious, or VIP options.</p>
            </div>
            <button type="button" class="self-start rounded-lg bg-night px-6 py-3 text-sm font-black text-white shadow-lift hover:bg-lake lg:self-auto" @click="navigateTo('/packages')">Compare All Packages</button>
          </div>

          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="journey in publicPackages.slice(0, 3)" :key="`home-dynamic-${journey.name}`" class="group overflow-hidden rounded-lg border border-night/[0.08] bg-white shadow-premium">
              <div class="relative min-h-72 overflow-hidden">
                <div class="image-cover absolute inset-0 transition duration-700 group-hover:scale-105" :style="{ backgroundImage: `url('${packageVisual(journey)}')` }"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-night/92 via-night/18 to-transparent"></div>
                <span class="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-2 text-xs font-black text-night">{{ displayDuration(journey.duration) }}</span>
                <div class="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p class="text-xs font-black uppercase tracking-[0.16em] text-gold">{{ journey.category || journey.tag }}</p>
                  <h3 class="mt-2 font-display text-3xl font-extrabold leading-tight">{{ journey.name }}</h3>
                </div>
              </div>
              <div class="p-6">
                <p class="text-xs font-black uppercase tracking-[0.16em] text-lake">Places covered</p>
                <p class="mt-2 text-sm font-semibold leading-6 text-night/62">{{ packageRoute(journey)[1] }}</p>
                <div class="mt-5 flex flex-wrap gap-2">
                  <span v-for="highlight in packageChips(journey)" :key="`${journey.name}-${highlight}`" class="rounded-full bg-frost px-3 py-2 text-xs font-bold text-night/68">{{ highlight }}</span>
                </div>
                <button type="button" class="mt-6 w-full rounded-lg bg-night px-5 py-3 text-sm font-black text-white hover:bg-lake" @click="openTripPlanner('plan', journey)">Get Custom Itinerary</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="bg-white py-12 sm:py-14">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Why Snow Feather Adventures</p>
              <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Kashmir travel planning with a clear purpose.</h2>
              <p class="mt-5 text-base leading-8 text-night/[0.64]">
                Snow Feather Adventures is a Srinagar-based Kashmir tourism team helping guests book practical, beautiful, and well-supported trips across famous landmarks and quieter valleys.
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

      <section v-if="currentPage === 'home'" class="section-band py-12 sm:py-14">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.homeActivitiesEyebrow }}</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">{{ siteContent.homeActivitiesTitle }}</h2>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article v-for="[icon, title, text, activityImage] in activities" :key="title" class="group relative min-h-72 overflow-hidden rounded-lg shadow-premium">
              <div class="image-cover absolute inset-0 transition duration-500 group-hover:scale-105" :style="imageStyle(activityImage)"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-night via-night/28 to-transparent"></div>
              <div class="absolute inset-x-0 bottom-0 p-5 text-white">
                <p class="text-xs font-black tracking-[0.24em] text-gold">{{ icon }}</p>
                <h3 class="mt-2 text-2xl font-black text-white">{{ title }}</h3>
                <p class="mt-2 text-sm font-semibold leading-6 text-white/76">{{ text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        v-if="currentPage === 'about'"
        id="about"
        class="page-hero relative flex min-h-[34rem] items-end overflow-hidden bg-night pt-28 text-white sm:min-h-[38rem]"
      >
        <div
          class="absolute inset-0 image-cover"
          :style="{ backgroundImage: `url('/kashmir-pahalgam-vibrant-v2.png')` }"
        ></div>
        <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,35,52,0.8),rgba(3,70,83,0.36),rgba(3,22,34,0.06)),linear-gradient(0deg,rgba(3,44,52,0.45),transparent)]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(250,204,21,0.2),transparent_34%)]"></div>
        <div class="relative mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:pb-16">
          <div class="max-w-3xl">
            <p class="page-eyebrow text-sm font-black uppercase tracking-[0.2em] text-gold">About Snow Feather Adventures</p>
            <h1 class="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-6xl">Local Kashmir knowledge. Professional adventure leadership.</h1>
            <p class="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/78 sm:text-lg">More than 25 years of tourism, skiing, mountaineering, trekking, and hospitality experience—combined with clear planning and genuine guest care.</p>
            <div class="mt-7 flex flex-wrap gap-3">
              <button type="button" class="btn-primary" @click="navigateTo('/booking')">Plan Your Journey</button>
              <button type="button" class="btn-light" @click="navigateTo('/contact')">Contact Our Team</button>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'about'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mx-auto mb-10 max-w-4xl text-center">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Vision, mission, and motto</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">The promise behind every Snow Feather Adventures tour.</h2>
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
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">More confidence for every Kashmir guest.</h2>
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
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-3xl">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Kashmir holiday packages</p>
              <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Find a Snow Feather Adventures package made for your trip.</h2>
              <p class="mt-4 text-base leading-7 text-night/[0.62]">Compare routes, duration, inclusions, and starting prices, then talk directly with our local Kashmir team.</p>
            </div>
            <button type="button" class="self-start rounded-lg bg-night px-6 py-3 text-sm font-black text-white shadow-lift hover:bg-lake lg:self-auto" @click="navigateTo('/packages')">View All Packages</button>
          </div>

          <div class="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
            <aside class="overflow-hidden rounded-lg border border-night/[0.08] bg-white shadow-premium lg:sticky lg:top-28">
              <div class="flex items-center justify-between bg-night px-5 py-4 text-white">
                <p class="font-black">Filter Packages</p>
                <button type="button" class="text-xs font-black text-gold hover:text-white" @click="clearPackageFilters">Clear All</button>
              </div>

              <div class="border-b border-night/[0.08] p-5">
                <p class="text-sm font-black text-night">Tour Type</p>
                <div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-1">
                  <label v-for="filter in filters" :key="`about-filter-${filter}`" class="flex cursor-pointer items-center gap-2 text-sm font-semibold capitalize text-night/[0.68]">
                    <input v-model="activeFilter" type="radio" name="about-tour-type" :value="filter" class="h-4 w-4 !border !p-0 accent-[#0ea5c6]" />
                    <span>{{ filter === 'all' ? 'All tours' : filter }}</span>
                  </label>
                </div>
              </div>

              <div class="p-5">
                <p class="text-sm font-black text-night">Price Range</p>
                <div class="mt-4 grid gap-3">
                  <label v-for="range in priceRanges" :key="`about-price-${range.value}`" class="flex cursor-pointer items-center gap-2 text-sm font-semibold text-night/[0.68]">
                    <input v-model="activePriceRange" type="radio" name="about-price-range" :value="range.value" class="h-4 w-4 !border !p-0 accent-[#0ea5c6]" />
                    <span>{{ range.label }}</span>
                  </label>
                </div>
              </div>
            </aside>

            <div>
              <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 class="text-2xl font-black text-night">{{ filteredPackages.length }} Holiday Packages</h3>
                  <p class="mt-1 text-sm font-semibold text-night/[0.5]">Showing {{ aboutPackages.length }} of {{ filteredPackages.length }} matching packages</p>
                </div>
              </div>

              <div v-if="aboutPackages.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <article v-for="item in aboutPackages" :key="`about-package-${item.name}`" class="group flex h-full flex-col overflow-hidden rounded-lg border border-night/[0.08] bg-white shadow-premium transition hover:-translate-y-1">
                  <div class="relative h-52 overflow-hidden">
                    <div class="image-cover h-full transition duration-500 group-hover:scale-105" :style="{ backgroundImage: `url('${packageVisual(item)}')` }"></div>
                    <span class="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-r from-gold to-[#ff8b6d] px-4 py-2 text-sm font-black text-white">{{ packageDiscount(item) }}% OFF</span>
                    <span class="absolute bottom-3 left-3 rounded-full bg-night/85 px-3 py-1.5 text-xs font-black text-white backdrop-blur">{{ displayDuration(item.duration) }}</span>
                  </div>

                  <div class="flex flex-1 flex-col p-5">
                    <p class="text-xs font-black uppercase tracking-[0.14em] text-lake">{{ packageRoute(item)[0] }}</p>
                    <h3 class="mt-2 line-clamp-2 min-h-14 text-xl font-black leading-7 text-night">{{ item.name }}</h3>
                    <div class="mt-3 flex items-center justify-between gap-3 text-sm">
                      <span class="font-black text-gold">★ {{ item.rating }}</span>
                      <span class="font-semibold text-night/[0.5]">{{ item.tag }}</span>
                    </div>

                    <div class="mt-auto border-t border-night/[0.08] pt-4">
                      <p class="text-xs font-bold uppercase tracking-wide text-night/[0.46]">Starts From</p>
                      <div class="mt-1 flex flex-wrap items-end gap-2">
                        <p class="font-display text-2xl font-extrabold text-lake">INR {{ item.price.toLocaleString("en-IN") }}</p>
                        <p class="pb-0.5 text-sm font-bold text-night/35 line-through">INR {{ packageOriginalPrice(item).toLocaleString("en-IN") }}</p>
                      </div>
                    </div>

                    <div class="mt-4 grid grid-cols-2 gap-2">
                      <button type="button" class="package-action package-action-primary" @click="viewPackageDetails(item)">View Details</button>
                      <button type="button" class="package-action package-action-secondary" @click="selectPackageAndBook(item)">Enquire</button>
                      <a :href="packageWhatsappLink(item)" class="package-action package-action-whatsapp">
                        <img src="/social/whatsapp.svg" alt="" class="h-5 w-5" />
                        <span>WhatsApp</span>
                      </a>
                      <a :href="phoneTel" class="package-action package-action-secondary">Call Now</a>
                    </div>
                  </div>
                </article>
              </div>

              <div v-else class="rounded-lg border border-dashed border-night/20 bg-white p-10 text-center shadow-lift">
                <h3 class="text-2xl font-black text-night">No packages match these filters.</h3>
                <p class="mt-2 text-sm text-night/[0.58]">Try another tour type or price range.</p>
                <button type="button" class="mt-5 rounded-lg bg-lake px-5 py-3 text-sm font-black text-white" @click="clearPackageFilters">Show All Packages</button>
              </div>
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
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">About Snow Feather Adventures</p>
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

      <section v-if="currentPage === 'about'" class="section-band py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mx-auto mb-12 max-w-4xl text-center">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Messages from our dignitaries</p>
            <h2 class="mt-3 font-display text-4xl font-extrabold text-night sm:text-5xl">Guidance from pioneers of Indian winter and adventure sports.</h2>
            <p class="mt-5 text-base font-semibold leading-8 text-night/[0.62]">Concluding our story, we proudly acknowledge the advisors, Olympians, instructors, and mountain experts whose experience strengthens our standards of safety, professionalism, and service.</p>
          </div>

          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="(mentor, index) in mentors" :key="mentor.name" class="flex h-full flex-col overflow-hidden rounded-lg border border-night/[0.08] bg-white shadow-premium">
              <div class="relative aspect-[4/3] overflow-hidden bg-frost">
                <img :src="mentor.image" :alt="mentor.name" class="absolute inset-0 h-full w-full object-cover object-top" :style="mentorPortraitStyle(mentor)" loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-night/65 via-transparent to-transparent"></div>
                <span class="absolute bottom-4 left-4 rounded-full bg-gold px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-night">Dignitary {{ String(index + 1).padStart(2, '0') }}</span>
              </div>
              <div class="flex flex-1 flex-col p-6">
                <p class="text-xs font-black uppercase tracking-[0.16em] text-lake">{{ mentor.role }}</p>
                <h3 class="mt-2 font-display text-2xl font-extrabold leading-tight text-night">{{ mentor.name }}</h3>
                <p class="mt-3 text-sm font-black leading-6 text-gold">{{ mentor.credentials }}</p>
                <p class="mt-4 border-l-2 border-lake pl-4 text-sm font-semibold italic leading-6 text-night/[0.62]">“{{ mentor.quote }}”</p>

                <div v-if="openMentorProfiles.includes(index)" class="mt-5 grid gap-4 border-t border-night/[0.08] pt-5">
                  <p v-for="(paragraph, paragraphIndex) in mentorParagraphs(mentor)" :key="`${mentor.name}-${paragraphIndex}`" class="text-sm font-semibold leading-7 text-night/[0.64]">{{ paragraph }}</p>
                </div>
                <button type="button" class="mt-5 self-start rounded-lg bg-night px-5 py-3 text-sm font-black text-white hover:bg-lake" :aria-expanded="openMentorProfiles.includes(index)" @click="toggleMentorProfile(index)">
                  {{ openMentorProfiles.includes(index) ? "Close Profile" : "Read Full Message" }}
                </button>
              </div>
            </article>
          </div>

          <div class="mt-10 rounded-lg bg-night p-6 text-center text-white shadow-premium sm:p-8">
            <p class="font-display text-2xl font-extrabold sm:text-3xl">Guided by experience. Driven by safety. Committed to excellence.</p>
            <p class="mx-auto mt-3 max-w-3xl text-sm font-semibold leading-7 text-white/68">Their association with Snow Feather Adventures is a source of pride and a promise that our skiing, trekking, mountaineering, and outdoor programs remain rooted in professional leadership.</p>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'packageDetail' && detailPackage" class="page-hero relative flex min-h-[34rem] items-end overflow-hidden pt-28 text-white">
        <div class="absolute inset-0 image-cover" :style="{ backgroundImage: `url('${packageVisual(detailPackage)}')` }"></div>
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
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" class="luxury-button luxury-button-primary" @click="bookDetailPackage">Reserve This Package</button>
              <a :href="detailWhatsappLink" class="luxury-button luxury-button-ghost">Chat on WhatsApp</a>
              <a :href="phoneTel" class="luxury-button luxury-button-ghost">Call Now</a>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'packageDetail' && detailPackage" class="bg-white py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.48fr]">
          <div class="min-w-0">
            <nav class="detail-sticky-nav mb-8 hidden gap-2 overflow-x-auto rounded-lg border border-night/10 bg-white/90 p-2 shadow-lift backdrop-blur lg:sticky lg:top-24 lg:z-20 lg:flex">
              <a v-for="[label, sectionId] in detailSectionNav" :key="sectionId" :href="`#${sectionId}`" class="rounded-lg px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-night/58 hover:bg-night hover:text-white">{{ label }}</a>
            </nav>

            <div id="package-overview">
            <h2 class="font-display text-3xl font-extrabold text-night sm:text-4xl">Overview</h2>
            <p class="mt-3 text-sm font-black uppercase tracking-[0.16em] text-lake">Package date: {{ detailPackage.packageDate }}</p>
            <p class="mt-5 max-w-4xl text-base leading-8 text-night/65 sm:text-lg">{{ detailPackage.description }} The route can be adjusted for arrival time, guest comfort, weather, and travel style.</p>

            <div class="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <article v-for="[label, value] in detailQuickFacts" :key="`fact-${label}`" class="quick-fact-card">
                <p>{{ label }}</p>
                <h3>{{ value }}</h3>
              </article>
            </div>

            <div class="mt-8 grid gap-3 sm:grid-cols-2">
              <div v-for="[icon, title, text] in reservationInfoCards" :key="title" class="premium-info-box">
                <span>{{ icon }}</span>
                <div>
                  <h3>{{ title }}</h3>
                  <p>{{ text }}</p>
                </div>
              </div>
              <template v-if="packageIsWinter(detailPackage)">
                <div v-for="[icon, title, text] in winterReservationInfoCards" :key="`winter-${title}`" class="premium-info-box premium-info-box-winter">
                  <span>{{ icon }}</span>
                  <div>
                    <h3>{{ title }}</h3>
                    <p>{{ text }}</p>
                  </div>
                </div>
              </template>
              <template v-else-if="packageIsSummer(detailPackage)">
                <div v-for="[icon, title, text] in summerReservationInfoCards" :key="`summer-${title}`" class="premium-info-box">
                  <span>{{ icon }}</span>
                  <div>
                    <h3>{{ title }}</h3>
                    <p>{{ text }}</p>
                  </div>
                </div>
              </template>
            </div>
            <p class="mt-5 rounded-lg border border-gold/25 bg-gold/10 p-4 text-sm font-bold leading-7 text-night/70">
              Package prices may vary depending on hotel category, transportation, activities, travel season, and customization preferences. For standard and regular Kashmir packages, guests should reserve at least one month in advance to secure better accommodation, transport, guide support, food coordination, and service quality.
            </p>
            <p v-if="packageIsWinter(detailPackage)" class="mt-3 rounded-lg border border-lake/20 bg-lake/10 p-4 text-sm font-bold leading-7 text-night/70">
              Due to high seasonal demand, guests should reserve winter packages at least two months in advance. Early reservation helps secure better hotels, transport arrangements, guides, snow activities, Gondola planning, and overall travel services.
            </p>
            <p v-else-if="packageIsSummer(detailPackage)" class="mt-3 rounded-lg border border-lake/20 bg-lake/10 p-4 text-sm font-bold leading-7 text-night/70">
              Summer routes are best planned early, especially for Pahalgam, Sonmarg, Gurez, camping, trekking, and meadow experiences. Early booking improves hotel availability, cab scheduling, local access planning, and activity coordination.
            </p>
            <p v-if="detailPackage.reservationNote" class="mt-3 rounded-lg border border-night/10 bg-white p-4 text-sm font-bold leading-7 text-night/68 shadow-lift">
              {{ detailPackage.reservationNote }}
            </p>

            <div class="mt-9">
              <h3 class="font-display text-3xl font-extrabold text-night">Highlights</h3>
              <div class="mt-5 grid gap-4 text-base font-semibold text-night/70 sm:grid-cols-2">
                <div v-for="highlight in detailHighlights" :key="highlight" class="flex items-center gap-3">
                  <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-lake text-sm font-black text-lake">Ok</span>
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

            <div id="package-itinerary" class="mt-9">
              <h3 class="font-display text-3xl font-extrabold text-night">Route & Itinerary</h3>
              <div class="itinerary-timeline mt-5 grid gap-3">
                <div v-for="(step, index) in packageItinerary(detailPackage)" :key="`${detailPackage.name}-day-${index}`" class="itinerary-step rounded-lg border border-night/10 bg-frost p-4">
                  <p class="text-xs font-black uppercase tracking-[0.16em] text-lake">Day {{ index + 1 }}</p>
                  <p class="mt-2 text-sm font-semibold leading-6 text-night/70">{{ step }}</p>
                </div>
              </div>
              <div class="mt-6 rounded-lg border border-gold/25 bg-gold/10 p-5">
                <p class="text-sm font-black uppercase tracking-[0.16em] text-night">Want this itinerary customized?</p>
                <p class="mt-2 text-sm font-semibold leading-7 text-night/62">Share your arrival time, stay preference, and must-see places. We will adjust the pace before you reserve.</p>
              </div>
              <div class="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" class="package-action package-action-primary px-5" @click="bookDetailPackage">Reserve Package</button>
                <a :href="detailWhatsappLink" class="package-action package-action-whatsapp px-5">Ask a Question</a>
              </div>
            </div>

            <div id="package-pricing" class="mt-9">
              <h3 class="font-display text-3xl font-extrabold text-night">Price Tiers</h3>
              <div class="mt-5 grid gap-4 md:grid-cols-2">
                <div v-for="[tier, amount, text] in packageTiers(detailPackage)" :key="`${detailPackage.name}-${tier}`" class="rounded-lg border border-night/10 bg-white p-5 shadow-lift">
                  <div class="flex items-start justify-between gap-3">
                    <h4 class="text-xl font-black text-night">{{ tier }}</h4>
                    <span class="rounded-lg bg-lake/10 px-3 py-2 font-display text-sm font-extrabold text-lake">{{ displayCurrencyText(amount) }}</span>
                  </div>
                  <p class="mt-3 text-sm font-semibold leading-6 text-night/62">{{ text }}</p>
                </div>
              </div>
              <div class="mt-6 overflow-x-auto rounded-lg border border-night/10 shadow-lift">
                <table class="min-w-[780px] w-full bg-white text-left text-sm">
                  <thead class="bg-night text-white">
                    <tr>
                      <th class="px-4 py-4">Package Type</th>
                      <th class="px-4 py-4">Hotel Category</th>
                      <th class="px-4 py-4">Transportation</th>
                      <th class="px-4 py-4">Meal Plan</th>
                      <th class="px-4 py-4">Activities</th>
                      <th class="px-4 py-4">Starting Price</th>
                      <th class="px-4 py-4">Reserve Button</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="[tier, amount, text] in packageTiers(detailPackage)" :key="`${detailPackage.name}-${tier}-table`" class="border-t border-night/10">
                      <td class="px-4 py-4 font-black text-night">{{ tier }}</td>
                      <td class="px-4 py-4 text-night/65">{{ tier === 'VIP' ? 'Best available resorts' : tier === 'Luxurious' ? '4-star / boutique' : tier === 'Premium' ? '3-star / better located' : 'Standard hotel / guest house' }}</td>
                      <td class="px-4 py-4 text-night/65">{{ tier === 'Standard' ? 'Shared or planned cab' : 'Private cab planning' }}</td>
                      <td class="px-4 py-4 text-night/65">As confirmed</td>
                      <td class="px-4 py-4 text-night/65">{{ text }}</td>
                      <td class="px-4 py-4 font-black text-lake">{{ displayCurrencyText(amount) }}</td>
                      <td class="px-4 py-4"><button type="button" class="package-action package-action-primary" @click="bookDetailPackage">Reserve</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="mt-4 rounded-lg bg-frost p-4 text-sm font-semibold leading-7 text-night/62">Final price may vary depending on customization, season, hotel availability, and number of travelers.</p>
            </div>

            <div class="mt-12 grid gap-5 md:grid-cols-2">
              <article id="package-inclusions" class="premium-card rounded-lg p-6">
                <h3 class="font-display text-3xl font-extrabold text-night">Inclusions</h3>
                <div class="mt-5 grid gap-3">
                  <p v-for="item in detailPackageInclusions" :key="item" class="flex gap-3 text-sm font-bold text-night/68"><span class="text-lake">Check</span>{{ item }}</p>
                </div>
              </article>
              <article id="package-exclusions" class="premium-card rounded-lg p-6">
                <h3 class="font-display text-3xl font-extrabold text-night">Exclusions</h3>
                <div class="mt-5 grid gap-3">
                  <p v-for="item in detailPackageExclusions" :key="item" class="flex gap-3 text-sm font-bold text-night/68"><span class="text-gold">Plus</span>{{ item }}</p>
                </div>
              </article>
            </div>

            <div class="mt-8 grid gap-4 md:grid-cols-2">
              <article v-for="[sectionId, title, text] in detailDynamicServiceSections" :id="sectionId" :key="sectionId" class="rounded-lg border border-night/10 bg-frost p-5">
                <h4 class="font-black text-night">{{ title }}</h4>
                <p class="mt-2 text-sm font-semibold leading-6 text-night/62">{{ text }}</p>
              </article>
            </div>

            <div id="package-reviews" class="mt-12">
              <h3 class="font-display text-3xl font-extrabold text-night">Reviews</h3>
              <div class="mt-5 grid gap-4 md:grid-cols-2">
                <article v-for="review in testimonials.slice(0, 2)" :key="`${detailPackage.name}-${review.name}`" class="premium-card rounded-lg p-5">
                  <div class="flex items-center gap-3">
                    <div class="image-cover h-12 w-12 rounded-full" :style="imageStyle(review.image)"></div>
                    <div>
                      <h4 class="font-black text-night">{{ review.name }}</h4>
                      <p class="text-xs font-bold uppercase tracking-[0.12em] text-lake">{{ review.trip }}</p>
                    </div>
                    <span class="ml-auto text-sm font-black text-gold">Star {{ review.rating }}</span>
                  </div>
                  <p class="mt-4 text-sm font-semibold leading-7 text-night/62">{{ review.text }}</p>
                </article>
              </div>
            </div>

            <div id="package-faq" class="mt-12">
              <h3 class="font-display text-3xl font-extrabold text-night">FAQ</h3>
              <div class="mt-5 grid gap-3">
                <details v-for="[question, answer] in packageFaqs" :key="question" class="rounded-lg border border-night/10 bg-white p-5 shadow-lift">
                  <summary class="cursor-pointer font-black text-night">{{ question }}</summary>
                  <p class="mt-3 text-sm font-semibold leading-7 text-night/62">{{ answer }}</p>
                </details>
              </div>
            </div>

            <div class="mt-12">
              <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">Related journeys</p>
                  <h3 class="mt-2 font-display text-3xl font-extrabold text-night">Other Kashmir routes guests compare.</h3>
                </div>
                <button type="button" class="self-start rounded-lg bg-night px-5 py-3 text-sm font-black text-white hover:bg-lake" @click="navigateTo('/packages')">View All</button>
              </div>
              <div class="grid gap-4 md:grid-cols-3">
                <article v-for="item in relatedPackages" :key="`related-${item.name}`" class="group overflow-hidden rounded-lg border border-night/10 bg-white shadow-lift">
                  <div class="relative h-40 overflow-hidden">
                    <div class="image-cover h-full transition duration-500 group-hover:scale-105" :style="{ backgroundImage: `url('${packageVisual(item)}')` }"></div>
                    <span class="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1.5 text-xs font-black text-night">{{ item.tag }}</span>
                  </div>
                  <div class="p-4">
                    <h4 class="line-clamp-2 min-h-12 font-black leading-6 text-night">{{ item.name }}</h4>
                    <p class="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-lake">{{ displayDuration(item.duration) }} · From INR {{ item.price.toLocaleString("en-IN") }}</p>
                    <button type="button" class="mt-4 w-full rounded-lg bg-frost px-4 py-3 text-sm font-black text-night hover:bg-night hover:text-white" @click="viewPackageDetails(item)">Compare Route</button>
                  </div>
                </article>
              </div>
            </div>

            <form id="package-book" class="booking-form premium-card mt-12 rounded-lg p-5 shadow-premium sm:p-6" @submit.prevent="submitBookingInquiry">
              <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">Booking form</p>
              <h3 class="mt-2 font-display text-3xl font-extrabold text-night">Request Reservation</h3>
              <div class="mt-6 grid gap-4 md:grid-cols-2">
                <label class="grid gap-2 text-sm font-bold">Full Name<input v-model="bookingInquiry.name" required type="text" placeholder="Full Name" /></label>
                <label class="grid gap-2 text-sm font-bold">Phone Number<input v-model="bookingInquiry.phone" required type="tel" placeholder="Phone Number" /></label>
                <label class="grid gap-2 text-sm font-bold">Email<input v-model="bookingInquiry.email" required type="email" placeholder="Email" /></label>
                <label class="grid gap-2 text-sm font-bold">Package Name<select v-model="selectedPackage"><option v-for="item in publicPackages" :key="`detail-form-${item.name}`" :value="item.price">{{ item.name }}</option></select></label>
                <label class="grid gap-2 text-sm font-bold">Travel Month<input v-model="bookingInquiry.travelDate" type="month" /></label>
                <label class="grid gap-2 text-sm font-bold">Number of Guests<input v-model.number="travelers" min="1" type="number" /></label>
                <label class="grid gap-2 text-sm font-bold">Hotel Preference<select v-model="bookingInquiry.hotelPreference"><option value="">Select hotel preference</option><option>Standard</option><option>Premium</option><option>Luxurious</option><option>VIP</option></select></label>
                <label class="grid gap-2 text-sm font-bold">Transportation Preference<select v-model="bookingInquiry.transportPreference"><option value="">Select transportation</option><option>Sedan</option><option>Innova / SUV</option><option>Tempo Traveller</option><option>Luxury vehicle</option></select></label>
                <label class="grid gap-2 text-sm font-bold">Meal Preference<select v-model="bookingInquiry.mealPreference"><option value="">Select meal plan</option><option>Breakfast only</option><option>Breakfast and dinner</option><option>All meals</option><option>Custom</option></select></label>
                <label class="grid gap-2 text-sm font-bold">Budget Range<select v-model="bookingInquiry.budgetRange"><option value="">Select budget</option><option>Standard</option><option>Premium</option><option>Luxurious</option><option>VIP custom</option></select></label>
                <label class="grid gap-2 text-sm font-bold md:col-span-2">Activities Interested In<input v-model="bookingInquiry.activities" type="text" placeholder="Skiing, Shikara, trekking, camping, sightseeing..." /></label>
                <label class="grid gap-2 text-sm font-bold">Preferred Contact Method<select v-model="bookingInquiry.contactMethod"><option>WhatsApp</option><option>Call</option><option>Email</option></select></label>
                <label class="grid gap-2 text-sm font-bold md:col-span-2">Message<textarea v-model="bookingInquiry.notes" class="min-h-28" placeholder="Tell us your dates, comfort level, route preference, and any special request."></textarea></label>
              </div>
              <p v-if="bookingInquiryStatus" :class="/thank you|sent/i.test(bookingInquiryStatus) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'" class="mt-5 rounded-lg p-3 text-sm font-semibold">{{ bookingInquiryStatus }}</p>
              <button type="submit" :disabled="isBookingSubmitting" class="mt-6 w-full rounded-lg bg-night px-5 py-4 text-base font-black text-white hover:bg-lake disabled:opacity-60">{{ isBookingSubmitting ? "Submitting..." : "Request Reservation" }}</button>
            </form>
          </div>

          <aside class="premium-card min-w-0 rounded-lg p-6 lg:sticky lg:top-28 lg:self-start">
            <p class="text-sm font-bold text-night/55">Starting From</p>
            <div class="mt-2 flex flex-wrap items-end gap-3">
              <p class="font-display text-4xl font-extrabold text-lake">INR {{ detailPackage.price.toLocaleString("en-IN") }}</p>
              <p class="pb-1 text-lg font-bold text-night/45 line-through">INR {{ detailOriginalPrice.toLocaleString("en-IN") }}</p>
            </div>
            <p class="mt-2 text-xs font-semibold text-night/55">Indicative starting estimate; final quote is confirmed after availability check.</p>
            <p class="mt-6 rounded-lg bg-lake/10 px-4 py-3 text-center font-display text-lg font-extrabold text-lake">Save INR {{ detailSaveAmount.toLocaleString("en-IN") }}!</p>
            <button type="button" class="mt-5 w-full rounded-lg bg-lake px-5 py-4 text-base font-black text-white shadow-lift hover:bg-night" @click="bookDetailPackage">
              Reserve This Package
            </button>
            <button type="button" class="mt-3 w-full rounded-lg bg-night px-5 py-4 text-base font-black text-white hover:bg-lake" @click="openTripPlanner('plan', detailPackage); bookingInquiry.notes = `Question about ${detailPackage.name}`">
              Ask a Question
            </button>
            <a :href="detailWhatsappLink" class="mt-3 block rounded-lg bg-frost px-5 py-4 text-center text-base font-black text-night hover:text-lake">
              Chat on WhatsApp
            </a>
            <a :href="phoneTel" class="mt-3 block rounded-lg border border-night/10 bg-white px-5 py-4 text-center text-base font-black text-night hover:text-lake">
              Call Now
            </a>
            <p class="mt-4 text-center text-xs font-semibold text-night/45">Secure payment ready layout</p>
          </aside>
        </div>
      </section>

      <section
        v-if="currentPage === 'packages'"
        id="packages"
        class="min-h-screen bg-white pb-20 pt-28 sm:pt-32"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="page-hero relative mb-10 min-h-[31rem] overflow-hidden rounded-[2rem] bg-night text-white shadow-premium">
            <div class="image-cover absolute inset-0" :style="imageStyle(currentPath === '/honeymoon-packages' ? '/kashmir-dal-lake-vibrant-v2.png' : '/kashmir-pahalgam-vibrant-v2.png')"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-night/92 via-night/64 to-lake/20"></div>
            <div class="relative grid min-h-[31rem] items-end gap-6 p-6 sm:p-9 lg:grid-cols-[1fr_0.68fr] lg:p-12">
              <div class="max-w-3xl">
                <p class="page-eyebrow text-sm font-black uppercase tracking-[0.2em] text-gold">{{ currentPath === '/honeymoon-packages' ? 'Kashmir Honeymoon Packages' : siteContent.packagesHeroEyebrow }}</p>
                <h1 class="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-6xl">{{ currentPath === '/honeymoon-packages' ? 'Private, romantic Kashmir journeys for two.' : siteContent.packagesHeroTitle }}</h1>
                <p class="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/78">{{ currentPath === '/honeymoon-packages' ? 'Explore relaxed honeymoon routes with private cabs, premium stays, Shikara moments, snow experiences, and time to enjoy Kashmir without rushing.' : siteContent.packagesHeroText }}</p>
                <div class="mt-5 flex flex-wrap gap-3">
                  <span class="rounded-lg border border-white/18 bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] backdrop-blur-xl">Updated {{ premiumStructureDate }}</span>
                  <span class="rounded-lg border border-gold/30 bg-gold/18 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-gold backdrop-blur-xl">No hidden charges</span>
                </div>
              </div>
              <div class="hidden min-h-72 grid-cols-2 gap-3 lg:grid">
                <div class="image-cover rounded-lg border border-white/18" :style="imageStyle('image15')"></div>
                <div class="image-cover rounded-lg border border-white/18" :style="imageStyle('image22')"></div>
                <div class="image-cover rounded-lg border border-white/18" :style="imageStyle('image19')"></div>
                <div class="image-cover rounded-lg border border-white/18" :style="imageStyle('image11')"></div>
              </div>
            </div>
          </div>

          <div class="hidden">
            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <article v-for="[title, meta, text] in packageCategories" :key="title" class="relative min-h-36 overflow-hidden rounded-lg border border-white/70 bg-white/24 p-4 shadow-lift backdrop-blur-xl">
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-lake to-alpine"></div>
                <p class="text-sm font-black text-night">{{ title }}</p>
                <p class="mt-2 text-xs font-black uppercase tracking-[0.14em] text-gold">{{ meta }}</p>
                <p class="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-night/[0.62]">{{ text }}</p>
              </article>
            </div>
          </div>

          <div class="hidden">
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

          <div class="hidden">
            <div v-for="message in trustMessages" :key="message" class="flex min-h-20 items-center gap-3 rounded-lg border border-white/70 bg-white/52 p-4 text-sm font-black leading-6 text-night shadow-lift backdrop-blur-xl">
              <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lake text-xs text-white">Ok</span>
              <span>{{ message }}</span>
            </div>
          </div>

          <div class="hidden">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.18em] text-gold">Registered details</p>
                <p class="mt-1 text-sm font-semibold text-white/62">Snow Feather Adventures business identifiers</p>
              </div>
              <span class="rounded-lg border border-white/14 bg-white/10 px-3 py-2 text-xs font-black text-white/80">Verified business info</span>
            </div>
            <div class="mt-4 grid gap-3 md:grid-cols-3">
              <div v-for="[label, value] in registrationDetails" :key="label" class="rounded-lg border border-white/14 bg-white/10 p-4 backdrop-blur-xl">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-gold">{{ label }}</p>
                <p class="mt-2 break-all text-sm font-black text-white">{{ value }}</p>
              </div>
            </div>
          </div>

          <div class="mb-10 rounded-lg border border-night/[0.08] bg-frost/70 p-4 shadow-lift">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex flex-wrap gap-2" role="group" aria-label="Package type filters">
                <button v-for="filter in filters" :key="filter" class="rounded-lg border px-4 py-2 text-sm font-black capitalize" :class="activeFilter === filter ? 'border-lake bg-lake text-white' : 'border-night/[0.12] bg-white text-night hover:border-lake hover:text-lake'" @click="activeFilter = filter">
                  {{ filter }}
                </button>
              </div>
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label for="package-price-filter" class="text-xs font-black uppercase tracking-[0.14em] text-night/[0.5]">Price range</label>
                <select id="package-price-filter" v-model="activePriceRange" class="min-w-48 rounded-lg border border-night/[0.12] bg-white px-4 py-2.5 text-sm font-black text-night">
                  <option v-for="range in priceRanges" :key="`page-price-${range.value}`" :value="range.value">{{ range.label }}</option>
                </select>
                <button v-if="activeFilter !== 'all' || activePriceRange !== 'all'" type="button" class="rounded-lg px-3 py-2 text-xs font-black text-lake hover:bg-white" @click="clearPackageFilters">Clear All</button>
              </div>
            </div>
            <p class="mt-3 text-sm font-semibold text-night/[0.5]">{{ filteredPackages.length }} matching packages</p>
          </div>

          <div v-if="filteredPackages.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="item in filteredPackages" :key="item.name" class="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-premium hover-lift">
              <div class="relative h-72 overflow-hidden">
                <div class="image-cover h-full transition duration-500 hover:scale-110" :style="{ backgroundImage: `linear-gradient(180deg, rgba(7, 24, 39, 0.02), rgba(7, 24, 39, 0.56)), url('${packageVisual(item)}')` }"></div>
                <span class="absolute left-4 top-4 rounded-full bg-gradient-to-r from-gold to-[#ff8b6d] px-4 py-2 text-sm font-black text-white shadow-lift">{{ item.tag }}</span>
                <span class="absolute right-4 top-4 rounded-full bg-white/95 backdrop-blur px-4 py-2 text-sm font-black text-night shadow-lift">{{ displayDuration(item.duration) }}</span>
              </div>

              <div class="flex flex-1 flex-col p-6">
                <p class="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-night/[0.58]">{{ packageRoute(item)[0] }} - {{ packageRoute(item)[1] }}</p>
                <p class="mt-2 text-xs font-black uppercase tracking-[0.14em] text-lake">Updated {{ item.packageDate }}</p>
                <h3 class="mt-3 line-clamp-2 min-h-16 font-display text-2xl font-extrabold leading-8 text-night">{{ item.name }}</h3>
                <div class="mt-4 flex min-h-14 flex-wrap content-start gap-2 overflow-hidden">
                  <span v-for="chip in packageChips(item)" :key="`${item.name}-${chip}`" class="rounded-full bg-gradient-to-r from-frost to-lake/10 px-3 py-1 text-xs font-semibold text-night/[0.62]">{{ chip }}</span>
                </div>

                <div class="mt-5 grid grid-rows-4 gap-2">
                  <div v-for="([tier, amount], tierIndex) in packageTiers(item)" :key="`${item.name}-${tier}-${tierIndex}-mini`" class="grid min-h-9 grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] items-center gap-2 rounded-lg bg-frost px-3 py-2 text-xs">
                    <span class="truncate font-black text-night" :title="tier">{{ tier }}</span>
                    <span class="truncate text-right font-display font-extrabold text-lake" :title="displayCurrencyText(amount)">{{ displayCurrencyText(amount) }}</span>
                  </div>
                </div>

                <div class="mt-auto border-t border-night/[0.08] pt-5">
                  <p class="text-sm font-semibold text-night/[0.58]">Starting From</p>
                  <div class="mt-2 flex flex-wrap items-end gap-3">
                    <p class="font-display text-3xl font-extrabold text-lake">INR {{ item.price.toLocaleString("en-IN") }}</p>
                    <p class="pb-1 text-base font-bold text-night/40 line-through">INR {{ packageOriginalPrice(item).toLocaleString("en-IN") }}</p>
                  </div>
                  <div class="mt-5 grid grid-cols-2 gap-2">
                    <button type="button" class="package-action package-action-primary" @click="viewPackageDetails(item)">View Details</button>
                    <button type="button" class="package-action package-action-secondary" @click="selectPackageAndBook(item)">Enquire</button>
                    <a :href="packageWhatsappLink(item)" class="package-action package-action-whatsapp">
                      <img src="/social/whatsapp.svg" alt="" class="h-5 w-5" />
                      <span>WhatsApp</span>
                    </a>
                    <a :href="phoneTel" class="package-action package-action-secondary">Call Now</a>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <div v-else class="rounded-lg border border-dashed border-night/20 bg-frost p-10 text-center">
            <h3 class="text-2xl font-black text-night">No packages found in this price range.</h3>
            <button type="button" class="mt-5 rounded-lg bg-lake px-5 py-3 text-sm font-black text-white" @click="clearPackageFilters">Reset Filters</button>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'packages' || currentPage === 'packageDetail'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="relative overflow-hidden rounded-lg bg-night px-4 py-12 text-white shadow-premium sm:px-8 lg:py-16">
            <div class="image-cover absolute inset-0 opacity-45" :style="imageStyle(inclusionShowcase.backgroundImage)"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-night/78 via-night/70 to-night/90"></div>
            <div class="relative mx-auto max-w-4xl">
              <div class="text-center">
                <div class="mx-auto grid h-12 w-12 place-items-center rounded-full border border-gold/45 bg-gold/15 text-2xl text-gold">✦</div>
                <p class="mt-4 text-xs font-black uppercase tracking-[0.22em] text-gold">{{ inclusionShowcase.eyebrow }}</p>
                <h2 class="mt-2 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">{{ inclusionShowcase.title }}</h2>
              </div>

              <div class="mt-9 grid gap-6">
                <article v-for="item in inclusionShowcase.items" :key="item.title" class="text-center">
                  <div class="relative aspect-[16/5] overflow-hidden rounded-[1.5rem] border-2 border-white bg-white/10 shadow-premium">
                    <img :src="item.image" :alt="item.title" class="h-full w-full object-cover" loading="lazy" />
                    <div class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-night/20"></div>
                  </div>
                  <h3 class="mt-3 text-2xl font-black text-white sm:text-3xl">{{ item.title }}</h3>
                  <p class="mx-auto mt-1 max-w-2xl text-sm font-semibold leading-6 text-white/68">{{ item.text }}</p>
                </article>
              </div>
            </div>
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

      <section v-if="currentPage === 'destinations'" id="destinations" class="section-band min-h-screen pb-20 pt-28 sm:pt-32">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="page-hero relative mb-12 min-h-[32rem] overflow-hidden rounded-[2rem] shadow-premium">
            <div class="image-cover absolute inset-0" :style="imageStyle(kashmirWebImages.dalLake)"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-night/92 via-night/62 to-night/12"></div>
            <div class="relative flex min-h-[30rem] max-w-3xl flex-col justify-end p-6 text-white sm:p-10">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">{{ siteContent.destinationsHeroEyebrow }}</p>
              <h1 class="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-6xl">From Dal Lake mornings to Gurez mountain roads.</h1>
              <p class="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/76">Explore famous Kashmir icons and quieter valleys, then combine them into a practical route based on season, travel time, and your preferred pace.</p>
              <div class="mt-6 flex flex-wrap gap-2">
                <span v-for="place in ['Gulmarg', 'Sonmarg', 'Pahalgam', 'Yusmarg', 'Gurez', 'Doodhpathri', 'Leh']" :key="`hero-place-${place}`" class="rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-black backdrop-blur">{{ place }}</span>
              </div>
            </div>
          </div>

          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Explore Kashmir</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">{{ siteContent.destinationsHeroTitle }}</h2>
            <p class="mt-4 text-base leading-7 text-night/[0.62]">Each destination card now explains the experiences, nearby attractions, and travel style guests can expect.</p>
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

          <div class="mt-12">
            <div class="mb-6 max-w-3xl">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Attractions</p>
              <h3 class="mt-2 font-display text-3xl font-extrabold text-night sm:text-4xl">Important Kashmir experiences are now visible.</h3>
            </div>
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article v-for="[title, text] in attractionHighlights" :key="title" class="rounded-lg border border-night/10 bg-white p-5 shadow-lift">
                <h4 class="text-xl font-black text-night">{{ title }}</h4>
                <p class="mt-3 text-sm font-semibold leading-6 text-night/62">{{ text }}</p>
              </article>
            </div>
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

      <section v-if="currentPage === 'booking'" id="booking" class="page-intro section-band min-h-screen pb-20 pt-28 sm:pt-32">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div class="relative min-h-[38rem] overflow-hidden rounded-lg shadow-premium">
            <div class="image-cover absolute inset-0" :style="imageStyle('image20')"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-night/92 via-night/62 to-lake/30"></div>
            <div class="relative flex min-h-[38rem] flex-col justify-between p-5 text-white sm:p-7">
              <div>
                <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">{{ siteContent.bookingHeroEyebrow }}</p>
                <h2 class="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{{ siteContent.bookingHeroTitle }}</h2>
                <p class="mt-5 max-w-xl text-sm font-semibold leading-7 text-white/78">Share your travel date, group size, and comfort level. The Snow Feather Adventures team will confirm the route, stays, cab, and activity details in one clear plan.</p>
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
                    <p class="mt-1 font-display text-3xl font-extrabold text-lake">INR {{ bookingTotal }}</p>
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

          <form class="booking-form planner-form premium-card rounded-lg p-5 shadow-premium sm:p-6" @submit.prevent="submitBookingInquiry">
            <div class="mb-5 flex flex-col gap-3 border-b border-night/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">Trip request</p>
                <h3 class="mt-1 text-2xl font-black text-night">Build your Kashmir booking</h3>
                <p class="mt-2 text-sm font-semibold leading-6 text-night/58">Our Kashmir travel specialist will get back with the best available plan.</p>
              </div>
              <span class="rounded-lg bg-night px-4 py-2 text-xs font-black text-white">Secure inquiry</span>
            </div>

            <div class="form-step-label"><span>01</span><p>Route and dates</p></div>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="grid min-w-0 gap-2 text-sm font-bold"><span>Package <span class="text-red-600">*</span></span>
                <select v-model="selectedPackage" required class="w-full min-w-0 truncate rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20">
                  <option v-for="item in publicPackages" :key="item.name" :value="item.price">{{ item.name }}</option>
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
                  <option :value="1.25">Premium</option>
                  <option :value="1.65">Luxurious</option>
                  <option :value="2.1">VIP</option>
                </select>
              </label>
            </div>

            <div class="form-step-label mt-6"><span>02</span><p>Guest details</p></div>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="grid gap-2 text-sm font-bold md:col-span-2"><span>Name <span class="text-red-600">*</span></span>
                <input v-model="bookingInquiry.name" type="text" placeholder="Name" required class="rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              </label>
              <label class="grid gap-2 text-sm font-bold"><span>Email <span class="text-red-600">*</span></span>
                <input v-model="bookingInquiry.email" type="email" placeholder="email" required class="rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              </label>
              <label class="grid gap-2 text-sm font-bold"><span>Phone <span class="text-red-600">*</span></span>
                <input v-model="bookingInquiry.phone" type="tel" placeholder="phone" required class="rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              </label>
            </div>

            <div class="form-step-label mt-6"><span>03</span><p>Preferences</p></div>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="grid gap-2 text-sm font-bold"><span>Hotel preference</span>
                <select v-model="bookingInquiry.hotelPreference"><option value="">Select hotel preference</option><option>Standard</option><option>Premium</option><option>Luxurious</option><option>VIP</option></select>
              </label>
              <label class="grid gap-2 text-sm font-bold"><span>Budget range</span>
                <select v-model="bookingInquiry.budgetRange"><option value="">Select budget</option><option>Standard</option><option>Premium</option><option>Luxurious</option><option>VIP custom</option></select>
              </label>
              <label class="grid gap-2 text-sm font-bold"><span>Travel type</span>
                <select @change="appendPlannerNote('Travel type', $event.target.value)"><option value="">Select travel type</option><option v-for="type in travelTypes" :key="`booking-type-${type}`">{{ type }}</option></select>
              </label>
              <label class="grid gap-2 text-sm font-bold"><span>Preferred contact</span>
                <select v-model="bookingInquiry.contactMethod"><option>WhatsApp</option><option>Call</option><option>Email</option></select>
              </label>
              <label class="grid gap-2 text-sm font-bold md:col-span-2"><span>Trip notes</span>
                <textarea v-model="bookingInquiry.notes" placeholder="Tell us preferred hotels, pickup point, must-see places, or special requests" class="min-h-28 rounded-lg border border-night/10 px-3 py-3 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20"></textarea>
              </label>
            </div>

            <p v-if="bookingInquiryStatus" :class="/thank you|sent/i.test(bookingInquiryStatus) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'" class="mt-5 rounded-lg p-3 text-sm font-semibold">
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
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Pay your advance with the Snow Feather Adventures UPI scanner.</h2>
            <p class="mt-5 text-base leading-7 text-night/[0.62]">After submitting your booking inquiry, scan the QR code, complete the advance payment, and share the payment screenshot on WhatsApp for faster confirmation.</p>
          </div>

          <div class="rounded-lg bg-frost p-5 shadow-lift">
            <div class="grid gap-5 sm:grid-cols-[13rem_1fr] sm:items-center">
              <img src="/upi-img.jpeg" alt="Snow Feather Adventures UPI payment QR scanner" class="mx-auto aspect-square w-full max-w-52 rounded-lg border border-night/10 bg-white object-contain p-3 shadow-lift" />
              <div>
                <p class="text-sm font-black uppercase tracking-[0.18em] text-lake">UPI payment</p>
                <h3 class="mt-2 text-2xl font-black text-night">Scan QR to pay</h3>
                <p class="mt-3 text-sm leading-6 text-night/[0.62]">Use any UPI app to scan the code. Mention your name, package, and travel date when sending the payment screenshot.</p>
            <a :href="whatsappLink('I have completed the UPI payment for my Snow Feather booking')" class="mt-5 inline-flex rounded-lg bg-night px-5 py-3 text-sm font-black text-white hover:bg-lake">Send Screenshot</a>
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

      <section v-if="currentPage === 'home'" class="bg-white py-14 sm:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div class="lg:sticky lg:top-28">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Why choose us</p>
              <h2 class="mt-3 font-display text-4xl font-extrabold text-night sm:text-5xl">Confidence is part of every package.</h2>
              <p class="mt-5 text-base font-semibold leading-8 text-night/[0.62]">More than 25 years in Kashmir tourism and adventure taught us that trust is built through clear information, realistic promises, responsive support, and consistent delivery.</p>
              <button type="button" class="mt-7 rounded-lg bg-gold px-6 py-3.5 text-sm font-black text-night shadow-lift hover:bg-night hover:text-white" @click="navigateTo('/contact')">Talk To Our Team</button>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div v-for="item in trustGuarantees" :key="item" class="flex min-h-20 items-center gap-4 rounded-lg border border-night/[0.08] bg-frost p-4 shadow-lift">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lake text-sm font-black text-white">Ok</span>
                <p class="font-black text-night">{{ item }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="bg-white py-14 sm:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-4xl">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Kashmir destination gallery</p>
              <h2 class="mt-3 font-display text-4xl font-extrabold text-night sm:text-5xl">From famous landmarks to Kashmir’s quieter valleys.</h2>
              <p class="mt-4 text-base font-semibold leading-8 text-night/[0.62]">Explore Gulmarg, Pahalgam, Sonmarg, Doodhpathri, Yousmarg, Dal Lake, Srinagar, Aru, Chandanwari, Gurez, and Tulail through a richer collection of destination photographs.</p>
            </div>
            <button type="button" class="self-start rounded-lg bg-night px-6 py-3 text-sm font-black text-white hover:bg-lake lg:self-auto" @click="navigateTo('/destinations')">Explore All Destinations</button>
          </div>
          <div class="grid auto-rows-[15rem] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article
              v-for="(place, index) in destinationSpotlights"
              :key="place.name"
              class="group relative overflow-hidden rounded-lg shadow-premium"
              :class="index === 0 || index === 5 || index === 9 ? 'sm:col-span-2' : ''"
            >
              <div class="image-cover absolute inset-0 transition duration-700 group-hover:scale-105" :style="imageStyle(place.image)"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-night/92 via-night/20 to-transparent"></div>
              <div class="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 class="font-display text-2xl font-extrabold">{{ place.name }}</h3>
                <p class="mt-2 max-w-md text-sm font-semibold leading-6 text-white/76">{{ place.note }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="section-band py-14 sm:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-9 text-center">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Guest reviews & testimonials</p>
            <h2 class="mt-3 font-display text-4xl font-extrabold text-night sm:text-5xl">Real experiences. Lasting trust.</h2>
            <p class="mx-auto mt-4 max-w-3xl text-base font-semibold leading-8 text-night/[0.62]">See why families, couples, groups, and adventure travelers trust our local team to plan and support their Kashmir journeys.</p>
          </div>
          <div class="grid gap-5 lg:grid-cols-3">
            <article v-for="review in testimonials" :key="review.name" class="testimonial-card rounded-lg border border-night/[0.08] bg-white p-6 shadow-premium" data-reveal>
              <div class="flex items-center gap-4">
                <div class="image-cover h-14 w-14 rounded-full" :style="imageStyle(review.image)"></div>
                <div>
                  <h3 class="font-black text-night">{{ review.name }}</h3>
                  <p class="text-xs font-bold uppercase tracking-[0.12em] text-lake">{{ review.location || "Guest" }} · {{ review.trip }}</p>
                </div>
                <span class="ml-auto rounded-full bg-gold/15 px-3 py-2 text-sm font-black text-gold">★ {{ review.rating }}</span>
              </div>
              <div class="mt-5 flex items-center gap-1 text-gold" aria-label="Five star review">
                <span v-for="star in 5" :key="`${review.name}-star-${star}`">★</span>
                <span class="ml-2 text-xs font-black uppercase tracking-[0.12em] text-night/42">Verified guest</span>
              </div>
              <p class="mt-5 text-sm font-semibold leading-7 text-night/[0.62]">“{{ review.text }}”</p>
            </article>
          </div>
          <form class="mt-8 grid gap-4 rounded-lg border border-white/70 bg-white/82 p-5 shadow-premium backdrop-blur md:grid-cols-2" @submit.prevent="submitReview">
            <div class="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.18em] text-lake">Share Your Experience</p>
                <h3 class="mt-1 font-display text-3xl font-extrabold text-night">Help future guests trust their Kashmir journey.</h3>
              </div>
              <span class="rounded-lg bg-night px-4 py-2 text-xs font-black text-white">Google-style review</span>
            </div>
            <input v-model="reviewForm.name" required type="text" placeholder="Name" />
            <input v-model="reviewForm.location" type="text" placeholder="Location" />
            <select v-model="reviewForm.rating" aria-label="Rating">
              <option>5.0</option>
              <option>4.9</option>
              <option>4.8</option>
              <option>4.7</option>
            </select>
            <input v-model="reviewForm.trip" required type="text" placeholder="Travel Experience" />
            <label class="flex cursor-pointer items-center justify-center rounded-lg border border-night/10 bg-frost px-4 py-3 text-sm font-black text-night/62">
              Upload Photo optional
              <input type="file" accept="image/*" class="hidden" @change="updateReviewPhoto" />
            </label>
            <textarea v-model="reviewForm.text" required placeholder="Short review" class="min-h-28 md:col-span-2"></textarea>
            <p v-if="reviewFormStatus" class="rounded-lg bg-green-50 p-3 text-sm font-bold text-green-700 md:col-span-2">{{ reviewFormStatus }}</p>
            <button type="submit" class="rounded-lg bg-night px-5 py-3 text-sm font-black text-white hover:bg-lake md:col-span-2">Submit Review</button>
          </form>
        </div>
      </section>

      <section v-if="currentPage === 'home'" id="gallery" class="section-band py-12 sm:py-14">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-4xl">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">{{ siteContent.homeGalleryEyebrow }}</p>
              <h2 class="mt-2 font-display text-3xl font-extrabold leading-tight text-night sm:text-4xl lg:text-5xl">A world of snow, lakes, mountains, culture, and story-worthy frames.</h2>
            </div>
            <button type="button" class="self-start rounded-lg bg-night px-6 py-3 text-sm font-black text-white hover:bg-lake lg:self-auto" @click="navigateTo('/gallery')">Open Full Gallery</button>
          </div>
          <div class="mb-6 flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="filter in galleryFilters"
              :key="filter"
              type="button"
              class="gallery-filter"
              :class="{ active: activeGalleryFilter === filter }"
              @click="activeGalleryFilter = filter"
            >
              {{ filter }}
            </button>
          </div>
          <div class="grid gap-4 md:grid-cols-4">
            <button
              v-for="(galleryImage, index) in filteredGalleryImages.slice(0, 16)"
              :key="`${mediaSource(galleryImage)}-${index}-${activeGalleryFilter}`"
              type="button"
              class="group relative h-72 overflow-hidden rounded-lg text-left shadow-lift"
              :class="index % 5 === 0 ? 'md:col-span-2' : ''"
              @click="galleryLightboxImage = { image: galleryImage, index }"
            >
              <div class="image-cover absolute inset-0 transition duration-500 group-hover:scale-105 group-hover:opacity-70" :style="imageStyle(galleryImage)"></div>
              <div class="absolute inset-0 flex items-end bg-gradient-to-t from-night/86 via-night/28 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                <div>
                  <p class="mb-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-gold">{{ galleryImageTags(galleryImage, index).slice(0, 3).join(" · ") }}</p>
                  <p class="text-xl font-black text-white">{{ galleryImageDetail(galleryImage, index)[0] }}</p>
                  <p class="mt-2 max-w-sm text-sm font-semibold leading-6 text-white/78">{{ galleryImageDetail(galleryImage, index)[1] }}</p>
                </div>
              </div>
            </button>
            <!-- <div class="dark-panel grid h-72 place-items-center rounded-lg p-6 text-center text-white"><div><p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Video Gallery</p><p class="mt-3 text-3xl font-black">Play reels, drone shots, and customer clips here.</p></div></div> -->
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="relative overflow-hidden bg-night py-14 text-white sm:py-16">
        <div class="image-cover absolute inset-0 opacity-25" :style="imageStyle('image22')"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-night via-night/90 to-alpine/70"></div>
        <div class="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Plan your Kashmir journey</p>
            <h2 class="mt-3 font-display text-4xl font-extrabold sm:text-5xl">One conversation can turn your Kashmir idea into a clear plan.</h2>
            <p class="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/70">Share your destination, dates, group size, and preferred comfort. Our local team will suggest the right route, stay, transport, activities, and transparent price range.</p>
          </div>
          <div class="grid gap-3 rounded-lg border border-white/14 bg-white/10 p-5 backdrop-blur">
            <a :href="whatsappLink('I want a Kashmir tour quotation')" class="rounded-lg bg-[#25D366] px-6 py-4 text-center text-base font-black text-white">WhatsApp For A Quote</a>
            <a :href="phoneTel" class="rounded-lg bg-white px-6 py-4 text-center text-base font-black text-night">Call {{ phoneDisplay }}</a>
            <button type="button" class="rounded-lg border border-white/18 px-6 py-4 text-base font-black text-white" @click="navigateTo('/booking')">Send Enquiry Form</button>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'home'" class="bg-white py-14 sm:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-4xl">
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Experienced & highly qualified team</p>
              <h2 class="mt-3 font-display text-4xl font-extrabold text-night sm:text-5xl">Guided by Olympians, national champions, instructors, and Himalayan experts.</h2>
              <p class="mt-4 text-base font-semibold leading-7 text-night/[0.62]">Our professional strength comes from respected specialists in skiing, mountaineering, trekking, mountain rescue, winter sports, outdoor leadership, and Kashmir tourism. Their knowledge helps us maintain high standards of safety, planning, and guest care.</p>
            </div>
            <button type="button" class="self-start rounded-lg bg-night px-6 py-3 text-sm font-black text-white hover:bg-lake lg:self-auto" @click="navigateTo('/about')">Meet Our Expert Team</button>
          </div>
          <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <button v-for="mentor in mentors" :key="`home-mentor-${mentor.name}`" type="button" class="group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-night/[0.08] bg-white text-left shadow-lift" @click="navigateTo('/about')">
              <div class="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-frost">
                <img :src="mentor.image" :alt="mentor.name" class="h-full w-full object-cover object-top transition duration-500" :style="mentorPortraitStyle(mentor)" loading="lazy" />
                <div class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-night/[0.06]"></div>
              </div>
              <div class="relative flex min-h-28 flex-1 flex-col border-t border-night/[0.08] bg-white p-3">
                <p class="line-clamp-2 min-h-10 text-sm font-black leading-5 text-night">{{ mentor.name }}</p>
                <p class="mt-2 line-clamp-3 min-h-12 text-[0.68rem] font-bold uppercase leading-4 tracking-[0.1em] text-lake">{{ mentor.role }}</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'gallery'" class="page-intro section-band min-h-screen pb-20 pt-28 sm:pt-32">
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

      <section v-if="currentPage === 'blog'" class="page-intro section-band min-h-screen pb-20 pt-28 sm:pt-32">
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
            <article v-for="(post, index) in visibleBlogPosts" :key="`${post.title}-${index}`" class="premium-card overflow-hidden rounded-lg hover-lift">
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
          <div v-if="hasMoreBlogPosts" class="mt-10 text-center">
            <button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl bg-night px-7 py-4 text-sm font-black text-white shadow-lift hover:bg-lake" @click="showMoreBlogPosts">
              <span>Show More Articles</span>
              <span aria-hidden="true">↓</span>
            </button>
            <p class="mt-3 text-xs font-bold text-night/45">Showing {{ visibleBlogPosts.length }} of {{ blogPosts.length }} articles</p>
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

      <section v-if="currentPage === 'contact'" id="contact" class="page-intro section-band min-h-screen pb-20 pt-28 sm:pt-32">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div class="relative min-h-[37rem] overflow-hidden rounded-lg shadow-premium">
            <div class="image-cover absolute inset-0" :style="imageStyle('/kashmir-dal-lake-vibrant-v2.png')"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-night/92 via-night/64 to-lake/28"></div>
            <div class="relative flex min-h-[37rem] flex-col justify-between p-5 text-white sm:p-7">
              <div>
                <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">{{ siteContent.contactHeroEyebrow }}</p>
                <h2 class="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{{ siteContent.contactHeroTitle }}</h2>
                <p class="mt-5 max-w-xl text-sm font-semibold leading-7 text-white/76">Reach us for package planning, booking changes, route suggestions, emergency coordination, or quick WhatsApp support.</p>
              </div>

              <div class="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <a :href="phoneTel" class="min-w-0 rounded-lg border border-white/18 bg-white/12 p-3 backdrop-blur-xl transition hover:bg-white/20">
                  <p class="text-[0.62rem] font-black uppercase leading-4 tracking-[0.14em] text-gold">Call / WhatsApp</p>
                  <p class="mt-2 break-words text-xs font-black leading-5 text-white sm:text-[0.8rem]">{{ phoneDisplay }}</p>
                </a>
                <a :href="`mailto:${siteContent.contactEmail}`" class="min-w-0 rounded-lg border border-white/18 bg-white/12 p-3 backdrop-blur-xl transition hover:bg-white/20">
                  <p class="text-[0.62rem] font-black uppercase leading-4 tracking-[0.14em] text-gold">Email</p>
                  <p class="mt-2 break-all text-xs font-black leading-5 text-white sm:text-[0.8rem]">{{ siteContent.contactEmail }}</p>
                </a>
                <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteContent.mapQuery || siteContent.contactAddress)}`" target="_blank" rel="noreferrer" class="min-w-0 rounded-lg border border-white/18 bg-white/12 p-3 backdrop-blur-xl transition hover:bg-white/20">
                  <p class="text-[0.62rem] font-black uppercase leading-4 tracking-[0.14em] text-gold">Office</p>
                  <p class="mt-2 line-clamp-5 text-xs font-semibold leading-5 text-white/78 sm:text-[0.8rem]">{{ siteContent.contactAddress }}</p>
                </a>
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
                <h3 class="mt-1 text-2xl font-black text-night">Tell us what you need—we’ll confirm every detail</h3>
              </div>
              <span class="rounded-lg bg-gold px-4 py-2 text-xs font-black text-night">Fast response</span>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <input v-model="bookingForm.name" type="text" placeholder="Full name" required class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              <input v-model="bookingForm.phone" type="tel" placeholder="Phone / WhatsApp" required class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              <input v-model="bookingForm.email" type="email" placeholder="Email" required class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              <select v-model="bookingForm.destination" required class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20">
                <option value="" disabled>Preferred destination</option>
                <option v-for="[name] in destinations" :key="`contact-${name}`" :value="name">{{ name }}</option>
              </select>
              <input v-model="bookingForm.travelDate" type="date" aria-label="Travel date" class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              <input v-model.number="bookingForm.guests" type="number" min="1" placeholder="Number of guests" aria-label="Number of guests" class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20" />
              <textarea v-model="bookingForm.details" placeholder="Tell us your dates, travelers, budget, and preferred destinations" class="min-h-36 rounded-lg border border-night/10 px-4 py-3 text-sm font-bold md:col-span-2 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20"></textarea>
            </div>
            <p v-if="bookingFormStatus" :class="bookingFormStatus.includes('valid') ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'" class="mt-4 rounded-lg p-3 text-sm font-semibold">{{ bookingFormStatus }}</p>
            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="submit" class="rounded-lg bg-gold px-5 py-4 text-base font-black uppercase tracking-[0.12em] text-night transition hover:bg-night hover:text-white">Send Enquiry</button>
              <a :href="whatsappLink('I want to book a Kashmir tour')" class="rounded-lg border border-night/[0.12] px-5 py-3 text-center text-sm font-black text-night transition hover:border-lake hover:text-lake hover:bg-frost">WhatsApp Live Chat</a>
            </div>
            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              <div class="rounded-lg bg-frost p-3 text-center text-xs font-black text-night/62">Hotels</div>
              <div class="rounded-lg bg-frost p-3 text-center text-xs font-black text-night/62">Cabs</div>
              <div class="rounded-lg bg-frost p-3 text-center text-xs font-black text-night/62">Activities</div>
            </div>
            <p class="mt-4 text-center text-xs font-bold leading-5 text-night/50">Submitting an enquiry does not create a payment obligation. Our team will contact you to confirm availability, inclusions, and the final quotation.</p>
          </form>
        </div>
      </section>

      <section v-if="currentPage === 'contact'" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Clear enquiry & confirmation</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Know exactly what happens after you contact us.</h2>
          </div>
          <div class="mb-12 grid gap-4 md:grid-cols-3">
            <article v-for="[number, title, text] in inquiryAssurances" :key="title" class="premium-card rounded-lg p-6 hover-lift">
              <span class="grid h-11 w-11 place-items-center rounded-full bg-gold text-lg font-black text-night">{{ number }}</span>
              <h3 class="mt-5 text-2xl font-black text-night">{{ title }}</h3>
              <p class="mt-3 text-sm font-semibold leading-7 text-night/[0.62]">{{ text }}</p>
            </article>
          </div>
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
            <iframe title="Kashmir contact map" class="h-[32rem] w-full" loading="lazy" referrerpolicy="no-referrer-when-downgrade" :src="`https://www.google.com/maps?q=${encodeURIComponent(siteContent.mapQuery || siteContent.contactAddress)}&output=embed`"></iframe>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'privacyPolicy'" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto max-w-5xl px-4 sm:px-6">
          <div class="max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Privacy Policy</p>
            <h1 class="mt-3 font-display text-4xl font-extrabold text-night sm:text-5xl">How Snow Feather Adventures handles guest information.</h1>
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
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">For privacy questions or correction requests, contact us at snowfeatheradventures@gmail.com or {{ phoneDisplay }}.</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'termsOfService'" class="section-band min-h-screen pb-16 pt-32">
        <div class="mx-auto max-w-5xl px-4 sm:px-6">
          <div class="max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Terms of Service</p>
            <h1 class="mt-3 font-display text-4xl font-extrabold text-night sm:text-5xl">Booking terms for Snow Feather Adventures guests.</h1>
            <p class="mt-5 text-base leading-8 text-night/[0.64]">
              These terms explain the conditions for inquiries, package planning, booking confirmation, payment, route changes, cancellations, and travel coordination with Snow Feather Adventures.
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
              <p class="mt-3 text-sm leading-7 text-night/[0.64]">For booking support, itinerary changes, or service questions, contact Snow Feather Adventures at snowfeatheradventures@gmail.com or {{ phoneDisplay }}.</p>
            </article>
          </div>
        </div>
      </section>
    </main>

    <div v-if="galleryLightboxImage" class="fixed inset-0 z-[88] grid place-items-center bg-[#031218]/90 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Kashmir gallery image" @click.self="galleryLightboxImage = null">
      <div class="relative w-full max-w-5xl overflow-hidden rounded-lg bg-night shadow-2xl">
        <button type="button" class="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-xl font-black text-night shadow-lg" aria-label="Close gallery image" @click="galleryLightboxImage = null">×</button>
        <div class="grid lg:grid-cols-[1.35fr_0.65fr]">
          <div class="min-h-[22rem] bg-cover bg-center sm:min-h-[34rem]" :style="imageStyle(galleryLightboxImage.image)"></div>
          <div class="bg-white p-6 text-night sm:p-8">
            <p class="text-xs font-black uppercase tracking-[0.18em] text-lake">{{ galleryImageTags(galleryLightboxImage.image, galleryLightboxImage.index).join(" · ") }}</p>
            <h2 class="mt-4 font-display text-4xl font-extrabold">{{ galleryImageTitle(galleryLightboxImage.image, galleryLightboxImage.index) }}</h2>
            <p class="mt-4 text-sm font-semibold leading-7 text-night/62">{{ galleryImageText(galleryLightboxImage.image, galleryLightboxImage.index) }}</p>
            <button type="button" class="mt-7 w-full rounded-lg bg-night px-5 py-3 text-sm font-black text-white hover:bg-lake" @click="galleryLightboxImage = null; openTripPlanner('plan')">Plan A Trip Like This</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="false && isTripPlannerOpen" class="fixed inset-0 z-[90] grid place-items-center bg-[#031218]/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Plan your Kashmir trip" @click.self="isTripPlannerOpen = false">
      <div class="planner-modal relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-[#f5f0e8] shadow-2xl">
        <button type="button" class="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-xl text-night shadow-lg" aria-label="Close trip planner" @click="isTripPlannerOpen = false">×</button>
        <div class="grid md:grid-cols-[0.72fr_1.28fr]">
          <div class="relative hidden min-h-[34rem] md:block">
            <img src="/images/image39.jpeg" alt="Kashmir mountain valley" class="absolute inset-0 h-full w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-night/90 via-night/15 to-transparent"></div>
            <p class="absolute bottom-7 left-7 right-7 font-display text-3xl font-extrabold text-white">Your Kashmir story starts with one conversation.</p>
          </div>
          <div class="p-7 sm:p-10">
            <p class="editorial-eyebrow">Private trip planner</p>
            <h2 class="mt-3 font-display text-4xl font-extrabold leading-tight text-night">What are you dreaming of?</h2>
            <p class="mt-3 text-sm leading-6 text-night/55">Tell us the mood. We’ll shape the route, stays, and experiences around you.</p>
            <div class="mt-7 grid gap-3">
              <button v-for="mood in ['Snow & adventure', 'Honeymoon & slow travel', 'Family discovery', 'Luxury private journey']" :key="mood" type="button" class="planner-choice" @click="bookingInquiry.notes = mood">{{ mood }} <span>-></span></button>
            </div>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <input v-model="bookingInquiry.name" type="text" placeholder="Name" class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold" />
              <input v-model="bookingInquiry.phone" type="tel" placeholder="Phone / WhatsApp" class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold" />
              <input v-model="bookingInquiry.travelDate" type="month" aria-label="Travel month" class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold" />
              <select class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold" @change="bookingInquiry.notes = `${bookingInquiry.notes ? bookingInquiry.notes + ' | ' : ''}People: ${$event.target.value}`">
                <option value="">Number of people</option>
                <option>1-2 travelers</option>
                <option>3-5 travelers</option>
                <option>6-10 travelers</option>
                <option>10+ travelers</option>
              </select>
              <select class="rounded-lg border border-night/10 px-4 py-3 text-sm font-bold" @change="bookingInquiry.notes = `${bookingInquiry.notes ? bookingInquiry.notes + ' | ' : ''}Budget: ${$event.target.value}`">
                <option value="">Budget range</option>
                <option>Standard</option>
                <option>Premium</option>
                <option>Luxurious</option>
                <option>VIP custom</option>
              </select>
              <textarea v-model="bookingInquiry.notes" placeholder="Message, trip type, destinations, hotel preference, or special request" class="min-h-28 rounded-lg border border-night/10 px-4 py-3 text-sm font-bold sm:col-span-2"></textarea>
            </div>
            <button type="button" class="luxury-button luxury-button-dark mt-7 w-full" @click="isTripPlannerOpen = false; navigateTo('/booking')">Build my journey</button>
            <a :href="whatsappLink(`Help me plan my dream Kashmir trip. Name: ${bookingInquiry.name || ''}. Phone: ${bookingInquiry.phone || ''}. Travel month: ${bookingInquiry.travelDate || ''}. Notes: ${bookingInquiry.notes || ''}`)" class="mt-3 block text-center text-xs font-black uppercase tracking-[0.14em] text-night/50">Or plan instantly on WhatsApp</a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isTripPlannerOpen" class="modal-backdrop fixed inset-0 z-[90] grid place-items-center bg-[#031218]/80 p-3 backdrop-blur-md sm:p-4" role="dialog" aria-modal="true" aria-label="Plan your Kashmir trip" @click.self="isTripPlannerOpen = false">
      <div class="planner-modal modal-panel relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[1.5rem] bg-[#f7f3ec] shadow-2xl">
        <button type="button" class="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-xl text-night shadow-lg" aria-label="Close trip planner" @click="isTripPlannerOpen = false">×</button>
        <div class="grid lg:grid-cols-[0.88fr_1.12fr]">
          <div class="relative min-h-[24rem] overflow-hidden rounded-t-[1.5rem] lg:rounded-l-[1.5rem] lg:rounded-r-none lg:rounded-t-none">
            <div class="image-cover absolute inset-0" :style="{ backgroundImage: `url('${tripPlannerMode === 'reserve' ? packageVisual(detailPackage) : '/images/image39.jpeg'}')` }"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-night/96 via-night/42 to-night/8"></div>
            <div class="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p class="text-xs font-black uppercase tracking-[0.22em] text-gold">{{ tripPlannerMode === "reserve" ? "Reserve package" : "Trip planning assistant" }}</p>
              <h3 class="mt-3 font-display text-4xl font-extrabold leading-tight">{{ tripPlannerMode === "reserve" ? "Hold the right Kashmir plan before it sells out." : "Tell us what Kashmir should feel like." }}</h3>
              <p class="mt-4 text-sm font-semibold leading-7 text-white/72">Route, stays, cab, budget, and activities are checked by a local Kashmir specialist before confirmation.</p>
              <div class="mt-5 grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/72 sm:grid-cols-2">
                <span v-for="badge in trustBadges.slice(0, 4)" :key="`modal-${badge}`" class="rounded-full border border-white/16 bg-white/10 px-3 py-2 backdrop-blur">{{ badge }}</span>
              </div>
            </div>
          </div>
          <form class="planner-form p-5 sm:p-8" @submit.prevent="submitBookingInquiry">
            <div class="mb-5 pr-10">
              <p class="text-xs font-black uppercase tracking-[0.18em] text-lake">Quick enquiry</p>
              <h3 class="mt-2 text-2xl font-black text-night">Get a clear plan from our team.</h3>
              <p class="mt-2 text-sm font-semibold leading-6 text-night/58">No spam. Just a practical itinerary, availability check, and next steps.</p>
            </div>
            <div class="grid gap-2 sm:grid-cols-2">
              <button v-for="type in travelTypes" :key="`planner-type-${type}`" type="button" class="planner-choice" @click="pickPlannerChoice(type)">{{ type }} <span>-></span></button>
            </div>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <label class="grid gap-2 text-sm font-bold">Full Name<input v-model="bookingInquiry.name" required type="text" placeholder="Full name" /></label>
              <label class="grid gap-2 text-sm font-bold">Phone / WhatsApp<input v-model="bookingInquiry.phone" required type="tel" placeholder="10-digit phone" /></label>
              <label class="grid gap-2 text-sm font-bold">Email<input v-model="bookingInquiry.email" required type="email" placeholder="Email address" /></label>
              <label class="grid gap-2 text-sm font-bold">Travel Month<input v-model="bookingInquiry.travelDate" type="month" /></label>
              <label class="grid gap-2 text-sm font-bold">Package / Interest<select v-model="selectedPackage"><option v-for="item in publicPackages" :key="`modal-package-${item.name}`" :value="item.price">{{ item.name }}</option></select></label>
              <label class="grid gap-2 text-sm font-bold">No. of Guests<input v-model.number="travelers" min="1" type="number" /></label>
              <label class="grid gap-2 text-sm font-bold">Budget Range<select v-model="bookingInquiry.budgetRange"><option value="">Select budget</option><option>Standard</option><option>Premium</option><option>Luxurious</option><option>VIP custom</option></select></label>
              <label class="grid gap-2 text-sm font-bold">Contact Method<select v-model="bookingInquiry.contactMethod"><option>WhatsApp</option><option>Call</option><option>Email</option></select></label>
              <label class="grid gap-2 text-sm font-bold sm:col-span-2">Message<textarea v-model="bookingInquiry.notes" placeholder="Destinations, travel type, hotel preference, budget, or special request" class="min-h-28"></textarea></label>
            </div>
            <p v-if="bookingInquiryStatus" :class="/thank you|sent/i.test(bookingInquiryStatus) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'" class="mt-4 rounded-lg p-3 text-sm font-semibold">{{ bookingInquiryStatus }}</p>
            <div class="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <button type="submit" :disabled="isBookingSubmitting" class="luxury-button luxury-button-dark w-full">{{ isBookingSubmitting ? "Sending..." : tripPlannerMode === "reserve" ? "Request reservation" : "Build my journey" }}</button>
              <button type="button" class="rounded-full border border-night/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-night hover:border-lake hover:text-lake" @click="isCallbackOpen = true">Quick callback</button>
            </div>
            <a :href="whatsappLink(`Help me plan my Kashmir trip. Package: ${selectedPackageName}. Name: ${bookingInquiry.name || ''}. Phone: ${bookingInquiry.phone || ''}. Travel month: ${bookingInquiry.travelDate || ''}. Guests: ${travelers}. Budget: ${bookingInquiry.budgetRange || ''}. Notes: ${bookingInquiry.notes || ''}`)" class="mt-4 block text-center text-xs font-black uppercase tracking-[0.14em] text-night/50">Or plan instantly on WhatsApp</a>
          </form>
        </div>
      </div>
    </div>

    <div v-if="isCallbackOpen" class="modal-backdrop fixed inset-0 z-[91] grid place-items-center bg-[#031218]/74 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Request callback" @click.self="isCallbackOpen = false">
      <form class="modal-panel w-full max-w-md rounded-[1.25rem] bg-white p-6 shadow-2xl" @submit.prevent="requestCallback">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.18em] text-lake">Quick callback</p>
            <h3 class="mt-2 text-2xl font-black text-night">Need help choosing?</h3>
            <p class="mt-2 text-sm font-semibold leading-6 text-night/58">Share your number and preferred time. A Kashmir travel specialist will call back.</p>
          </div>
          <button type="button" class="grid h-10 w-10 place-items-center rounded-full bg-frost text-xl text-night" aria-label="Close callback popup" @click="isCallbackOpen = false">×</button>
        </div>
        <div class="mt-5 grid gap-3">
          <input v-model="callbackForm.name" required type="text" placeholder="Full name" />
          <input v-model="callbackForm.phone" required type="tel" placeholder="Phone / WhatsApp" />
          <select v-model="callbackForm.time">
            <option v-for="time in callbackTimes" :key="time">{{ time }}</option>
          </select>
        </div>
        <p v-if="callbackStatus" class="mt-4 rounded-lg bg-green-50 p-3 text-sm font-bold text-green-700">{{ callbackStatus }}</p>
        <button type="submit" class="mt-5 w-full rounded-lg bg-night px-5 py-4 text-sm font-black text-white hover:bg-lake">Request Callback</button>
      </form>
    </div>

    <footer class="site-footer bg-night px-4 py-12 text-white sm:px-6 lg:py-16">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 xl:grid-cols-[1.25fr_0.8fr_0.85fr_1fr] xl:gap-12">
          <div>
            <button type="button" class="inline-flex items-center gap-3 text-left" @click="navigateTo('/')">
              <span class="grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-lake/30 bg-white p-2">
                <img :src="logoSrc" :alt="`${brandName} logo`" class="h-full w-full object-contain" />
              </span>
              <span>
                <span class="block font-display text-2xl font-extrabold text-lake">{{ brandName }}</span>
                <span class="block text-xs font-black uppercase tracking-[0.14em] text-white/60">{{ brandTagline }}</span>
              </span>
            </button>
            <p class="mt-6 max-w-sm text-sm font-semibold leading-7 text-white/72">
              Your Kashmir travel partner for transparent tour packages, hotels, houseboats, private cabs, snow adventures, valleys, and locally supported journeys.
            </p>
            <div class="mt-6 flex gap-3">
              <a href="https://www.instagram.com/" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 transition hover:-translate-y-1 hover:border-lake/40 hover:bg-white/15" aria-label="Instagram">
                <img src="/social/instagram.svg" alt="" class="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 transition hover:-translate-y-1 hover:border-lake/40 hover:bg-white/15" aria-label="Facebook">
                <img src="/social/facebook.svg" alt="" class="h-5 w-5" />
              </a>
              <a :href="whatsappLink('I want to book a Kashmir tour')" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 transition hover:-translate-y-1 hover:border-lake/40 hover:bg-white/15" aria-label="WhatsApp">
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
              <button type="button" class="text-left hover:text-lake" @click="navigateTo('/destinations')">Kashmir Destinations</button>
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

          <div>
            <h2 class="font-display text-2xl font-extrabold text-lake">Registered Details</h2>
            <div class="mt-6 grid gap-3">
              <div v-for="[label, value] in registrationDetails" :key="`footer-${label}`" class="rounded-lg border border-white/10 bg-white/8 p-3">
                <p class="text-xs font-black uppercase tracking-[0.14em] text-gold">{{ label }}</p>
                <p class="mt-2 break-all text-sm font-black text-white/82">{{ value }}</p>
              </div>
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
          <div>
            <p class="text-sm font-semibold text-white/62">Payments are accepted only through the methods confirmed directly by our team during booking.</p>
            <p class="mt-2 text-sm font-semibold text-white/50">(c) 2026 Snow Feather Adventures. All rights reserved.</p>
          </div>
          <div class="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm shadow-lift backdrop-blur sm:flex sm:items-center sm:gap-4">
            <a href="https://growwithclickmyze.com/" target="_blank" rel="noopener noreferrer" class="font-semibold text-white/62 transition hover:text-gold">
              Designed &amp; Developed by <span class="font-black text-gold">Clickmyze</span>
            </a>
            <span class="my-2 hidden h-5 w-px bg-white/12 sm:block"></span>
            <a href="https://wa.me/919993013936" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center rounded-full border border-gold/30 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-gold transition hover:bg-gold hover:text-night sm:mt-0">
              Want a website like this? Contact Developer
              <span class="sr-only"> at +91 99930 13936</span>
            </a>
          </div>
        </div>
      </div>
    </footer>

    <div class="fixed bottom-5 right-5 z-50 hidden gap-2 md:flex">
      <button type="button" class="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-black text-night shadow-premium" @click="navigateTo('/booking')">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 5.75h14a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-8l-4.5 3v-3H5a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M7.5 10h9M7.5 13.5h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span>{{ currentPage === 'packageDetail' ? 'Reserve' : 'Enquire' }}</span>
      </button>
      <a :href="phoneTel" class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-night shadow-premium">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7.4 3.8 10 8.2 8.2 10c1.1 2.5 3.3 4.7 5.8 5.8l1.8-1.8 4.4 2.6-.9 3.2c-.2.7-.9 1.2-1.7 1.2C9.5 20.5 3.5 14.5 3 6.4c0-.8.5-1.5 1.2-1.7l3.2-.9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
        <span>Call</span>
      </a>
      <a :href="whatsappLink('I want instant Kashmir booking support')" class="cta-whatsapp inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-black text-white shadow-premium">
        <img src="/social/whatsapp.svg" alt="" class="h-6 w-6" />
        <span>WhatsApp</span>
      </a>
    </div>
    <div class="fixed inset-x-3 bottom-3 z-50 grid grid-cols-3 overflow-hidden rounded-lg border border-white/50 bg-night text-center text-xs font-black text-white shadow-premium md:hidden">
      <button type="button" class="flex items-center justify-center gap-1.5 px-3 py-3" @click="navigateTo('/booking')">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 5.75h14a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-8l-4.5 3v-3H5a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
        <span>{{ currentPage === 'packageDetail' ? 'Reserve' : 'Enquire' }}</span>
      </button>
      <a :href="phoneTel" class="flex items-center justify-center gap-1.5 border-x border-white/12 px-3 py-3">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7.4 3.8 10 8.2 8.2 10c1.1 2.5 3.3 4.7 5.8 5.8l1.8-1.8 4.4 2.6-.9 3.2c-.2.7-.9 1.2-1.7 1.2C9.5 20.5 3.5 14.5 3 6.4c0-.8.5-1.5 1.2-1.7l3.2-.9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
        <span>Call</span>
      </a>
      <a :href="whatsappLink('I want instant Kashmir booking support')" class="cta-whatsapp flex items-center justify-center gap-1.5 bg-[#25D366] px-3 py-3">
        <img src="/social/whatsapp.svg" alt="" class="h-5 w-5" />
        <span>WhatsApp</span>
      </a>
    </div>
  </template>
</template>
