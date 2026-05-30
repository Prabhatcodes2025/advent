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

function imageStyle(name) {
  const source = name?.startsWith("data:") || name?.startsWith("http") || name?.startsWith("/") ? name : image(name);
  return { backgroundImage: `url('${source}')` };
}

function loadStoredValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

const navItems = [
  ["Packages", "#packages"],
  ["Destinations", "#destinations"],
  ["Booking", "#booking"],
  ["Contact", "#contact"],
];

const currentPath = ref(window.location.pathname);
const isAdminRoute = computed(() => currentPath.value === "/admin/login");
const isMenuOpen = ref(false);
const activeSection = ref("home");
const activeFilter = ref("all");
const activeAdminTab = ref("packages");
const openFaqs = ref([0]);

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

const defaultGalleryImages = ["image03", "image04", "image05", "image06", "image09", "image10", "image11", "image13", "image15", "image16", "image17", "image18"];
const galleryImages = ref(loadStoredValue("kashmir-gallery-images", defaultGalleryImages));
const heroCarouselImages = ["image17", "image10", "image12", "image13", "image16", "image04"];

const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(90deg, rgba(7, 24, 39, 0.86), rgba(7, 24, 39, 0.48), rgba(7, 24, 39, 0.18)), url('${image("image23")}')`,
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

function sectionFromHref(href) {
  return href.replace("#", "");
}

function updateActiveSection() {
  const sectionIds = ["home", "packages", "destinations", "booking", "contact"];
  const current = sectionIds
    .map((id) => {
      const element = document.getElementById(id);
      return element ? { id, top: Math.abs(element.getBoundingClientRect().top - 120) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.top - b.top)[0];

  if (current) activeSection.value = current.id;
}

function toggleFaq(index) {
  openFaqs.value = openFaqs.value.includes(index) ? openFaqs.value.filter((item) => item !== index) : [...openFaqs.value, index];
}

function choosePayment(method) {
  selectedPaymentMethod.value = method;
  if (method === "UPI") {
    window.location.href = `upi://pay?pa=9729968734@upi&pn=Kashmir%20Alpine%20Co&am=${bookingTotalAmount.value}&cu=INR&tn=Kashmir%20tour%20booking%20advance`;
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
  updateActiveSection();
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("popstate", () => {
    currentPath.value = window.location.pathname;
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateActiveSection);
});
</script>

