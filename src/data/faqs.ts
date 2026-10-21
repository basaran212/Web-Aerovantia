// Preguntas frecuentes de la web. Las usan las páginas, los datos estructurados y la base de
// conocimiento del asistente: si cambias una respuesta aquí, cambia en todos los sitios.
export interface Faq {
  q: string;
  a: string;
}

export const homeFaqs: Faq[] = [
  { q: "¿Qué hacéis exactamente?", a: "Aerotermia, placas solares, baterías y cargadores de coche eléctrico, solos o combinados. También reformas de cocinas, baños y viviendas completas en las que aprovechamos la obra para instalar aerotermia y suelo radiante." },
  { q: "¿Quién hace la instalación?", a: "El estudio, la propuesta, el diseño y la gestión de ayudas los hacemos nosotros. La instalación la realizan instaladores habilitados RITE y gases fluorados que colaboran con nosotros, coordinados por tu responsable de proyecto." },
  { q: "¿En qué zonas trabajáis?", a: "En la Comunidad de Madrid y en la provincia de Toledo, incluida La Sagra. La oficina está en Olías del Rey (Toledo). Si tu municipio no aparece en la lista, pregúntanos." },
  { q: "¿Cuánto cuesta el estudio?", a: "Nada. La visita y la propuesta por escrito son gratuitas y no te obligan a nada." },
  { q: "¿Cuánto tardáis en contestar?", a: "Te llamamos en menos de 24 horas laborables desde que nos escribes. La propuesta por escrito llega entre 5 y 10 días después de la visita." },
  { q: "¿Qué garantía tiene la instalación?", a: "La garantía del fabricante del equipo y la garantía legal de la instalación. En la propuesta te indicamos los plazos de cada una para los equipos concretos que te proponemos." },
  { q: "¿Tenéis obras terminadas que pueda ver?", a: "Somos una marca nueva y todavía no tenemos instalaciones propias terminadas. Por eso tenemos el programa Primeros clientes, y por eso las imágenes de la web están marcadas como ilustrativas." },
  { q: "¿Y si la aerotermia o las placas no me compensan?", a: "Te lo decimos. Si después de estudiar tu casa y tus facturas los números no salen, no te proponemos la instalación." },
];

export const aeroFaqs: Faq[] = [
  { q: "¿La aerotermia funciona con mis radiadores?", a: "Depende de los radiadores y del aislamiento. Con radiadores de baja temperatura o grandes, suele funcionar bien. Con radiadores convencionales, la bomba de calor trabaja a más temperatura y rinde menos, y a veces conviene cambiar algunos. Lo comprobamos en la visita." },
  { q: "¿Funciona cuando hace mucho frío?", a: "Sí. Las bombas de calor actuales siguen calentando con temperaturas bajo cero, aunque su rendimiento baja. Por eso la dimensionamos con los días más fríos de tu municipio, no con la media." },
  { q: "¿Cuánto cuesta?", a: "Depende de la superficie, del aislamiento y de cómo se reparte el calor. La calculadora te da un rango orientativo; el precio de tu instalación es el de la propuesta escrita después de la visita." },
  { q: "¿Cuánto ahorro?", a: "En climatización y agua caliente, entre un 20 y un 50 % frente a una caldera de gas natural, y entre un 50 y un 80 % frente a gasóleo, propano o radiadores eléctricos. Depende sobre todo de cómo se reparte el calor (radiadores o suelo radiante) y del aislamiento. En la propuesta lo calculamos con tus facturas." },
  { q: "¿Qué ayudas hay?", a: "Una deducción del 40 % en el IRPF hasta el 31 de diciembre de 2026, con una base máxima de 7.500 € (deducción máxima de 3.000 €), si se cumplen los requisitos. Al sustituir una caldera de combustión también puede obtenerse un descuento por Certificados de Ahorro Energético (CAE)." },
  { q: "¿Necesita mantenimiento?", a: "Menos que una caldera, porque no hay combustión. Recomendamos una revisión anual para mantener el rendimiento y conservar la garantía del fabricante." },
];

