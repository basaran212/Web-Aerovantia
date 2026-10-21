# Benchmark de precios (interno, no se publica)

Esta carpeta está fuera de `src/` y `public/`: nada de lo que hay aquí llega a la web. **No se nombra a la
competencia en la web ni se publican comparativas de precio** (publicidad comparativa).

| Archivo | Qué es | Quién lo mantiene |
|---|---|---|
| `competencia.csv` | Referencias de precio de mercado (B01…) | Gabriel, cada 3 meses |
| `costes.csv` | Coste real por configuración tipo (C01…) | Gabriel con las tarifas de distribuidor y del instalador |
| `casos-prueba.csv` | 20 viviendas tipo: calculadora frente al presupuesto de un técnico | Técnico + `pnpm report:precios` |
| `../../src/data/prices.json` | Precios que ve el cliente (fuente única) | Se recalibra con los dos primeros |
| `../../src/data/energy.json` | Hipótesis energéticas con fuente | Revisión trimestral |

## Estado a 21-10-2026

- `competencia.csv`: 25 referencias, **todas "estimación"**: guías de precios publicadas y leídas a través de
  un buscador. Desde este entorno no se pueden abrir las páginas para verificarlas. **No hay todavía ningún
  presupuesto real** ni ninguna referencia confirmada de instaladores locales de Madrid sur/oeste.
- Regla: los rangos de las calculadoras **no se publican en producción** hasta tener al menos 10 referencias
  por servicio con fiabilidad "precio público" (verificado en la página) o "presupuesto real". Por eso
  `prices.json` lleva un `[PENDIENTE]` que bloquea `pnpm deploy`.
- `costes.csv`: plantilla con las 50 configuraciones tipo; todos los importes están `[PENDIENTE]`.

## Cómo rellenar `competencia.csv`

Una fila por referencia. Campos:

- `tipo`: nacional / comercializadora / instalador local de Madrid / instalador local de Toledo / marketplace.
- `configuracion`: kWp, kW térmicos, batería, emisores, m². Cuanto más concreta, más útil.
- `precio_min_con_iva` y `precio_max_con_iva`: si es un precio único, el mismo en las dos columnas.
- `incluye`: legalización, gestión de ayudas, certificado energético, retirada de caldera, garantía, mantenimiento.
- `fuente`: URL o "presupuesto recibido (archivo en Drive/…)". Guarda el PDF del presupuesto.
- `fiabilidad`: precio público (lo has visto en la página) / presupuesto real / estimación.

Cobertura mínima:

- Fotovoltaica: comercializadoras y plataformas nacionales con precio publicado, 3 instaladores locales de
  Madrid sur/oeste y 3 de Toledo / La Sagra.
- Aerotermia: 3 instaladores o empresas de climatización por provincia y las ofertas publicadas de las grandes
  energéticas.
- Reformas: €/m² de reformistas de Madrid y Toledo y de plataformas de presupuestos.

## Guion de "cliente misterio" (6 presupuestos por servicio: 3 en Madrid y 3 en Toledo)

Usa siempre la misma vivienda para poder comparar. Pide el presupuesto por escrito y desglosado.

**Vivienda Madrid:** chalet de 180 m² en Boadilla del Monte, construido en 2002, caldera de gasóleo de 2008 con
radiadores de hierro fundido, gasto de unos 2.900 €/año en gasóleo, factura de luz de 120 €/mes, tejado de
teja a dos aguas orientado sur y norte, 40 m² útiles al sur, sin sombras, monofásico 5,75 kW.

**Vivienda Toledo:** chalet de 160 m² en Illescas, construido en 2006, caldera de propano con radiadores de
aluminio, unos 2.600 €/año en propano, factura de luz de 110 €/mes, cubierta plana de 60 m² útiles,
monofásico 6,9 kW.

Qué pedir (por separado, para poder sumar):

1. Aerotermia sustituyendo la caldera y aprovechando los radiadores.
2. La misma con suelo radiante (solo planta baja, 90 m²).
3. Placas solares sin batería, y la misma con batería de 5 kWh.
4. Cargador de 7,4 kW a 12 m del cuadro.

Preguntas que hay que hacer siempre (y anotar en `incluye`):

- ¿Incluye legalización, certificado energético antes y después y gestión de la deducción del IRPF y de los CAE?
- ¿Incluye la retirada de la caldera y del depósito? ¿Y la gestión de residuos?
- ¿Qué potencia y qué marca de equipo? ¿Qué SCOP declara el fabricante a 35 °C y a 55 °C?
- ¿Qué garantía da el fabricante y qué garantía da el instalador?
- ¿Cuánto ahorro estiman y con qué precio de la energía? (anótalo para comparar hipótesis)
- ¿Plazo de instalación y forma de pago?

No digas que eres de una empresa del sector. No pidas visitas que no vayas a atender: si te ofrecen visita,
di que primero quieres un precio orientativo por escrito.

## Después de rellenar

```sh
pnpm report:precios   # recalcula percentiles P25/mediana/P75 y alerta si Aerovantia queda fuera
pnpm test             # comprueba las bandas de mercado de las calculadoras
```

Si el precio de Aerovantia queda por encima del P75: revisar costes, revisar margen o justificar el valor
añadido. Si queda por debajo del P25: posible margen insuficiente o costes mal calculados. La calculadora no
se maquilla: se decide y se cambia `prices.json`.
