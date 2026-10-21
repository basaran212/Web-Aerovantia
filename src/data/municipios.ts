// Landings de municipio (fase 1). Cada una lleva contenido propio: vivienda típica, clima, ayudas
// municipales, trámite y preguntas frecuentes. Lo que no está verificado en la fuente primaria va como
// [PENDIENTE: ...] y bloquea el despliegue a producción.
import type { Faq } from "./faqs";

export interface Municipio {
  slug: string;
  name: string;
  province: "madrid" | "toledo";
  href: string;
  title: string;
  description: string;
  /** Coordenadas del núcleo urbano para simular en PVGIS. */
  lat: number;
  lon: number;
  intro: string;
  vivienda: string;
  clima: string;
  zonaCTE: string;
  ibi: string;
  tramite: string;
  enfoque: string;
  faqs: Faq[];
}

const P_ZONA = "[PENDIENTE: verificar zona climática y grados-día con la tabla a-Anejo B del DB-HE y la altitud del núcleo]";
const P_PVGIS = "[PENDIENTE: simular en PVGIS con las coordenadas del municipio]";
const P_SEDE = "[PENDIENTE: verificar trámite y enlace a la sede electrónica]";

const base = (m: Omit<Municipio, "href" | "title">): Municipio => ({
  ...m,
  href: `/zona/${m.province}/${m.slug}/`,
  title: `Aerotermia y placas solares en ${m.name === "Madrid" ? "Madrid capital" : m.name} | Aerovantia`,
});

export const PENDIENTES_MUNICIPIO = { zona: P_ZONA, pvgis: P_PVGIS, sede: P_SEDE };

