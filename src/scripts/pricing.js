// Tarifas y fórmulas de las calculadoras y del presupuesto automático.
//
// Todos los importes son precios finales para el cliente, IVA incluido, calibrados con
// referencias públicas de mercado de 2026 para Toledo y Madrid (ver README).
// Revisad estas cifras con vuestros costes reales: son las que la web muestra como "desde".

export const PRICING = {
  // Margen del rango sobre el precio calculado: "desde" = base × low, "hasta" = base × high.
  spread: { low: 0.92, high: 1.12 },

  aero: {
    // Bomba de calor aire-agua con depósito de ACS, hidráulica, legalización y puesta en marcha.
    equipmentBase: 4800,
    equipmentPerKw: 520,
    sizesKw: [6, 8, 10, 12, 14, 16],
    // Potencia orientativa por m² según zona climática y aislamiento de la vivienda.
    wPerM2: {
      D3: { good: 40, mid: 50, poor: 65 },
      C4: { good: 35, mid: 45, poor: 60 },
    },
    emitters: {
      keep: { label: "Adaptación de los radiadores actuales", perM2: 0, fixed: 600 },
      radiators: { label: "Radiadores nuevos de baja temperatura", perRoom: 420, m2PerRoom: 18 },
      floor: { label: "Suelo radiante (sin pavimento final)", perM2: 48 },
    },
    removal: { gasoleo: 650, propano: 650, gas: 350, elec: 0 },
    // Precio de la energía para estimar el ahorro (€/kWh útil de cada combustible).
    energyPrice: { gasoleo: 1.15 / 10 / 0.85, propano: 0.15, gas: 0.085, elec: 0.19 },
    // Rendimiento estacional según el emisor: cuanto más baja la temperatura de impulsión, mejor.
    // Radiadores convencionales 50–55 °C, radiadores de baja temperatura ~45 °C, suelo radiante ~35 °C.
    scop: {
      D3: { keep: 2.9, radiators: 3.5, floor: 4.3 },
      C4: { keep: 3.1, radiators: 3.7, floor: 4.5 },
    },
    electricity: 0.19,
    // Deducción IRPF del 40 %: base máxima 7.500 € (deducción máxima 3.000 €).
    irpf: { rate: 0.4, maxBase: 7500 },
  },

  solar: {
    fixed: 1300,
    perKwp: 980,
    panelKwp: 0.5,
    batteries: { 0: 0, 5: 3500, 10: 6200 },
    wallbox: 1100,
    // kWh al año por kWp con orientación sur e inclinación óptima (PVGIS, 14 % de pérdidas).
    yieldPerKwp: { D3: 1580, C4: 1640 },
    // Producción relativa al óptimo según orientación e inclinación (PVGIS, latitud 40°).
    // Inclinación: 15° tejado suave, 30° tejado habitual, 45° tejado muy inclinado.
    orientation: {
      S: { label: "Sur", f: { 15: 0.95, 30: 1, 45: 0.98 } },
      SE: { label: "Sureste", f: { 15: 0.93, 30: 0.96, 45: 0.93 } },
      SO: { label: "Suroeste", f: { 15: 0.93, 30: 0.96, 45: 0.93 } },
      EO: { label: "Este-oeste (tejado a dos aguas)", f: { 15: 0.87, 30: 0.84, 45: 0.78 } },
      E: { label: "Este", f: { 15: 0.87, 30: 0.84, 45: 0.78 } },
      O: { label: "Oeste", f: { 15: 0.87, 30: 0.84, 45: 0.78 } },
      NE: { label: "Noreste", f: { 15: 0.77, 30: 0.66, 45: 0.55 } },
      NO: { label: "Noroeste", f: { 15: 0.77, 30: 0.66, 45: 0.55 } },
      N: { label: "Norte", f: { 15: 0.7, 30: 0.55, 45: 0.42 } },
    },
    // Cubierta plana: los paneles van sobre estructura inclinada hacia el sur.
    flatFactor: 0.96,
    // Tipo de cubierta: sobrecoste de estructura y montaje (€/kWp) y m² de cubierta por panel.
    roofs: {
      teja: { label: "Teja", perKwp: 0, m2PerPanel: 2.3 },
      chapa: { label: "Chapa o panel sándwich", perKwp: -60, m2PerPanel: 2.3 },
      pizarra: { label: "Pizarra", perKwp: 150, m2PerPanel: 2.3 },
      plana: { label: "Cubierta plana", perKwp: 110, m2PerPanel: 3.4, flat: true },
      uralita: { label: "Fibrocemento (uralita)", perKwp: 0, m2PerPanel: 2.3, asbestos: true },
    },
    shade: { none: 1, some: 0.92, lot: 0.8 },
    // Autoconsumo directo según batería; un tejado este-oeste reparte la producción en más horas.
    selfConsumption: { 0: 0.42, 5: 0.62, 10: 0.75 },
    eastWestBonus: 0.05,
    surplusPrice: 0.06,
    // La compensación de excedentes no puede superar el término de energía de lo comprado a la red.
    gridEnergyPrice: 0.13,
    electricity: 0.19,
    irpf: { rate: 0.4, maxBase: 7500 },
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

/** Potencia de bomba de calor recomendada (kW) para una superficie, zona y aislamiento. */
export function heatPumpKw(m2, zone = "D3", insulation = "mid") {
  const need = (m2 * P.aero.wPerM2[zone][insulation]) / 1000;
  return P.aero.sizesKw.find((s) => s >= need) ?? P.aero.sizesKw.at(-1);
}

/** Líneas de una instalación de aerotermia (sin ahorro ni ayudas). */
export function aeroLines({ m2, zone = "D3", emitter = "keep", fuel = "gas", insulation = "mid" }) {
  const a = P.aero;
  const kw = heatPumpKw(m2, zone, insulation);
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

export function quoteAero({ fuel, spend, m2, zone, emitter, irpf, insulation = "mid" }) {
  const a = P.aero;
  const { kw, lines } = aeroLines({ m2, zone, emitter, fuel, insulation });
  const t = total(lines);
  const scop = a.scop[zone][emitter];
  const newCost = (spend / a.energyPrice[fuel]) * a.electricity / scop;
  const save = Math.max(0, spend - newCost);
  const deduction = irpf ? a.irpf.rate * Math.min(t.lo, a.irpf.maxBase) : 0;
  const payback = save > 0 ? (t.lo - deduction) / save : Infinity;
  return {
    kind: "aero",
    title: "Aerotermia",
    lines,
    ...t,
    kw,
    scop,
    save,
    newCost,
    deduction,
    payback,
    net15: save * 15 - (t.lo - deduction),
    summary: `Aerotermia ${kw} kW para ${m2} m², desde ${t.lo} € (IVA incl.)`,
  };
}

/** Producción relativa al óptimo para una cubierta, orientación, inclinación y sombras. */
export function solarFactor({ roof = "teja", orient = "S", tilt = 30, shade = "none" }) {
  const s = P.solar;
  const base = s.roofs[roof].flat ? s.flatFactor : s.orientation[orient].f[tilt];
  return base * s.shade[shade];
}

export function quoteSolar({ bill, zone, roof = "teja", orient = "S", tilt = 30, shade = "none", area = 60, battery, aero, ev, irpf = false }) {
  const s = P.solar;
  const r = s.roofs[roof];
  const cons = (bill * 12 * 0.8) / s.electricity + (aero ? 4000 : 0) + (ev ? 2500 : 0);
  const annual = bill * 12 + (aero ? 4000 * s.electricity : 0) + (ev ? 2500 * s.electricity : 0);
  const factor = solarFactor({ roof, orient, tilt, shade });
  const yieldK = s.yieldPerKwp[zone] * factor;
  const wanted = Math.round(clamp((cons * 0.9) / yieldK, 2, 15) / s.panelKwp);
  const fit = Math.floor(area / r.m2PerPanel);
  const panels = Math.max(2, Math.min(wanted, fit));
  const kwp = panels * s.panelKwp;
  const prod = kwp * yieldK;
  const eastWest = !r.flat && orient === "EO";
  const selfR = s.selfConsumption[battery] + (eastWest ? s.eastWestBonus : 0);
  const self = Math.min(prod * selfR, cons * 0.85);
  const surplus = prod - self;
  const credit = Math.min(surplus * s.surplusPrice, (cons - self) * s.gridEnergyPrice);
  const save = self * s.electricity + credit;
  const after = Math.max(annual - save, annual * 0.12);
  const lines = [];
  const [plo, phi] = range(s.fixed + (s.perKwp + r.perKwp) * kwp);
  const mount = r.flat ? "estructura inclinada sobre cubierta plana" : `estructura para ${r.label.toLowerCase()}`;
  lines.push({ label: `${panels} paneles (${kwp.toLocaleString("es-ES")} kWp), inversor, ${mount} y legalización`, lo: plo, hi: phi });
  if (battery) {
    const [lo, hi] = range(s.batteries[battery]);
    lines.push({ label: `Batería de ${battery} kWh`, lo, hi });
  }
  if (ev) {
    const [lo, hi] = range(s.wallbox);
    lines.push({ label: "Cargador de vehículo eléctrico", lo, hi });
  }
  const t = total(lines);
  const deduction = irpf ? s.irpf.rate * Math.min(t.lo, s.irpf.maxBase) : 0;
  return {
    kind: "solar",
    title: "Placas solares",
    lines,
    ...t,
    kwp,
    panels,
    limitedByRoof: fit < wanted,
    factor,
    prod,
    selfPct: self / cons,
    save,
    annual,
    after,
    deduction,
    payback: (t.lo - deduction) / save,
    asbestos: Boolean(r.asbestos),
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
