// Paseo de la portada: el scroll decide el fotograma de cada clip, nunca se reproduce solo.
//
// `w` es la posición en el paseo: 0 en la primera parada, 1 en la segunda, 2.5 a medio camino entre
// la tercera y la cuarta. El clip i va de la imagen de la parada i a la de la i + 1, así que su
// último fotograma es idéntico a la imagen de la parada siguiente y no se nota el paso.

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const fmt = (n, d = 1) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Interpola por tramos: keys es una lista de [x, y] ordenada por x. */
function piecewise(x, keys) {
  if (x <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [x0, y0] = keys[i - 1];
    const [x1, y1] = keys[i];
    if (x <= x1) return y0 + (y1 - y0) * ((x - x0) / (x1 - x0 || 1));
  }
  return keys.at(-1)[1];
}

export function initWorld(world, { reduceMotion, onScroll }) {
  const stage = world.querySelector("[data-stage]");
  const stops = [...world.querySelectorAll("[data-stop]")];
  const frames = [...stage.querySelectorAll("[data-frame]")];
  const clips = [...stage.querySelectorAll("[data-clip]")];
  const links = [...stage.querySelectorAll("[data-goto]")];
  const fill = stage.querySelector("[data-rail-fill]");
  const hint = stage.querySelector("[data-hint]");
  const solarEl = stage.querySelector("[data-live-solar]");
  const extEl = stage.querySelector("[data-live-ext]");
  const focus = stops.map((s) => Number(s.dataset.focus ?? 50));
  const live = JSON.parse(world.dataset.live ?? "[]");
  const last = stops.length - 1;
  const ready = clips.map(() => false);

  let marks = [];
  let end = 0;
  let w = 0;
  let active = 0;
  let shown = -1;
  let time = 0;
  let current = -1;

  // Cada parada llega cuando su bloque toca el borde superior; el paseo acaba al final de la sección.
  const measure = () => {
    marks = stops.map((s) => s.getBoundingClientRect().top + scrollY);
    const r = world.getBoundingClientRect();
    end = r.top + scrollY + r.height - innerHeight;
  };

  const setCurrent = (i) => {
    if (i === current) return;
    current = i;
    stops.forEach((s, j) => s.classList.toggle("is-current", j === i));
    links.forEach((a, j) => a.setAttribute("aria-current", String(j === i)));
  };

  const show = () => {
    if (shown !== active) {
      shown = active;
      clips.forEach((c, i) => c.classList.toggle("is-shown", i === active));
    }
    stage.dataset.mode = "video";
  };

  // Lleva el clip activo a su fotograma; mientras no ha cargado se ven las imágenes de debajo.
  const sync = () => {
    const clip = clips[active];
    if (!clip || !ready[active] || w >= clips.length) {
      delete stage.dataset.mode;
      return;
    }
    if (clip.seeking) return;
    if (Math.abs(clip.currentTime - time) > 0.01) clip.currentTime = time;
    else show();
  };
  clips.forEach((clip, i) =>
    clip.addEventListener("seeked", () => {
      if (i === active) {
        show();
        sync();
      }
    }),
  );

  const render = () => {
    const y = scrollY;
    w = piecewise(y, [...marks.map((m, i) => [m, i]), [end, stops.length]]);
    const at = Math.min(w, last);
    setCurrent(Math.round(at));
    stage.style.setProperty("--focus-x", `${piecewise(y, marks.map((m, i) => [m, focus[i]]))}%`);
    if (fill) fill.style.transform = `scaleY(${at / last})`;
    if (hint) hint.style.opacity = String(clamp01(1 - w * 4));
    if (live.length && solarEl && extEl) {
      const keys = (k) => live.map((v, i) => [i, v[k]]);
      solarEl.textContent = `${fmt(piecewise(at, keys("solar")))} kW`;
      extEl.textContent = `${Math.round(piecewise(at, keys("ext")))} °C`;
    }
    // Cada imagen aparece en la segunda mitad del tramo anterior y está entera justo en su parada,
    // donde empieza su clip, para que el vídeo entre encima sin salto.
    frames.forEach((f, i) => {
      f.style.opacity = String(i === 0 ? 1 : clamp01((w - i + 0.5) / 0.5));
      if (!reduceMotion) f.style.transform = `scale(${1 + 0.05 * clamp01(w - i)})`;
    });
    if (!clips.length) return;
    active = Math.min(clips.length - 1, Math.floor(w));
    const d = clips[active].duration;
    if (ready[active] && d) time = Math.min((w - active) * d, d - 0.05);
    sync();
  };

  measure();
  render();
  onScroll(render);
  addEventListener("resize", () => {
    measure();
    render();
  });
  links.forEach((a, i) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.lenis ? window.lenis.scrollTo(marks[i] + 1) : scrollTo({ top: marks[i] + 1, behavior: "smooth" });
    }),
  );

  // Con movimiento reducido o ahorro de datos se quedan las imágenes.
  const saveData = navigator.connection?.saveData;
  if (!clips.length || reduceMotion || saveData) return;

  // Carga de uno en uno: el clip del tramo actual y después el más cercano, primero el que viene delante.
  const distance = (i) => (i === active ? -1 : i > w ? i - w : w - (i + 1) + 0.5);
  const queue = clips.map((_, i) => i);
  // H.264 (MP4) para Safari, Chrome y Edge; VP9 (WebM) para los navegadores que no traen H.264.
  const probe = document.createElement("video");
  const useMp4 = probe.canPlayType('video/mp4; codecs="avc1.640028"') !== "";
  const sourceOf = (clip) => (useMp4 ? clip.dataset.src : clip.dataset.src.replace(/\.mp4$/, ".webm"));
  const loadNext = async () => {
    queue.sort((a, b) => distance(a) - distance(b));
    const i = queue.shift();
    if (i === undefined) return;
    const clip = clips[i];
    const src = sourceOf(clip);
    // El clip entero en memoria: así el scrub no espera a la red.
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(String(res.status));
      clip.src = URL.createObjectURL(await res.blob());
    } catch {
      clip.src = src;
    }
    clip.preload = "auto";
    const ok = await new Promise((resolve) => {
      clip.addEventListener("loadeddata", () => resolve(true), { once: true });
      clip.addEventListener("error", () => resolve(false), { once: true });
    });
    if (ok) {
      // Safari no pinta fotogramas buscados hasta que el vídeo se ha reproducido una vez.
      await clip.play().catch(() => {});
      clip.pause();
      ready[i] = true;
      render();
    }
    loadNext();
  };
  if (document.readyState === "complete") loadNext();
  else addEventListener("load", loadNext, { once: true });
}
