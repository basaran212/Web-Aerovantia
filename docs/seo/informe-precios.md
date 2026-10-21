# Informe de posicionamiento de precio

Generado por `pnpm report:precios` el 2026-10-21. Interno: no se publica.

**Aviso:** todas las referencias del benchmark son, por ahora, *estimaciones* leídas a través de un buscador
(sin verificar en la página ni presupuestos reales). Los percentiles son orientativos y **no sirven todavía
para decidir el posicionamiento**. Posicionamiento elegido: [PENDIENTE].

| Configuración tipo | Calculadora | Punto medio | P25 | Mediana | P75 | Ref. (verificadas) | Alerta |
|---|---|---|---|---|---|---|---|
| Aerotermia 11 kW, 150–200 m², aprovechando radiadores (gasóleo) | 10.900 € – 12.600 € | 11.750 € | 9.125 € | 12.050 € | 14.475 € | 4 (0) | Dentro de P25–P75 |
| Aerotermia con radiadores nuevos de baja temperatura, 150 m² | 12.100 € – 13.800 € | 12.950 € | 10.250 € | 12.000 € | 13.750 € | 2 (0) | Dentro de P25–P75 |
| Aerotermia con suelo radiante nuevo, 180 m² | 18.500 € – 21.100 € | 19.800 € | 20.750 € | 23.000 € | 25.250 € | 1 (0) | ⚠ Por debajo del P25: posible margen insuficiente o costes mal calculados |
| Aerotermia piso 80 m² (6 kW) | 8.200 € – 9.500 € | 8.850 € | 10.650 € | 10.800 € | 10.950 € | 1 (0) | ⚠ Por debajo del P25: posible margen insuficiente o costes mal calculados |
| Fotovoltaica 5 kWp sin batería (teja sur) | 5.800 € – 6.600 € | 6.200 € | 5.100 € | 6.000 € | 7.125 € | 4 (0) | Dentro de P25–P75 |
| Fotovoltaica 4 kWp sin batería | 4.900 € – 5.600 € | 5.250 € | 4.375 € | 5.000 € | 5.875 € | 2 (0) | Dentro de P25–P75 |
| Fotovoltaica 6 kWp sin batería | 6.700 € – 7.700 € | 7.200 € | 7.500 € | 7.500 € | 7.500 € | 1 (0) | ⚠ Por debajo del P25: posible margen insuficiente o costes mal calculados |
| Fotovoltaica ≈ 5–6 kWp con batería de 5 kWh | 9.400 € – 10.900 € | 10.150 € | 9.700 € | 12.000 € | 14.500 € | 2 (0) | Dentro de P25–P75 |
| Cargador 7,4 kW, instalación sencilla (8 m) | 1.000 € – 1.300 € | 1.150 € | 1.200 € | 1.400 € | 1.600 € | 1 (0) | ⚠ Por debajo del P25: posible margen insuficiente o costes mal calculados |
| Reforma integral 100 m², estándar alto (€/m²) | 630 €/m² – 771 €/m² | 701 €/m² | 638 €/m² | 750 €/m² | 800 €/m² | 2 (0) | Dentro de P25–P75 |
| Reforma integral 100 m², alta (€/m²) | 855 €/m² – 1045 €/m² | 950 €/m² | 775 €/m² | 800 €/m² | 900 €/m² | 2 (0) | ⚠ Por encima del P75: revisar costes, margen o justificar el valor añadido |

## Casos de prueba (20)

El presupuesto del técnico con costes reales está [PENDIENTE] (necesita `costes.csv`). Criterio: desviación
≤ ±10 % en el punto medio.

