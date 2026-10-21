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

## Formulario de contacto

Las solicitudes se envían por POST (JSON) a la URL de `PUBLIC_LEAD_WEBHOOK_URL`
(por ejemplo, un webhook de Make, Zapier o n8n). Cópiala en `.env` antes de `pnpm build`.
Si está vacía, el formulario valida los datos pero no envía nada.

## Pendiente antes de publicar

- Teléfono, email y datos legales: marcadores entre corchetes en `src/data/site.ts` (y algún dato más en las páginas legales).
- Revisión de las páginas legales por un asesor.
- Conectar el formulario (ver arriba).
