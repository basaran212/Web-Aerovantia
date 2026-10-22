// Portfolio. Tres tipos que nunca se mezclan:
// - "ejecutada": obra real terminada, con fotos reales y permiso del cliente.
// - "desarrollo": proyecto real en curso.
// - "conceptual": visualización generada con IA para explicar una idea. Nunca se presenta como obra.
// Para añadir una obra real: una entrada con type "ejecutada", fotos reales en src/assets/proyectos/
// y la ficha (municipio, equipos, superficie, ahorro medido si el cliente lo autoriza).
import type { ImageMetadata } from "astro";

import bath from "../assets/img/bath.jpg";
import exteriorDusk from "../assets/img/exterior-dusk.jpg";
import exteriorNight from "../assets/img/exterior-night.jpg";
import exteriorNoon from "../assets/img/exterior-noon.jpg";
import heatpump from "../assets/img/heatpump.jpg";
import kitchenBefore from "../assets/img/kitchen-before.jpg";
import kitchen from "../assets/img/kitchen.jpg";
import living from "../assets/img/living.jpg";
import solarRoof from "../assets/img/solar-roof.jpg";

export type ProjectType = "ejecutada" | "desarrollo" | "conceptual";

export const projectTypes: { k: ProjectType; label: string; plural: string; empty: string }[] = [
  { k: "ejecutada", label: "Obra ejecutada", plural: "Obras ejecutadas", empty: "Todavía no hay obras terminadas publicadas. Las primeras llegarán con el programa Primeros clientes, con fotos reales y permiso de cada cliente." },
  { k: "desarrollo", label: "Proyecto en desarrollo", plural: "Proyectos en desarrollo", empty: "Cuando haya proyectos en marcha que los clientes autoricen a mostrar, aparecerán aquí." },
  { k: "conceptual", label: "Visualización conceptual", plural: "Visualizaciones conceptuales", empty: "" },
];

export interface Project {
  slug: string;
  type: ProjectType;
  title: string;
  summary: string;
  cover: ImageMetadata;
  coverAlt: string;
  images: { img: ImageMetadata; alt: string }[];
  spec: { k: string; v: string }[];
  body: string[];
  links: { href: string; label: string }[];
}

export const projects: Project[] = [
  {
    slug: "casa-energia-integrada",
    type: "conceptual",
    title: "Una casa con la energía integrada",
    summary: "Chalet con aerotermia, placas solares, batería y recarga del coche, pensado como un único sistema.",
    cover: exteriorDusk,
    coverAlt: "Visualización conceptual con IA: chalet de fachada de madera al atardecer",
    images: [
      { img: exteriorNoon, alt: "Visualización conceptual con IA: el chalet a mediodía con placas solares en la cubierta" },
      { img: solarRoof, alt: "Visualización conceptual con IA: vista aérea de la cubierta con placas solares y piscina" },
      { img: heatpump, alt: "Visualización conceptual con IA: unidad exterior de aerotermia junto a la fachada" },
      { img: exteriorNight, alt: "Visualización conceptual con IA: el chalet de noche con el coche eléctrico cargando" },
    ],
    spec: [
      { k: "Tipo", v: "Visualización conceptual" },
      { k: "Sistemas", v: "Aerotermia, suelo radiante, placas solares, batería y cargador de coche eléctrico" },
      { k: "Idea", v: "Que la casa produzca parte de la energía que consume para calentar, enfriar y moverse" },
    ],
    body: [
      "Es la casa del paseo de la portada. La usamos para explicar cómo encajan las piezas: las placas producen a mediodía, la batería guarda el sobrante para la tarde, la aerotermia calienta el agua en horas de sol y el coche carga cuando sobra energía.",
      "No es una obra realizada. Las imágenes están generadas con inteligencia artificial y sirven para ilustrar el tipo de vivienda y de instalación que proyectamos.",
    ],
    links: [
      { href: "/aerotermia-y-placas-solares/", label: "Aerotermia y placas solares juntas" },
      { href: "/calculadoras/placas-solares/", label: "Calculadora de placas solares" },
    ],
  },
  {
    slug: "cocina-piedra-roble",
    type: "conceptual",
    title: "Cocina de piedra y roble",
    summary: "Una cocina de los noventa transformada en un espacio abierto, con suelo radiante bajo la madera.",
    cover: kitchen,
    coverAlt: "Visualización conceptual con IA: cocina con isla de mármol, roble y lámparas de latón",
    images: [
      { img: kitchenBefore, alt: "Visualización conceptual con IA: cocina de los años noventa antes de reformar" },
      { img: kitchen, alt: "Visualización conceptual con IA: la cocina reformada con isla de mármol y roble" },
    ],
    spec: [
      { k: "Tipo", v: "Visualización conceptual" },
      { k: "Materiales", v: "Mármol, roble natural y latón cepillado" },
      { k: "Energía", v: "Suelo radiante con aerotermia bajo el pavimento de madera" },
    ],
    body: [
      "Recreación del tipo de transformación que proyectamos en una reforma de cocina: abrir el espacio, ganar luz y aprovechar la obra para quitar radiadores y poner suelo radiante.",
      "No es una obra realizada. Las imágenes están generadas con inteligencia artificial.",
    ],
    links: [
      { href: "/reformas/", label: "Reformas con energía integrada" },
      { href: "/calculadoras/reformas/", label: "Calculadora de reformas" },
    ],
  },
  {
    slug: "salon-y-bano-materiales-nobles",
    type: "conceptual",
    title: "Salón y baño con materiales nobles",
    summary: "Interiorismo con lino, travertino y luz cálida, con la climatización escondida.",
    cover: living,
    coverAlt: "Visualización conceptual con IA: salón con sofá de lino y mesa de travertino",
    images: [
      { img: living, alt: "Visualización conceptual con IA: salón con sofá de lino y luz cálida de tarde" },
      { img: bath, alt: "Visualización conceptual con IA: baño de travertino con ducha a ras de suelo" },
    ],
    spec: [
      { k: "Tipo", v: "Visualización conceptual" },
      { k: "Materiales", v: "Travertino, roble, lino y latón" },
      { k: "Confort", v: "Suelo radiante y climatización sin aparatos a la vista" },
    ],
    body: [
      "Una propuesta de interiorismo en la que la técnica no se ve: sin radiadores, con la iluminación integrada y los materiales elegidos sobre muestras reales.",
      "No es una obra realizada. Las imágenes están generadas con inteligencia artificial.",
    ],
    links: [
      { href: "/interiorismo/", label: "Interiorismo" },
      { href: "/reformas/", label: "Reformas" },
    ],
  },
];

export const projectHref = (p: Project) => `/proyectos/${p.slug}/`;
