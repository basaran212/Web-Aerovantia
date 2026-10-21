// Eventos de medición. Se apilan en dataLayer; solo llegan a GA4/Ads si el visitante acepta las
// cookies de analítica (Consent Mode v2) y hay un ID configurado en src/data/config.json.
export function track(event, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
