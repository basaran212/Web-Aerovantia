// Datos de empresa y navegación compartidos por todas las páginas.
// Los valores entre corchetes son marcadores: sustitúyelos por los reales antes de publicar.
export const company = {
  name: "Aerovantia",
  legalName: "Euforico Equilibrio S.L.",
  cif: "B45917622",
  founded: "2019-11-15",
  foundedYear: 2019,
  locality: "Olías del Rey",
  region: "Toledo",
  address: "Olías del Rey (Toledo)",
  registry: "[datos de inscripción en el Registro Mercantil]",
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

export const services = [
  { href: "/reformas-de-lujo/", label: "Reformas" },
  { href: "/obra-nueva/", label: "Obra nueva" },
  { href: "/interiorismo/", label: "Interiorismo" },
  { href: "/aerotermia/", label: "Aerotermia" },
  { href: "/placas-solares/", label: "Placas solares" },
];

export const nav = [...services, { href: "/#calculadoras", label: "Calculadoras" }];

export const legal = [
  { href: "/aviso-legal/", label: "Aviso legal" },
  { href: "/privacidad/", label: "Privacidad" },
  { href: "/cookies/", label: "Cookies" },
];

export const areas = {
  "Madrid sur y oeste": [
    "Boadilla del Monte", "Villaviciosa de Odón", "Villanueva de la Cañada", "Brunete",
    "Alcorcón", "Móstoles", "Arroyomolinos", "Navalcarnero", "Fuenlabrada", "Getafe",
    "Leganés", "Parla", "Griñón", "Valdemoro",
  ],
  "Toledo y La Sagra": [
    "Seseña", "Illescas", "Yeles", "Esquivias", "Ugena", "Yuncos", "Numancia de la Sagra",
    "Cabañas de la Sagra", "Bargas", "Olías del Rey", "Toledo", "Torrijos",
  ],
};
