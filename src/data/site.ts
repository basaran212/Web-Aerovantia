// Datos de empresa y navegación compartidos por todas las páginas.
// Los valores entre corchetes son marcadores: sustitúyelos por los reales antes de publicar.
export const company = {
  name: "Aerovantia",
  legalName: "[Razón social S.L.]",
  cif: "[B-00000000]",
  address: "[Domicilio social]",
  registry: "[provincia]",
  phone: "[+34 600 000 000]",
  email: "[hola@aerovantia.es]",
  hours: "L–V 9:00–19:00 · S 10:00–14:00",
};

export const services = [
  { href: "/aerotermia/", label: "Aerotermia" },
  { href: "/placas-solares/", label: "Placas solares" },
  { href: "/reformas-de-lujo/", label: "Reformas" },
  { href: "/obra-nueva/", label: "Obra nueva" },
];

export const nav = [
  ...services,
  { href: "/#calculadoras", label: "Calculadoras" },
  { href: "/#ayudas", label: "Ayudas" },
];

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
