// Synthetic but realistic Barcelona mobility data

export type EventType = "traffic" | "event" | "works" | "bus" | "bicing" | "accident";

export interface MobilityItem {
  id: string;
  type: EventType;
  title: string;
  description: string;
  lat: number;
  lng: number;
  severity?: "low" | "medium" | "high";
  startDate?: string;
  endDate?: string;
  status: "active" | "scheduled" | "resolved";
  district: string;
  affectedStreets?: string[];
}

export const mobilityData: MobilityItem[] = [
  // TRAFFIC
  {
    id: "t1",
    type: "traffic",
    title: "Congestio intensa",
    description: "Transit molt dens en hora punta. Retards estimats de 15-20 minuts.",
    lat: 41.38794,
    lng: 2.17012,
    severity: "high",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Gran Via de les Corts Catalanes", "Carrer d'Arago"],
  },
  {
    id: "t2",
    type: "traffic",
    title: "Tall parcial de carril",
    description: "Avaria de vehicle en carril central. Guardia Urbana regula el pas.",
    lat: 41.37558,
    lng: 2.13977,
    severity: "medium",
    status: "active",
    district: "Sants-Montjuic",
    affectedStreets: ["Carrer de Sants", "Carrer de la Creu Coberta"],
  },
  {
    id: "t3",
    type: "traffic",
    title: "Retencions a Via Laietana",
    description: "Transit irregular per acumulacio de vehicles de pas cap al front maritim.",
    lat: 41.38519,
    lng: 2.17632,
    severity: "medium",
    status: "active",
    district: "Ciutat Vella",
    affectedStreets: ["Via Laietana", "Placa d'Antoni Maura"],
  },
  {
    id: "t4",
    type: "traffic",
    title: "Entrada lenta per Ronda Litoral",
    description: "Flux dens en sentit Besos. Es recomana itinerari alternatiu interior.",
    lat: 41.38204,
    lng: 2.18745,
    severity: "medium",
    status: "active",
    district: "Ciutat Vella",
    affectedStreets: ["Ronda del Litoral", "Passeig de Joan de Borbo"],
  },
  {
    id: "t5",
    type: "traffic",
    title: "Transit dens a Glories",
    description: "Retencions per obres i elevada demanda en l'encreuament principal.",
    lat: 41.40368,
    lng: 2.18916,
    severity: "high",
    status: "active",
    district: "Sant Marti",
    affectedStreets: ["Avinguda Diagonal", "Placa de les Glories"],
  },

  // EVENTS
  {
    id: "e1",
    type: "event",
    title: "Concert Primavera Sound",
    description: "Aforament alt al Parc del Forum i accessos restringits en vehicle privat.",
    lat: 41.41183,
    lng: 2.21985,
    severity: "high",
    startDate: "2026-03-20T18:00",
    endDate: "2026-03-20T23:59",
    status: "scheduled",
    district: "Sant Marti",
    affectedStreets: ["Rambla de Prim", "Carrer de la Pau"],
  },
  {
    id: "e2",
    type: "event",
    title: "Cursa Montjuic 10K",
    description: "Prova esportiva amb talls puntuals i desviaments de bus durant el mati.",
    lat: 41.36418,
    lng: 2.15273,
    severity: "high",
    startDate: "2026-03-20T08:00",
    endDate: "2026-03-20T12:00",
    status: "scheduled",
    district: "Sants-Montjuic",
    affectedStreets: ["Avinguda de Rius i Taulet", "Passeig Olimpic"],
  },
  {
    id: "e3",
    type: "event",
    title: "Mercat de disseny",
    description: "Mercat temporal a l'eix central. Reduccio de carrils laterals.",
    lat: 41.39107,
    lng: 2.16555,
    severity: "low",
    startDate: "2026-03-20T10:00",
    endDate: "2026-03-20T20:00",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Passeig de Gracia", "Carrer de Casp"],
  },
  {
    id: "e4",
    type: "event",
    title: "Partit al Camp Nou",
    description: "Gran afluencia prevista abans i despres del partit, amb controls d'acces.",
    lat: 41.38089,
    lng: 2.12282,
    severity: "high",
    startDate: "2026-03-22T21:00",
    endDate: "2026-03-22T23:00",
    status: "scheduled",
    district: "Les Corts",
    affectedStreets: ["Avinguda de Joan XXIII", "Travessera de les Corts"],
  },
  {
    id: "e5",
    type: "event",
    title: "Concert al Palau Sant Jordi",
    description: "Acces escalonat de public i reforc de transports al finalitzar el concert.",
    lat: 41.36318,
    lng: 2.15209,
    severity: "medium",
    startDate: "2026-03-21T19:30",
    endDate: "2026-03-21T23:30",
    status: "scheduled",
    district: "Sants-Montjuic",
    affectedStreets: ["Passeig Olimpic", "Avinguda de l'Estadi"],
  },

  // WORKS
  {
    id: "w1",
    type: "works",
    title: "Obres de clavegueram",
    description: "Renovacio de xarxa soterrada amb tall parcial i pas alternatiu.",
    lat: 41.39081,
    lng: 2.16533,
    severity: "high",
    startDate: "2026-03-10",
    endDate: "2026-03-31",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Carrer del Consell de Cent", "Carrer de Roger de Lluria"],
  },
  {
    id: "w2",
    type: "works",
    title: "Millora de voreres",
    description: "Obra de reurbanitzacio amb ampliacio de pas de vianants.",
    lat: 41.37495,
    lng: 2.12761,
    severity: "medium",
    startDate: "2026-03-15",
    endDate: "2026-04-10",
    status: "active",
    district: "Sants-Montjuic",
    affectedStreets: ["Carrer de Sants", "Carrer de Burgos"],
  },
  {
    id: "w3",
    type: "works",
    title: "Connexio L9 zona universitaria",
    description: "Tasques de finalitzacio d'infraestructura amb afectacio puntual en superficie.",
    lat: 41.38124,
    lng: 2.12194,
    severity: "medium",
    startDate: "2026-02-01",
    endDate: "2026-06-30",
    status: "active",
    district: "Les Corts",
    affectedStreets: ["Avinguda de Joan XXIII", "Carrer d'Aristides Maillol"],
  },
  {
    id: "w4",
    type: "works",
    title: "Nou carril bici a Gracia",
    description: "Reordenacio viaria i nova senyalitzacio ciclista al barri.",
    lat: 41.40687,
    lng: 2.15614,
    severity: "low",
    startDate: "2026-03-18",
    endDate: "2026-04-05",
    status: "active",
    district: "Gracia",
    affectedStreets: ["Carrer de Verdi", "Carrer del Torrent de l'Olla"],
  },
  {
    id: "w5",
    type: "works",
    title: "Reforma de Via Laietana",
    description: "Reurbanitzacio de calcada i vorera amb fase actual al tram central.",
    lat: 41.38489,
    lng: 2.17654,
    severity: "high",
    startDate: "2026-03-01",
    endDate: "2026-07-15",
    status: "active",
    district: "Ciutat Vella",
    affectedStreets: ["Via Laietana", "Placa d'Antoni Maura"],
  },

  // BUS
  {
    id: "b1",
    type: "bus",
    title: "Parada provisional H16",
    description: "Parada movida 80 m per obres. Senyalitzacio temporal ja instalada.",
    lat: 41.40401,
    lng: 2.17514,
    severity: "low",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Carrer de la Marina", "Carrer de Mallorca"],
  },
  {
    id: "b2",
    type: "bus",
    title: "Desviament linies 7, 33 i 67",
    description: "Recorregut alternatiu per evitar obres en l'eix de Consell de Cent.",
    lat: 41.39082,
    lng: 2.16531,
    severity: "medium",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Carrer del Consell de Cent", "Carrer de Provenca"],
  },
  {
    id: "b3",
    type: "bus",
    title: "Reforc de nit cap de setmana",
    description: "Increment de frequencia a linees nocturnes per activitats al centre.",
    lat: 41.38713,
    lng: 2.17028,
    severity: "low",
    status: "scheduled",
    district: "Eixample",
    affectedStreets: ["Placa de Catalunya", "Ronda Universitat"],
  },
  {
    id: "b4",
    type: "bus",
    title: "Bus turistic desviat",
    description: "Ruta nord desviada per treballs de manteniment en el tram del Tibidabo.",
    lat: 41.41431,
    lng: 2.13403,
    severity: "low",
    status: "active",
    district: "Sarria-Sant Gervasi",
    affectedStreets: ["Avinguda del Tibidabo", "Placa del Doctor Andreu"],
  },
  {
    id: "b5",
    type: "bus",
    title: "Parada anulada V15",
    description: "Parada temporalment fora de servei per saturacio d'espai de maniobra.",
    lat: 41.38158,
    lng: 2.18894,
    severity: "medium",
    status: "active",
    district: "Ciutat Vella",
    affectedStreets: ["Passeig de Joan de Borbo", "Carrer de la Maquinista"],
  },

  // BICING
  {
    id: "bi1",
    type: "bicing",
    title: "Estacio plena",
    description: "No hi ha ancoratges lliures. Punt alternatiu a menys de 250 metres.",
    lat: 41.39358,
    lng: 2.15997,
    severity: "low",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Carrer de Provenca", "Carrer de Balmes"],
  },
  {
    id: "bi2",
    type: "bicing",
    title: "Estacio sense bicicletes",
    description: "Reposicio en curs amb previsio de normalitzacio en 30 minuts.",
    lat: 41.38453,
    lng: 2.16388,
    severity: "medium",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Ronda de Sant Antoni", "Carrer del Comte d'Urgell"],
  },
  {
    id: "bi3",
    type: "bicing",
    title: "Nova estacio operativa",
    description: "Nova estacio amb 20 ancoratges, incloent punts de carrega electrica.",
    lat: 41.40406,
    lng: 2.15585,
    severity: "low",
    status: "active",
    district: "Gracia",
    affectedStreets: ["Placa del Diamant", "Carrer d'Asturies"],
  },
  {
    id: "bi4",
    type: "bicing",
    title: "Estacio fora de servei",
    description: "Manteniment tecnic de terminals i ancoratges en l'entorn de Poblenou.",
    lat: 41.40264,
    lng: 2.20515,
    severity: "medium",
    status: "active",
    district: "Sant Marti",
    affectedStreets: ["Carrer de Pujades", "Rambla del Poblenou"],
  },
  {
    id: "bi5",
    type: "bicing",
    title: "Redistribucio reforcada",
    description: "Servei preventiu per cobrir major demanda d'entrada i sortida de viatgers.",
    lat: 41.37918,
    lng: 2.14065,
    severity: "low",
    status: "scheduled",
    district: "Sants-Montjuic",
    affectedStreets: ["Placa dels Paisos Catalans", "Carrer de Tarragona"],
  },

  // ACCIDENTS
  {
    id: "a1",
    type: "accident",
    title: "Col lisio entre turismes",
    description: "Xoc amb un carril tallat. Serveis d'emergencia treballant al punt.",
    lat: 41.40498,
    lng: 2.17346,
    severity: "high",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Carrer de la Marina", "Carrer de la Industria"],
  },
  {
    id: "a2",
    type: "accident",
    title: "Caiguda de ciclista",
    description: "Ciclista ates in situ. Tall puntual del carril bici per assistencia.",
    lat: 41.39465,
    lng: 2.14879,
    severity: "medium",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Carrer de Muntaner", "Carrer de Paris"],
  },
  {
    id: "a3",
    type: "accident",
    title: "Accident resolt",
    description: "Incidencia ja resolta i mobilitat recuperada a l'entorn immediat.",
    lat: 41.39794,
    lng: 2.17143,
    severity: "low",
    status: "resolved",
    district: "Gracia",
    affectedStreets: ["Passeig de Sant Joan", "Carrer de Corsega"],
  },
  {
    id: "a4",
    type: "accident",
    title: "Atropellament lleu",
    description: "Persona atesa pel SEM. Reduccio temporal de capacitat viaria.",
    lat: 41.44211,
    lng: 2.17054,
    severity: "high",
    status: "active",
    district: "Nou Barris",
    affectedStreets: ["Via Julia", "Carrer d'Almansa"],
  },
  {
    id: "a5",
    type: "accident",
    title: "Col lisio multiple",
    description: "Diversos vehicles implicats amb retencions importants en sentit litoral.",
    lat: 41.37392,
    lng: 2.18368,
    severity: "high",
    status: "active",
    district: "Ciutat Vella",
    affectedStreets: ["Ronda del Litoral", "Moll de la Fusta"],
  },

  // EXTRA TRAFFIC
  {
    id: "t6",
    type: "traffic",
    title: "Retencions a Placa d'Espanya",
    description: "Transit lent per alta demanda d'entrada i sortida de vehicles.",
    lat: 41.37513,
    lng: 2.14907,
    severity: "medium",
    status: "active",
    district: "Sants-Montjuic",
    affectedStreets: ["Placa d'Espanya", "Avinguda del Paral lel"],
  },
  {
    id: "t7",
    type: "traffic",
    title: "Transit dens a Travessera de Dalt",
    description: "Pas intermitent per alta intensitat de semafors en hora punta.",
    lat: 41.40748,
    lng: 2.15865,
    severity: "medium",
    status: "active",
    district: "Gracia",
    affectedStreets: ["Travessera de Dalt", "Carrer de Verdi"],
  },
  {
    id: "t8",
    type: "traffic",
    title: "Acces carregat per Gran Via sud",
    description: "Flux carregat en sentit entrada ciutat des de la B-10.",
    lat: 41.36194,
    lng: 2.13482,
    severity: "high",
    status: "active",
    district: "Sants-Montjuic",
    affectedStreets: ["Gran Via de les Corts Catalanes", "Ronda del Mig"],
  },
  {
    id: "t9",
    type: "traffic",
    title: "Circulacio irregular a Ronda del Guinardo",
    description: "Compactacio de transit per obres i encreuaments saturats.",
    lat: 41.41621,
    lng: 2.16984,
    severity: "medium",
    status: "active",
    district: "Horta-Guinardo",
    affectedStreets: ["Ronda del Guinardo", "Carrer de Cartagena"],
  },

  // EXTRA EVENTS
  {
    id: "e6",
    type: "event",
    title: "Fira a Montjuic",
    description: "Aforament elevat a recinte firal amb acces de vehicles restringit.",
    lat: 41.37224,
    lng: 2.15162,
    severity: "medium",
    startDate: "2026-03-24T09:00",
    endDate: "2026-03-24T20:00",
    status: "scheduled",
    district: "Sants-Montjuic",
    affectedStreets: ["Avinguda de la Reina Maria Cristina", "Carrer de Mexico"],
  },
  {
    id: "e7",
    type: "event",
    title: "Acte popular a Vila de Gracia",
    description: "Talls puntuals i control d'accessos al centre del barri.",
    lat: 41.40324,
    lng: 2.15821,
    severity: "low",
    startDate: "2026-03-23T17:00",
    endDate: "2026-03-23T22:00",
    status: "active",
    district: "Gracia",
    affectedStreets: ["Placa de la Vila de Gracia", "Carrer de Gran de Gracia"],
  },
  {
    id: "e8",
    type: "event",
    title: "Acte institucional a Arc de Triomf",
    description: "Zona amb control perimetral i desviaments de mobilitat local.",
    lat: 41.39186,
    lng: 2.18046,
    severity: "medium",
    startDate: "2026-03-25T18:30",
    endDate: "2026-03-25T21:30",
    status: "scheduled",
    district: "Ciutat Vella",
    affectedStreets: ["Passeig de Lluis Companys", "Carrer del Comerc"],
  },
  {
    id: "e9",
    type: "event",
    title: "Cursa solidaria Diagonal Mar",
    description: "Trams balisats amb restriccions temporals de transit.",
    lat: 41.41047,
    lng: 2.21763,
    severity: "medium",
    startDate: "2026-03-26T08:00",
    endDate: "2026-03-26T12:30",
    status: "scheduled",
    district: "Sant Marti",
    affectedStreets: ["Avinguda Diagonal", "Carrer de Josep Pla"],
  },

  // EXTRA WORKS
  {
    id: "w6",
    type: "works",
    title: "Renovacio d'asfalt a Arago",
    description: "Reasfaltat nocturn amb carrils reduits i pas regulat.",
    lat: 41.39624,
    lng: 2.17504,
    severity: "medium",
    startDate: "2026-03-23",
    endDate: "2026-03-30",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Carrer d'Arago", "Passeig de Sant Joan"],
  },
  {
    id: "w7",
    type: "works",
    title: "Intervencio tecnica a Paral lel",
    description: "Treballs de serveis soterrats amb desviament de carril bus.",
    lat: 41.37542,
    lng: 2.16584,
    severity: "medium",
    startDate: "2026-03-24",
    endDate: "2026-04-18",
    status: "scheduled",
    district: "Sants-Montjuic",
    affectedStreets: ["Avinguda del Paral lel", "Carrer de Vila i Vila"],
  },
  {
    id: "w8",
    type: "works",
    title: "Millora de plataforma a Bonanova",
    description: "Obra de voreres i senyalitzacio en tram escolar.",
    lat: 41.40192,
    lng: 2.12963,
    severity: "low",
    startDate: "2026-03-22",
    endDate: "2026-04-12",
    status: "active",
    district: "Sarria-Sant Gervasi",
    affectedStreets: ["Passeig de la Bonanova", "Carrer de Mandri"],
  },
  {
    id: "w9",
    type: "works",
    title: "Manteniment de clavegueram a Poblenou",
    description: "Ocupacio parcial de calcada amb pas alternatiu senyalitzat.",
    lat: 41.40346,
    lng: 2.20112,
    severity: "medium",
    startDate: "2026-03-21",
    endDate: "2026-04-02",
    status: "active",
    district: "Sant Marti",
    affectedStreets: ["Carrer de Pujades", "Carrer de Llacuna"],
  },

  // EXTRA BUS
  {
    id: "b6",
    type: "bus",
    title: "Desviament H12 a Sagrada Familia",
    description: "Canvi puntual de recorregut per ocupacio de via central.",
    lat: 41.40352,
    lng: 2.17462,
    severity: "medium",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Carrer de Mallorca", "Carrer de la Marina"],
  },
  {
    id: "b7",
    type: "bus",
    title: "Parada provisional D20 a Barceloneta",
    description: "Parada desplacada 120 metres per actuacio tecnica.",
    lat: 41.38102,
    lng: 2.19084,
    severity: "low",
    status: "active",
    district: "Ciutat Vella",
    affectedStreets: ["Passeig Maritim de la Barceloneta", "Carrer de Pepe Rubianes"],
  },
  {
    id: "b8",
    type: "bus",
    title: "Reforc L41 a Sant Andreu",
    description: "Sortides addicionals per absorbir demanda en hora punta.",
    lat: 41.42932,
    lng: 2.19016,
    severity: "low",
    status: "scheduled",
    district: "Sant Andreu",
    affectedStreets: ["Passeig de Torras i Bages", "Carrer Gran de Sant Andreu"],
  },
  {
    id: "b9",
    type: "bus",
    title: "Desviament linia 54 a Paral lel",
    description: "Recorregut alternatiu durant franja de treballs nocturns.",
    lat: 41.37437,
    lng: 2.16828,
    severity: "medium",
    status: "active",
    district: "Sants-Montjuic",
    affectedStreets: ["Avinguda del Paral lel", "Carrer de Nou de la Rambla"],
  },

  // EXTRA BICING
  {
    id: "bi6",
    type: "bicing",
    title: "Estacio amb alta ocupacio",
    description: "Queden pocs ancoratges disponibles durant la tarda.",
    lat: 41.38873,
    lng: 2.16948,
    severity: "low",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Placa de Catalunya", "Carrer de Pelai"],
  },
  {
    id: "bi7",
    type: "bicing",
    title: "Estacio saturada a Placa d'Espanya",
    description: "Sense espais lliures. Redistribucio prevista en 20 minuts.",
    lat: 41.37458,
    lng: 2.14873,
    severity: "medium",
    status: "active",
    district: "Sants-Montjuic",
    affectedStreets: ["Placa d'Espanya", "Carrer de Tarragona"],
  },
  {
    id: "bi8",
    type: "bicing",
    title: "Manteniment d'estacio al Clot",
    description: "Terminals en revisio tecnica i servei parcial temporal.",
    lat: 41.41119,
    lng: 2.18992,
    severity: "low",
    status: "scheduled",
    district: "Sant Marti",
    affectedStreets: ["Carrer de la Independencia", "Carrer d'Arago"],
  },
  {
    id: "bi9",
    type: "bicing",
    title: "Nova estacio operativa a Sant Andreu",
    description: "S'activa una estacio amb 18 punts d'ancoratge.",
    lat: 41.43503,
    lng: 2.18912,
    severity: "low",
    status: "active",
    district: "Sant Andreu",
    affectedStreets: ["Passeig de Santa Coloma", "Carrer de Dublin"],
  },

  // EXTRA ACCIDENTS
  {
    id: "a6",
    type: "accident",
    title: "Col lisio a Avinguda Meridiana",
    description: "Dos vehicles implicats amb un carril restringit.",
    lat: 41.42039,
    lng: 2.18874,
    severity: "high",
    status: "active",
    district: "Sant Andreu",
    affectedStreets: ["Avinguda Meridiana", "Carrer de Felip II"],
  },
  {
    id: "a7",
    type: "accident",
    title: "Topada moto i vianant a Sant Antoni",
    description: "Assistencia sanitaria en curs i circulacio alentida.",
    lat: 41.37981,
    lng: 2.16307,
    severity: "medium",
    status: "active",
    district: "Eixample",
    affectedStreets: ["Ronda de Sant Antoni", "Carrer del Comte d'Urgell"],
  },
  {
    id: "a8",
    type: "accident",
    title: "Incidencia resolta a Vallcarca",
    description: "Serveis retirats i transit normalitzat al tram afectat.",
    lat: 41.41579,
    lng: 2.14403,
    severity: "low",
    status: "resolved",
    district: "Gracia",
    affectedStreets: ["Avinguda de Vallcarca", "Carrer de Bolivar"],
  },
  {
    id: "a9",
    type: "accident",
    title: "Atropellament lleu a Poblenou",
    description: "Intervencio del SEM amb retencions puntuals.",
    lat: 41.40308,
    lng: 2.19941,
    severity: "high",
    status: "active",
    district: "Sant Marti",
    affectedStreets: ["Rambla del Poblenou", "Carrer de Pujades"],
  },
  {
    id: "a10",
    type: "accident",
    title: "Col lisio multiple a B-10",
    description: "Retencions severes en sentit Llobregat per retirada de vehicles.",
    lat: 41.36683,
    lng: 2.17488,
    severity: "high",
    status: "active",
    district: "Ciutat Vella",
    affectedStreets: ["Ronda del Litoral", "Moll de Barcelona"],
  },
];

