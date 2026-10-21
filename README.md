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

- `src/layouts/Layout.astro`: `<head>`, título, descripción y fuentes.
- `src/pages/index.astro`: todo el contenido de la página.
- `src/styles/global.css`: estilos y colores (variables en `:root`).
- `src/scripts/site.js`: portada animada con el scroll, tarjetas, antes/después, calculadoras y formulario.

## Formulario de contacto

Las solicitudes se envían por POST (JSON) a la URL de `PUBLIC_LEAD_WEBHOOK_URL`
(por ejemplo, un webhook de Make, Zapier o n8n). Cópiala en `.env` antes de `pnpm build`.
Si está vacía, el formulario valida los datos pero no envía nada.

## Pendiente antes de publicar

- Teléfono, email y datos legales: hay marcadores entre corchetes en `index.astro`.
- Páginas de aviso legal, privacidad y cookies.
- Conectar el formulario (ver arriba).
