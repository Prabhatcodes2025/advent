import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://www.snowfeatheradventure.com";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const appVuePath = path.join(projectRoot, "src", "App.vue");
const publicDir = path.join(projectRoot, "public");

const staticRoutes = [
  { path: "/", priority: "1.00", changefreq: "weekly" },
  { path: "/about", priority: "0.85", changefreq: "monthly" },
  { path: "/packages", priority: "0.95", changefreq: "weekly" },
  { path: "/destinations", priority: "0.85", changefreq: "monthly" },
  { path: "/gallery", priority: "0.75", changefreq: "monthly" },
  { path: "/contact", priority: "0.85", changefreq: "monthly" },
  { path: "/testimonials", priority: "0.70", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.35", changefreq: "yearly" },
  { path: "/terms-of-service", priority: "0.35", changefreq: "yearly" },
];

function slugifyPackageName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function uniqueRoutes(routes) {
  const seen = new Set();
  return routes.filter((route) => {
    if (seen.has(route.path)) return false;
    seen.add(route.path);
    return true;
  });
}

async function packageSlugsFromSource() {
  const source = await readFile(appVuePath, "utf8");
  const packageBlock = source.match(/const defaultPackages = \[([\s\S]*?)\n\];/);
  if (!packageBlock) return [];
  return [...packageBlock[1].matchAll(/name:\s*"([^"]+)"/g)]
    .map((match) => slugifyPackageName(match[1]))
    .filter(Boolean);
}

async function packageSlugsFromSupabase() {
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return [];

  try {
    const endpoint = new URL(`${url}/rest/v1/packages`);
    endpoint.searchParams.set("select", "slug");
    endpoint.searchParams.set("is_active", "eq.true");
    endpoint.searchParams.set("order", "sort_order.asc,created_at.desc");
    const response = await fetch(endpoint, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    if (!response.ok) return [];
    const rows = await response.json();
    return rows.map((row) => row.slug).filter(Boolean);
  } catch {
    return [];
  }
}

function sitemapXml(routes) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = routes
    .map((route) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${route.path === "/" ? "" : route.path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

async function main() {
  const supabaseSlugs = await packageSlugsFromSupabase();
  const sourceSlugs = await packageSlugsFromSource();
  const packageSlugs = supabaseSlugs.length ? supabaseSlugs : sourceSlugs;
  const packageRoutes = packageSlugs.map((slug) => ({
    path: `/packages/${slug}`,
    priority: "0.90",
    changefreq: "weekly",
  }));
  const routes = uniqueRoutes([...staticRoutes, ...packageRoutes]);

  await writeFile(path.join(publicDir, "sitemap.xml"), sitemapXml(routes), "utf8");
  await writeFile(
    path.join(publicDir, "robots.txt"),
    `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
    "utf8",
  );

  console.log(`Generated sitemap.xml with ${routes.length} URLs and robots.txt.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