<template>
  <section v-if="isAdminRoute" class="min-h-screen bg-night text-white">
    <div v-if="!isAdminLoggedIn" class="grid min-h-screen place-items-center px-4 py-10 sm:px-6">
      <div class="w-full max-w-md rounded-lg border border-white/[0.12] bg-white/[0.08] p-6 shadow-premium backdrop-blur sm:p-8">
        <a href="/" class="mb-7 inline-flex rounded-lg border border-white/[0.18] px-4 py-2 text-sm font-black text-white hover:bg-white/[0.12]">View Website</a>
        <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Private manager login</p>
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
          <p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Private manager dashboard</p>
          <h1 class="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Kashmir Alpine Admin</h1>
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
                <div class="admin-cell grid grid-cols-4 p-3 text-sm"><span>KA-260530-001</span><span>Sarah</span><span>Honeymoon</span><span class="text-gold">Pending</span></div>
                <div class="grid grid-cols-4 p-3 text-sm"><span>KA-260530-002</span><span>Rohan</span><span>Gulmarg Ski</span><span class="text-lake">Confirmed</span></div>
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
        <a href="#home" class="flex items-center gap-3" aria-label="Kashmir Alpine Co. home">
          <span class="grid h-10 w-10 place-items-center rounded-lg bg-night text-sm font-black text-white">KA</span>
          <span class="text-base font-black tracking-tight text-night">Kashmir Alpine Co.</span>
        </a>

        <div class="hidden items-center gap-2 text-sm font-bold text-night/[0.78] lg:flex">
          <a
            v-for="[label, href] in navItems"
            :key="label"
            :href="href"
            class="rounded-lg px-4 py-2 transition"
            :class="activeSection === sectionFromHref(href) ? 'bg-night text-white shadow-lift' : 'hover:bg-white/[0.55] hover:text-lake'"
          >
            {{ label }}
          </a>
        </div>

        <div class="hidden items-center gap-2 sm:flex">
          <a href="https://wa.me/919729968734?text=I%20want%20to%20book%20a%20Kashmir%20tour" class="rounded-lg border border-night/10 px-4 py-2 text-sm font-extrabold text-night hover:border-lake hover:text-lake">WhatsApp</a>
          <a href="#booking" class="rounded-lg bg-gold px-4 py-2 text-sm font-extrabold text-night shadow-lift hover:bg-white">Book Now</a>
        </div>

        <button class="grid h-10 w-10 place-items-center rounded-lg border border-night/10 text-night lg:hidden" aria-label="Open menu" @click="isMenuOpen = !isMenuOpen">
          <span class="text-xl leading-none">=</span>
        </button>
      </nav>

      <div v-if="isMenuOpen" class="glass-nav mx-auto mt-2 grid max-w-7xl rounded-lg px-4 py-4 text-sm font-bold text-night">
        <a v-for="[label, href] in navItems" :key="label" :href="href" class="rounded-lg px-3 py-2" :class="activeSection === sectionFromHref(href) ? 'bg-night text-white' : ''" @click="isMenuOpen = false">
          {{ label }}
        </a>
      </div>
    </header>

    <main id="home">
      <section class="hero-media relative min-h-[92vh] overflow-hidden pt-28 text-white" :style="heroStyle">
        <div class="mx-auto grid max-w-6xl gap-8 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[0.92fr_0.86fr] lg:items-center lg:pt-20">
          <div class="max-w-2xl">
            <p class="mb-5 inline-flex rounded-lg border border-white/20 bg-white/[0.12] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] backdrop-blur">{{ siteContent.heroBadge }}</p>
            <h1 class="font-display text-4xl font-extrabold leading-[1.04] sm:text-5xl lg:text-6xl xl:text-7xl">{{ siteContent.heroTitle }}</h1>
            <p class="mt-5 max-w-xl text-base leading-7 text-white/[0.86] sm:text-lg">{{ siteContent.heroSubtitle }}</p>

            <div class="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#booking" class="rounded-lg bg-gold px-6 py-3.5 text-center text-sm font-black text-night shadow-premium hover:bg-white">Book Now</a>
              <a href="#packages" class="rounded-lg border border-white/[0.24] bg-white/[0.12] px-6 py-3.5 text-center text-sm font-black text-white backdrop-blur hover:bg-white/[0.18]">Explore Packages</a>
              <a href="https://wa.me/919729968734?text=I%20want%20instant%20Kashmir%20booking%20support" class="rounded-lg border border-white/[0.24] bg-white px-6 py-3.5 text-center text-sm font-black text-night hover:bg-frost">WhatsApp Now</a>
            </div>
          </div>

          <aside class="premium-card w-full max-w-xl justify-self-center rounded-lg p-4 text-night lg:justify-self-end">
            <div class="grid gap-3 sm:grid-cols-3">
              <div class="glass-tile rounded-lg p-4"><p class="text-2xl font-black">4.9</p><p class="mt-1 text-xs font-bold text-night/60">Guest rating</p></div>
              <div class="glass-tile rounded-lg p-4"><p class="text-2xl font-black">24/7</p><p class="mt-1 text-xs font-bold text-night/60">Support</p></div>
              <div class="glass-tile rounded-lg p-4"><p class="text-2xl font-black">120+</p><p class="mt-1 text-xs font-bold text-night/60">Tour plans</p></div>
            </div>
            <div class="mt-4 overflow-hidden rounded-lg">
              <div class="relative h-64 bg-night/10">
                <div v-for="(sliderImage, index) in heroCarouselImages" :key="`${sliderImage}-${index}`" class="hero-fade-slide image-cover absolute inset-0 h-full w-full" :style="imageStyle(sliderImage)"></div>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between gap-3">
              <div><p class="text-sm font-black text-lake">Featured winter route</p><p class="text-xl font-black">Gulmarg Snow Adventure</p></div>
              <p class="rounded-lg bg-night px-3 py-2 text-sm font-black text-white">From INR 18,500</p>
            </div>
          </aside>
        </div>
      </section>

      <section class="section-band py-16">
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

      <section id="packages" class="bg-white py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Package highlights</p>
              <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Sell every season professionally.</h2>
            </div>
            <div class="flex flex-wrap gap-2" role="group" aria-label="Package filters">
              <button v-for="filter in filters" :key="filter" class="rounded-lg border px-4 py-2 text-sm font-black capitalize" :class="activeFilter === filter ? 'border-night bg-night text-white' : 'border-night/[0.12] text-night'" @click="activeFilter = filter">
                {{ filter }}
              </button>
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="item in filteredPackages" :key="item.name" class="premium-card overflow-hidden rounded-lg">
              <div class="image-cover h-56" :style="{ backgroundImage: `url('${item.image}')` }"></div>
              <div class="p-5">
                <div class="flex items-start justify-between gap-3">
                  <h3 class="text-2xl font-black">{{ item.name }}</h3>
                  <span class="rounded-lg bg-gold px-3 py-1 text-xs font-black text-night">{{ item.tag }}</span>
                </div>
                <p class="mt-4 text-sm leading-6 text-night/[0.62]">{{ item.description }}</p>
                <div class="mt-5 flex items-center justify-between gap-3">
                  <p class="text-2xl font-black text-night">INR {{ item.price.toLocaleString("en-IN") }}</p>
                  <p class="text-sm font-black text-lake">{{ item.duration }} / {{ item.rating }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="destinations" class="section-band py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Destinations</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Kashmir routes your guests ask for.</h2>
          </div>
          <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article v-for="[name, img, text] in destinations" :key="name" class="premium-card overflow-hidden rounded-lg">
              <div class="image-cover h-56" :style="imageStyle(img)"></div>
              <div class="p-5">
                <h3 class="text-2xl font-black">{{ name }}</h3>
                <p class="mt-3 text-sm leading-6 text-night/[0.62]">{{ text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="booking" class="bg-white py-16">
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

      <section id="gallery" class="section-band py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="mb-8 max-w-4xl">
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Media gallery</p>
            <h2 class="mt-2 font-display text-3xl font-extrabold leading-tight text-night sm:text-4xl lg:text-5xl">Instagram, video, snowfall, and drone ready layout.</h2>
          </div>
          <div class="grid gap-4 md:grid-cols-4">
            <div v-for="(galleryImage, index) in galleryImages" :key="`${galleryImage}-${index}`" class="image-cover h-72 rounded-lg" :class="index % 5 === 0 ? 'md:col-span-2' : ''" :style="imageStyle(galleryImage)"></div>
            <div class="dark-panel grid h-72 place-items-center rounded-lg p-6 text-center text-white"><div><p class="text-sm font-black uppercase tracking-[0.2em] text-gold">Video Gallery</p><p class="mt-3 text-3xl font-black">Play reels, drone shots, and customer clips here.</p></div></div>
          </div>
        </div>
      </section>

      <section class="bg-white py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">FAQ</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Clear answers before booking.</h2>
            <div class="mt-6 grid gap-3">
              <div v-for="([question, answer], index) in faqs" :key="question" class="premium-card rounded-lg p-5">
                <button class="flex w-full items-center justify-between gap-4 text-left text-lg font-black" @click="toggleFaq(index)">{{ question }}<span>+</span></button>
                <p v-if="openFaqs.includes(index)" class="mt-3 text-sm leading-6 text-night/[0.64]">{{ answer }}</p>
              </div>
            </div>
          </div>
          <div class="premium-card overflow-hidden rounded-lg">
            <iframe title="Kashmir map" class="h-[32rem] w-full" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Srinagar%20Kashmir&output=embed"></iframe>
          </div>
        </div>
      </section>

      <section id="contact" class="section-band py-16">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] text-lake">Contact</p>
            <h2 class="mt-2 font-display text-4xl font-extrabold text-night sm:text-5xl">Instant inquiry, emergency support, and WhatsApp booking.</h2>
            <div class="mt-6 grid gap-3 text-sm font-bold text-night/[0.68]">
              <p class="rounded-lg bg-white p-4">Phone: +91 919729968734</p>
              <p class="rounded-lg bg-white p-4">Email: snowfeatheradventures@gmail.com</p>
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
              <a href="https://wa.me/919729968734?text=I%20want%20to%20book%20a%20Kashmir%20tour" class="rounded-lg border border-night/[0.12] px-5 py-3 text-center text-sm font-black text-night hover:border-lake hover:text-lake">WhatsApp Live Chat</a>
            </div>
          </form>
        </div>
      </section>
    </main>

    <a
      href="https://wa.me/919729968734?text=I%20want%20instant%20Kashmir%20booking%20support"
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
