// Tarifas y fórmulas de las calculadoras y del presupuesto automático.
//
// Todos los importes son precios finales para el cliente, IVA incluido, calibrados con
// referencias públicas de mercado de 2026 para Toledo y el sur de Madrid (ver README).
// Revisad estas cifras con vuestros costes reales: son las que la web muestra como "desde".

export const PRICING = {
  // Margen del rango sobre el precio calculado: "desde" = base × low, "hasta" = base × high.
  spread: { low: 0.92, high: 1.12 },

  aero: {
    // Bomba de calor aire-agua con depósito de ACS, hidráulica, legalización y puesta en marcha.
    equipmentBase: 4800,
    equipmentPerKw: 520,
    sizesKw: [6, 8, 10, 12, 14, 16],
    // Potencia orientativa por m² según zona climática (chalet con aislamiento medio).
    wPerM2: { D3: 50, C4: 45 },
    emitters: {
      keep: { label: "Adaptación de los radiadores actuales", perM2: 0, fixed: 600 },
      radiators: { label: "Radiadores nuevos de baja temperatura", perRoom: 420, m2PerRoom: 18 },
      floor: { label: "Suelo radiante (sin pavimento final)", perM2: 48 },
    },
    removal: { gasoleo: 650, propano: 650, gas: 350, elec: 0 },
    // Precio de la energía para estimar el ahorro (€/kWh útil de cada combustible).
    energyPrice: { gasoleo: 1.15 / 10 / 0.85, propano: 0.15, gas: 0.085, elec: 0.17 },
    scop: { D3: 3.6, C4: 3.9 },
    electricity: 0.17,
    // Deducción IRPF del 40 %: base máxima 7.500 € (deducción máxima 3.000 €).
    irpf: { rate: 0.4, maxBase: 7500 },
  },

  solar: {
    fixed: 1300,
    perKwp: 980,
    panelKwp: 0.5,
    batteries: { 0: 0, 5: 3500, 10: 6200 },
    wallbox: 1100,
    yieldPerKwp: { D3: 1550, C4: 1620 },
    surplusPrice: 0.06,
    electricity: 0.17,
  },

  // Reformas e interiorismo: [mín, máx] por nivel (0 Estándar alto, 1 Alta, 2 Lujo).
  reforma: {
    types: {
      int: { label: "Reforma integral", unit: "m2", p: [[620, 780], [820, 1080], [1150, 1600]] },
      kit: { label: "Reforma de cocina", unit: "n", p: [[9000, 14000], [15000, 26000], [28000, 50000]], m2eq: 18 },
      bath: { label: "Reforma de baño", unit: "n", p: [[5500, 8500], [9000, 15000], [16000, 30000]], m2eq: 8 },
      design: { label: "Proyecto de interiorismo", unit: "m2", p: [[22, 35], [35, 55], [55, 90]] },
    },
    domotics: 0.05, // sobre el coste de obra
    project: 0.07, // proyecto 3D, licencia y dirección de obra, sobre el coste de obra
    payments: "30 % · 40 % · 30 %",
  },

  // Obra nueva llave en mano, €/m² construido, sin terreno.
  obra: {
    perM2: [[1350, 1600], [1650, 2000], [2100, 2800]],
    soft: 0.09, // proyecto, dirección facultativa, licencia e ICIO, sobre construcción
    pool: [18000, 32000],
    solarKwp: 5,
  },

  levels: ["Estándar alto", "Alta", "Lujo"],
};

const P = PRICING;
const down = (n) => Math.floor(n / 100) * 100;
const up = (n) => Math.ceil(n / 100) * 100;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function range(base) {
  return [down(base * P.spread.low), up(base * P.spread.high)];
}

function total(lines) {
  const lo = lines.reduce((s, l) => s + l.lo, 0);
  const hi = lines.reduce((s, l) => s + l.hi, 0);
  return { lo: down(lo), hi: up(hi) };
}

/** Potencia de bomba de calor recomendada (kW) para una superficie y zona. */
export function heatPumpKw(m2, zone = "D3") {
  const need = (m2 * P.aero.wPerM2[zone]) / 1000;
  return P.aero.sizesKw.find((s) => s >= need) ?? P.aero.sizesKw.at(-1);
}

/** Líneas de una instalación de aerotermia (sin ahorro ni ayudas). */
export function aeroLines({ m2, zone = "D3", emitter = "keep", fuel = "gas" }) {
  const a = P.aero;
  const kw = heatPumpKw(m2, zone);
  const lines = [];
  const [elo, ehi] = range(a.equipmentBase + a.equipmentPerKw * kw);
  lines.push({ label: `Bomba de calor ${kw} kW con depósito de ACS, instalación y legalización`, lo: elo, hi: ehi });
  const e = a.emitters[emitter];
  let em = 0;
  if (emitter === "radiators") em = Math.max(3, Math.round(m2 / e.m2PerRoom)) * e.perRoom;
  else em = (e.perM2 || 0) * m2 + (e.fixed || 0);
  if (em) {
    const [lo, hi] = range(em);
    lines.push({ label: e.label, lo, hi });
  }
  const rem = a.removal[fuel] || 0;
  if (rem) lines.push({ label: "Desmontaje de la caldera y retirada del depósito", lo: rem, hi: rem });
  return { kw, lines };
}

export function quoteAero({ fuel, spend, m2, zone, emitter, irpf }) {
  const a = P.aero;
  const { kw, lines } = aeroLines({ m2, zone, emitter, fuel });
  const t = total(lines);
  const newCost = (spend / a.energyPrice[fuel]) * a.electricity / a.scop[zone];
  const save = Math.max(0, spend - newCost);
  const deduction = irpf ? a.irpf.rate * Math.min(t.lo, a.irpf.maxBase) : 0;
  const payback = save > 0 ? (t.lo - deduction) / save : Infinity;
  return {
    kind: "aero",
    title: "Aerotermia",
    lines,
    ...t,
    kw,
    save,
    newCost,
    deduction,
    payback,
    net15: save * 15 - (t.lo - deduction),
    summary: `Aerotermia ${kw} kW para ${m2} m², desde ${t.lo} € (IVA incl.)`,
  };
}