export const layerConfig = {
  traffic: { label: "Transit", color: "#f97316", emoji: "\ud83d\ude97" },
  event: { label: "Esdeveniments", color: "#8b5cf6", emoji: "\ud83c\udfaa" },
  works: { label: "Obres", color: "#eab308", emoji: "\ud83d\udea7" },
  bus: { label: "Autobusos", color: "#3b82f6", emoji: "\ud83d\ude8c" },
  bicing: { label: "Bicing", color: "#22c55e", emoji: "\ud83d\udeb2" },
  accident: { label: "Accidents", color: "#ef4444", emoji: "\u26a0\ufe0f" },
};

export const severityColors = {
  high: "#ef4444",
  medium: "#f97316",
  low: "#22c55e",
};

function toBullets(items: MobilityItem[], limit = 6) {
  if (items.length === 0) return "- No hi ha incidencies destacades.";
  return items
    .slice(0, limit)
    .map((item) => {
      const streets = item.affectedStreets?.slice(0, 2).join(" / ");
      return `- ${item.title} (${item.district})${streets ? ` - ${streets}` : ""}`;
    })
    .join("\n");
}

const trafficActive = mobilityData.filter((item) => item.type === "traffic" && item.status === "active");
const worksActive = mobilityData.filter((item) => item.type === "works" && item.status !== "resolved");
const accidentActive = mobilityData.filter((item) => item.type === "accident" && item.status === "active");
const eventPlanned = mobilityData.filter((item) => item.type === "event" && item.status !== "resolved");
const transportUpdates = mobilityData.filter(
  (item) => (item.type === "bus" || item.type === "bicing") && item.status !== "resolved"
);

