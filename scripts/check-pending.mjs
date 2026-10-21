// Bloquea el despliegue a producción si queda algún dato sin verificar o texto de borrador en lo
// que se publica (dist/) o en los datos que alimentan la web (src/data/).
// Uso: node scripts/check-pending.mjs   (lo ejecuta pnpm deploy antes de wrangler deploy)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const PATTERNS = [/\[PENDIENTE/g, /Texto base pendiente/gi, /\bborrador\b/gi, /\bTODO\b/g, /lorem ipsum/gi];
const ROOTS = ["dist", "src/data"];
const EXT = /\.(html|xml|txt|json|ts|js|md)$/;

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : EXT.test(p) ? [p] : [];
});

const hits = new Map();
for (const file of ROOTS.flatMap(walk)) {
  const text = readFileSync(file, "utf8").replace(/<script[\s\S]*?<\/script>/g, (s) => (file.endsWith(".html") ? s.replace(/[^\n]/g, "") : s));
  for (const re of PATTERNS) {
    for (const m of text.matchAll(re)) {
      const snippet = text.slice(m.index, m.index + 110).replace(/\s+/g, " ").split("]")[0] + "]";
      const key = snippet.slice(0, 110);
      if (!hits.has(key)) hits.set(key, new Set());
      hits.get(key).add(file);
    }
  }
}

if (!hits.size) {
  console.log("✓ Sin [PENDIENTE] ni textos de borrador. Se puede publicar.");
  process.exit(0);
}
console.error(`✗ ${hits.size} pendientes distintos. No se publica en producción hasta resolverlos:\n`);
for (const [k, files] of hits) console.error(`· ${k}\n    en ${[...files].slice(0, 3).join(", ")}${files.size > 3 ? ` y ${files.size - 3} más` : ""}`);
process.exit(1);