| Caso | Vivienda | Calculadora | Ahorro/año | Retorno | ¿Compensa? |
|---|---|---|---|---|---|
| A01 | Chalet 180 m² Boadilla, gasóleo, radiadores, aislamiento medio | 10.900 € – 12.600 € | 1.544 € – 1.762 € | 4,5 – 6,2 años | Sí |
| A02 | Chalet 220 m² Las Rozas, gas natural, radiadores nuevos BT | 14.800 € – 17.000 € | 656 € – 864 € | 13,7 – 21,4 años | Aviso de que no compensa |
| A03 | Adosado 140 m² Getafe, gas natural condensación, radiadores | 9.200 € – 10.600 € | 19 € – 226 € | > 30 – > 30 años | Aviso de que no compensa |
| A04 | Chalet 250 m² Pozuelo, gasóleo, suelo radiante en reforma | 24.100 € – 27.500 € | 2.584 € – 2.750 € | 7,7 – 9,5 años | Sí |
| A05 | Piso 90 m² Madrid capital, radiadores eléctricos | 9.300 € – 10.700 € | 963 € – 1.022 € | 6,2 – 8,0 años | Sí |
| A06 | Chalet 200 m² Illescas, propano, radiadores | 10.900 € – 12.600 € | 1.999 € – 2.187 € | 3,6 – 4,8 años | Sí |
| A07 | Casa 160 m² Toledo capital, gasóleo baja temperatura, radiadores BT | 12.500 € – 14.300 € | 1.368 € – 1.490 € | 6,4 – 8,3 años | Sí |
| A08 | Adosado 130 m² Seseña, gas natural, radiadores, buen aislamiento | 8.200 € – 9.500 € | 237 € – 372 € | 22,0 – > 30 años | Aviso de que no compensa |
| A09 | Chalet 300 m² Talavera, gasóleo, suelo radiante, mal aislamiento | 26.400 € – 30.000 € | 3.097 € – 3.284 € | 7,1 – 8,7 años | Sí |
| A10 | Casa 120 m² Torrijos, propano, radiadores | 8.500 € – 9.800 € | 1.312 € – 1.435 € | 3,8 – 5,2 años | Sí |
| S01 | Chalet Boadilla, 120 €/mes, teja sur 30°, sin batería | 4.400 € – 5.100 € | 625 € – 716 € | 6,1 – 8,2 años | Sí |
| S02 | Chalet Majadahonda, 180 €/mes, teja este-oeste, batería 5 | 9.900 € – 11.500 € | 1.067 € – 1.181 € | 8,4 – 10,8 años | Sí |
| S03 | Adosado Getafe, 90 €/mes, cubierta plana, sin batería | 4.200 € – 4.900 € | 473 € – 542 € | 7,7 – 10,4 años | Sí |
| S04 | Chalet Pozuelo, 250 €/mes, pizarra suroeste 45°, batería 10 + VE | 17.500 € – 20.000 € | 1.957 € – 2.127 € | 8,2 – 10,2 años | Sí |
| S05 | Chalet Villaviciosa, 150 €/mes + aerotermia, teja sur, batería 5 | 10.400 € – 12.000 € | 1.448 € – 1.587 € | 6,6 – 8,3 años | Sí |
| S06 | Chalet Illescas, 130 €/mes, chapa sur 15°, sin batería | 4.600 € – 5.300 € | 687 € – 792 € | 5,8 – 7,7 años | Sí |
| S07 | Casa Toledo capital, 110 €/mes, teja este, batería 5 | 8.100 € – 9.400 € | 628 € – 706 € | 11,5 – 15,0 años | Sí |
| S08 | Chalet Seseña, 160 €/mes + VE, plana, batería 10 | 14.100 € – 16.200 € | 1.364 € – 1.490 € | 9,5 – 11,9 años | Sí |
| S09 | Casa Talavera, 100 €/mes, uralita sur (retirada aparte) | 3.900 € – 4.500 € | 515 € – 594 € | 6,6 – 8,7 años | Sí |
| S10 | Chalet Torrijos, 200 €/mes + aerotermia, teja suroeste, batería 5 | 11.700 € – 13.500 € | 1.733 € – 1.910 € | 6,1 – 7,8 años | Sí |
