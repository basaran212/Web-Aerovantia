# Matriz de keywords y mapa keyword → URL

Una keyword principal = una URL. Volumen y dificultad: **[PENDIENTE: Keyword Planner / Search Console]**
(no se inventan). Prioridad: A = núcleo de negocio con intención de compra; B = apoyo; C = informativa.

## Mapa principal

| Keyword principal | URL | Cluster | Intención | Prioridad | Volumen / KD |
|---|---|---|---|---|---|
| aerotermia y placas solares madrid toledo | / | marca + combo | comercial | A | [PENDIENTE] |
| instalación aerotermia madrid / aerotermia toledo | /aerotermia/ | aerotermia | comercial | A | [PENDIENTE] |
| precio aerotermia | /aerotermia/precio/ | aerotermia | comercial | A | [PENDIENTE] |
| aerotermia con radiadores | /aerotermia/con-radiadores/ | aerotermia | informativa-comercial | A | [PENDIENTE] |
| aerotermia vs gas natural | /guias/aerotermia-vs-gas-natural/ | aerotermia | informativa | B | [PENDIENTE] |
| cambiar caldera de gasóleo por aerotermia | (guía 5, pendiente) | aerotermia | comercial | A | [PENDIENTE] |
| placas solares chalet madrid / toledo | /placas-solares/ | fotovoltaica | comercial | A | [PENDIENTE] |
| placas solares chalet precio | /placas-solares/precio/ | fotovoltaica | comercial | A | [PENDIENTE] |
| placas solares con batería | /placas-solares/baterias/ | fotovoltaica | informativa-comercial | A | [PENDIENTE] |
| placas solares tejado de teja / uralita | (guía 6, pendiente) | fotovoltaica | informativa | B | [PENDIENTE] |
| aerotermia y placas solares | /aerotermia-y-placas-solares/ | combo | comercial | A | [PENDIENTE] |
| deducción irpf aerotermia / deducción 40 % placas solares | /ayudas/deduccion-irpf/ | ayudas | informativa | A | [PENDIENTE] |
| certificado energético deducción irpf | /guias/certificado-energetico/ | ayudas | informativa | B | [PENDIENTE] |
| bonificación ibi placas solares [municipio] | /ayudas/bonificacion-ibi-icio/ | ayudas | informativa | B | [PENDIENTE] |
| cae aerotermia | /ayudas/cae/ | ayudas | informativa | B | [PENDIENTE] |
| ayudas aerotermia placas solares | /ayudas/ | ayudas | informativa | B | [PENDIENTE] |
| cargador coche eléctrico chalet | /cargador-coche-electrico/ | complementos | comercial | B | [PENDIENTE] |
| reforma con suelo radiante / reforma integral con aerotermia | /reformas/ | reformas | comercial | B | [PENDIENTE] |
| interiorismo madrid toledo | /interiorismo/ | reformas | comercial | C (sin prioridad) | [PENDIENTE] |
| obra nueva chalet madrid / toledo | /obra-nueva/ | obra nueva | comercial | C | [PENDIENTE] |
| calculadora aerotermia | /calculadoras/aerotermia/ | herramientas | transaccional | B | [PENDIENTE] |
| calculadora placas solares | /calculadoras/placas-solares/ | herramientas | transaccional | B | [PENDIENTE] |
| calculadora reforma | /calculadoras/reformas/ | herramientas | transaccional | C | [PENDIENTE] |

## Municipios (fase 1)

Patrón: "aerotermia [municipio]" y "placas solares [municipio]" → la landing del municipio. La keyword
genérica "aerotermia madrid" va a /aerotermia/; "aerotermia madrid capital" a /zona/madrid/madrid/.

| Municipio | URL |
|---|---|
| Madrid capital | /zona/madrid/madrid/ |
| Boadilla del Monte | /zona/madrid/boadilla-del-monte/ |
| Pozuelo de Alarcón | /zona/madrid/pozuelo-de-alarcon/ |
| Las Rozas | /zona/madrid/las-rozas/ |
| Majadahonda | /zona/madrid/majadahonda/ |
| Villaviciosa de Odón | /zona/madrid/villaviciosa-de-odon/ |
| Getafe | /zona/madrid/getafe/ |
| Toledo capital | /zona/toledo/toledo/ |
| Illescas | /zona/toledo/illescas/ |
| Seseña | /zona/toledo/sesena/ |
| Talavera de la Reina | /zona/toledo/talavera-de-la-reina/ |
| Torrijos | /zona/toledo/torrijos/ |

Hubs: /zona/madrid/ ("aerotermia comunidad de madrid") y /zona/toledo/ ("aerotermia provincia de toledo").

## Reglas anti-canibalización aplicadas

- Las guías que coinciden con una keyword de servicio viven en la URL del servicio (aerotermia con
  radiadores → /aerotermia/con-radiadores/; baterías → /placas-solares/baterias/; deducción IRPF →
  /ayudas/deduccion-irpf/). No hay una segunda URL en /guias/ para lo mismo.
- "precio" solo en /aerotermia/precio/ y /placas-solares/precio/. Las páginas de servicio enlazan a ellas
  con el anchor "precio de la aerotermia" / "precio de las placas solares".
- Los títulos de los hubs de zona empiezan por "Zona…" para no competir con Madrid capital y Toledo capital.
- Las calculadoras no apuntan a "precio": su title es "Calculadora de…".
- Los parámetros ?calc= no generan URL indexables: el canonical es siempre la URL limpia.

## Fase 2 (tras 90 días de datos)

Villanueva de la Cañada, Brunete, Alcorcón, Móstoles, Arroyomolinos, Navalcarnero, Fuenlabrada, Leganés,
Parla, Griñón, Valdemoro, Yeles, Esquivias, Ugena, Yuncos, Numancia de la Sagra, Cabañas de la Sagra,
Bargas, Olías del Rey y los que indique Search Console. Cada una con contenido propio (verificar con
`node scripts/check-landings.mjs`, máximo 30 % de texto compartido).