export const contextSummary = `
Ets l'assistent de mobilitat de Barcelona (BCN Mobility Assistant).
Tens acces a incidencies sintetiques pero coherents amb carrers i districtes reals.

DADES ACTUALS (${new Date().toLocaleDateString("ca-ES", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})}):

TRANSIT ACTIU:
${toBullets(trafficActive)}

OBRES EN CURS:
${toBullets(worksActive)}

ACCIDENTS ACTIUS:
${toBullets(accidentActive)}

ESDEVENIMENTS:
${toBullets(eventPlanned)}

TRANSPORT PUBLIC:
${toBullets(transportUpdates)}

Respon SEMPRE en catala.
Sigues concis, util i directe.
Recomana alternatives de mobilitat quan sigui rellevant.
`;

const BCN_BOUNDS = {
  minLat: 41.30,
  maxLat: 41.47,
  minLng: 2.05,
  maxLng: 2.24,
};

function validateMobilityDataset(items: MobilityItem[]) {
  if (items.length !== 55) {
    throw new Error(`Expected 55 incidents, got ${items.length}`);
  }

  for (const item of items) {
    const insideBounds =
      item.lat >= BCN_BOUNDS.minLat &&
      item.lat <= BCN_BOUNDS.maxLat &&
      item.lng >= BCN_BOUNDS.minLng &&
      item.lng <= BCN_BOUNDS.maxLng;

    if (!insideBounds) {
      throw new Error(`Incident ${item.id} is outside Barcelona bounds`);
    }
  }
}

validateMobilityDataset(mobilityData);
