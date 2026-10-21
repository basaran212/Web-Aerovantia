// Comprueba que las calculadoras dan cifras coherentes con el mercado publicado y que los casos
// límite no producen resultados absurdos. Las bandas de mercado vienen de data/benchmark/competencia.csv.
import assert from "node:assert/strict"
import { test } from "node:test"

import { aeroSavings, heatPumpKw, quoteAero, quoteCharger, quoteReforma, quoteSolar, solarFactor } from "../src/scripts/pricing.js"
import { AERO_CASES, SOLAR_CASES } from "./cases.mjs"

const within = (v, lo, hi, what) => assert.ok(v >= lo && v <= hi, `${what}: ${v} fuera de ${lo}–${hi}`)
const halfWidth = (lo, hi) => (hi - lo) / (hi + lo)

test("aerotermia aprovechando radiadores en 100–200 m²: dentro de 8.000–18.500 € (B01–B04)", () => {
  for (const m2 of [100, 150, 200]) {
    const q = quoteAero({ fuel: "gasoleo", spend: 2400, m2, zone: "madrid", emitter: "keep", irpf: false })
    within(q.lo, 8000, 18500, `desde ${m2} m²`)
    within(q.hi, 8000, 18500, `hasta ${m2} m²`)
  }
})

test("aerotermia con suelo radiante nuevo en 150–200 m²: dentro de 15.000–27.500 € (B05–B06)", () => {
  for (const m2 of [150, 200]) {
    const q = quoteAero({ fuel: "gasoleo", spend: 2900, m2, zone: "madrid", emitter: "floor", irpf: false })
    within(q.lo, 15000, 27500, `desde ${m2} m²`)
    within(q.hi, 15000, 27500, `hasta ${m2} m²`)
  }
})

test("bomba de calor dimensionada por superficie y aislamiento", () => {
  assert.equal(heatPumpKw(120), 6)
  assert.equal(heatPumpKw(220), 11)
  assert.equal(heatPumpKw(600), 16)
  assert.ok(heatPumpKw(180, "madrid", "poor") > heatPumpKw(180, "madrid", "good"))
})

test("aerotermia: suelo radiante rinde más que los radiadores de siempre y el ahorro es un rango", () => {
  const args = { fuel: "gasoleo", spend: 2400, zone: "toledo" }
  const keep = aeroSavings({ ...args, emitter: "keep" })
  const floor = aeroSavings({ ...args, emitter: "floor" })
  assert.ok(floor.save[0] > keep.save[0])
  assert.ok(keep.save[0] < keep.save[1], "rango, no cifra única")
  assert.ok(keep.scop[1] <= 3.5, "nunca el COP nominal de catálogo")
})

test("aerotermia: el ahorro de una caldera de condensación es menor que el de una estándar", () => {
  const base = { fuel: "gas", spend: 1800, zone: "madrid", emitter: "radiators" }
  assert.ok(aeroSavings({ ...base, boiler: "condensacion" }).save[1] < aeroSavings({ ...base, boiler: "estandar" }).save[1])
})

test("fotovoltaica 4–6 kWp sin batería: 4.000–8.500 €; con batería de 5 kWh: 7.000–14.000 € (B09–B16)", () => {
  const base = { bill: 120, zone: "madrid", orient: "S", tilt: 30, area: 60, aero: false, ev: false }
  const no = quoteSolar({ ...base, bill: 160, battery: 0 })
  within(no.kwp, 4, 6, "kWp")
  within(no.lo, 4000, 8500, "sin batería desde")
  within(no.hi, 4000, 8500, "sin batería hasta")
  const yes = quoteSolar({ ...base, bill: 160, battery: 5 })
  within(yes.lo, 7000, 14000, "con batería desde")
  within(yes.hi, 7000, 14000, "con batería hasta")
})

test("cargador: instalación sencilla dentro de 1.000–1.800 € (B19–B20)", () => {
  within(quoteCharger({ power: "7.4", meters: 8 }).lo, 1000, 1800, "7,4 kW a 8 m")
  assert.ok(quoteCharger({ power: "11", meters: 25 }).lo > quoteCharger({ power: "7.4", meters: 8 }).lo)
})

