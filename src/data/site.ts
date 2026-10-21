// Datos de empresa y navegación compartidos por todas las páginas.
// Los datos sin confirmar van como [PENDIENTE: ...]; el despliegue a producción falla mientras quede alguno.
export const company = {
  name: "Aerovantia",
  legalName: "Eufórico Equilibrio S.L.",
  legalNamePendiente: "[PENDIENTE: confirmar «Eufórico» con tilde tal como figura en el Registro Mercantil]",
  cif: "B45917622",
  locality: "Olías del Rey",
  region: "Toledo",
  address: "Olías del Rey (Toledo)",
  street: "C/ Venta de Abajo, 3",
  registry: "Registro Mercantil de Toledo, tomo 1697, libro 0, folio 45, sección 8, hoja TO-42258, inscripción 1.ª",
  phones: [
    { display: "689 042 717", tel: "+34689042717" },
    { display: "626 731 467", tel: "+34626731467" },
  ],
  email: "info@aerovantia.es",
};

export const phone = company.phones[0];

/** Número con WhatsApp y mensaje inicial del chat. */
export const whatsapp = {
  display: company.phones[0].display,
  href: `https://wa.me/${company.phones[0].tel.replace("+", "")}?text=${encodeURIComponent("Hola, quiero pedir un estudio gratuito para mi casa.")}`,
};

// Líneas de servicio con página propia (menú, pie y datos estructurados).
export const services = [
  { href: "/aerotermia/", label: "Aerotermia" },
  { href: "/placas-solares/", label: "Placas solares" },
  { href: "/aerotermia-y-placas-solares/", label: "Aerotermia + Solar" },
  { href: "/reformas/", label: "Reformas con energía" },
];

export const nav = [
  { href: "/aerotermia/", label: "Aerotermia" },
  { href: "/placas-solares/", label: "Placas solares" },
  { href: "/aerotermia-y-placas-solares/", label: "Aerotermia + Solar" },
  { href: "/reformas/", label: "Reformas" },
  { href: "/ayudas/", label: "Ayudas" },
  { href: "/calculadoras/", label: "Calculadoras" },
  { href: "/#contacto", label: "Contacto" },
];

export const guides = [
  { href: "/guias/aerotermia-con-radiadores/", label: "¿Funciona la aerotermia con mis radiadores?" },
  { href: "/guias/deduccion-irpf-40/", label: "Cómo conseguir la deducción del 40 % paso a paso" },
  { href: "/guias/aerotermia-vs-caldera-de-gas/", label: "Aerotermia vs caldera de gas: números reales en Madrid y Toledo" },
];

export const legal = [
  { href: "/aviso-legal/", label: "Aviso legal" },
  { href: "/privacidad/", label: "Privacidad" },
  { href: "/cookies/", label: "Cookies" },
];

// Zona de trabajo: dos bloques de igual peso. Los municipios con página propia están en municipios.ts.
export const areas = {
  "Comunidad de Madrid": [
    "Madrid", "Boadilla del Monte", "Pozuelo de Alarcón", "Las Rozas", "Majadahonda", "Villaviciosa de Odón",
    "Villanueva de la Cañada", "Brunete", "Alcorcón", "Móstoles", "Arroyomolinos", "Navalcarnero",
    "Fuenlabrada", "Getafe", "Leganés", "Parla", "Griñón", "Valdemoro",
  ],
  "Provincia de Toledo": [
    "Toledo", "Olías del Rey", "Bargas", "Illescas", "Seseña", "Yeles", "Esquivias", "Ugena", "Yuncos",
    "Numancia de la Sagra", "Cabañas de la Sagra", "Torrijos", "Talavera de la Reina",
  ],
};

export const zoneLabel = "Comunidad de Madrid y provincia de Toledo";
