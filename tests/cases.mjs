// Viviendas tipo de Madrid y Toledo para validar las calculadoras. La columna "técnico" de
// data/benchmark/casos-prueba.csv se rellena con el presupuesto que haría un técnico con los costes
// reales; scripts/report-calculadoras.mjs compara ambos (criterio: ±10 % en el punto medio).
export const AERO_CASES = [
  { id: "A01", desc: "Chalet 180 m² Boadilla, gasóleo, radiadores, aislamiento medio", input: { fuel: "gasoleo", spend: 2900, m2: 180, zone: "madrid", emitter: "keep", irpf: true, insulation: "mid", boiler: "estandar" } },
  { id: "A02", desc: "Chalet 220 m² Las Rozas, gas natural, radiadores nuevos BT", input: { fuel: "gas", spend: 2200, m2: 220, zone: "madrid", emitter: "radiators", irpf: true, insulation: "mid", boiler: "estandar" } },
  { id: "A03", desc: "Adosado 140 m² Getafe, gas natural condensación, radiadores", input: { fuel: "gas", spend: 1300, m2: 140, zone: "madrid", emitter: "keep", irpf: false, insulation: "mid", boiler: "condensacion" } },
  { id: "A04", desc: "Chalet 250 m² Pozuelo, gasóleo, suelo radiante en reforma", input: { fuel: "gasoleo", spend: 3800, m2: 250, zone: "madrid", emitter: "floor", irpf: true, insulation: "poor", boiler: "estandar" } },
  { id: "A05", desc: "Piso 90 m² Madrid capital, radiadores eléctricos", input: { fuel: "elec", spend: 1400, m2: 90, zone: "madrid", emitter: "radiators", irpf: true, insulation: "mid", boiler: "electrica" } },
  { id: "A06", desc: "Chalet 200 m² Illescas, propano, radiadores", input: { fuel: "propano", spend: 3200, m2: 200, zone: "toledo", emitter: "keep", irpf: true, insulation: "mid", boiler: "estandar" } },
  { id: "A07", desc: "Casa 160 m² Toledo capital, gasóleo baja temperatura, radiadores BT", input: { fuel: "gasoleo", spend: 2300, m2: 160, zone: "toledo", emitter: "radiators", irpf: true, insulation: "mid", boiler: "bajaTemperatura" } },
  { id: "A08", desc: "Adosado 130 m² Seseña, gas natural, radiadores, buen aislamiento", input: { fuel: "gas", spend: 1100, m2: 130, zone: "toledo", emitter: "keep", irpf: false, insulation: "good", boiler: "estandar" } },
  { id: "A09", desc: "Chalet 300 m² Talavera, gasóleo, suelo radiante, mal aislamiento", input: { fuel: "gasoleo", spend: 4500, m2: 300, zone: "toledo", emitter: "floor", irpf: true, insulation: "poor", boiler: "estandar" } },
  { id: "A10", desc: "Casa 120 m² Torrijos, propano, radiadores", input: { fuel: "propano", spend: 2100, m2: 120, zone: "toledo", emitter: "keep", irpf: true, insulation: "mid", boiler: "estandar" } },
]

export const SOLAR_CASES = [
  { id: "S01", desc: "Chalet Boadilla, 120 €/mes, teja sur 30°, sin batería", input: { bill: 120, zone: "madrid", roof: "teja", orient: "S", tilt: 30, shade: "none", area: 50, battery: 0, profile: "dia" } },
  { id: "S02", desc: "Chalet Majadahonda, 180 €/mes, teja este-oeste, batería 5", input: { bill: 180, zone: "madrid", roof: "teja", orient: "EO", tilt: 30, shade: "none", area: 70, battery: 5, profile: "fuera" } },
  { id: "S03", desc: "Adosado Getafe, 90 €/mes, cubierta plana, sin batería", input: { bill: 90, zone: "madrid", roof: "plana", orient: "S", tilt: 30, shade: "some", area: 30, battery: 0, profile: "dia" } },
  { id: "S04", desc: "Chalet Pozuelo, 250 €/mes, pizarra suroeste 45°, batería 10 + VE", input: { bill: 250, zone: "madrid", roof: "pizarra", orient: "SO", tilt: 45, shade: "none", area: 90, battery: 10, ev: true, profile: "fuera" } },
  { id: "S05", desc: "Chalet Villaviciosa, 150 €/mes + aerotermia, teja sur, batería 5", input: { bill: 150, zone: "madrid", roof: "teja", orient: "S", tilt: 30, shade: "none", area: 80, battery: 5, aero: true, profile: "dia" } },
  { id: "S06", desc: "Chalet Illescas, 130 €/mes, chapa sur 15°, sin batería", input: { bill: 130, zone: "toledo", roof: "chapa", orient: "S", tilt: 15, shade: "none", area: 60, battery: 0, profile: "dia" } },
  { id: "S07", desc: "Casa Toledo capital, 110 €/mes, teja este, batería 5", input: { bill: 110, zone: "toledo", roof: "teja", orient: "E", tilt: 30, shade: "some", area: 40, battery: 5, profile: "fuera" } },
  { id: "S08", desc: "Chalet Seseña, 160 €/mes + VE, plana, batería 10", input: { bill: 160, zone: "toledo", roof: "plana", orient: "S", tilt: 30, shade: "none", area: 70, battery: 10, ev: true, profile: "fuera" } },
  { id: "S09", desc: "Casa Talavera, 100 €/mes, uralita sur (retirada aparte)", input: { bill: 100, zone: "toledo", roof: "uralita", orient: "S", tilt: 15, shade: "none", area: 50, battery: 0, profile: "dia" } },
  { id: "S10", desc: "Chalet Torrijos, 200 €/mes + aerotermia, teja suroeste, batería 5", input: { bill: 200, zone: "toledo", roof: "teja", orient: "SO", tilt: 30, shade: "none", area: 80, battery: 5, aero: true, profile: "dia" } },
]
