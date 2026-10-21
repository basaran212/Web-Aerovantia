// Paradas del paseo de la portada. Cada parada tiene un clip que va de su imagen a la de la siguiente;
// la última se queda en su imagen. `focus` es la parte horizontal que queda a la vista en móvil (0–100).
// Las imágenes son el primer fotograma de cada clip (y la última, el final del quinto), sacadas del propio
// vídeo para que el paso de la imagen al clip no se note.
import poster1 from "../assets/paseo/poster-1.jpg";
import poster2 from "../assets/paseo/poster-2.jpg";
import poster3 from "../assets/paseo/poster-3.jpg";
import poster4 from "../assets/paseo/poster-4.jpg";
import poster5 from "../assets/paseo/poster-5.jpg";
import poster6 from "../assets/paseo/poster-6.jpg";

export const stops = [
  { id: "casa", alt: "Recreación ilustrativa con IA: chalet de fachada de madera al anochecer en invierno", label: "Tu casa", poster: poster1, clip: "/video/paseo-1.mp4", focus: 55, solar: 0.3, ext: 9 },
  { id: "energia", alt: "Recreación ilustrativa con IA: cubierta de un chalet con placas solares a mediodía junto a la piscina", label: "Placas solares", poster: poster2, clip: "/video/paseo-2.mp4", focus: 55, solar: 5.4, ext: 24 },
  { id: "aerotermia", alt: "Recreación ilustrativa con IA: unidad exterior de aerotermia junto a la fachada de un chalet", label: "Aerotermia", poster: poster3, clip: "/video/paseo-3.mp4", focus: 50, solar: 4.6, ext: 22 },
  { id: "reforma", alt: "Recreación ilustrativa con IA: cocina con isla de mármol, roble y lámparas de latón", label: "Reforma", poster: poster4, clip: "/video/paseo-4.mp4", focus: 50, solar: 3.1, ext: 20 },
  { id: "interiorismo", alt: "Recreación ilustrativa con IA: salón con sofá de lino y luz cálida de tarde", label: "Interiorismo", poster: poster5, clip: "/video/paseo-5.mp4", focus: 45, solar: 1.2, ext: 16 },
  { id: "noche", alt: "Recreación ilustrativa con IA: el chalet iluminado por la noche", label: "Por la noche", poster: poster6, clip: null, focus: 55, solar: 0, ext: 11 },
] as const;
