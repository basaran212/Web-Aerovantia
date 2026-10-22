// Configurador: presenta las preguntas de cada calculadora paso a paso, con barra de progreso y
// opciones como botones. Es solo una capa de presentación: los campos, sus id y calc.js son los mismos,
// así que los resultados no cambian. "Ver todas las preguntas" vuelve al formulario completo.
// Sin JavaScript se ve el formulario completo.
import { track } from "./track.js";

document.querySelectorAll("[data-calcs] .calc-grid").forEach((grid) => {
  const form = grid.querySelector("form.fields");
  const items = [...form.querySelectorAll(":scope > [data-step]")];
  if (!items.length) return;
  const kind = grid.id.replace(/^p-/, "");
  const steps = [...new Set(items.map((el) => +el.dataset.step))].sort((a, b) => a - b);
  const titleOf = (n) => items.find((el) => +el.dataset.step === n && el.dataset.stepTitle)?.dataset.stepTitle ?? "";
  const result = grid.querySelector(".result");
  let index = 0;

  // Barra superior: progreso, paso actual y cambio de modo.
  const bar = document.createElement("div");
  bar.className = "cfg-bar";
  bar.innerHTML = `<div class="cfg-progress" role="progressbar" aria-valuemin="1" aria-valuemax="${steps.length}" aria-label="Progreso"><i></i></div><span class="cfg-count" aria-live="polite"></span><button class="cfg-mode" type="button"></button>`;
  form.prepend(bar);
  const progress = bar.querySelector(".cfg-progress");
  const count = bar.querySelector(".cfg-count");
  const mode = bar.querySelector(".cfg-mode");

  // Botones Atrás / Siguiente.
  const nav = document.createElement("div");
  nav.className = "cfg-nav";
  nav.innerHTML = `<button class="btn btn-ghost" type="button" data-cfg="back">Atrás</button><button class="btn btn-primary" type="button" data-cfg="next">Siguiente</button>`;
  form.append(nav);
  const back = nav.querySelector('[data-cfg="back"]');
  const next = nav.querySelector('[data-cfg="next"]');

  // Desplegables cortos como botones: el select sigue siendo el que manda.
  form.querySelectorAll(":scope > .field").forEach((field) => {
    const select = field.querySelector(":scope > select");
    if (!select || select.options.length > 9) return;
    const chips = document.createElement("div");
    chips.className = "chips";
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", field.querySelector("label")?.textContent ?? "");
    [...select.options].forEach((opt) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = opt.textContent;
      b.dataset.value = opt.value;
      b.addEventListener("click", () => {
        select.value = opt.value;
        select.dispatchEvent(new Event("input", { bubbles: true }));
        select.dispatchEvent(new Event("change", { bubbles: true }));
        sync();
      });
      chips.append(b);
    });
    const sync = () => chips.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === select.value)));
    select.addEventListener("input", sync);
    select.addEventListener("change", sync);
    sync();
    select.after(chips);
    field.classList.add("has-chips");
  });

  // Un paso cuenta si tiene alguna pregunta visible (calc.js oculta las que no aplican).
  const visible = (n) => items.some((el) => +el.dataset.step === n && !el.hidden);
  const show = (focus) => {
    const n = steps[index];
    items.forEach((el) => el.classList.toggle("is-step", +el.dataset.step === n));
    const pos = steps.filter((s) => visible(s)).indexOf(n) + 1;
    const total = steps.filter((s) => visible(s)).length;
    progress.querySelector("i").style.width = `${(pos / total) * 100}%`;
    progress.setAttribute("aria-valuenow", String(pos));
    progress.setAttribute("aria-valuemax", String(total));
    count.textContent = `Paso ${pos} de ${total} · ${titleOf(n)}`;
    back.disabled = index === 0;
    next.textContent = index === steps.length - 1 ? "Ver resultado" : "Siguiente";
    if (focus) items.find((el) => el.classList.contains("is-step") && !el.hidden)?.querySelector("button, input, select")?.focus({ preventScroll: true });
  };
  const go = (dir) => {
    let i = index + dir;
    while (i > 0 && i < steps.length - 1 && !visible(steps[i])) i += dir;
    index = Math.max(0, Math.min(steps.length - 1, i));
    show(true);
  };
  back.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => {
    if (index === steps.length - 1) {
      track("calc_result_viewed", { calculadora: kind, modo: "pasos" });
      result.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      result.querySelector(".big")?.setAttribute("tabindex", "-1");
      result.querySelector(".big")?.focus({ preventScroll: true });
      return;
    }
    go(1);
  });

  // Paso a paso o todas las preguntas a la vez.
  const setMode = (stepped) => {
    grid.classList.toggle("cfg-on", stepped);
    grid.classList.toggle("cfg-off", !stepped);
    mode.textContent = stepped ? "Ver todas las preguntas" : "Paso a paso";
    progress.hidden = count.hidden = nav.hidden = !stepped;
    if (stepped) show(false);
  };
  mode.addEventListener("click", () => setMode(!grid.classList.contains("cfg-on")));
  setMode(true);
});
