// Fórmulas de las calculadoras y del presupuesto orientativo.
//
// Los precios salen de src/data/prices.json y las hipótesis energéticas de src/data/energy.json:
// cambiar una cifra allí cambia la calculadora, las páginas de precio y el PDF a la vez.
// Todos los importes son precios finales con IVA. Cada resultado se da en rango (desde–hasta).
import PRICES from "../data/prices.json" with { type: "json" };
import ENERGY from "../data/energy.json" with { type: "json" };

export { PRICES, ENERGY };

const P = PRICES;
const E = ENERGY;
export const ZONES = { madrid: "Comunidad de Madrid", toledo: "Provincia de Toledo" };

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

/** Retorno en años como rango: el peor caso usa la inversión alta y el ahorro bajo. */
function paybackRange(lo, hi, deduction, save) {
  const f = (inv, s) => (s > 0 ? Math.max(0, inv - deduction) / s : Infinity);
  return [f(lo, save[1]), f(hi, save[0])];
}

/** Indica si la inversión no compensa con los umbrales de energy.json. */
function notWorth(save, payback) {
  return payback[1] > E.noCompensa.retornoMaxAnios || save[1] < E.noCompensa.ahorroMinAnual;
}

function irpfDeduction(amount, applies) {
  return applies ? E.irpf.porcentaje * Math.min(amount, E.irpf.baseMaxima) : 0;
}

/* ===== Aerotermia ===== */

/** Potencia de bomba de calor recomendada (kW) para una superficie, zona y aislamiento. */
export function heatPumpKw(m2, zone = "madrid", insulation = "mid") {
  const need = (m2 * E.potenciaPorM2[zone][insulation]) / 1000;
  return P.aero.sizesKw.find((s) => s >= need) ?? P.aero.sizesKw.at(-1);
}

/** Líneas de una instalación de aerotermia (sin ahorro ni ayudas). */
export function aeroLines({ m2, zone = "madrid", emitter = "keep", fuel = "gas", insulation = "mid", kw: forcedKw }) {
  const a = P.aero;
  const kw = forcedKw ?? heatPumpKw(m2, zone, insulation);
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
  if (rem) lines.push({ label: a.removalLabel[fuel], lo: rem, hi: rem });
  return { kw, lines };
}

/**
 * Ahorro anual en rango. La energía útil que hoy produce tu caldera sale de tu gasto, del precio
 * del combustible y del rendimiento de la caldera; la aerotermia la produce con electricidad
 * dividida por su SCOP (rango según emisor y zona).
 */
export function aeroSavings({ fuel, spend, zone, emitter, boiler = "estandar" }) {
  const c = E.combustibles[fuel];
  const eff = fuel === "elec" ? 1 : E.calderas[boiler].rendimiento;
  const fixed = fuel === "gas" ? c.fijoAnual : 0;
  const useful = (Math.max(0, spend - fixed) / c.precio) * eff;
  const [s0, s1] = E.scop[zone][emitter];
  const cost = [useful * E.electricidad.precio / s1, useful * E.electricidad.precio / s0];
  // El ahorro nunca supera el gasto actual: como mínimo seguirás pagando la electricidad de la bomba.
  const save = [Math.max(0, spend - cost[1]), Math.max(0, spend - cost[0])];
  return { useful, scop: [s0, s1], cost, save };
}

export function quoteAero({ fuel, spend, m2, zone, emitter, irpf, insulation = "mid", boiler = "estandar", kw: forcedKw }) {
  const { kw, lines } = aeroLines({ m2, zone, emitter, fuel, insulation, kw: forcedKw });
  const t = total(lines);
  const s = aeroSavings({ fuel, spend, zone, emitter, boiler });
  const deduction = irpfDeduction(t.lo, irpf);
  const payback = paybackRange(t.lo, t.hi, deduction, s.save);
  return {
    kind: "aero",
    title: "Aerotermia",
    lines,
    ...t,
    kw,
    scop: s.scop,
    save: s.save,
    newCost: s.cost,
    deduction,
    payback,
    notWorth: notWorth(s.save, payback),
    summary: `Aerotermia ${kw} kW para ${m2} m², ${t.lo}–${t.hi} € (IVA incl.)`,
  };
}

/* ===== Fotovoltaica ===== */

/** Producción relativa al óptimo para una cubierta, orientación, inclinación y sombras. */
export function solarFactor({ roof = "teja", orient = "S", tilt = 30, shade = "none" }) {
  const s = E.solar;
  const base = P.solar.roofs[roof].flat ? s.planaFactor : s.orientacion[orient].f[tilt];
  return base * s.sombras[shade];
}

