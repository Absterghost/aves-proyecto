import barranquero from '../assets/imagenes/barranquero.png';
import pavaAndina from '../assets/imagenes/pava_andina.png';
import colibri from '../assets/imagenes/colibri_cobrizo.jpg';
import charaVerde from '../assets/imagenes/chara_verde.jpg';

import { BookOpen, Map, Users, Leaf, Bird, Image, Shield } from 'lucide-react';

export const homeContent = {
  heroSection: { // Añadido para evitar el error de undefined
    title: 'Aves Caldas',
    description: '',
  },
  welcomeSection: {
    title: 'Introducción',
    description: 'El semillero de investigación “Aves Caldas” de la Tecnoacademia es un espacio académico dedicado al estudio, observación y conservación de las aves del departamento de Caldas. Nuestro propósito es fomentar el interés por la investigación científica y la educación ambiental, promoviendo el conocimiento de la biodiversidad regional y la importancia de proteger los ecosistemas que albergan esta valiosa riqueza natural.',
    images: [], // Empty array to remove the gallery
  },
  explorerSections: [
    { path: '/ecoalas', label: 'EcoAlas', description: 'Explora un compendio detallado de familias de aves, sus hábitats y estados de conservación.', iconName: 'BookOpen' },
    { path: '/georutas', label: 'Georutas', description: 'Descubre y navega rutas de avistamiento optimizadas para encontrar la mayor diversidad de aves.', iconName: 'Map' },
    { path: '/semillero', label: 'Semillero', description: 'Conoce a nuestro equipo de investigación, sus proyectos y eventos dedicados a la ornitología.', iconName: 'Users' },
    { path: '/verdesaber', label: 'Verde Saber', description: 'Aprende conceptos clave sobre la avifauna y la importancia de su conservación.', iconName: 'Leaf' },
    { path: '/zonotrichia', label: 'Zonotrichia', description: 'Un estudio a fondo del Zonotrichia capensis, el copetón, y su importancia.', iconName: 'Bird' },
    { path: '/planetavivo', label: 'Planeta Vivo', description: 'Una galería visual que captura la belleza y fragilidad de la vida silvestre.', iconName: 'Image' }
  ],
  adminSection: {
    path: '/login', 
    label: 'Admin Dashboard', 
    description: 'Accede al panel de administración para gestionar el contenido del semillero y las especies de aves.', 
    iconName: 'Shield',
    isFeatured: true
  }
};