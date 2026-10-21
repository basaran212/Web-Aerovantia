// Auditoría SEO del build: titles, metas, H1, alt, canonical, schema y enlaces internos rotos.
// Uso: node scripts/audit-seo.mjs  (después de astro build)
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : []; });
const pages = walk("dist").filter((p) => !p.includes("404"));
const REDIRECTS = ["/reformas-de-lujo/"];
const issues = [];
const titles = new Map(), metas = new Map();
const pick = (html, re) => (html.match(re) || [])[1];
const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');

for (const file of pages) {
  const url = "/" + file.replace(/^dist\//, "").replace(/index\.html$/, "");
  const html = readFileSync(file, "utf8");
  const title = decode(pick(html, /<title>([^<]*)<\/title>/));
  const desc = decode(pick(html, /<meta name="description" content="([^"]*)"/));
  if (!title) issues.push([url, "sin title"]);
  else if (title.length > 60) issues.push([url, `title de ${title.length} caracteres: ${title}`]);
  if (!desc) issues.push([url, "sin meta description"]);
  else if (desc.length > 160) issues.push([url, `meta de ${desc.length} caracteres`]);
  titles.set(title, [...(titles.get(title) || []), url]);
  metas.set(desc, [...(metas.get(desc) || []), url]);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) issues.push([url, `${h1} H1`]);
  for (const img of html.match(/<img [^>]*>/g) || []) if (!/ alt="[^"]+"/.test(img)) issues.push([url, `img sin alt: ${img.slice(0, 80)}`]);
  if (!/<link rel="canonical" href="https:\/\/aerovantia\.es\//.test(html)) issues.push([url, "canonical no apunta a aerovantia.es"]);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      const s = JSON.stringify(j);
      if (/"(Review|AggregateRating)"/.test(s)) issues.push([url, "schema con Review/AggregateRating"]);
      if (/"@type":"Offer"/.test(s)) issues.push([url, "schema Offer con precio"]);
    } catch (e) { issues.push([url, "JSON-LD inválido"]); }
  }
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = m[1];
    if (/\.(png|svg|xml|jpg|webp|avif|css|js|mp4|webm)$/.test(href) || href.startsWith("/_astro/")) continue;
    if (REDIRECTS.includes(href)) { issues.push([url, `enlace a URL redirigida ${href}`]); continue; }
    const target = join("dist", href, href.endsWith("/") ? "index.html" : "");
    if (!existsSync(target)) issues.push([url, `enlace roto ${href}`]);
  }
}
for (const [t, urls] of titles) if (urls.length > 1) issues.push([urls.join(", "), `title duplicado: ${t}`]);
for (const [d, urls] of metas) if (urls.length > 1) issues.push([urls.join(", "), `meta duplicada`]);

console.log(`${pages.length} páginas auditadas, ${issues.length} incidencias`);
for (const [u, m] of issues) console.log(`· ${u}: ${m}`);
process.exit(issues.length ? 1 : 0);