export const municipios: Municipio[] = [
  base({
    slug: "madrid", name: "Madrid", province: "madrid", lat: 40.4168, lon: -3.7038,
    description: "Aerotermia y placas solares para chalets en Madrid capital: Mirasierra, Aravaca, El Plantío, Conde de Orgaz y otras colonias. Estudio gratuito.",
    intro: "En Madrid capital la vivienda unifamiliar se concentra en colonias y barrios como Mirasierra, Aravaca, El Plantío, Conde de Orgaz, Fuente del Berro o la Colonia del Viso. Son casas con décadas de antigüedad, muchas con caldera de gasóleo o de gas y radiadores de hierro.",
    vivienda: "Chalets y casas de colonia de los años 50 a 90, a menudo protegidos o en zonas con normas estéticas. La unidad exterior de la aerotermia y las placas deben encajar con la fachada y la cubierta, y a veces requieren consulta previa al ayuntamiento.",
    clima: "Inviernos fríos y secos con heladas y veranos calurosos. La bomba de calor se dimensiona para los días más fríos, y en verano el mismo equipo da frío por suelo radiante o fancoils.",
    zonaCTE: `D3 (Madrid capital, CTE DB-HE) ${P_ZONA}`,
    ibi: "La ordenanza fiscal del IBI de Madrid contempla una bonificación por instalar sistemas de aprovechamiento de la energía solar (hasta el 50 % de la cuota según la Ley de Haciendas Locales). [PENDIENTE: porcentaje, duración y requisitos vigentes en 2026 en la ordenanza de la Agencia Tributaria Madrid]",
    tramite: `Declaración responsable o licencia según el ámbito y la protección del edificio. ${P_SEDE}`,
    enfoque: "En casas de colonia, el cuello de botella suele ser la ubicación de la unidad exterior y del depósito de agua caliente. Lo resolvemos en la visita, antes de proponerte un equipo.",
    faqs: [
      { q: "¿Puedo poner aerotermia en una casa protegida de Madrid?", a: "En muchos casos sí, con condiciones sobre la ubicación de la unidad exterior. Revisamos la normativa de tu parcela antes de proponerte nada." },
      { q: "¿Se pueden poner placas en una colonia con normas estéticas?", a: "Normalmente sí, coplanares con la cubierta y sin sobresalir del faldón. Lo comprobamos con el planeamiento antes de presentar la propuesta." },
    ],
  }),
  base({
    slug: "boadilla-del-monte", name: "Boadilla del Monte", province: "madrid", lat: 40.405, lon: -3.8783,
    description: "Aerotermia y placas solares en Boadilla del Monte: chalets de Las Lomas, Valdecabañas o Montepríncipe. Ahorro estimado y bonificación del IBI revisada.",
    intro: "Boadilla del Monte tiene una de las mayores concentraciones de chalets de la Comunidad de Madrid, en urbanizaciones como Las Lomas, Valdecabañas, Montepríncipe, Parque Boadilla o Bonanza. Muchos tienen más de 250 m² y calefacción por gasóleo o gas con radiadores.",
    vivienda: "Chalets independientes grandes, de los años 80 y 90 en las urbanizaciones históricas y más recientes en los desarrollos nuevos. Parcelas amplias y tejados de teja con buena orientación en muchas calles.",
    clima: "Clima continental de la sierra baja: inviernos con heladas frecuentes y veranos calurosos. En casas grandes y con radiadores, la potencia de la bomba de calor y el aislamiento pesan mucho en el resultado.",
    zonaCTE: `D3 ${P_ZONA}`,
    ibi: "Las fuentes publicadas no coinciden: bonificación del IBI de entre el 40 y el 50 % durante 3 a 5 años por instalar placas solares. [PENDIENTE: verificar porcentaje, duración y requisitos en la ordenanza fiscal vigente de Boadilla del Monte]",
    tramite: `Comunicación previa para instalaciones en cubierta. ${P_SEDE}`,
    enfoque: "En chalets de más de 250 m² con radiadores, la clave es comprobar si los radiadores aguantan una temperatura de impulsión más baja. Si no, te proponemos cambiar solo los que hagan falta.",
    faqs: [
      { q: "¿Cuánta potencia necesita un chalet grande en Boadilla?", a: "Depende del aislamiento, pero en casas de 250–350 m² suele salir una bomba de calor de 14 a 16 kW, o dos equipos. Lo calculamos con tus facturas y la superficie real." },
      { q: "¿Compensa la batería en Boadilla?", a: "Si la casa está vacía durante el día o tienes coche eléctrico, suele mejorar mucho el autoconsumo. Si hay alguien en casa de día, a veces no compensa: lo calculamos." },
    ],
  }),
  base({
    slug: "pozuelo-de-alarcon", name: "Pozuelo de Alarcón", province: "madrid", lat: 40.4351, lon: -3.8137,
    description: "Aerotermia y placas solares en Pozuelo de Alarcón: chalets de Somosaguas, La Finca, Monteclaro y Húmera. Estudio gratuito y bonificación del IBI revisada.",
    intro: "Pozuelo de Alarcón combina urbanizaciones de chalets de alto nivel (Somosaguas, La Finca, Monteclaro, Húmera, Prado de Somosaguas) con adosados en el casco y en Pozuelo Estación. En las casas más recientes no es raro encontrar suelo radiante con caldera de gas.",
    vivienda: "Chalets grandes con piscina, muchos ya con suelo radiante de gas, y adosados de los años 90. Las casas con suelo radiante existente son las que mejor aprovechan la aerotermia: se cambia la caldera y se mantiene la instalación.",
    clima: "Inviernos fríos y veranos calurosos. En casas con piscina y climatización, el consumo eléctrico de verano hace que las placas trabajen a pleno rendimiento.",
    zonaCTE: `D3 ${P_ZONA}`,
    ibi: "Las fuentes coinciden en una bonificación del 50 % del IBI, pero no en la duración (3 o 5 años). [PENDIENTE: verificar en la ordenanza fiscal vigente de Pozuelo de Alarcón]",
    tramite: `Declaración responsable para placas en cubierta. ${P_SEDE}`,
    enfoque: "Si ya tienes suelo radiante con caldera de gas, el cambio a aerotermia es de los más sencillos: aprovechamos el circuito y revisamos que el reparto de caudales sea correcto.",
    faqs: [
      { q: "Tengo suelo radiante con caldera de gas, ¿qué cambia?", a: "Se sustituye la caldera por la bomba de calor y se mantiene el suelo radiante. Es el caso en el que la aerotermia rinde mejor, porque trabaja a baja temperatura." },
      { q: "¿Puedo calentar la piscina con aerotermia?", a: "Sí, con una bomba de calor para piscina o un intercambiador. Lo estudiamos aparte, porque cambia la potencia y el consumo." },
    ],
  }),
  base({
    slug: "las-rozas", name: "Las Rozas", province: "madrid", lat: 40.4929, lon: -3.8737,
    description: "Aerotermia y placas solares en Las Rozas: chalets y adosados de El Pinar, Molino de la Hoz, Monterrozas y Las Matas. Ahorro estimado con tu factura.",
    intro: "En Las Rozas hay chalets en El Pinar, Molino de la Hoz, Monterrozas o Punta Galea, y muchos adosados de los años 90 y 2000 en Las Matas, Európolis y el entorno de la A-6.",
    vivienda: "Adosados de dos y tres plantas con caldera de gas individual y radiadores de aluminio, y chalets independientes con gasóleo en las urbanizaciones más antiguas. En los adosados, el espacio para la unidad exterior suele ser el patio trasero.",
    clima: "Más fresco que Madrid capital por la altitud, con más horas de calefacción. Eso hace que el ahorro frente al gasóleo sea mayor, y que la bomba de calor deba dimensionarse con margen.",
    zonaCTE: `D3 ${P_ZONA}`,
    ibi: "Las fuentes indican una bonificación de entre el 25 y el 50 % del IBI durante 5 años. [PENDIENTE: verificar en la ordenanza fiscal vigente de Las Rozas]",
    tramite: `Comunicación previa para placas en cubierta. ${P_SEDE}`,
    enfoque: "En adosados con caldera de gas, la decisión depende mucho de los radiadores. Te enseñamos el cálculo con tus facturas para que veas si compensa ahora o al cambiar la caldera.",
    faqs: [
      { q: "¿La aerotermia hace ruido en un adosado?", a: "Los equipos actuales son silenciosos, pero la ubicación importa. Buscamos el sitio que menos moleste a ti y a tus vecinos, y respetamos los límites de ruido municipales." },
      { q: "¿Necesito permiso de la comunidad para poner placas en un adosado?", a: "Si la cubierta es privativa, normalmente no, aunque conviene revisar los estatutos. Si es común, sí. Lo comprobamos en la visita." },
    ],
  }),
  base({
    slug: "majadahonda", name: "Majadahonda", province: "madrid", lat: 40.4728, lon: -3.8722,
    description: "Aerotermia y placas solares en Majadahonda: chalets y adosados de El Plantío, Monte del Pilar y Roza Martín. Estudio gratuito y ayudas explicadas.",
    intro: "Majadahonda tiene chalets en el entorno de El Plantío y Monte del Pilar, y muchas viviendas adosadas y pareadas en Roza Martín, Los Satélites y el casco. Es frecuente la calefacción individual por gas natural.",
    vivienda: "Pareados y adosados de los años 80 a 2000 con caldera de gas y radiadores, y chalets independientes con más superficie. Cubiertas de teja a dos aguas: a menudo una cara mira al este y otra al oeste.",
    clima: "Inviernos fríos y veranos calurosos. Un tejado este-oeste produce algo menos que uno sur, pero reparte la producción entre la mañana y la tarde, que es cuando más se consume en casa.",
    zonaCTE: `D3 ${P_ZONA}`,
    ibi: "Las fuentes publicadas no coinciden: bonificación del 50 % del IBI durante 3 u 8 años. [PENDIENTE: verificar en la ordenanza fiscal vigente de Majadahonda]",
    tramite: `Comunicación previa para placas en cubierta. ${P_SEDE}`,
    enfoque: "Con un tejado a dos aguas este-oeste, calculamos las dos caras por separado y te enseñamos qué parte de la producción vas a usar en casa.",
    faqs: [
      { q: "Mi tejado es este-oeste, ¿merece la pena?", a: "Suele merecer la pena: produce en torno a un 15 % menos que un tejado sur, pero aprovechas más energía por la mañana y por la tarde." },
      { q: "¿Puedo cambiar la caldera de gas por aerotermia sin tocar los radiadores?", a: "A veces sí. Depende del tamaño de los radiadores y del aislamiento. En la visita medimos y te decimos si hace falta cambiar alguno." },
    ],
  }),
  base({
    slug: "villaviciosa-de-odon", name: "Villaviciosa de Odón", province: "madrid", lat: 40.3569, lon: -3.9002,
    description: "Aerotermia y placas solares en Villaviciosa de Odón: chalets de El Bosque, Campodón y Monte de la Villa. Ahorro estimado frente a gasóleo y propano.",
    intro: "Villaviciosa de Odón es un municipio de urbanizaciones de chalets como El Bosque, Campodón, Monte de la Villa o El Castillo, Donde no llega el gas natural, lo habitual es la caldera de gasóleo o de propano.",
    vivienda: "Chalets independientes en parcelas grandes, muchos de los años 70 a 90, con depósito de gasóleo o de propano. Son los casos en los que la aerotermia suele ahorrar más.",
    clima: "Inviernos fríos, con heladas, y veranos calurosos. Con gasóleo o propano y una casa grande, el gasto en calefacción suele ser alto, y el ahorro también.",
    zonaCTE: `D3 ${P_ZONA}`,
    ibi: "Una fuente publicada indica una bonificación del 30 % del IBI durante 5 años, pero es antigua. [PENDIENTE: verificar en la ordenanza fiscal vigente de Villaviciosa de Odón]",
    tramite: `Comunicación previa para placas en cubierta. ${P_SEDE}`,
    enfoque: "Al quitar el gasóleo o el propano, incluimos la retirada de la caldera y del depósito, y la gestión de los Certificados de Ahorro Energético (CAE) si tu caso cumple.",
    faqs: [
      { q: "¿Qué se hace con el depósito de gasóleo?", a: "Se vacía, se limpia y se retira, o se inertiza si está enterrado y no se puede sacar. Va incluido en la propuesta." },
      { q: "¿Cuánto se ahorra frente al propano?", a: "Frente a propano, el ahorro en climatización suele estar entre un 50 y un 75 %, según cómo se reparte el calor y el aislamiento. Lo calculamos con tus facturas." },
    ],
  }),
  base({
    slug: "getafe", name: "Getafe", province: "madrid", lat: 40.3083, lon: -3.7329,
    description: "Aerotermia y placas solares en Getafe: adosados y chalets de El Bercial, Los Molinos, Perales del Río y el Sector III. Estudio gratuito con tu factura.",
    intro: "Getafe es sobre todo vivienda en bloque, pero tiene zonas de adosados y chalets en El Bercial, Los Molinos, Perales del Río, el Sector III y Buenavista. Ahí está la mayoría de las casas en las que la aerotermia y las placas tienen sentido.",
    vivienda: "Adosados y pareados de los años 90 y 2000 con caldera de gas natural individual. En estas casas, el ahorro de la aerotermia frente al gas es más moderado, y las placas solares suelen ser el primer paso.",
    clima: "Más caluroso en verano que la sierra, con mucho uso del aire acondicionado. Eso favorece las placas: hay consumo justo cuando más producen.",
    zonaCTE: `D3 ${P_ZONA}`,
    ibi: "La bonificación más citada (30 % durante 10 años) se refiere, según una fuente, a instalaciones solares térmicas y no a fotovoltaicas. Otras fuentes hablan del 50 % durante 4 u 8 años. [PENDIENTE: verificar en la ordenanza fiscal vigente de Getafe]",
    tramite: `Comunicación previa para placas en cubierta. ${P_SEDE}`,
    enfoque: "Con gas natural y un adosado bien aislado, te decimos con números si la aerotermia compensa ya o si es mejor empezar por las placas y cambiar la caldera cuando toque.",
    faqs: [
      { q: "Tengo gas natural, ¿me compensa la aerotermia?", a: "Depende. Frente a gas natural el ahorro es menor que frente a gasóleo o propano. Si tu caldera es reciente y de condensación, a veces no compensa todavía: te lo decimos." },
      { q: "¿Las placas me bajan el aire acondicionado?", a: "Sí: el aire acondicionado consume justo en las horas de más sol, así que buena parte de ese consumo lo cubren las placas." },
    ],
  }),
  base({
    slug: "toledo", name: "Toledo", province: "toledo", lat: 39.8628, lon: -4.0273,
    description: "Aerotermia y placas solares en Toledo capital: chalets de Montesión, San Bernardo, Valparaíso y Santa Bárbara. Estudio gratuito y ayudas municipales revisadas.",
    intro: "En Toledo capital, las casas unifamiliares están sobre todo en Montesión, San Bernardo, Valparaíso, La Legua, Santa Bárbara y en los cigarrales. El casco histórico tiene una protección que limita mucho las instalaciones en cubierta.",
    vivienda: "Chalets en urbanizaciones de las afueras con gasóleo o propano, adosados en Santa Bárbara y Azucaica con gas natural, y casas en el casco histórico con restricciones de patrimonio.",
    clima: "Inviernos más suaves que en la sierra de Madrid, pero con heladas, y veranos muy calurosos. Las bombas de calor trabajan con mejores rendimientos medios y las placas producen algo más que en Madrid.",
    zonaCTE: `C4 (Toledo capital, CTE DB-HE) ${P_ZONA}`,
    ibi: "Las fuentes publicadas no coinciden: bonificación del IBI del 30 % durante 3 años o del 50 % durante 5 años, y del 50 % del ICIO. [PENDIENTE: verificar en las ordenanzas fiscales vigentes del Ayuntamiento de Toledo]",
    tramite: `Comunicación previa o licencia según la zona; en el casco histórico, informe de patrimonio. ${P_SEDE}`,
    enfoque: "Si vives en el casco histórico, lo primero es saber qué se puede instalar. Si vives en una urbanización con gasóleo o propano, es de los casos con más ahorro.",
    faqs: [
      { q: "¿Se pueden poner placas en el casco histórico de Toledo?", a: "Con muchas restricciones, y a veces no. Hace falta informe de patrimonio. Te decimos qué opciones hay antes de pedirte nada." },
      { q: "¿La aerotermia rinde mejor en Toledo que en Madrid?", a: "Algo mejor de media, porque los inviernos son más suaves. Pero la diferencia la marcan sobre todo el aislamiento y los radiadores." },
    ],
  }),
  base({
    slug: "illescas", name: "Illescas", province: "toledo", lat: 40.1225, lon: -3.8463,
    description: "Aerotermia y placas solares en Illescas: chalets y adosados de El Señorío de Illescas y las urbanizaciones de La Sagra. Bonificación del ICIO revisada.",
    intro: "Illescas ha crecido con urbanizaciones de chalets y adosados (El Señorío de Illescas, Dehesa de Moraleda y otras) en las que vive mucha gente que trabaja en Madrid. Muchas son de los años 2000, con gas, propano o gasóleo según la urbanización.",
    vivienda: "Adosados y chalets relativamente recientes, con buen aislamiento para su época y tejados con espacio. Buena base para combinar aerotermia y placas.",
    clima: "Clima de La Sagra: inviernos fríos y secos y veranos muy calurosos. Mucho aire acondicionado en verano, que las placas cubren bien.",
    zonaCTE: `[PENDIENTE: zona C4 o D3 según la altitud] ${P_ZONA}`,
    ibi: "Varias fuentes indican una bonificación del 95 % del ICIO por instalar placas solares; no aparece bonificación del IBI. [PENDIENTE: verificar en las ordenanzas fiscales vigentes de Illescas]",
    tramite: `Comunicación previa para placas en cubierta. ${P_SEDE}`,
    enfoque: "Muchas casas de Illescas están vacías durante el día porque sus dueños trabajan en Madrid. En ese perfil, la batería o el coche eléctrico cambian mucho el resultado de las placas.",
    faqs: [
      { q: "Trabajo fuera todo el día, ¿me compensan las placas?", a: "Sin batería aprovecharías una parte pequeña de la producción. Con batería, o con el coche eléctrico cargando el fin de semana, el resultado mejora. Lo calculamos con tu perfil." },
      { q: "¿Qué es la bonificación del ICIO?", a: "Un descuento en el impuesto municipal que se paga al hacer la obra. En Illescas las fuentes publicadas hablan de un 95 %; lo verificamos en la ordenanza vigente." },
    ],
  }),
  base({
    slug: "sesena", name: "Seseña", province: "toledo", lat: 40.1036, lon: -3.6977,
    description: "Aerotermia y placas solares en Seseña y Seseña Nuevo: adosados y chalets de El Quiñón y las urbanizaciones de La Sagra. Estudio gratuito con tu factura.",
    intro: "Seseña tiene tres núcleos muy distintos: el casco histórico, Seseña Nuevo y El Quiñón, además de urbanizaciones de adosados y chalets. Mucha vivienda es de los años 2000 y posterior.",
    vivienda: "Adosados y pareados recientes, muchos con caldera de gas o calefacción eléctrica, y chalets en urbanizaciones. En las casas con calefacción eléctrica, la aerotermia es la que más ahorra.",
    clima: "Inviernos fríos y veranos muy calurosos, en el límite con la Comunidad de Madrid. Alto consumo de aire acondicionado en verano.",
    zonaCTE: `[PENDIENTE: zona C4 o D3 según la altitud] ${P_ZONA}`,
    ibi: "Varias fuentes indican una bonificación del 50 % del IBI durante 1 año. [PENDIENTE: verificar en la ordenanza fiscal vigente de Seseña y si existe bonificación del ICIO]",
    tramite: `Comunicación previa para placas en cubierta. ${P_SEDE}`,
    enfoque: "Si tu casa tiene radiadores o acumuladores eléctricos, la aerotermia suele recortar el gasto de calefacción entre un 50 y un 80 %. Es de los casos más claros.",
    faqs: [
      { q: "Tengo calefacción eléctrica, ¿cuánto ahorro con aerotermia?", a: "Frente a radiadores eléctricos, la aerotermia produce la misma calefacción con bastante menos electricidad. El ahorro suele estar entre un 50 y un 80 %, según cómo se reparte el calor." },
      { q: "¿Necesito más potencia contratada?", a: "A veces sí, sobre todo si sumas aerotermia y coche eléctrico. Lo revisamos y te decimos si hay que subirla." },
    ],
  }),
  base({
    slug: "talavera-de-la-reina", name: "Talavera de la Reina", province: "toledo", lat: 39.9636, lon: -4.8308,
    description: "Aerotermia y placas solares en Talavera de la Reina: chalets y casas en las urbanizaciones y pedanías del entorno. Ahorro estimado frente a gasóleo y gas.",
    intro: "Talavera de la Reina es la ciudad más poblada de la provincia de Toledo. Además de vivienda en bloque, tiene casas unifamiliares en el extrarradio, en urbanizaciones y en Talavera la Nueva y El Casar de Talavera.",
    vivienda: "Casas unifamiliares de distintas épocas, muchas con gasóleo, y adosados con gas natural. Parcelas con espacio para placas también fuera de la cubierta.",
    clima: "Valle del Tajo: inviernos suaves con nieblas y veranos de los más calurosos de la provincia. Mucha radiación solar y mucho aire acondicionado.",
    zonaCTE: `[PENDIENTE: zona C4 o D3 según la altitud] ${P_ZONA}`,
    ibi: "Las fuentes publicadas no coinciden: IBI del 25 o del 50 % durante 5 años e ICIO del 20 o del 50 %. [PENDIENTE: verificar en las ordenanzas fiscales vigentes de Talavera de la Reina]",
    tramite: `Comunicación previa para placas en cubierta. ${P_SEDE}`,
    enfoque: "Con inviernos más suaves y veranos muy calurosos, la combinación de aerotermia para frío y calor con placas solares es especialmente interesante.",
    faqs: [
      { q: "¿La aerotermia me sirve también de aire acondicionado?", a: "Sí, si el sistema lo permite: con suelo radiante refrescante o con fancoils. Con radiadores, el frío necesita otro emisor." },
      { q: "¿Venís hasta Talavera?", a: "Sí. Trabajamos en toda la provincia de Toledo. La visita es gratuita también en Talavera." },
    ],
  }),
  base({
    slug: "torrijos", name: "Torrijos", province: "toledo", lat: 39.9829, lon: -4.2823,
    description: "Aerotermia y placas solares en Torrijos y su comarca: casas de pueblo, chalets y naves. Estudio gratuito con tu factura y ayudas explicadas.",
    intro: "Torrijos es cabecera de comarca, con casas de pueblo en el casco, chalets en las urbanizaciones del entorno y viviendas rurales en los municipios cercanos, donde no siempre hay gas natural.",
    vivienda: "Casas de pueblo de muros gruesos, chalets con gasóleo o propano y viviendas con patio. Mucho tejado de teja disponible y, en ocasiones, espacio en el suelo de la parcela.",
    clima: "Inviernos fríos con nieblas y veranos calurosos. Sin gas natural, la comparación habitual es con gasóleo o propano, donde la aerotermia ahorra más.",
    zonaCTE: `[PENDIENTE: zona C4 o D3 según la altitud] ${P_ZONA}`,
    ibi: "Las fuentes publicadas no coinciden: IBI del 50 % durante 1 año o del 30 % durante 3 años, e ICIO del 25 %. [PENDIENTE: verificar en las ordenanzas fiscales vigentes de Torrijos]",
    tramite: `Comunicación previa para placas en cubierta. ${P_SEDE}`,
    enfoque: "En casas de pueblo con muros gruesos, el aislamiento suele ser mejor de lo que parece en invierno. Lo tenemos en cuenta al calcular la potencia, para no sobredimensionar.",
    faqs: [
      { q: "Mi casa es antigua, ¿funciona la aerotermia?", a: "Puede funcionar, pero hay que mirar el aislamiento, las ventanas y los radiadores. En la visita te decimos qué mejoras harían que compense." },
      { q: "¿Se pueden poner las placas en el suelo de la parcela?", a: "Sí, con una estructura. A veces es mejor que un tejado mal orientado. Lo valoramos con la producción de cada opción." },
    ],
  }),
];
