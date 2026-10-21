# Google Business Profile: guía para Gabriel

## Alta

1. Crea la ficha como **empresa de área de servicio** con sede en C/ Venta de Abajo, 3, Olías del Rey
   (Toledo). Oculta la dirección si no atiendes al público en la oficina.
2. **Áreas de servicio:** Comunidad de Madrid y provincia de Toledo. Añade además los 12 municipios de la
   fase 1 (Madrid, Boadilla del Monte, Pozuelo de Alarcón, Las Rozas, Majadahonda, Villaviciosa de Odón,
   Getafe, Toledo, Illescas, Seseña, Talavera de la Reina, Torrijos), hasta el máximo que permita Google.
3. **Categorías:** elige la principal y las secundarias de la lista que te ofrece Google al escribir. Busca
   las relacionadas con energía solar (instalador de paneles solares / proveedor de energía solar),
   calefacción y climatización (contratista de calefacción, contratista de aire acondicionado) y reformas
   (contratista de reformas). Principal recomendada: la de energía solar o la de calefacción, según cuál
   sea el servicio con más demanda los primeros meses. [PENDIENTE: decidir la categoría principal]
4. **Web:** `https://aerovantia.es/?utm_source=google&utm_medium=organic&utm_campaign=gbp`
5. **Teléfonos:** 689 042 717 (principal) y 626 731 467.
6. **NAP idéntico** en la web, la ficha y los directorios: "Aerovantia", "C/ Venta de Abajo, 3, 45280 Olías
   del Rey, Toledo" [PENDIENTE: confirmar código postal], "689 042 717".

## Fotos

- **Solo fotos reales**: oficina, equipo, furgoneta, instalaciones terminadas con permiso del cliente.
- **Las imágenes generadas con IA de la web NO se suben a la ficha.**
- Programa Primeros clientes: cada instalación fotografiada se sube a la ficha y a /proyectos/ (que se
  activa con la primera obra real).

## Actividad

- Una publicación por semana: una guía nueva, un caso de Primeros clientes, un recordatorio del plazo de la
  deducción del IRPF (31-12-2026), un dato útil de las calculadoras.
- Preguntas y respuestas: siembra las preguntas frecuentes de la web con sus respuestas.

## Reseñas

- Pídelas por WhatsApp el día de la puesta en marcha, con el enlace directo de reseña.
- **Sin incentivos** (ni descuentos ni regalos a cambio de reseñas): lo prohíben las políticas de Google.
- Responde a todas en menos de 48 h, también a las negativas, con tono sobrio y una solución concreta.
- Nunca pongas en la web un schema de reseñas propio (Review o AggregateRating).

## Directorios y autoridad

- Cámara de Comercio de Toledo y asociaciones empresariales locales. Sin compra de enlaces ni directorios
  spam.
- Localizadores de instaladores de los fabricantes, solo con alta confirmada. [PENDIENTE: marcas confirmadas]
- La guía de bonificaciones de IBI (/ayudas/bonificacion-ibi-icio/) como recurso para medios locales y
  blogs de urbanizaciones, cuando esté verificada municipio a municipio.

## Medición

- **Search Console:** propiedad de dominio `aerovantia.es` (verificación por DNS en Cloudflare). Envía
  `https://aerovantia.es/sitemap-index.xml`.
- **GA4 con Consent Mode v2:** pon el ID en `src/data/config.json` (`analytics.ga4Id`). La web ya está
  preparada: no carga Google ni muestra el aviso hasta que haya ID, y con ID lo carga con todo denegado
  hasta que el visitante acepta.
- Eventos ya enviados a `dataLayer`: `calc_used`, `calc_result_viewed`, `calc_hypotheses_opened`,
  `calc_lead`, `form_submit`, `whatsapp_click`, `call_click`. Márcalos como conversiones en GA4:
  `calc_lead`, `form_submit`, `whatsapp_click`, `call_click`.
