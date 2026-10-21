// Movimiento de toda la web: scroll suave, entradas al hacer scroll, lema palabra a palabra,
// comparador antes/después y el paseo de la portada.
import Lenis from "lenis";

import { initWorld } from "./world.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Un solo bucle por fotograma reparte la posición de scroll a quien la necesite.
const listeners = new Set();
const onScroll = (fn) => listeners.add(fn);
let queued = false;
const tick = () => {
  queued = false;
  listeners.forEach((fn) => fn());
};
const schedule = () => {
  if (!queued) {
    queued = true;
    requestAnimationFrame(tick);
  }
};

if (!reduceMotion) {
  const lenis = new Lenis({ anchors: true, lerp: 0.1 });
  lenis.on("scroll", schedule);
  const raf = (t) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  window.lenis = lenis;
} else {
  addEventListener("scroll", schedule, { passive: true });
}

// Entradas: solo lo que está por debajo de la pantalla al cargar, con IntersectionObserver.
if (!reduceMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.remove("pre");
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -10% 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) {
      el.classList.add("pre");
      io.observe(el);
    }
  });
}

// Lema: cada palabra pasa de apagada a encendida al cruzar la línea de lectura, en orden.
document.querySelectorAll("[data-words]").forEach((block) => {
  const words = [...block.querySelectorAll("[data-word]")];
  if (reduceMotion) return words.forEach((w) => w.classList.add("is-lit"));
  const update = () => {
    const r = block.getBoundingClientRect();
    const progress = (innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.35);
    const lit = Math.round(Math.max(0, Math.min(1, progress)) * words.length);
    words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
  };
  onScroll(update);
  update();
});

// Antes y después: el deslizador mueve el corte entre las dos fotos.
document.querySelectorAll("[data-ba]").forEach((ba) => {
  const input = ba.querySelector("input");
  const set = () => ba.style.setProperty("--split", `${input.value}%`);
  input.addEventListener("input", set);
  set();
});

const world = document.querySelector("[data-world]");
if (world) initWorld(world, { reduceMotion, onScroll });
