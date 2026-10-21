// Informe de posicionamiento de precio: compara la calculadora con el benchmark interno.
// Uso: pnpm report:precios  →  docs/seo/informe-precios.md y data/benchmark/casos-prueba.csv
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

import { quoteAero, quoteCharger, quoteReforma, quoteSolar } from "../src/scripts/pricing.js";
import { AERO_CASES, SOLAR_CASES } from "../tests/cases.mjs";

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

const quantile = (xs, q) => {
  const s = [...xs].sort((a, b) => a - b);
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
};
const eur = (n) => Math.round(n).toLocaleString("es-ES", { useGrouping: "always" }) + " €";

const bench = parseCsv(readFileSync("data/benchmark/competencia.csv", "utf8"));
const byId = Object.fromEntries(bench.map((b) => [b.id, b]));

// Configuraciones tipo comparables con referencias concretas del benchmark.
const configs = [
  { name: "Aerotermia 11 kW, 150–200 m², aprovechando radiadores (gasóleo)", refs: ["B01", "B02", "B04", "B06"], q: () => quoteAero({ fuel: "gasoleo", spend: 2400, m2: 180, zone: "madrid", emitter: "keep", irpf: false }) },
  { name: "Aerotermia con radiadores nuevos de baja temperatura, 150 m²", refs: ["B03", "B08"], q: () => quoteAero({ fuel: "gasoleo", spend: 2400, m2: 150, zone: "madrid", emitter: "radiators", irpf: false }) },
  { name: "Aerotermia con suelo radiante nuevo, 180 m²", refs: ["B05"], q: () => quoteAero({ fuel: "gasoleo", spend: 2900, m2: 180, zone: "madrid", emitter: "floor", irpf: false }) },
  { name: "Aerotermia piso 80 m² (6 kW)", refs: ["B07"], q: () => quoteAero({ fuel: "gas", spend: 1200, m2: 80, zone: "madrid", emitter: "keep", irpf: false }) },
  { name: "Fotovoltaica 5 kWp sin batería (teja sur)", refs: ["B09", "B11", "B12", "B16"], q: () => quoteSolar({ bill: 175, zone: "madrid", orient: "S", tilt: 30, area: 60, battery: 0 }) },
  { name: "Fotovoltaica 4 kWp sin batería", refs: ["B14", "B11"], q: () => quoteSolar({ bill: 140, zone: "madrid", orient: "S", tilt: 30, area: 60, battery: 0 }) },
  { name: "Fotovoltaica 6 kWp sin batería", refs: ["B13"], q: () => quoteSolar({ bill: 210, zone: "toledo", orient: "S", tilt: 30, area: 60, battery: 0 }) },
  { name: "Fotovoltaica ≈ 5–6 kWp con batería de 5 kWh", refs: ["B10", "B15"], q: () => quoteSolar({ bill: 190, zone: "madrid", orient: "S", tilt: 30, area: 60, battery: 5 }) },
  { name: "Cargador 7,4 kW, instalación sencilla (8 m)", refs: ["B19"], q: () => quoteCharger({ power: "7.4", meters: 8 }) },
  { name: "Reforma integral 100 m², estándar alto (€/m²)", refs: ["B22", "B24"], perM2: true, q: () => quoteReforma({ type: "int", level: 0, m2: 100, units: 1 }) },
  { name: "Reforma integral 100 m², alta (€/m²)", refs: ["B23", "B24"], perM2: true, q: () => quoteReforma({ type: "int", level: 1, m2: 100, units: 1 }) },
];

const rows = configs.map((c) => {
  const refs = c.refs.map((id) => byId[id]).filter(Boolean);
  const values = refs.flatMap((r) => [Number(r.precio_min_con_iva), Number(r.precio_max_con_iva)]).filter((v) => v > 0);
  const q = c.q();
  const lo = c.perM2 ? q.perM2[0] : q.lo;
  const hi = c.perM2 ? q.perM2[1] : q.hi;
  const mid = (lo + hi) / 2;
  const p25 = quantile(values, 0.25), med = quantile(values, 0.5), p75 = quantile(values, 0.75);
  const verified = refs.filter((r) => /precio público|presupuesto real/.test(r.fiabilidad)).length;
  let alerta = "Dentro de P25–P75";
  if (mid > p75) alerta = "⚠ Por encima del P75: revisar costes, margen o justificar el valor añadido";
  else if (mid < p25) alerta = "⚠ Por debajo del P25: posible margen insuficiente o costes mal calculados";
  return { ...c, lo, hi, mid, p25, med, p75, n: refs.length, verified, alerta };
});

const casos = [
  ...AERO_CASES.map((c) => ({ c, q: quoteAero(c.input) })),
  ...SOLAR_CASES.map((c) => ({ c, q: quoteSolar(c.input) })),
];
writeFileSync(
  "data/benchmark/casos-prueba.csv",
  ["id,descripcion,calculadora_desde,calculadora_hasta,presupuesto_tecnico,desviacion_punto_medio,ok_±10%"]
    .concat(casos.map(({ c, q }) => `${c.id},"${c.desc}",${q.lo},${q.hi},[PENDIENTE],,`))
    .join("\n") + "\n",
);

const fmt = (r) => (r.perM2 ? (n) => `${Math.round(n)} €/m²` : eur);
const md = `# Informe de posicionamiento de precio

Generado por \`pnpm report:precios\` el ${new Date().toISOString().slice(0, 10)}. Interno: no se publica.

**Aviso:** todas las referencias del benchmark son, por ahora, *estimaciones* leídas a través de un buscador
(sin verificar en la página ni presupuestos reales). Los percentiles son orientativos y **no sirven todavía
para decidir el posicionamiento**. Posicionamiento elegido: [PENDIENTE].

| Configuración tipo | Calculadora | Punto medio | P25 | Mediana | P75 | Ref. (verificadas) | Alerta |
|---|---|---|---|---|---|---|---|
${rows.map((r) => { const f = fmt(r); return `| ${r.name} | ${f(r.lo)} – ${f(r.hi)} | ${f(r.mid)} | ${f(r.p25)} | ${f(r.med)} | ${f(r.p75)} | ${r.n} (${r.verified}) | ${r.alerta} |`; }).join("\n")}

## Casos de prueba (20)

El presupuesto del técnico con costes reales está [PENDIENTE] (necesita \`costes.csv\`). Criterio: desviación
≤ ±10 % en el punto medio.

| Caso | Vivienda | Calculadora | Ahorro/año | Retorno | ¿Compensa? |
|---|---|---|---|---|---|
${casos.map(({ c, q }) => `| ${c.id} | ${c.desc} | ${eur(q.lo)} – ${eur(q.hi)} | ${eur(q.save[0])} – ${eur(q.save[1])} | ${q.payback.map((v) => (v > 30 ? "> 30" : v.toFixed(1).replace(".", ","))).join(" – ")} años | ${q.notWorth ? "Aviso de que no compensa" : "Sí"} |`).join("\n")}
`;
mkdirSync("docs/seo", { recursive: true });
writeFileSync("docs/seo/informe-precios.md", md);
console.log(rows.map((r) => `${r.alerta.startsWith("⚠") ? "⚠" : "✓"} ${r.name}: ${Math.round(r.mid)} (P25 ${Math.round(r.p25)} · P75 ${Math.round(r.p75)})`).join("\n"));
