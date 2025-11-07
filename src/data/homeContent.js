import barranquero from '../assets/imagenes/barranquero.png';
import pavaAndina from '../assets/imagenes/pava_andina.png';
import colibri from '../assets/imagenes/colibri_cobrizo.jpg';
import charaVerde from '../assets/imagenes/chara_verde.jpg';

import { BookOpen, Map, Users, Leaf, Bird, Image, Shield } from 'lucide-react';

export const homeContent = {
  heroSection: { // Añadido para evitar el error de undefined
    title: 'Avess: Un Vuelo por la Biodiversidad',
    description: 'Una plataforma interactiva para explorar, aprender y maravillarse con la increíble diversidad de aves en nuestro territorio.',
  },
  welcomeSection: {
    title: 'Bienvenidos a Avess',
    description: 'Un proyecto dedicado a la exploración, documentación y conservación de la rica avifauna de nuestro territorio. Nuestra plataforma ofrece herramientas para que tanto aficionados como expertos puedan descubrir y aprender sobre las especies que nos rodean. Sumérgete en un mundo de conocimiento, explora rutas de avistamiento y únete a nuestra comunidad de investigación.',
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