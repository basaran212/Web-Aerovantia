# Tabla de [PENDIENTE]

`pnpm deploy` (producción) falla mientras quede alguno en la web o en `src/data/`. Para ver la lista exacta:
`pnpm build && pnpm check:pendientes`. El preview (`pnpm deploy:preview`) sí se publica con ellos, sin indexar.

| # | Pendiente | Dónde | Responsable | Bloquea producción |
|---|---|---|---|---|
| 1 | Posicionamiento de precio (media del mercado con más servicio, o algo por encima) | data/benchmark/precios-internos.json | Gabriel | Indirecto (sin él no se valida prices.json) |
| 2 | Margen objetivo por línea | data/benchmark/precios-internos.json | Gabriel | Indirecto |
| 3 | Tarifas de distribuidor (Saltoki, Salvador Escoda, Sonepar, SumSol, Suministros Orduña, Frigicoll) | data/benchmark/costes.csv | Gabriel | Indirecto |
| 4 | Tarifas acordadas con los instaladores colaboradores | data/benchmark/costes.csv | Gabriel | Indirecto |
| 5 | Benchmark: ≥ 10 referencias verificadas por servicio (precio público visto en la página o presupuesto real) y 6 presupuestos de cliente misterio por servicio | data/benchmark/competencia.csv | Gabriel | Sí (`prices.json` → estado) |
| 6 | Presupuesto del técnico para los 20 casos de prueba (validación ±10 %) | data/benchmark/casos-prueba.csv | Técnico | Sí (vía estado de prices.json) |
| 7 | Precio medio de la electricidad 12 meses (CNMC/OMIE) | src/data/energy.json | Gabriel / técnico | Sí |
| 8 | Precio de excedentes 12 meses (ESIOS/OMIE) y término de energía (CNMC) | src/data/energy.json | Gabriel / técnico | Sí |
| 9 | TUR de gas vigente (verificar en el BOE) | src/data/energy.json | Técnico | Sí |
| 10 | Gasóleo C: precio medio (Boletín Petrolero UE / MITECO). Hoy las fuentes van de 1,09 a 1,75 €/L | src/data/energy.json | Técnico | Sí |
| 11 | Propano granel: precio de un distribuidor de la zona | src/data/energy.json | Gabriel | Sí |
| 12 | Rendimiento de calderas (IDAE o fichas) | src/data/energy.json | Técnico | Sí |
| 13 | SCOP por emisor con fichas EN 14825 o IDAE | src/data/energy.json | Técnico | Sí |
| 14 | Simulaciones PVGIS de Madrid y Toledo (y de cada municipio, con las coordenadas de su landing) | src/data/energy.json, landings | Técnico | Sí |
| 15 | Autoconsumo con/sin batería con fuente técnica | src/data/energy.json | Técnico | Sí |
| 16 | Umbrales de "no compensa" (años de retorno y ahorro mínimo; hoy 15 años y 300 €) | src/data/energy.json | Gabriel | Sí |
| 17 | Deducción IRPF: texto consolidado de la DA 50.ª y RDL 7/2026 en el BOE | src/data/energy.json | Asesor fiscal | Sí |
| 18 | CAE: ficha RES060 y coeficientes del RDL 7/2026 | /ayudas/cae/ | Técnico | Sí |
| 19 | Certificado energético: verificar rangos de precio y tasas de registro de Madrid y CLM | /guias/certificado-energetico/ | Técnico | Sí |
| 20 | Programa Primeros clientes: condición concreta, número de plazas y plazas disponibles | src/data/config.json | Gabriel | Sí |
| 21 | Autor y revisor técnico de las guías (nombre real, rol, titulación) | src/data/authors.ts | Gabriel | Sí |
| 22 | Equipo real para /quienes-somos/ (nombre, rol, foto real) | /quienes-somos/ | Gabriel | Sí |
| 23 | Nº de registro de los instaladores colaboradores (RITE, gases fluorados) | /como-trabajamos/ | Gabriel | Sí |
| 24 | Seguro de RC: aseguradora y cobertura | /como-trabajamos/ | Gabriel | Sí |
| 25 | Razón social exacta ("Eufórico" con tilde) según el Registro Mercantil | src/data/site.ts (aviso legal) | Gabriel | Sí |
| 26 | Privacidad: plazo de conservación de solicitudes no convertidas | /privacidad/ | Asesor legal | Sí |
| 27 | Privacidad: nombre del CRM y confirmación de encargados y transferencias internacionales | /privacidad/ | Asesor legal | Sí |
| 28 | 12 municipios: zona climática CTE y grados-día con la tabla a-Anejo B y la altitud | src/data/municipios.ts | Técnico | Sí |
| 29 | 12 municipios: bonificación de IBI/ICIO en la ordenanza vigente (con enlace) | src/data/municipios.ts | Gabriel | Sí |
| 30 | 12 municipios: trámite y enlace a la sede electrónica | src/data/municipios.ts | Gabriel | Sí |
| 31 | Garantía propia (años y alcance), solo si existe | src/data/config.json (`garantiaPropia`) | Gabriel | No (si es `null`, no se muestra) |
| 32 | Marcas de fabricantes confirmadas en programas partner | src/data/config.json (`marcasConfirmadas`) | Gabriel | No (sin ellas no se muestra ninguna) |
| 33 | ID de GA4 / Google Ads | src/data/config.json | Gabriel | No |
| 34 | Webhook de Make para formulario y calculadora (`PUBLIC_LEAD_WEBHOOK_URL`) | .env del build | Gabriel | No (sin él, el formulario abre el correo) |
| 35 | Volumen y dificultad de keywords | docs/seo/keywords.md | Gabriel (Keyword Planner / Search Console) | No |
| 36 | Categoría principal de Google Business Profile y código postal exacto | docs/seo/google-business-profile.md | Gabriel | No |
