// Paradas del paseo de la portada. Cada parada tiene un clip que va de su imagen a la de la siguiente;
// la última se queda en su imagen. `focus` es la parte horizontal que queda a la vista en móvil (0–100).
import exteriorDusk from "../assets/img/exterior-dusk.jpg";
import exteriorNight from "../assets/img/exterior-night.jpg";
import exteriorNoon from "../assets/img/exterior-noon.jpg";
import heatpump from "../assets/img/heatpump.jpg";
import kitchen from "../assets/img/kitchen.jpg";
import living from "../assets/img/living.jpg";

export const stops = [
  { id: "casa", label: "Tu casa", poster: exteriorDusk, clip: "/video/paseo-1.mp4", focus: 55, solar: 0.3, ext: 9 },
  { id: "energia", label: "Placas solares", poster: exteriorNoon, clip: "/video/paseo-2.mp4", focus: 55, solar: 5.4, ext: 24 },
  { id: "aerotermia", label: "Aerotermia", poster: heatpump, clip: "/video/paseo-3.mp4", focus: 50, solar: 4.6, ext: 22 },
  { id: "reforma", label: "Reforma", poster: kitchen, clip: "/video/paseo-4.mp4", focus: 50, solar: 3.1, ext: 20 },
  { id: "interiorismo", label: "Interiorismo", poster: living, clip: "/video/paseo-5.mp4", focus: 45, solar: 1.2, ext: 16 },
  { id: "noche", label: "Por la noche", poster: exteriorNight, clip: null, focus: 55, solar: 0, ext: 11 },
] as const;
