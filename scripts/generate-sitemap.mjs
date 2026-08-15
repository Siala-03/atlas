import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SITE_URL = "https://www.atlasdrinks.africa";

const productsSrc = readFileSync(join(root, "src/data/products.ts"), "utf8");
const productIds = [...productsSrc.matchAll(/id:\s*"(p-[^"]+)"/g)].map((m) => m[1]);

const CATEGORIES = [
"Whisky", "Vodka", "Wine", "Beer", "Gin", "Rum",
"Cognac", "Liqueur", "Tequila", "Aperitif", "Bitters", "RTD", "Mixer"];


const today = new Date().toISOString().slice(0, 10);

const staticUrls = [
{ loc: "/", priority: "1.0", changefreq: "daily" },
{ loc: "/shop", priority: "0.9", changefreq: "daily" },
{ loc: "/about", priority: "0.5", changefreq: "monthly" },
{ loc: "/contact", priority: "0.5", changefreq: "monthly" },
{ loc: "/faq", priority: "0.4", changefreq: "monthly" }];


const categoryUrls = CATEGORIES.map((c) => ({
  loc: `/shop?category=${encodeURIComponent(c)}`,
  priority: "0.7",
  changefreq: "daily"
}));

const productUrls = productIds.map((id) => ({
  loc: `/product/${id}`,
  priority: "0.6",
  changefreq: "weekly"
}));

const all = [...staticUrls, ...categoryUrls, ...productUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.
map(
  (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
).
join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`Generated sitemap.xml with ${all.length} URLs (${productUrls.length} products).`);
