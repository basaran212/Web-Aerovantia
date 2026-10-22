# Rediseño premium: informe

Rama `rediseno-premium` (sale de `wip-veracidad-seo`). Preview sin indexar:
https://web-aerovantia-rediseno.web-aerovantia.workers.dev. Producción sin tocar.

## Qué ha cambiado

**Sistema de diseño** (`src/styles/global.css`)
- Paleta clara: blanco cálido `#F6F4EF`, grafito `#1B1C1A`, gris piedra `#6B6860`, verde profundo `#1E4A38`
  como único acento. El hero, las cabeceras con foto y los bloques a sangre usan una paleta oscura propia
  (`.on-dark`), así que su legibilidad no cambia.
- Escala tipográfica mayor (H1 40–80 px, H2 32–56 px), más espacio entre secciones (88–128 px), botones sin
  sombras, entradas al hacer scroll más cortas y sin desenfoque. Manrope y Geist Mono se mantienen: son la
  identidad actual y no cuestan carga extra.
- Se conservan los nombres de clase: todas las páginas adoptan el sistema sin reescribirse.

**Navegación** (`src/components/Header.astro`, `src/data/site.ts`)
- Menú: Proyectos · Reformas · Construcción · Eficiencia energética · Aerovantia. Botón "Solicitar estudio".
- Cristal oscuro sobre el hero y las cabeceras con foto, claro en el resto (se cambia al hacer scroll).
- Menú móvil: hoja clara a pantalla completa con los 5 apartados y los accesos secundarios (aerotermia,
  placas, combo, calculadoras, ayudas, guías, cómo trabajamos, Madrid, Toledo, contacto). Escape cierra y
  devuelve el foco.
- Ninguna página ha perdido su ruta: lo que sale del menú principal está en el menú móvil, el pie y el hub
  `/eficiencia-energetica/`.

**Portada** (`src/pages/index.astro`)
1. Hero original: solo cambian textos y botones ("Una nueva forma de habitar.", "Descubre Aerovantia",
   "Cuéntanos tu proyecto"). Sin cambios en `world.js`, `paseo.ts` ni en la estructura.
2. Manifiesto: "Tu vivienda puede ser mucho más.", que se ilumina palabra a palabra con el scroll.
3. Tres pilares: Diseño, Construcción y Eficiencia, con imagen grande alternando lados.
4. Reformas integrales premium: imagen a sangre, titular y enlace; debajo, el antes/después y los materiales.
5. Tecnología invisible: aerotermia, energía solar, climatización inteligente y aislamiento, por beneficio,
   sin cifras de ahorro. La franja de la deducción del IRPF se mantiene aquí.
6. Configura tu proyecto: las calculadoras con el nuevo configurador.
7. Nuestro método: los 6 pasos y los compromisos (texto sin cambios: son compromisos comerciales).
8. Proyectos: 3 visualizaciones conceptuales, señaladas como tales, y Primeros clientes.
9. Zona, preguntas frecuentes y contacto: "Tu próximo espacio empieza con una conversación."

**Configurador** (`src/scripts/configurator.js`)
- Capa de presentación sobre las calculadoras: pasos con título, barra de progreso, opciones como botones,
  Atrás/Siguiente, "Ver resultado" y "Ver todas las preguntas" (modo avanzado = formulario completo).
- Los campos, sus id y `calc.js`/`pricing.js` no cambian. Sin JavaScript se ve el formulario completo.

**Formulario**: tipo de proyecto, ubicación, superficie aproximada, presupuesto estimado y fecha de inicio,
además de nombre, teléfono, Primeros clientes, privacidad y comunicaciones comerciales. El envío conserva
las claves anteriores (name, phone, town, interest, calc, utm…) y añade `tipo`, `superficie`, `presupuesto`
e `inicio`.

**Páginas nuevas**: `/proyectos/` (obras ejecutadas, proyectos en desarrollo y visualizaciones
conceptuales, siempre separados; las dos primeras con estado vacío honesto), una ficha por proyecto y
`/eficiencia-energetica/`.

## Pruebas

| Prueba | Resultado |
|---|---|
| Hero: estado en las 6 paradas (parada actual, imágenes visibles, raíl, indicador, carga de los 5 clips) frente al estado inicial | Idéntico |
| Calculadoras: 10 escenarios (3 aerotermia, 3 placas, 2 reformas, 2 obra nueva) frente al estado inicial | Resultados idénticos |
| Pruebas automáticas de precios (`pnpm test`) | 13 de 13 |
| Auditoría SEO del build (49 páginas) | Sin enlaces rotos, un H1 por página, alt en todas las imágenes, canonical a aerovantia.es, JSON-LD válido. Solo quedan títulos de más de 60 caracteres que fijaste tú |
| Texto compartido entre landings de municipio | Máximo 18 % (límite 30 %) |
| Desbordamiento horizontal en móvil (390 px), 10 páginas | Ninguno |
| Formulario de principio a fin | Valida, preselecciona el tipo desde la calculadora, envía todos los campos y registra `form_submit` |
| Lighthouse móvil (local) | Portada: rendimiento 95–99, accesibilidad 100, SEO 100, LCP 2,0 s, CLS 0,001. Aerotermia, calculadora, proyectos y eficiencia: 98–100 en rendimiento |
| Errores de JavaScript | Ninguno |

## Limitaciones y pendientes

- **INP**: Lighthouse en laboratorio no mide INP; el bloqueo total (TBT) es de 0 ms en las ejecuciones
  calientes. Hay que medirlo con usuarios reales (Search Console / CrUX) cuando esté en producción.
- **Safari y iPhone**: no hay WebKit en este entorno. El hero y el configurador están probados en Chromium.
- **WCAG 2.2 AA**: Lighthouse da 100 en accesibilidad, pero es una revisión automática. Falta una revisión
  manual con lector de pantalla.
- **Fotografía**: todas las imágenes siguen siendo generadas con IA y etiquetadas. Para el nivel de un
  estudio internacional hacen falta fotos reales de obra (Primeros clientes).
- **Arquitectura**: la web no dice "arquitectura"; si se ofrece a través de arquitectos colaboradores,
  conviene explicarlo en "Cómo trabajamos".
- Siguen pendientes los `[PENDIENTE]` del encargo de SEO (`docs/seo/pendientes.md`): bloquean `pnpm deploy`.

## Para publicar

1. Revisar la preview en un iPhone y en un Android reales.
2. Resolver los `[PENDIENTE]` (`pnpm build && pnpm check:pendientes`).
3. Fusionar `rediseno-premium` en `main` y ejecutar `pnpm deploy` (el script se para si queda algún pendiente).
4. Conectar el dominio aerovantia.es al Worker; el noindex desaparece solo en ese dominio.
5. Después de publicar: Search Console, CrUX (INP real) y revisión de rankings a las 2 y 6 semanas.
