# Web Aerovantia

Web de Aerovantia (aerotermia, placas solares y reformas de lujo) hecha con [Astro](https://astro.build).
Es una página estática: `pnpm build` genera la carpeta `dist/`, que se puede subir a cualquier hosting.

## Desarrollo

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # genera dist/
pnpm preview   # sirve dist/ en local
```

## Estructura

- `src/data/site.ts`: **datos de empresa** (teléfono, email, razón social, CIF…), menú y zona de trabajo. Se cambian aquí y se actualizan en toda la web.
- `src/layouts/Layout.astro`: `<head>`, SEO (canonical, Open Graph, datos estructurados) y fuentes.
- `src/components/`: cabecera con menú móvil, pie, barra móvil, plantilla de servicio y plantilla legal.
- `src/pages/index.astro`: portada (película con el scroll, servicios, reformas, calculadoras, ayudas, proceso, zona, FAQ y formulario).
- `src/pages/aerotermia.astro`, `placas-solares.astro`, `reformas-de-lujo.astro`, `obra-nueva.astro`: páginas de servicio.
- `src/pages/aviso-legal.astro`, `privacidad.astro`, `cookies.astro`, `404.astro`.
- `src/styles/global.css`: estilos y colores (variables en `:root`).
- `src/scripts/site.js`: animaciones, calculadoras y formulario de la portada.
- `public/og.png`: imagen que aparece al compartir la web en redes y WhatsApp.

Las fuentes (Archivo e IBM Plex Mono) se sirven desde la propia web: no hay conexiones a Google ni a otros terceros, y la web no usa cookies.

## Calculadoras y presupuesto automático

Las tarifas y fórmulas están en `src/scripts/pricing.js` (objeto `PRICING`). La web muestra
"Desde X €" con el extremo bajo del rango, IVA incluido, y el botón "Ver mi presupuesto" genera
un presupuesto orientativo con referencia, desglose, PDF descargable y envío por WhatsApp.

Las cifras están calibradas con referencias públicas de mercado de 2026, y `pnpm test`
comprueba que siguen dentro de esos rangos:

| Servicio | Referencia de mercado | Fuente |
| --- | --- | --- |
| Aerotermia unifamiliar | 10.000–15.000 €; 12.000–18.000 € con radiadores; 15.000–22.000 € con suelo radiante (150–200 m²) | Obramat, Selectra |
| Placas solares | 850–1.400 €/kWp; 4.000–8.500 € (3–7 kWp) sin batería; 7.000–14.000 € con batería | 1KOMMA5°, Tarifasgasluz, Voltflow |
| Reforma integral | 600–900 €/m² habitual; 800–1.000+ €/m² calidad alta; Illescas ≈ 443 €/m² de media | Housfy, Trustlocal, Cronoshare |
| Obra nueva | ≈ 1.400 €/m² básica; 150 m² calidad media 280.000–370.000 € con honorarios y licencias | RealAdvisor, OCU (2026) |
| Interiorismo | 15–70 €/m² según alcance | Habitissimo, Cronoshare |
| Deducción IRPF 40 % | Vigente hasta el 31-12-2026 en viviendas (RDL 16/2025) | idealista/news, elEconomista |

**Antes de publicar, revisad `PRICING` con vuestros costes reales**: el "desde" es un precio
que el cliente verá y esperará.

## Formulario de contacto

Las solicitudes se envían por POST (JSON) a la URL de `PUBLIC_LEAD_WEBHOOK_URL`
(por ejemplo, un webhook de Make, Zapier o n8n). Cópiala en `.env` antes de `pnpm build`.
Si está vacía, el formulario valida los datos pero no envía nada.

## Pendiente antes de publicar

- Datos de inscripción en el Registro Mercantil (marcador en `src/data/site.ts`).
- Revisión de las páginas legales por un asesor.
- Conectar el formulario (ver arriba).
