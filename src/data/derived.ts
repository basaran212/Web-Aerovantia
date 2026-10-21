// Cifras derivadas de prices.json y energy.json para las páginas: así coinciden siempre con las calculadoras.
import { aeroSavings, quoteAero, quoteCharger, quoteSolar } from "../scripts/pricing.js";

const pct = (x: number) => Math.round(x * 100);

export const FUELS = [
  { k: "gasoleo", label: "Gasóleo" },
  { k: "propano", label: "Propano" },
  { k: "gas", label: "Gas natural" },
  { k: "elec", label: "Radiadores eléctricos" },
] as const;

/** Ahorro en % por sistema sustituido y emisor, para un gasto de 2.000 €/año. */
export function savingsTable(zone: "madrid" | "toledo" = "madrid") {
  return FUELS.map((f) => {
    const boiler = f.k === "elec" ? "electrica" : "estandar";
    const keep = aeroSavings({ fuel: f.k, spend: 2000, zone, emitter: "keep", boiler });
    const floor = aeroSavings({ fuel: f.k, spend: 2000, zone, emitter: "floor", boiler });
    return { ...f, keep: [pct(keep.save[0] / 2000), pct(keep.save[1] / 2000)], floor: [pct(floor.save[0] / 2000), pct(floor.save[1] / 2000)] };
  });
}

/** Rango global de ahorro (mínimo y máximo de la tabla) para frases y bloques de cifras. */
export function savingsSpan(zone: "madrid" | "toledo" = "madrid") {
  const t = savingsTable(zone);
  const fossil = t.filter((r) => r.k !== "gas");
  const gas = t.find((r) => r.k === "gas")!;
  return {
    gas: [gas.keep[0], gas.floor[1]],
    others: [Math.min(...fossil.map((r) => r.keep[0])), Math.max(...fossil.map((r) => r.floor[1]))],
  };
}

/** Configuraciones tipo de aerotermia (precio con IVA). */
export function aeroConfigs() {
  const rows = [
    { kw: 6, m2: 90, label: "Piso o adosado pequeño (≈ 90 m²)" },
    { kw: 8, m2: 140, label: "Adosado (≈ 140 m²)" },
    { kw: 11, m2: 180, label: "Chalet (≈ 180 m²)" },
    { kw: 14, m2: 250, label: "Chalet grande (≈ 250 m²)" },
    { kw: 16, m2: 320, label: "Chalet muy grande (≈ 320 m²)" },
  ];
  return rows.map((r) => {
    const q = (emitter: string) => quoteAero({ fuel: "gas", spend: 2000, m2: r.m2, zone: "madrid", emitter, irpf: false, kw: r.kw });
    return { ...r, keep: q("keep"), radiators: q("radiators"), floor: q("floor") };
  });
}

/** Configuraciones tipo de fotovoltaica: kWp × batería, teja sur, sin límites de superficie. */
export function solarConfigs() {
  const sizes = [3, 4.5, 6, 8, 10];
  return sizes.map((kwp) => {
    const q = (battery: number) => quoteSolar({ bill: kwp * 25, zone: "madrid", roof: "teja", orient: "S", tilt: 30, area: 200, battery, kwp });
    return { kwp: kwp.toLocaleString("es-ES"), b0: q(0), b5: q(5), b10: q(10) };
  });
}

export function chargerConfigs() {
  return [
    { label: "7,4 kW monofásico, cuadro a 5 m", q: quoteCharger({ power: "7.4", meters: 5 }) },
    { label: "7,4 kW monofásico, cuadro a 20 m", q: quoteCharger({ power: "7.4", meters: 20 }) },
    { label: "11 kW trifásico, cuadro a 5 m", q: quoteCharger({ power: "11", meters: 5 }) },
    { label: "11 kW trifásico, cuadro a 20 m", q: quoteCharger({ power: "11", meters: 20 }) },
  ];
}

export const eur = (n: number) => Math.round(n).toLocaleString("es-ES", { useGrouping: "always" }) + " €";
export const eurRange = (a: number, b: number) => `${Math.round(a).toLocaleString("es-ES", { useGrouping: "always" })} – ${eur(b)}`;