test("reforma integral: estándar alto y alta dentro de las bandas publicadas (B22–B23)", () => {
  const q0 = quoteReforma({ type: "int", level: 0, m2: 120, units: 1 })
  within(q0.perM2[0], 450, 900, "estándar alto €/m²")
  const q1 = quoteReforma({ type: "int", level: 1, m2: 120, units: 1 })
  within(q1.perM2[0], 700, 1200, "alta €/m²")
})

test("amplitud de todos los rangos de precio ≤ ±12 % sobre el punto medio", () => {
  const qs = [
    ...AERO_CASES.map((c) => quoteAero(c.input)),
    ...SOLAR_CASES.map((c) => quoteSolar(c.input)),
    quoteCharger({ power: "11", meters: 30 }),
    ...["int", "kit", "bath", "design"].flatMap((type) => [0, 1, 2].map((level) => quoteReforma({ type, level, m2: 150, units: 1, size: "m", project: true, domotics: true }))),
  ]
  for (const q of qs) assert.ok(halfWidth(q.lo, q.hi) <= 0.12, `${q.title}: ±${(halfWidth(q.lo, q.hi) * 100).toFixed(1)} %`)
})

test("orientación: sur > sureste > este-oeste > noreste > norte (PVGIS, latitud 40°)", () => {
  const f = (orient, tilt = 30) => solarFactor({ orient, tilt })
  assert.equal(f("S"), 1)
  assert.ok(f("S") > f("SE") && f("SE") > f("E") && f("E") > f("NE") && f("NE") > f("N"))
  assert.equal(solarFactor({ roof: "plana", orient: "N" }), solarFactor({ roof: "plana", orient: "S" }))
})

test("los 20 casos de prueba dan resultados coherentes (sin absurdos)", () => {
  for (const c of AERO_CASES) {
    const q = quoteAero(c.input)
    assert.ok(q.lo < q.hi && q.lo % 100 === 0, c.id)
    assert.ok(q.save[1] <= c.input.spend, `${c.id}: ahorro mayor que el gasto`)
    assert.ok(q.payback[0] >= 0, `${c.id}: retorno negativo`)
  }
  for (const c of SOLAR_CASES) {
    const q = quoteSolar(c.input)
    assert.ok(q.lo < q.hi && q.lo % 100 === 0, c.id)
    assert.ok(q.save[1] < q.annual, `${c.id}: ahorro mayor que la factura`)
    assert.ok(q.prod[1] / q.kwp <= 1700, `${c.id}: producción imposible`)
    assert.ok(q.payback[0] >= 0, `${c.id}: retorno negativo`)
  }
})

test("casos límite: superficie mínima y máxima, norte, mucha sombra, casa muy aislada, consumo muy bajo", () => {
  const min = quoteAero({ fuel: "gas", spend: 800, m2: 60, zone: "madrid", emitter: "keep", irpf: false, insulation: "good" })
  const max = quoteAero({ fuel: "gasoleo", spend: 6000, m2: 450, zone: "madrid", emitter: "floor", irpf: true, insulation: "poor" })
  assert.equal(min.kw, 6)
  assert.equal(max.kw, 16)
  assert.ok(min.save[1] < 800 && min.save[0] >= 0)
  assert.ok(min.notWorth, "gas natural con poco gasto: debe avisar de que no compensa")
  const north = quoteSolar({ bill: 120, zone: "madrid", orient: "N", tilt: 45, shade: "lot", area: 60, battery: 0 })
  assert.ok(north.factor < 0.4 && north.payback[1] > north.payback[0])
  const low = quoteSolar({ bill: 40, zone: "toledo", orient: "S", tilt: 30, area: 150, battery: 10 })
  assert.ok(low.save[1] < low.annual && low.notWorth, "consumo muy bajo con batería grande: no compensa")
  const zero = quoteAero({ fuel: "elec", spend: 800, m2: 60, zone: "toledo", emitter: "floor", irpf: false })
  assert.ok(Number.isFinite(zero.payback[0]))
})
