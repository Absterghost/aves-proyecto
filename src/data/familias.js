import accipitriformesImg from '../assets/logos-ecoalas/accipitriformes.jpg';
import apodiformesImg from '../assets/logos-ecoalas/apodiformes.jpg';
import charadriiformesImg from '../assets/logos-ecoalas/charadriiformes.jpg';
import ciconiiformesImg from '../assets/logos-ecoalas/ciconiiformes.jpg';
import columbiformesImg from '../assets/logos-ecoalas/columbiformes.jpg';
import coraciiformesImg from '../assets/logos-ecoalas/coraciiformes.jpg';
import cuculiformesImg from '../assets/logos-ecoalas/cuculiformes.jpg';
import falconiformesImg from '../assets/logos-ecoalas/falconiformes.jpg';
import galliformesImg from '../assets/logos-ecoalas/galliformes.jpg';
import passeriformesImg from '../assets/logos-ecoalas/passeriformes.jpg';
import pelecaniformesImg from '../assets/logos-ecoalas/pelecaniformes.jpg';
import piciformesImg from '../assets/logos-ecoalas/piciformes.jpg';
import psittaciformesImg from '../assets/logos-ecoalas/psittaciformes.jpg';
import strigidaeImg from '../assets/logos-ecoalas/strigidae.jpg';

