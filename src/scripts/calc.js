// Calculadoras y presupuesto orientativo. Las fórmulas viven en pricing.js; aquí solo se leen los
// campos, se pintan los resultados en rango y se gestiona el presupuesto (PDF y WhatsApp).
import { ENERGY as E, PRICES, ZONES, quoteAero, quoteObra, quoteReforma, quoteSolar } from "./pricing.js";
import { track } from "./track.js";

(function () {
  const root = document.querySelector("[data-calcs]");
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const num = (n, d = 1) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });
  const eurx = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0, useGrouping: "always" }).format(n);
  const eurRange = (a, b) => (Math.round(a) === Math.round(b) ? eurx(a) : `${eurx(a).replace(/\s?€/, "")} – ${eurx(b)}`);
  const years = ([a, b]) => (a > 30 ? "Más de 30 años" : `${num(a)} – ${b > 30 ? "más de 30" : num(b)} años`);
  const kwh = (n) => Math.round(n).toLocaleString("es-ES", { useGrouping: "always" });
  const pending = (o) => (o && o.pendiente ? ` ${o.pendiente}` : "");
  const quotes = {};
  let used = false;
  const markUsed = (k) => { if (!used) { used = true; track("calc_used", { calculadora: k }); } };

  // Pestañas (solo en la portada, donde hay varias calculadoras).
  root.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll(".tab").forEach((o) => { const on = o === b; o.setAttribute("aria-selected", on); $("p-" + o.dataset.k).hidden = !on; });
  }));
  // Los enlaces /?calc=solar#calculadoras abren su pestaña. La URL canónica no lleva el parámetro.
  const wanted = new URLSearchParams(location.search).get("calc");
  if (wanted) root.querySelector(`.tab[data-k="${wanted}"]`)?.click();

  const showRange = (id, q) => { $(id + "-from").textContent = eurRange(q.lo, q.hi); $(id + "-range").textContent = "Rango orientativo, IVA incluido"; };
  const list = (id, items) => $(id).replaceChildren(...items.map((t) => { const li = document.createElement("li"); li.textContent = t; return li; }));
  const NOT_WORTH = "Con estos datos, la inversión tarda en recuperarse. En la visita revisamos si hay una opción que te compense más.";

  function aeroHyp(zone, emitter, fuel, boiler) {
    const c = E.combustibles[fuel];
    const [s0, s1] = E.scop[zone][emitter];
    return [
      `Electricidad: ${num(E.electricidad.precio, 2)} €/kWh. Fuente: ${E.electricidad.fuente}.${pending(E.electricidad)}`,
      `Combustible actual: ${num(c.precio, 3)} €/kWh. Fuente: ${c.fuente}.${pending(c)}`,
      fuel === "elec" ? "Rendimiento actual: 100 % (calefacción eléctrica directa)." : `Rendimiento de tu caldera: ${Math.round(E.calderas[boiler].rendimiento * 100)} %. Fuente: ${E.calderas.fuente}.${pending(E.calderas)}`,
      `Rendimiento estacional de la aerotermia (SCOP): ${num(s0)} – ${num(s1)} según el emisor y la zona. Fuente: ${E.scop.fuente}.${pending(E.scop)}`,
      `Potencia: ${E.potenciaPorM2[zone].mid} W/m² con aislamiento medio en ${ZONES[zone]}. ${E.potenciaPorM2.fuente}.`,
      `Precios orientativos actualizados en ${PRICES.actualizadoTexto}.`,
    ];
  }
  function solarHyp(zone, battery, profile) {
    const [y0, y1] = E.solar.kWhPorKWp[zone];
    return [
      `Producción: ${kwh(y0)} – ${kwh(y1)} kWh por kWp al año en ${ZONES[zone]} con orientación sur, ajustada por orientación, inclinación y sombras. Fuente: ${E.solar.fuente}.${pending(E.solar)}`,
      `Autoconsumo directo: ${Math.round(E.solar.autoconsumo[profile][battery] * 100)} % de la producción. Fuente: ${E.solar.autoconsumo.fuente}.${pending(E.solar.autoconsumo)}`,
      `Electricidad que dejas de comprar: ${num(E.electricidad.precio, 2)} €/kWh.${pending(E.electricidad)}`,
      `Excedentes: ${num(E.excedentes.min, 2)} – ${num(E.excedentes.max, 2)} €/kWh (precio de compensación, nunca el de compra), con el límite legal de lo que compras a la red. Fuente: ${E.excedentes.fuente}.${pending(E.excedentes)}`,
      "No incluimos subidas futuras del precio de la energía ni degradación de los paneles.",
      `Precios orientativos actualizados en ${PRICES.actualizadoTexto}.`,
    ];
  }

  function calcA() {
    const fuel = $("a-fuel").value, zone = $("a-zone").value, emitter = $("a-emit").value;
    const boiler = fuel === "elec" ? "electrica" : $("a-boiler").value;
    $("a-boiler-f").hidden = fuel === "elec";
    const spend = +$("a-spend").value;
    const q = quoteAero({ fuel, spend, m2: +$("a-m2").value, zone, emitter, irpf: $("a-irpf").checked, insulation: $("a-ins").value, boiler });
    $("a-spend-v").textContent = eurx(spend); $("a-m2-v").textContent = $("a-m2").value + " m²";
    showRange("a", q);
    $("a-n1").textContent = eurx(spend); $("a-n2").textContent = eurRange(q.newCost[0], q.newCost[1]);
    $("a-b1").style.width = "100%"; $("a-b2").style.width = Math.min(100, (q.newCost[1] / spend) * 100).toFixed(1) + "%";
    $("a-kw").textContent = q.kw + " kW · SCOP " + num(q.scop[0]) + "–" + num(q.scop[1]);
    $("a-save").textContent = eurRange(q.save[0], q.save[1]);
    $("a-irpf-v").textContent = q.deduction ? eurx(q.deduction) : "No aplicada";
    $("a-ret").textContent = years(q.payback);
    const warn = [
      emitter === "keep" ? "Con radiadores convencionales la bomba trabaja a 50–55 °C y rinde menos. En la visita comprobamos si alguno hay que cambiarlo." : "",
      q.notWorth ? NOT_WORTH : "",
    ].filter(Boolean);
    $("a-warn").textContent = warn.join(" "); $("a-warn").hidden = !warn.length;
    q.hyp = aeroHyp(zone, emitter, fuel, boiler);
    list("a-hyp", q.hyp);
    q.notes = [
      `Bomba de calor recomendada: ${q.kw} kW.`,
      `Ahorro estimado frente a tu sistema actual: ${eurRange(q.save[0], q.save[1])} al año.`,
      q.deduction ? `Deducción IRPF estimada: ${eurx(q.deduction)}, si tu caso cumple los requisitos (certificado energético antes y después, obras hasta el 31-12-2026).` : "",
      ...warn,
    ].filter(Boolean);
    quotes.aero = q;
  }

  function calcS() {
    const roof = $("s-type").value, flat = roof === "plana", zone = $("s-zone").value, profile = $("s-profile").value, battery = +$("s-bat").value;
    $("s-orient-f").hidden = $("s-tilt-f").hidden = flat;
    const q = quoteSolar({ bill: +$("s-bill").value, zone, roof, orient: $("s-orient").value, tilt: +document.querySelector('input[name="s-tilt"]:checked').value, shade: $("s-shade").value, area: +$("s-area").value, battery, aero: $("s-aero").checked, ev: $("s-ev").checked, irpf: $("s-irpf").checked, profile });
    $("s-bill-v").textContent = eurx(+$("s-bill").value) + "/mes"; $("s-area-v").textContent = $("s-area").value + " m²";
    showRange("s", q);
    $("s-n1").textContent = eurx(q.annual); $("s-n2").textContent = eurRange(q.after[0], q.after[1]);
    $("s-b1").style.width = "100%"; $("s-b2").style.width = ((q.after[1] / q.annual) * 100).toFixed(1) + "%";
    $("s-kwp").textContent = num(q.kwp, 1) + " kWp · " + q.panels + " paneles";
    $("s-prod").textContent = `${kwh(q.prod[0])} – ${kwh(q.prod[1])} kWh`;
    $("s-save").textContent = eurRange(q.save[0], q.save[1]);
    $("s-irpf-v").textContent = q.deduction ? eurx(q.deduction) : "No aplicada";
    $("s-ret").textContent = years(q.payback);
    const warn = [
      q.asbestos ? "El fibrocemento suele contener amianto: hay que retirarlo con una empresa autorizada (RERA) antes de instalar. La retirada no está incluida." : "",
      !flat && q.factor < 0.7 ? "Con esta orientación los paneles producen bastante menos. A veces compensa más una estructura en otra zona de la parcela; lo vemos en la visita." : "",
      q.limitedByRoof ? `Tu tejado no da para cubrir todo tu consumo: hemos ajustado la instalación a los ${q.panels} paneles que caben.` : "",
      q.notWorth ? NOT_WORTH : "",
    ].filter(Boolean);
    $("s-warn").textContent = warn.join(" "); $("s-warn").hidden = !warn.length;
    q.hyp = solarHyp(zone, battery, profile);
    list("s-hyp", q.hyp);
    q.notes = [
      `Producción estimada: ${kwh(q.prod[0])} – ${kwh(q.prod[1])} kWh al año (${Math.round(q.factor * 100)} % de un tejado ideal orientado al sur).`,
      `Ahorro estimado: ${eurRange(q.save[0], q.save[1])} al año.`,
      q.deduction ? `Deducción IRPF estimada: ${eurx(q.deduction)}, si tu caso cumple los requisitos.` : "",
      ...warn,
    ].filter(Boolean);
    quotes.solar = q;
  }

  function calcR() {
    const type = $("r-type").value, m2 = +$("r-m2").value;
    const maxN = type === "kit" ? 2 : 5; $("r-n").max = maxN; if (+$("r-n").value > maxN) $("r-n").value = maxN;
    const units = +$("r-n").value;
    const unitM2 = type === "int" || type === "design";
    $("r-m2-f").hidden = !unitM2; $("r-n-f").hidden = $("r-size-f").hidden = unitM2;
    $("r-m2-v").textContent = m2 + " m²"; $("r-n-v").textContent = units + (units > 1 ? " unidades" : " unidad");
    $("r-floor").disabled = type !== "int"; $("r-proj").disabled = $("r-dom").disabled = type === "design";
    const q = quoteReforma({ type, level: +document.querySelector('input[name="r-q"]:checked').value, m2, units, size: document.querySelector('input[name="r-size"]:checked').value, floor: $("r-floor").checked, domotics: $("r-dom").checked, project: $("r-proj").checked });
    showRange("r", q); $("r-range").textContent = "Referencia de mercado, IVA incluido";
    $("r-m2p-l").textContent = unitM2 ? "Precio por m²" : type === "kit" ? "Precio por cocina" : "Precio por baño";
    $("r-m2p").textContent = unitM2 ? eurRange(q.perM2[0], q.perM2[1]) : eurRange(q.lo / units, q.hi / units);
    $("r-time").textContent = q.weeks[0] + "–" + q.weeks[1] + " semanas";
    $("r-pay").textContent = type === "design" ? "50 % · 50 %" : q.payments;
    q.hyp = [`Rangos de referencia del mercado de Madrid y Toledo actualizados en ${PRICES.actualizadoTexto}.`];
    q.notes = [
      "Rango de referencia del mercado. El precio de tu reforma se da bajo proyecto, después de ver la vivienda.",
      `Plazo estimado: ${q.weeks[0]}–${q.weeks[1]} semanas, que se concreta en el calendario de la propuesta.`,
      "No incluye mobiliario suelto ni electrodomésticos salvo que se indique.",
    ];
    quotes.ref = q;
  }

  function calcO() {
    const m2 = +$("o-m2").value, level = +document.querySelector('input[name="o-q"]:checked').value;
    $("o-m2-v").textContent = m2 + " m²";
    const q = quoteObra({ m2, level, zone: $("o-zone").value, energy: $("o-energy").checked, soft: $("o-soft").checked, pool: $("o-pool").checked });
    showRange("o", q); $("o-range").textContent = "Referencia de mercado, IVA incluido";
    $("o-m2p").textContent = eurRange(q.perM2[0], q.perM2[1]);
    $("o-time").textContent = q.months[0] + "–" + q.months[1] + " meses";
    q.hyp = [
      `Construcción llave en mano: ${PRICES.obra.perM2[level].map((v) => eurx(v)).join(" – ")} por m² construido según calidades (${PRICES.levels[level].toLowerCase()}), punto medio ±10 %.`,
      `Proyecto, dirección facultativa, licencia e ICIO: ${Math.round(PRICES.obra.soft * 100)} % de la construcción.`,
      "Vivienda de nueva construcción: IVA del 10 % incluido.",
      `Rangos de referencia del mercado de Madrid y Toledo actualizados en ${PRICES.actualizadoTexto}.`,
    ];
    list("o-hyp", q.hyp);
    q.notes = [
      "Referencia de mercado. En obra nueva el precio se da bajo proyecto.",
      `Plazo estimado de obra: ${q.months[0]}–${q.months[1]} meses desde la licencia.`,
      "No incluye el terreno, las acometidas ni la urbanización exterior.",
    ];
    quotes.obra = q;
  }

  const CALC = { aero: calcA, solar: calcS, ref: calcR, obra: calcO };
  const bind = (k, ids, radios = []) => {
    if (!$("p-" + k)) return;
    ids.forEach((id) => $(id).addEventListener("input", () => { markUsed(k); CALC[k](); }));
    radios.forEach((n) => document.querySelectorAll(`input[name="${n}"]`).forEach((r) => r.addEventListener("input", () => { markUsed(k); CALC[k](); })));
    CALC[k]();
  };
  bind("aero", ["a-fuel", "a-boiler", "a-spend", "a-m2", "a-ins", "a-emit", "a-zone", "a-irpf"]);
  bind("solar", ["s-bill", "s-zone", "s-profile", "s-type", "s-orient", "s-shade", "s-area", "s-bat", "s-aero", "s-ev", "s-irpf"], ["s-tilt"]);
  bind("ref", ["r-type", "r-m2", "r-n", "r-floor", "r-dom", "r-proj"], ["r-q", "r-size"]);
  bind("obra", ["o-m2", "o-zone", "o-energy", "o-soft", "o-pool"], ["o-q"]);
  root.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", () => { if (d.open) track("calc_hypotheses_opened", { calculadora: d.closest(".calc-grid").id.slice(2) }); }));

  // Presupuesto orientativo
  const dlg = $("quote");
  let current = null;
  const quoteRef = () => { const d = new Date(), p = (n) => String(n).padStart(2, "0"); return "AV-" + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(); };
  const quoteText = (q) => `Presupuesto orientativo ${q.ref} · ${q.title}\n${q.lines.map((l) => `· ${l.label}: ${eurRange(l.lo, l.hi)}`).join("\n")}\nTotal orientativo: ${eurRange(q.lo, q.hi)} (IVA incluido)`;
  function openQuote(k) {
    CALC[k](); const q = quotes[k]; q.ref = quoteRef(); current = q;
    const d = new Date();
    $("q-meta").textContent = "Ref. " + q.ref + " · " + d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    $("q-title").textContent = q.title; $("q-from").textContent = eurx(q.lo); $("q-to").textContent = "a " + eurx(q.hi) + " · IVA incluido";
    $("q-lines").replaceChildren(...q.lines.map((l) => { const tr = document.createElement("tr"); [l.label, eurx(l.lo), eurx(l.hi)].forEach((t) => { const td = document.createElement("td"); td.textContent = t; tr.append(td); }); return tr; }));
    $("q-lo").textContent = eurx(q.lo); $("q-hi").textContent = eurx(q.hi);
    list("q-notes", [...q.notes, "Hipótesis usadas:", ...q.hyp]);
    $("q-legal").textContent = k === "ref" || k === "obra"
      ? `Estimación orientativa con rangos de referencia del mercado de Madrid y Toledo, actualizados en ${PRICES.actualizadoTexto}, IVA incluido. No es un presupuesto: en reformas y obra nueva el precio se da bajo proyecto. Validez de la estimación: 30 días.`
      : `Presupuesto orientativo generado a partir de tus datos y de precios actualizados en ${PRICES.actualizadoTexto}, IVA incluido. No es vinculante: el precio definitivo se fija en la propuesta escrita tras la visita. Validez de la estimación: 30 días.`;
    $("q-company").textContent = "Aerovantia · Eufórico Equilibrio S.L. · NIF B45917622 · Olías del Rey (Toledo) · 689 042 717 · info@aerovantia.es";
    $("q-err").hidden = true;
    dlg.showModal();
    track("calc_result_viewed", { calculadora: k });
  }
  root.querySelectorAll("[data-quote]").forEach((b) => b.addEventListener("click", () => openQuote(b.dataset.quote)));
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });

  // Nombre y teléfono antes de descargar o enviar el presupuesto. El resultado en pantalla no lo pide.
  function leadOk() {
    const name = $("q-name").value.trim(), phone = $("q-phone").value.replace(/\s/g, ""), err = $("q-err");
    const fail = (m) => { err.textContent = m; err.hidden = false; return false; };
    if (!name) return fail("Indica tu nombre.");
    if (!/^(\+34)?[6789]\d{8}$/.test(phone)) return fail("Revisa el teléfono: 9 cifras, empezando por 6, 7, 8 o 9.");
    if (!$("q-rgpd").checked) return fail("Necesitamos tu consentimiento para preparar el presupuesto a tu nombre.");
    err.hidden = true;
    if (!current.leadSent) {
      current.leadSent = true;
      track("calc_lead", { calculadora: current.kind });
      sendLead({ name, phone, calc: { tipo: current.title, resumen: current.ref + " · " + current.summary } });
    }
    return true;
  }
  let pageTitle = document.title;
  $("q-pdf").addEventListener("click", () => {
    if (!leadOk()) return;
    pageTitle = document.title; document.title = "Presupuesto Aerovantia " + current.ref;
    document.documentElement.classList.add("printing-quote"); print();
  });
  addEventListener("afterprint", () => { document.documentElement.classList.remove("printing-quote"); document.title = pageTitle; });
  $("q-wa").addEventListener("click", (e) => {
    e.preventDefault();
    if (!leadOk()) return;
    track("whatsapp_click", { origen: "presupuesto" });
    window.open("https://wa.me/34689042717?text=" + encodeURIComponent("Hola, soy " + $("q-name").value.trim() + ". He calculado mi presupuesto en la web y quiero una visita.\n\n" + quoteText(current)), "_blank", "noopener");
  });

  // El cálculo viaja al formulario de contacto (en esta página o en la portada).
  const share = (k, q) => {
    try { sessionStorage.setItem("aerovantia_calc", JSON.stringify({ k, tipo: q.title, resumen: (q.ref ? q.ref + " · " : "") + q.summary })); } catch (_) {}
    window.dispatchEvent(new Event("aerovantia:calc"));
  };
  root.querySelectorAll("[data-from]").forEach((a) => a.addEventListener("click", () => { const k = a.dataset.from; CALC[k](); share(k, quotes[k]); }));
  $("q-book").addEventListener("click", () => { share(current.kind, current); dlg.close(); });

  function sendLead(data) {
    const url = import.meta.env.PUBLIC_LEAD_WEBHOOK_URL || "";
    if (!url) return;
    const utm = Object.fromEntries([...new URLSearchParams(location.search)].filter(([k]) => k.startsWith("utm_")));
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, origen: "calculadora", utm, page: location.href, ts: new Date().toISOString() }) }).catch(() => {});
  }
})();
