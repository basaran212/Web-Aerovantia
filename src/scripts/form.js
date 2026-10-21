// Formulario de estudio gratuito de la portada. Si hay webhook (PUBLIC_LEAD_WEBHOOK_URL) se envía por
// POST; si no, se abre el correo del cliente con la solicitud ya redactada para no perder el contacto.
import { track } from "./track.js";

(function () {
  const form = document.getElementById("leadForm");
  if (!form) return;
  const $ = (id) => document.getElementById(id);
  const WEBHOOK_URL = import.meta.env.PUBLIC_LEAD_WEBHOOK_URL || "";
  const LEAD_EMAIL = "info@aerovantia.es";
  const INTEREST = { aero: "Aerotermia", pv: "Placas solares", combo: "Aerotermia + Solar", bat: "Batería", ev: "Cargador VE", ref: "Reforma", new: "Obra nueva", int: "Interiorismo", first: "Quiero ser de los primeros clientes" };
  const INTEREST_OF = { aero: ["aero"], solar: ["pv"], ref: ["ref"], obra: ["new"] };
  let calc = null;

  // El cálculo llega de la calculadora de esta página o de otra (sessionStorage).
  function loadCalc() {
    try { calc = JSON.parse(sessionStorage.getItem("aerovantia_calc") || "null"); } catch (_) { calc = null; }
    if (!calc) return;
    $("f-calc").textContent = "Tu cálculo: " + calc.tipo + " — " + calc.resumen + ". Lo usaremos para preparar tu visita.";
    $("f-calc").hidden = false;
    Object.keys(INTEREST).forEach((k) => { if ($("i-" + k)) $("i-" + k).checked = (INTEREST_OF[calc.k] || []).includes(k); });
  }
  loadCalc();
  addEventListener("aerovantia:calc", loadCalc);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("f-err"), ok = $("f-ok"), btn = e.submitter || form.querySelector("button[type=submit]");
    err.hidden = true; ok.hidden = true;
    const name = $("f-name").value.trim(), phone = $("f-phone").value.replace(/\s/g, ""), town = $("f-town").value.trim();
    if (!name || !town) { err.textContent = "Indica tu nombre y municipio."; err.hidden = false; return; }
    if (!/^(\+34)?[6789]\d{8}$/.test(phone)) { err.textContent = "Revisa el teléfono: 9 cifras, empezando por 6, 7, 8 o 9."; err.hidden = false; return; }
    if (!$("f-rgpd").checked) { err.textContent = "Necesitamos tu consentimiento para poder llamarte."; err.hidden = false; return; }
    const interest = Object.keys(INTEREST).filter((k) => $("i-" + k)?.checked).map((k) => INTEREST[k]);
    const utm = Object.fromEntries([...new URLSearchParams(location.search)].filter(([k]) => k.startsWith("utm_")));
    const payload = { name, phone, town, interest, marketing: $("f-mkt").checked, calc, utm, page: location.href, ts: new Date().toISOString() };
    const first = name.split(" ")[0];
    track("form_submit", { interes: interest.join(", ") });
    if (WEBHOOK_URL) {
      if (btn.disabled) return;
      btn.disabled = true;
      try {
        const r = await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!r.ok) throw new Error(r.status);
        ok.textContent = "Gracias, " + first + ". Te llamamos en menos de 24 h laborables.";
        form.reset();
      } catch (_) {
        err.textContent = "No se ha podido enviar. Llámanos o escríbenos por WhatsApp al 689 042 717, o a " + LEAD_EMAIL + ".";
        err.hidden = false; btn.disabled = false; return;
      }
    } else {
      const lines = ["Nombre: " + name, "Teléfono: " + phone, "Municipio: " + town, "Me interesa: " + (interest.join(", ") || "—")];
      if (calc) lines.push("Mi cálculo: " + calc.tipo + " — " + calc.resumen);
      lines.push("", "Acepto la política de privacidad para que Aerovantia me contacte.");
      location.href = "mailto:" + LEAD_EMAIL + "?subject=" + encodeURIComponent("Estudio gratuito — " + name + " (" + town + ")") + "&body=" + encodeURIComponent(lines.join("\n"));
      ok.textContent = "Se ha abierto tu correo con la solicitud lista: solo tienes que enviarla. Si lo prefieres, llámanos al 689 042 717.";
    }
    ok.hidden = false;
  });
})();
