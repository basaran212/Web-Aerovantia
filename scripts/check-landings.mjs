// Comprueba que dos landings de municipio cualesquiera comparten menos del 30 % del texto propio
// (contenido principal y preguntas; sin cabecera, pie, calculadora ni franja de contacto).
import { readdirSync, readFileSync, existsSync } from "node:fs";

const files = ["madrid", "toledo"].flatMap((p) => readdirSync(`dist/zona/${p}`).filter((d) => existsSync(`dist/zona/${p}/${d}/index.html`)).map((d) => `dist/zona/${p}/${d}/index.html`));
const text = (f) => {
  let h = readFileSync(f, "utf8");
  h = h.replace(/<header[\s\S]*?<\/header>|<nav id="mnav"[\s\S]*?<\/nav>|<footer[\s\S]*?<\/footer>|<script[\s\S]*?<\/script>|<section id="calculadoras"[\s\S]*?<\/dialog>|<section class="cta-band"[\s\S]*?<\/section>|<div class="mbar"[\s\S]*?<\/div>/g, " ");
  const main = (h.match(/<main>([\s\S]*)<\/main>/) || [, h])[1];
  return main.replace(/<[^>]+>/g, " ").replace(/\[PENDIENTE[^\]]*\]/g, " ").toLowerCase().split(/[^a-záéíóúñü0-9]+/).filter(Boolean);
};
const shingles = (w, n = 5) => new Set(w.slice(0, -n + 1).map((_, i) => w.slice(i, i + n).join(" ")));
const sets = files.map((f) => [f.split("/").slice(2, 4).join("/"), shingles(text(f))]);
let worst = 0, pair = "";
for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) {
  const [a, A] = sets[i], [b, B] = sets[j];
  let inter = 0; for (const s of A) if (B.has(s)) inter++;
  const share = inter / Math.min(A.size, B.size);
  if (share > worst) { worst = share; pair = `${a} ↔ ${b}`; }
}
console.log(`${sets.length} landings · máximo texto compartido: ${(worst * 100).toFixed(1)} % (${pair}) · límite 30 %`);
process.exit(worst < 0.3 ? 0 : 1);
