# Hero de la portada: estado de referencia (antes del rediseño)

Documentado el 22-10-2026 sobre la rama `wip-veracidad-seo` (commit f65059d). El rediseño no cambia su lógica.

## Componentes

| Pieza | Archivo | Qué hace |
|---|---|---|
| Marcado | `src/components/ScrollWorld.astro` | Sección `.world#paseo` con un escenario fijo (`.stage`, sticky, 100lvh) y 6 paradas (`.stop`, una pantalla cada una) que se desplazan por encima. |
| Datos | `src/data/paseo.ts` | 6 paradas: casa, energía, aerotermia, reforma, interiorismo, noche. Cada una con imagen, clip, encuadre en móvil (`focus`) y valores del indicador (solar, exterior). |
| Lógica | `src/scripts/world.js` (`initWorld`) | Traduce el scroll a la posición del paseo `w`, fija el fotograma de cada clip (sin reproducción), funde las imágenes, mueve el encuadre, actualiza el indicador y la barra de progreso, y carga los clips de uno en uno. |
| Arranque | `src/scripts/motion.js` | Lenis (scroll suave) y llamada a `initWorld` con `reduceMotion` y `onScroll`. |
| Estilos | `src/styles/global.css`, bloque "Paseo (scroll world)" | Escenario, velos, raíl, indicador, pista "Desliza" y paradas. |

## Comportamiento

1. **Imágenes:** la primera escena carga con la página (LCP); las escenas 2–6 llevan `data-srcset` y se piden al terminar la carga.
2. **Clips:** 5 vídeos (MP4 H.264 para Safari, WebM VP9 para el resto), descargados enteros como blob y cargados de uno en uno, primero el más cercano. En iPhone se dispara la carga con un `play()` silencioso y oculto; si no carga en 15 s, se quedan las imágenes.
3. **Scroll:** `w = 0` en la primera parada, `1` en la segunda… El clip `i` va de la imagen de la parada `i` a la de `i + 1`; su fotograma se fija con `currentTime`. Con movimiento reducido o ahorro de datos solo se ven las imágenes.
4. **Indicador (`.live`):** solar y temperatura exterior interpolados entre paradas (0,3 kW / 9 °C → … → 0 kW / 11 °C). Oculto en móvil.
5. **Raíl (`.rail`):** 6 enlaces a las paradas y barra de progreso. Solo en escritorio (≥ 1024 px).
6. **Pista "Desliza":** se desvanece al empezar el paseo. Oculta en móvil.
7. **Paradas:** la actual lleva `.is-current` (el texto aparece con una transición de opacidad y desplazamiento). La primera contiene el H1.
8. **Etiqueta de IA:** abajo a la izquierda en escritorio y a la derecha, sobre la barra inferior, en móvil.

## Estado medido (escritorio 1440 × 900, con movimiento)

Una medida por parada (posición de la parada + 1 px): parada actual, opacidad de las 6 imágenes, barra del raíl, indicador y `readyState` de los 5 clips. Guardado en `scratchpad/redesign/before.json` y capturas `before-hero-0…5.jpg`.

| Parada | Actual | Imágenes visibles | Indicador |
|---|---|---|---|
| 0 Tu casa | 0 | 1 | 0,3 kW / 9 °C |
| 1 Placas solares | 1 | 1–2 | 5,4 kW / 24 °C |
| 2 Aerotermia | 2 | 1–3 | 4,6 kW / 22 °C |
| 3 Reforma | 3 | 1–4 | 3,1 kW / 20 °C |
| 4 Interiorismo | 4 | 1–5 | 1,2 kW / 16 °C |
| 5 Por la noche | 5 | 1–6 | 0,0 kW / 11 °C |

Los 5 clips llegan a `readyState 4` en Chromium.

## Qué puede cambiar el rediseño (y qué no)

- **Sí:** textos de las paradas, tipografía y espaciado del texto superpuesto, botones, contraste de los velos, integración con la cabecera.
- **No:** `world.js`, `paseo.ts` (salvo textos alternativos), estructura `.world > .stage + .stops`, atributos `data-*`, número de paradas, raíl, indicador y carga de clips.

Después del rediseño se repite la misma medida y debe dar los mismos valores.
