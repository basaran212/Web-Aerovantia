// Clics de llamada y WhatsApp en cualquier página (eventos call_click y whatsapp_click).
import { track } from "./track.js";

document.addEventListener("click", (e) => {
  const a = e.target.closest?.("a[href]");
  if (!a) return;
  const href = a.getAttribute("href");
  if (href.startsWith("tel:")) track("call_click", { origen: location.pathname });
  else if (href.includes("wa.me/")) track("whatsapp_click", { origen: location.pathname });
});