export function quoteSolar({ bill, zone, roof = "teja", orient = "S", tilt = 30, shade = "none", area = 60, battery = 0, aero = false, ev = false, irpf = false, profile = "dia", kwp: forcedKwp }) {
  const s = P.solar;
  const r = s.roofs[roof];
  const price = E.electricidad.precio;
  const extra = (aero ? E.consumos.aerotermiaKWh : 0) + (ev ? E.consumos.cocheElectricoKWh : 0);
  const cons = (bill * 12 * 0.8) / price + extra;
  const annual = bill * 12 + extra * price;
  const factor = solarFactor({ roof, orient, tilt, shade });
  const [y0, y1] = E.solar.kWhPorKWp[zone];
  const yMid = ((y0 + y1) / 2) * factor;
  const wanted = Math.round(clamp((cons * 0.9) / yMid, 2, 15) / s.panelKwp);
  const fit = Math.floor(area / r.m2PerPanel);
  const panels = forcedKwp ? Math.round(forcedKwp / s.panelKwp) : Math.max(2, Math.min(wanted, fit));
  const kwp = panels * s.panelKwp;
  const prod = [kwp * y0 * factor, kwp * y1 * factor];
  const eastWest = !r.flat && orient === "EO";
  const selfR = E.solar.autoconsumo[profile][battery] + (eastWest ? E.solar.autoconsumo.eastWestBonus : 0);
  const saving = (p, surplusPrice) => {
    const self = Math.min(p * selfR, cons * 0.85);
    const credit = Math.min((p - self) * surplusPrice, (cons - self) * E.compraRedEnergia.precio);
    return { self, value: self * price + credit };
  };
  const lowCase = saving(prod[0], E.excedentes.min);
  const highCase = saving(prod[1], E.excedentes.max);
  // Nunca más ahorro que la factura: siempre quedan el término de potencia y los impuestos.
  const cap = annual * 0.88;
  const save = [Math.min(lowCase.value, cap), Math.min(highCase.value, cap)];
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
  const deduction = irpfDeduction(t.lo, irpf);
  const payback = paybackRange(t.lo, t.hi, deduction, save);
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
    selfPct: Math.min(lowCase.self, cons) / cons,
    save,
    annual,
    after: [Math.max(annual - save[1], annual * 0.12), Math.max(annual - save[0], annual * 0.12)],
    deduction,
    payback,
    notWorth: notWorth(save, payback),
    asbestos: Boolean(r.asbestos),
    summary: `${kwp.toLocaleString("es-ES")} kWp${battery ? ` + batería ${battery} kWh` : ""}, ${t.lo}–${t.hi} € (IVA incl.)`,
  };
}

/* ===== Cargador de coche eléctrico ===== */

export function quoteCharger({ power = "7.4", meters = 10 }) {
  const c = P.cargador;
  const base = c.base[power] + Math.max(0, meters - c.metrosIncluidos) * c.perMetro;
  const [lo, hi] = range(base);
  return { kind: "ev", title: "Cargador de coche eléctrico", lo, hi, lines: [{ label: `Punto de recarga ${power.replace(".", ",")} kW y línea de ${meters} m`, lo, hi }] };
}

/* ===== Reformas (rango de referencia de mercado; el precio se da bajo proyecto) ===== */

const SIZE_POS = { s: 0.2, m: 0.5, l: 0.8 };

export function quoteReforma({ type, level, m2, units, size = "m", floor, domotics, project, zone = "madrid" }) {
  const r = P.reforma;
  const cfg = r.types[type];
  const [pmin, pmax] = cfg.p[level];
  const qty = cfg.unit === "m2" ? m2 : units;
  // Punto medio según el tamaño (cocinas y baños) o el centro del rango (por m²), ±10 %.
  const mid = cfg.unit === "m2" ? (pmin + pmax) / 2 : pmin + (pmax - pmin) * SIZE_POS[size];
  const works = { lo: mid * 0.9 * qty, hi: mid * 1.1 * qty };
  const lines = [{ label: `${cfg.label} · ${P.levels[level]}${cfg.unit === "m2" ? ` · ${m2} m²` : ` · ${units} ud.`}`, ...works }];
  if (domotics && type !== "design")
    lines.push({ label: "Domótica e iluminación escénica", lo: works.lo * r.domotics, hi: works.hi * r.domotics });
  if (project && type !== "design")
    lines.push({ label: "Proyecto 3D, licencia y dirección de obra", lo: works.lo * r.project, hi: works.hi * r.project });
  if (floor && type === "int") lines.push(...aeroLines({ m2, zone, emitter: "floor", fuel: "gas" }).lines.filter((l) => !/Desmontaje/.test(l.label)));
  const rounded = lines.map((l) => ({ ...l, lo: down(l.lo), hi: up(l.hi) }));
  const t = total(rounded);
  const area = cfg.unit === "m2" ? m2 : cfg.m2eq * units;
  let weeks;
  if (type === "int") weeks = [Math.round(10 + m2 / 25), Math.round(14 + m2 / 18)];
  else if (type === "kit") weeks = [3 + units, 5 + units * 2];
  else if (type === "bath") weeks = [2 + units, 3 + units * 2];
  else weeks = [3, 6];
  return {
    kind: "ref",
    title: cfg.label,
    lines: rounded,
    ...t,
    perM2: [t.lo / area, t.hi / area],
    weeks,
    payments: r.payments,
    summary: `${cfg.label} (${P.levels[level].toLowerCase()}), ${t.lo}–${t.hi} € (IVA incl.), referencia de mercado`,
  };
}