export const solarFaqs: Faq[] = [
  { q: "¿Cuántas placas necesito?", a: "Depende de tu consumo, de la orientación y del espacio de tu tejado. En un chalet suelen salir entre 6 y 16 paneles. La calculadora te da una primera estimación." },
  { q: "¿Mi tejado sirve?", a: "Sur, sureste y suroeste son las mejores orientaciones. Este y oeste producen algo menos, y un tejado a dos aguas este-oeste reparte mejor la producción a lo largo del día. Un tejado orientado al norte rara vez compensa: te lo decimos." },
  { q: "¿Compensa poner batería?", a: "Si pasas poco tiempo en casa durante el día, o tienes aerotermia o coche eléctrico, suele subir mucho la parte de energía que usas de tus placas. Pero encarece la instalación y alarga la amortización: lo calculamos con tu consumo." },
  { q: "¿Qué pasa con la energía que no uso?", a: "Se vierte a la red y tu comercializadora la descuenta de tu factura mediante la compensación simplificada de excedentes. La compensación tiene un límite: no puede superar el coste de la energía que compras a la red ese mes." },
  { q: "¿Necesito licencia?", a: "Según el municipio, una comunicación previa o una licencia de obra menor. La tramitamos nosotros, junto con la legalización de la instalación." },
  { q: "¿Hay bonificaciones?", a: "Algunos ayuntamientos bonifican el IBI o el ICIO por instalar placas solares. Revisamos las de tu municipio en el estudio." },
];

export const comboFaqs: Faq[] = [
  { q: "¿Por qué juntar aerotermia y placas?", a: "La aerotermia funciona con electricidad y las placas la producen. Con las dos, parte de la calefacción, el aire acondicionado y el agua caliente se cubre con energía de tu tejado, sobre todo en primavera, verano y los días soleados de invierno." },
  { q: "¿Las placas cubren toda la calefacción?", a: "No. En invierno las placas producen menos justo cuando más calefacción necesitas. Lo que sí hacen es cubrir buena parte del agua caliente y del aire acondicionado, y una parte de la calefacción de mediodía." },
  { q: "¿Hay que hacerlo todo a la vez?", a: "No es obligatorio, pero estudiarlo junto evita dimensionar mal: la aerotermia sube tu consumo eléctrico y las placas deben calcularse con ese consumo nuevo." },
  { q: "¿Se pueden deducir las dos?", a: "La deducción del 40 % en el IRPF se aplica a obras que reducen al menos un 30 % el consumo de energía primaria no renovable, acreditado con certificado energético antes y después. La base máxima es de 7.500 € por declaración. Te decimos en la visita si tu caso cumple." },
];

export const reformFaqs: Faq[] = [
  { q: "¿Qué tipo de reformas hacéis?", a: "Cocinas, baños y reformas integrales de viviendas en las que aprovechamos la obra para instalar aerotermia, suelo radiante o preparar la casa para placas solares." },
  { q: "¿Cuánto cuesta una reforma?", a: "Cada reforma se presupuesta bajo proyecto, después de ver la vivienda y definir contigo calidades y alcance. La calculadora solo da un rango de referencia de mercado." },
  { q: "¿Cuánto dura?", a: "Depende del alcance. Te damos un calendario por fases en la propuesta, antes de empezar." },
  { q: "¿Necesito licencia?", a: "Según el municipio y el alcance, una comunicación previa o una licencia de obra. La tramitamos nosotros." },
  { q: "¿Puedo deducirme parte de la reforma?", a: "La parte de eficiencia energética, como la aerotermia con suelo radiante, puede acogerse a la deducción del 40 % en el IRPF si cumple los requisitos. El resto de la reforma, no." },
  { q: "¿Hacéis casas nuevas?", a: "Sí. Coordinamos obra nueva de chalets y viviendas unifamiliares con la aerotermia, el suelo radiante y las placas solares diseñados desde el proyecto. Si ya tienes constructor, nos encargamos solo de la energía. Más en obra nueva." },
];