export const familias = [
  {
    nombre: "Accipitriformes",
    descripcion: "Águilas, gavilanes, buitres",
    habitatGeneral: "Zonas abiertas, bosques, montañas y sabanas; también se adaptan a áreas agrícolas.",
    dietaGeneral: "Carnívoros; cazan pequeños mamíferos, aves, reptiles y carroña.",
    estadoConservacionGeneral: "Amenazados por pérdida de hábitat, caza y envenenamiento; se promueven áreas protegidas y control de pesticidas.",
    tagsHabitat: ["Zona Abierta", "Bosque", "Montaña", "Agrícola"],
    tagsConservacion: ["Amenazado"],
    logo: accipitriformesImg,
  },
  {
    nombre: "Apodiformes",
    descripcion: "Colibríes y vencejos",
    habitatGeneral: "Bosques tropicales, zonas andinas, jardines y áreas urbanas con flores.",
    dietaGeneral: "Principalmente néctar, también pequeños insectos y arañas.",
    estadoConservacionGeneral: "Afectados por deforestación y uso de agroquímicos; se promueve la siembra de flores nativas y la protección de corredores biológicos.",
    tagsHabitat: ["Bosque Tropical", "Zona Andina", "Urbano"],
    tagsConservacion: ["Afectado por Deforestación"],
    logo: apodiformesImg,
  },
  {
    nombre: "Charadriiformes",
    descripcion: "Gaviotas, chorlitos, playeros",
    habitatGeneral: "Costas, humedales, playas y lagunas.",
    dietaGeneral: "Invertebrados acuáticos, peces pequeños y restos orgánicos.",
    estadoConservacionGeneral: "Amenazados por contaminación de cuerpos de agua y pérdida de humedales; se impulsan programas de conservación costera.",
    tagsHabitat: ["Zona Costera", "Humedal"],
    tagsConservacion: ["Amenazado"],
    logo: charadriiformesImg,
  },
  {
    nombre: "Ciconiiformes",
    descripcion: "Cigüeñas, garzas, ibis",
    habitatGeneral: "Humedales, ríos, manglares y campos inundados.",
    dietaGeneral: "Peces, anfibios, reptiles pequeños e insectos acuáticos.",
    estadoConservacionGeneral: "La contaminación y la desecación de humedales reducen sus poblaciones; requieren protección de ecosistemas acuáticos.",
    tagsHabitat: ["Humedal", "Río", "Manglar"],
    tagsConservacion: ["Reducción de Población"],
    logo: ciconiiformesImg,
  },
  {
    nombre: "Columbiformes",
    descripcion: "Palomas y tórtolas",
    habitatGeneral: "Bosques, zonas rurales y urbanas.",
    dietaGeneral: "Semillas, frutos y granos.",
    estadoConservacionGeneral: "La mayoría no está en peligro, pero algunas especies silvestres sufren por la caza y pérdida de hábitat.",
    tagsHabitat: ["Bosque", "Rural", "Urbano"],
    tagsConservacion: ["Preocupación Menor"],
    logo: columbiformesImg,
  },
  {
    nombre: "Coraciiformes",
    descripcion: "Martines pescadores, abejarucos",
    habitatGeneral: "Bosques, riberas de ríos y zonas tropicales.",
    dietaGeneral: "Peces, insectos voladores y pequeños invertebrados.",
    estadoConservacionGeneral: "Afectados por contaminación de ríos y pérdida de árboles ribereños.",
    tagsHabitat: ["Bosque", "Río", "Bosque Tropical"],
    tagsConservacion: ["Afectado por Contaminación"],
    logo: coraciiformesImg,
  },
  {
    nombre: "Cuculiformes",
    descripcion: "Cuclillos y corocoros",
    habitatGeneral: "Bosques tropicales, matorrales y sabanas.",
    dietaGeneral: "Insectos, orugas, pequeños vertebrados y frutos.",
    estadoConservacionGeneral: "Algunas especies se reducen por la fragmentación del hábitat y el cambio climático.",
    tagsHabitat: ["Bosque Tropical", "Matorral", "Sabana"],
    tagsConservacion: ["Reducción de Población"],
    logo: cuculiformesImg,
  },
  {
    nombre: "Falconiformes",
    descripcion: "Halcones y caracaras",
    habitatGeneral: "Zonas abiertas, montañas y áreas urbanas.",
    dietaGeneral: "Carnívoros; cazan aves, roedores e insectos.",
    estadoConservacionGeneral: "Amenazados por el uso de pesticidas y caza; se promueven programas de reproducción y liberación controlada.",
    tagsHabitat: ["Zona Abierta", "Montaña", "Urbano"],
    tagsConservacion: ["Amenazado"],
    logo: falconiformesImg,
  },
  {
    nombre: "Galliformes",
    descripcion: "Gallinas, pavos, codornices",
    habitatGeneral: "Bosques, pastizales y zonas agrícolas.",
    dietaGeneral: "Semillas, frutas, insectos y pequeños invertebrados.",
    estadoConservacionGeneral: "Pérdida de hábitat y caza excesiva afectan algunas especies silvestres; existen criaderos y reservas.",
    tagsHabitat: ["Bosque", "Pastizal", "Agrícola"],
    tagsConservacion: ["Afectado por Caza"],
    logo: galliformesImg,
  },
  {
    nombre: "Passeriformes",
    descripcion: "Aves cantoras, gorriones, mirlos",
    habitatGeneral: "Amplia variedad de ambientes: bosques, campos y zonas urbanas.",
    dietaGeneral: "Insectos, semillas, frutas y néctar.",
    estadoConservacionGeneral: "La contaminación, deforestación y depredadores domésticos (gatos) son las principales amenazas; se promueve la educación ambiental.",
    tagsHabitat: ["Bosque", "Urbano", "Variado"],
    tagsConservacion: ["Amenaza General"],
    logo: passeriformesImg,
  },
  {
    nombre: "Pelecaniformes",
    descripcion: "Pelícanos, garzas, cormoranes",
    habitatGeneral: "Zonas costeras, lagunas, ríos y manglares.",
    dietaGeneral: "Peces y crustáceos.",
    estadoConservacionGeneral: "Amenazados por derrames de petróleo y pesca excesiva; se requiere proteger los ecosistemas acuáticos.",
    tagsHabitat: ["Zona Costera", "Humedal", "Río"],
    tagsConservacion: ["Amenazado"],
    logo: pelecaniformesImg,
  },
  {
    nombre: "Piciformes",
    descripcion: "Pájaros carpinteros, tucanes",
    habitatGeneral: "Bosques tropicales y templados, especialmente árboles maduros.",
    dietaGeneral: "Insectos, larvas, frutas y semillas.",
    estadoConservacionGeneral: "La tala de árboles reduce sitios de anidación; se promueve la conservación de bosques nativos.",
    tagsHabitat: ["Bosque Tropical", "Bosque Templado"],
    tagsConservacion: ["Afectado por Deforestación"],
    logo: piciformesImg,
  },
  {
    nombre: "Psittaciformes",
    descripcion: "Loros, guacamayos, pericos",
    habitatGeneral: "Bosques tropicales, sabanas arboladas y manglares.",
    dietaGeneral: "Frutas, semillas, nueces y flores.",
    estadoConservacionGeneral: "Amenazados por el tráfico ilegal y la deforestación; existen programas de rescate y reproducción en cautiverio.",
    tagsHabitat: ["Bosque Tropical", "Sabana", "Manglar"],
    tagsConservacion: ["Tráfico Ilegal"],
    logo: psittaciformesImg,
  },
  {
    nombre: "Strigidae",
    descripcion: "Búhos y lechuzas",
    habitatGeneral: "Bosques, praderas, zonas rurales y urbanas.",
    dietaGeneral: "Roedores, insectos y pequeños vertebrados.",
    estadoConservacionGeneral: "La pérdida de hábitat y la superstición humana los afectan; se promueve su conservación por su papel en el control biológico.",
    tagsHabitat: ["Bosque", "Rural", "Urbano"],
    tagsConservacion: ["Pérdida de Hábitat"],
    logo: strigidaeImg,
  },
];
