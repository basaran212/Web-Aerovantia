// Genera las imágenes para redes (public/og/*.png, 1200×630) con la tipografía y la paleta de la web.
// Uso: node scripts/og-images.cjs   (requiere Playwright; las imágenes son recreaciones con IA y lo indican)
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const font = (pkg, file) => "data:font/woff2;base64," + fs.readFileSync(path.join(root, "node_modules/@fontsource-variable", pkg, "files", file)).toString("base64");
const img = (f) => "data:image/jpeg;base64," + fs.readFileSync(path.join(root, "src/assets/img", f)).toString("base64");
const pages = [
  ["home", "Aerotermia y placas solares", "en Madrid y Toledo", "exterior-noon.jpg"],
  ["aerotermia", "Aerotermia", "Madrid y Toledo", "heatpump.jpg"],
  ["placas-solares", "Placas solares", "Madrid y Toledo", "solar-roof.jpg"],
  ["aerotermia-y-placas-solares", "Aerotermia + Solar", "calculadas juntas", "exterior-dusk.jpg"],
  ["cargador-coche-electrico", "Cargador de coche eléctrico", "para tu casa", "exterior-night.jpg"],
  ["reformas", "Reformas con energía", "aerotermia y suelo radiante", "kitchen.jpg"],
  ["interiorismo", "Interiorismo", "proyecto 3D", "living.jpg"],
  ["ayudas", "Ayudas y deducción del 40 %", "requisitos explicados", "exterior-noon.jpg"],
  ["calculadoras", "Calculadoras", "precios orientativos en rango", "solar-roof.jpg"],
];
const html = (title, sub, photo) => `<!doctype html><html><head><style>
@font-face{font-family:M;src:url(${font("manrope", "manrope-latin-wght-normal.woff2")})}
@font-face{font-family:G;src:url(${font("geist-mono", "geist-mono-latin-wght-normal.woff2")})}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#131209;color:#F2EDE4;font-family:M;display:grid;grid-template-columns:1fr 520px;overflow:hidden}
.t{padding:64px;display:flex;flex-direction:column;justify-content:space-between}
.logo{font-weight:700;letter-spacing:.14em;font-size:22px}.logo span{color:#C9A45C}
h1{font-size:64px;line-height:1.02;font-weight:700;letter-spacing:-.02em;background:linear-gradient(90deg,#fff,#9B9B9B);-webkit-background-clip:text;color:transparent}
p{font-family:G;font-size:22px;letter-spacing:.12em;text-transform:uppercase;color:#C9A45C;margin-top:20px}
.f{font-family:G;font-size:16px;color:#A39E94}
.ph{background:url(${photo}) center/cover;position:relative}.ph:before{content:"";position:absolute;inset:0;background:linear-gradient(to right,#131209,transparent 40%)}
.ph span{position:absolute;right:16px;bottom:16px;font-family:G;font-size:14px;padding:4px 10px;border-radius:999px;background:rgba(19,18,9,.7);color:rgba(242,237,228,.85)}
</style></head><body><div class="t"><div class="logo">AEROVANTIA<span>.</span></div><div><h1>${title}</h1><p>${sub}</p></div><div class="f">aerovantia.es · Estudio gratuito</div></div><div class="ph"><span>Imagen ilustrativa generada con IA</span></div></body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  fs.mkdirSync(path.join(root, "public/og"), { recursive: true });
  for (const [slug, title, sub, photo] of pages) {
    await p.setContent(html(title, sub, img(photo)), { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(root, "public/og", slug + ".png") });
    console.log("og/" + slug + ".png");
  }
  await b.close();
})();
