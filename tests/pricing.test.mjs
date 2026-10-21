// Comprueba que la calculadora cae dentro de los rangos de mercado publicados en 2026.
import assert from "node:assert/strict"
import { test } from "node:test"

import { heatPumpKw, quoteAero, quoteObra, quoteReforma, quoteSolar } from "../src/scripts/pricing.js"

const within = (v, lo, hi, what) => assert.ok(v >= lo && v <= hi, `${what}: ${v} fuera de ${lo}–${hi}`)

test("aerotermia en unifamiliar con radiadores: 10.000–18.000 €", () => {
  const q = quoteAero({ fuel: "gasoleo", spend: 2900, m2: 180, zone: "D3", emitter: "keep", irpf: true })
  within(q.lo, 9000, 14000, "desde")
  within(q.hi, 11000, 18000, "hasta")
  assert.ok(q.deduction <= 3000)
})

test("aerotermia con suelo radiante en 150–200 m²: 15.000–22.000 €", () => {
  for (const m2 of [150, 200]) {
    const q = quoteAero({ fuel: "gasoleo", spend: 2900, m2, zone: "D3", emitter: "floor", irpf: false })
    within(q.lo, 14000, 22000, `desde ${m2} m²`)
    within(q.hi, 15000, 26000, `hasta ${m2} m²`)
  }
})

test("bomba de calor dimensionada por superficie", () => {
  assert.equal(heatPumpKw(120), 6)
  assert.equal(heatPumpKw(220), 12)
  assert.equal(heatPumpKw(600), 16)
})

test("placas solares 4–6 kWp sin batería: 4.000–8.500 €; con batería: 7.000–14.000 €", () => {
  const base = { bill: 120, zone: "D3", orient: 1, aero: false, ev: false }
  const no = quoteSolar({ ...base, battery: 0 })
  within(no.kwp, 3, 7, "kWp")
  within(no.lo, 4000, 8500, "sin batería")
  const yes = quoteSolar({ ...base, battery: 5 })
  within(yes.lo, 7000, 14000, "con batería")
})

test("reforma integral 200 m²: estándar 600–900 €/m², alta 800–1.100 €/m²", () => {
  const q0 = quoteReforma({ type: "int", level: 0, m2: 200, units: 1, floor: false, domotics: false, project: false })
  within(q0.perM2[0], 600, 900, "estándar €/m²")
  const q1 = quoteReforma({ type: "int", level: 1, m2: 200, units: 1, floor: false, domotics: false, project: false })
  within(q1.perM2[0], 800, 1100, "alta €/m²")
})

test("interiorismo: 20–90 €/m² según nivel", () => {
  const q = quoteReforma({ type: "design", level: 0, m2: 150, units: 1, floor: true, domotics: true, project: true })
  within(q.perM2[0], 20, 40, "estándar")
  assert.equal(q.lines.length, 1, "solo diseño: sin obra ni extras")
})

test("obra nueva 150 m² calidad media-alta: 1.400–2.500 €/m²", () => {
  const q = quoteObra({ m2: 150, level: 1, energy: false, soft: false, pool: false })
  within(q.perM2[0], 1400, 2100, "€/m²")
  const all = quoteObra({ m2: 150, level: 1, energy: true, soft: true, pool: false })
  within(all.lo, 280000, 380000, "con energía y proyecto")
})

test("el precio 'desde' nunca supera el 'hasta' y es múltiplo de 100", () => {
  const qs = [
    quoteAero({ fuel: "gas", spend: 1500, m2: 90, zone: "C4", emitter: "radiators", irpf: false }),
    quoteSolar({ bill: 300, zone: "C4", orient: 0.8, battery: 10, aero: true, ev: true }),
    quoteReforma({ type: "kit", level: 2, m2: 0, units: 2, floor: false, domotics: true, project: true }),
    quoteObra({ m2: 400, level: 2, energy: true, soft: true, pool: true }),
  ]
  for (const q of qs) {
    assert.ok(q.lo < q.hi, q.title)
    assert.equal(q.lo % 100, 0, q.title)
  }
})