export function quoteSolar({ bill, zone, orient, battery, aero, ev }) {
  const s = P.solar;
  const cons = (bill * 12 * 0.8) / s.electricity + (aero ? 4000 : 0) + (ev ? 2500 : 0);
  const annual = bill * 12 + (aero ? 4000 * s.electricity : 0) + (ev ? 2500 * s.electricity : 0);
  const yieldK = s.yieldPerKwp[zone] * orient;
  const panels = Math.round(clamp((cons * 0.75) / yieldK, 2, 15) / s.panelKwp);
  const kwp = panels * s.panelKwp;
  const prod = kwp * yieldK;
  const selfR = battery ? (battery >= 10 ? 0.75 : 0.62) : 0.42;
  const self = Math.min(prod * selfR, cons * 0.85);
  const save = self * s.electricity + (prod - self) * s.surplusPrice;
  const after = Math.max(annual - save, annual * 0.12);
  const lines = [];
  const [plo, phi] = range(s.fixed + s.perKwp * kwp);
  lines.push({ label: `${panels} paneles (${kwp.toLocaleString("es-ES")} kWp), inversor, estructura y legalización`, lo: plo, hi: phi });
  if (battery) {
    const [lo, hi] = range(s.batteries[battery]);
    lines.push({ label: `Batería de ${battery} kWh`, lo, hi });
  }
  if (ev) {
    const [lo, hi] = range(s.wallbox);
    lines.push({ label: "Cargador de vehículo eléctrico", lo, hi });
  }
  const t = total(lines);
  return {
    kind: "solar",
    title: "Placas solares",
    lines,
    ...t,
    kwp,
    panels,
    prod,
    selfPct: self / cons,
    save,
    annual,
    after,
    payback: t.lo / save,
    summary: `${kwp.toLocaleString("es-ES")} kWp${battery ? ` + batería ${battery} kWh` : ""}, desde ${t.lo} € (IVA incl.)`,
  };
}

export function quoteReforma({ type, level, m2, units, floor, domotics, project }) {
  const r = P.reforma;
  const cfg = r.types[type];
  const qty = cfg.unit === "m2" ? m2 : units;
  const [plo, phi] = cfg.p[level];
  const lines = [{ label: `${cfg.label} · ${P.levels[level]}${cfg.unit === "m2" ? ` · ${m2} m²` : ` · ${units} ud.`}`, lo: plo * qty, hi: phi * qty }];
  const works = { lo: plo * qty, hi: phi * qty };
  if (domotics && type !== "design")
    lines.push({ label: "Domótica e iluminación escénica", lo: works.lo * r.domotics, hi: works.hi * r.domotics });
  if (project && type !== "design")
    lines.push({ label: "Proyecto 3D, licencia y dirección de obra", lo: works.lo * r.project, hi: works.hi * r.project });
  if (floor && type === "int") lines.push(...aeroLines({ m2, emitter: "floor", fuel: "gas" }).lines.filter((l) => !/Desmontaje/.test(l.label)));
  const t = total(lines.map((l) => ({ ...l, lo: down(l.lo), hi: up(l.hi) })));
  const area = cfg.unit === "m2" ? m2 : cfg.m2eq * units;
  let weeks;
  if (type === "int") weeks = [Math.round(10 + m2 / 25), Math.round(14 + m2 / 18)];
  else if (type === "kit") weeks = [3 + units, 5 + units * 2];
  else if (type === "bath") weeks = [2 + units, 3 + units * 2];
  else weeks = [3, 6];
  return {
    kind: "ref",
    title: cfg.label,
    lines: lines.map((l) => ({ ...l, lo: down(l.lo), hi: up(l.hi) })),
    ...t,
    perM2: [t.lo / area, t.hi / area],
    weeks,
    payments: r.payments,
    summary: `${cfg.label} (${P.levels[level].toLowerCase()}), desde ${t.lo} € (IVA incl.)`,
  };
}

export function quoteObra({ m2, level, energy, soft, pool }) {
  const o = P.obra;
  const [plo, phi] = o.perM2[level];
  const lines = [{ label: `Construcción llave en mano · ${P.levels[level]} · ${m2} m²`, lo: plo * m2, hi: phi * m2 }];
  if (energy) {
    lines.push(...aeroLines({ m2, emitter: "floor", fuel: "elec" }).lines);
    const [lo, hi] = range(P.solar.fixed + P.solar.perKwp * o.solarKwp);
    lines.push({ label: `Placas solares ${o.solarKwp} kWp`, lo, hi });
  }
  if (soft) lines.push({ label: "Proyecto, dirección facultativa, licencia e ICIO", lo: plo * m2 * o.soft, hi: phi * m2 * o.soft });
  if (pool) lines.push({ label: "Piscina", lo: o.pool[0], hi: o.pool[1] });
  const rounded = lines.map((l) => ({ ...l, lo: down(l.lo), hi: up(l.hi) }));
  const t = total(rounded);
  return {
    kind: "obra",
    title: "Obra nueva",
    lines: rounded,
    ...t,
    perM2: [t.lo / m2, t.hi / m2],
    months: [Math.round(8 + m2 / 60), Math.round(12 + m2 / 45)],
    summary: `Obra nueva de ${m2} m² (${P.levels[level].toLowerCase()}), desde ${t.lo} € (IVA incl.)`,
  };
}
