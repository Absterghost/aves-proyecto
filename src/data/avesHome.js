// src/data/avesData.js
// Este archivo contiene los datos de las aves para la página de inicio.

// Importamos las imágenes de las aves
import lechuzonImg from '../assets/imagenes/lechuzon_de_anteojos.jpg';
import pinchaflorImg from '../assets/imagenes/pinchaflor_enmascarado.jpg';
import mieleritoImg from '../assets/imagenes/mielerito_verde.jpg';
import afrecheroImg from '../assets/imagenes/afrechero.jpg';
import martinPescadorImg from '../assets/imagenes/martin_pescador_verde.jpg';
import charaVerdeImg from '../assets/imagenes/chara_verde.jpg';
import pavaAndinaImg from '../assets/imagenes/pava_andina.png';
import barranqueroImg from '../assets/imagenes/barranquero.png';
import trepatroncosImg from '../assets/imagenes/trepatroncos_tiranino.jpg';
import mosqueroNegroImg from '../assets/imagenes/mosquero_negro.jpg';
import colibriCobrizoImg from '../assets/imagenes/colibri_cobrizo.jpg';
import garzaCucaImg from '../assets/imagenes/garza_cuca.jpg';
import mosqueroCardenalImg from '../assets/imagenes/mosquero_cardenal.jpg';

// Array con la información de cada ave
export const aves = [
  {
    nombre: "Lechuzón de Anteojos",
    nombreCientifico: "Pulsatrix perspicillata",
    imagen: lechuzonImg,
    descripcion: "Plumas blancas alrededor de los ojos que parecen unos anteojos lo cual dau aspecto único y reconocible en la selva.",
    familia: "Strigidae"
  },
  {
    nombre: "Pinchaflor Enmascarado",
    nombreCientifico: "Diglossa cyanea",
    imagen: pinchaflorImg,
    descripcion: "Tiene un pico curvado con forma de gancho que le permite perforar flores para robar nectar sin polinizarlos.",
    familia: "Thraupidae"
  },
  {
    nombre: "Mielerito Verde",
    nombreCientifico: "Chlorophanes spiza",
    imagen: mieleritoImg,
    descripcion: "Su color verde brillante lo camufla perfectamente entre el follaje, tanto machos como hembras colaboran buscando néctar y frutas.",
    familia: "Thraupidae"
  },
  {
    nombre: "Afrechero",
    nombreCientifico: "Sicalis flaveola",
    imagen: afrecheroImg,
    descripcion: "Es un ave muy comun en pueblos y cuidades andinas, y su canto varia según la region, como si tuviera diferentes dialectos.",
    familia: "Thraupidae"
  },
  {
    nombre: "Martín Pescador Verde",
    nombreCientifico: "Chloroceryle americana",
    imagen: martinPescadorImg,
    descripcion: "Se lanza en picada al agua para atrapar peces pequeños, usando su largo pico como arpón.",
    familia: "Alcedinidae"
  },
  {
    nombre: "Chara Verde",
    nombreCientifico: "Cyanocorax yncas",
    imagen: charaVerdeImg,
    descripcion: "Es muy sociable y ruidosa, suele vivir en grupos familiares, se comunica con llamados fuertes y variados.",
    familia: "Corvidae"
  },
  {
    nombre: "Pava Andina",
    nombreCientifico: "Penelope montagnii",
    imagen: pavaAndinaImg,
    descripcion: "Aunque es grande y parece torpe, vuela de forma rapida y con fuertes aleteos ruidosos que la delatan en el bosque.",
    familia: "Cracidae"
  },
  {
    nombre: "Barranquero Andino",
    nombreCientifico: "Momotus aequatorialis",
    imagen: barranqueroImg,
    descripcion: "Tiene una cola con puntas en forma de raqueta, que mueve como un péndulo cuando se siente en peligro o esta alerta.",
    familia: "Momotidae"
  },
  {
    nombre: "Trepatroncos Tiranino",
    nombreCientifico: "Dendrocincla tyrannina",
    imagen: trepatroncosImg,
    descripcion: "Suele seguir a las columnas de hormigas cazadoras para atrapar los insectos que escapen de ellas.",
    familia: "Furnariidae"
  },
  {
    nombre: "Mosquero Negro",
    nombreCientifico: "Sayornis nigricans",
    imagen: mosqueroNegroImg,
    descripcion: "Se posa en ramas o cables cerca del agua  y se lanza en vuelos cortos para atrapar los insectos en el aire.",
    familia: "Tyrannidae"
  },
  {
    nombre: "Colibrí Cobrizo",
    nombreCientifico: "Aglaeactis cupripennis",
    imagen: colibriCobrizoImg,
    descripcion: "Su plumaje metalico refleja la luz del sol y brilla como si estuviera hecho de cobre pulido.",
    familia: "Trochilidae"
  },
  {
    nombre: "Garza Cuca",
    nombreCientifico: "Ardea cocoi",
    imagen: garzaCucaImg,
    descripcion: "Permanece quieta por varios minutos en la orilla esperando pacientemente a que pase un pez para atraparlo.",
    familia: "Ardeidae"
  },
  {
    nombre: "Mosquero Cardenal",
    nombreCientifico: "Pyrocephalus rubinus",
    imagen: mosqueroCardenalImg,
    descripcion: "El macho luce en plumaje rojo intenso que contrasta con los ojos paisajes secos y abiertos donde suele vivir.",
    familia: "Tyrannidae"
  }
];
