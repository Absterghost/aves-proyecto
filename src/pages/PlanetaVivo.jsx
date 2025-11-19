import React from 'react';

// Importar las imágenes locales
import img5 from '../assets/planeta-vivo/IMG-20251119-WA0005.jpg';
import img6 from '../assets/planeta-vivo/IMG-20251119-WA0006.jpg';
import img7 from '../assets/planeta-vivo/IMG-20251119-WA0007.jpg';
import img8 from '../assets/planeta-vivo/IMG-20251119-WA0008.jpg';
import img9 from '../assets/planeta-vivo/IMG-20251119-WA0009.jpg';
import img10 from '../assets/planeta-vivo/IMG-20251119-WA0010.jpg';
import img11 from '../assets/planeta-vivo/IMG-20251119-WA0011.jpg';
import img12 from '../assets/planeta-vivo/IMG-20251119-WA0012.jpg';
import img13 from '../assets/planeta-vivo/IMG-20251119-WA0013.jpg';
import img14 from '../assets/planeta-vivo/IMG-20251119-WA0014.jpg';
import img15 from '../assets/planeta-vivo/IMG-20251119-WA0015.jpg';
import img16 from '../assets/planeta-vivo/IMG-20251119-WA0016.jpg';
import img17 from '../assets/planeta-vivo/IMG-20251119-WA0017.jpg';
import img18 from '../assets/planeta-vivo/IMG-20251119-WA0018.jpg';

// Array of all imported images
const images = [img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18];

// Merged and structured data for the sections
const baseSectionsData = [
  {
    title: 'Colombia: líder mundial en diversidad de aves',
    content: [
      'Colombia cuenta con más de 1.960 especies de aves, lo que equivale a cerca del 20% de las especies del planeta.',
      'En eventos como el Global Big Day, Colombia ha registrado entre 1.532 y 1.560 especies avistadas, ocupando consistentemente el primer lugar.',
    ],
  },
  {
    title: 'Funciones ecosistémicas esenciales',
    content: [
      'Polinización y dispersión de semillas, vitales para la regeneración forestal y la agricultura.',
      'Las aves controlan plagas y ayudan a mantener el equilibrio de los ecosistemas.',
    ],
  },
  {
    title: 'Aviturismo como motor económico sostenible',
    content: [
      'En 2019 más de 15.000 turistas extranjeros visitaron Colombia para el avistamiento de aves, generando aproximadamente USD 22 millones.',
      'Se estima que 150.000 observadores estadounidenses podrían visitar Colombia, lo que generaría cerca de USD 47 millones adicionales y 7.500 empleos.',
      'El ecoturismo está beneficiando directamente a comunidades rurales, promoviendo alternativas económicas en zonas postconflicto (Mesetas, Valle del Cauca) y contribuyendo a la conservación forestal.',
    ],
  },
  {
    title: 'Conservación activa y políticas nacionales',
    content: [
      'La Estrategia Nacional para la Conservación de las Aves (ENCA 2021-2030), liderada por Humboldt, Audubon y RNOA, busca integrar conservación con desarrollo sostenible y fortalecer una red de observadores de aves con más de 7.500 miembros.',
      'El “Libro Rojo de Aves de Colombia” identifica a 72 especies amenazadas, incluidas 27 endémicas.',
      'Organizaciones como la Fundación ProAves protegen hábitats de especies en riesgo a través de 27 reservas naturales.',
    ],
  },
  {
    title: 'Amenazas y desafíos',
    content: [
      'La deforestación es la mayor amenaza: el 96.5% de las aves forestales han perdido hábitat, y el 18% ha perdido más de la mitad de su hogar arbóreo; se espera que el impacto aumente hacia 2040 si continúa el ritmo actual.',
      'Otras amenazas incluyen la expansión agrícola, ganadera, cultivos ilícitos e infraestructura no sostenible.',
    ],
  },
  {
    title: 'Impactos positivos actuales',
    content: [
      'El aviturismo promueve la conservación de bosques porque las comunidades locales lo gestionan y se benefician directamente.',
      'Grandes reservas como Los Farallones (Cali) albergan +600 especies de aves, apoyan protección hídrica y ecoturismo comunitario.',
      'La Sierra Nevada de Santa Marta alberga más de 600 especies y es reconocida como reserva de la biosfera por su riqueza natural.',
    ],
  },
  {
    title: 'Caldas: Riqueza y diversidad de especies',
    content: [
      'Caldas alberga alrededor de 799–802 especies de aves, lo que representa cerca del 41–42% de las aves registradas en Colombia (799 según diagnóstico 2018; 802 según datos turísticos).',
      'De estas, 22 son endémicas, otras 73 casi endémicas, y 77 especies realizan migraciones.',
      'También hay 34 especies amenazadas a nivel nacional y 38 a nivel mundial, reflejando retos en conservación.',
    ],
  },
  {
    title: 'Caldas: Hogar de ecosistemas únicos',
    content: [
      'El territorio de Caldas cubre desde los 150 hasta los 5.200 metros de altitud, integrando variados ecosistemas como páramo, bosques andinos, valles interandinos y selvas húmedas.',
      'Estos ecosistemas posibilitan la presencia de grupos diversos como atrapamoscas, tangaras, colibríes, saltarines o pipridos, y emblemáticos como el Cóndor Andino y la Tángara Multicolor.',
    ],
  },
  {
    title: 'Caldas: Aviturismo, Eventos y Formación',
    content: [
      'El 42% de las especies del país favorecen a Caldas como destino líder en avistamiento de aves, atrayendo turistas nacionales e internacionales.',
      'En lugares como la Finca Tinamú, los visitantes crecieron de 172 en 2016 a más de 1.000 en un año, con el 82% de ellos extranjeros, generando empleo local.',
      'La actividad ha impulsado otros emprendimientos rurales, fortaleciendo el tejido económico comunitario (transporte, alojamiento, guianza).',
      'Caldas organiza desde 2009 el reconocido Congreso de Aviturismo, con ediciones anuales donde se comparten casos de éxito, talleres, salidas de campo y formación.',
      'Cada edición incorpora una especie icónica (por ejemplo, los saltarines o pipridos en 2024) como símbolo inspirador.',
    ],
  },
  {
    title: 'Caldas: Conservación y Ciencia Ciudadana',
    content: [
      'La Red de Aviturismo de Caldas, conformada por actores como Corpocaldas, Sociedad Caldense de Ornitología, Audubon, Cotelco y universidades, promueve el turismo de naturaleza ligado a conservación y ciencia ciudadana.',
      'Se confeccionó un diagnóstico del estado del conocimiento con salidas de campo, talleres y listas de especies, confirmando 799 especies y fortaleciendo clubes locales.',
      'Los clubes de observadores, apoyados por Corpocaldas, han sido equipados y capacitados para laborar en ciencia ciudadana, fomentando conciencia ecológica.',
      'Durante el Global Big Day, Caldas registró 562 especies, aportando significativamente a la plataforma eBird.',
    ],
  },
  {
    title: 'Manizales: Biodiversidad y Especies Destacadas',
    content: [
      'Manizales alberga aproximadamente 500–813 especies de aves, es decir, hasta el 43% de todas las especies del país.',
      'La Reserva Forestal Protectora Río Blanco, ubicada a apenas 2km de la ciudad, cuenta con unos 362–350–175 especies según diferentes censos.',
      'Aves emblemáticas incluyen: Momotus aequatorialis (barranquero), Oxypogon stubelii (bardudito de páramo), Henicorhina leucophrys (cucarachero), Eubucco bourcierii (torito cabecirrojo).',
      'En Río Blanco se observan antpittas, colibríes (hasta 50 juntos), tucanes de montaña y loros endémicos.',
    ],
  },
  {
    title: 'Manizales: Identidad urbana y monumentos aviares',
    content: [
      'Manizales se reconoce como una de las capitales del aviturismo en Colombia y muestra este orgullo con 11 esculturas monumentales de aves en varios parques y avenidas.',
      'El barranquero (Momotus aequatorialis) es el ave emblemática local desde 1995, presente en esculturas y jardines.',
    ],
  },
  {
    title: 'Manizales: Aviturismo, Comunidades y Aporte Social',
    content: [
      'Se llevan a cabo eventos como congresos, talleres y salidas de campo por la Sociedad Caldense de Ornitología y actores locales.',
      'Existen clubes de avistamiento (por ejemplo AndinAves, Ensiferas…) que visitan Río Blanco, Monteleón y Hacienda Venecia, involucrando comunidad local y niños.',
      'El aviturismo fortalece una economía verde y comunitaria: guías locales, alojamiento, alimentos y educación ambiental son actividades impulsadas por esta industria.',
      'Festivales y salidas guiadas se integran a la agenda local, destacando el valor cultural y educativo de la avifauna urbana y rural.',
    ],
  },
  {
    title: 'Manizales: Rutas, Sitios y Aves Migratorias',
    content: [
      'La Reserva Río Blanco es uno de los mejores lugares del mundo por hectárea, con más de 350–362 especies, incluyendo especies endémicas, migratorias, rapaces y amenazadas.',
      'Otras zonas de interés: Ecoparque Los Alcázares, Reserva Tinamú, Finca Romelia, cada una con más de 200 especies registradas.',
      'Muchas especies migratorias boreales llegan a la región, y la café de sombra ofrece hábitats adecuados para ellas.',
      'Están documentadas más de 37 especies migratorias en la Reserva Tinamú y Río Blanco ofrece zonas de invernada cruciales para aves del hemisferio norte.',
    ],
  },
];

const sectionsData = baseSectionsData.map((section, index) => ({
  ...section,
  image: images[index],
  alt: `Imagen de Planeta Vivo ${index + 1}`,
}));

// Componente para renderizar una sección individual
const ContentSection = ({ section, index, openLightbox }) => {
  const isImageLeft = index % 2 === 0;

  // This check is now redundant if all sections have images, but good for robustness
  if (!section.image) {
    return (
      <section className="my-12 md:my-20 py-10 px-8 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-emerald-300 leading-tight text-center">
          {section.title}
        </h2>
        <ul className="list-disc list-inside ml-6 space-y-3 text-lg text-gray-200 text-justify">
          {section.content.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>
    );
  }

  return (
    <section className="my-12 md:my-20">
      <div className={`flex flex-col md:flex-row items-center gap-10 ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>
        {/* Columna de la imagen */}
        <div className="w-full md:w-1/2">
          <img 
            src={section.image} 
            alt={section.alt}
            className="rounded-lg shadow-2xl object-cover w-full h-80 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => openLightbox({ src: section.image, alt: section.alt })}
          />
        </div>
        {/* Columna de texto */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-6 text-emerald-300 leading-tight">
            {section.title}
          </h2>
          <ul className="list-none space-y-4 text-lg text-gray-300">
            {section.content.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-1">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export function PlanetaVivo({ openLightbox }) {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-900 text-gray-100 max-w-5xl">
      <h1 className="text-5xl font-extrabold text-center text-emerald-400 mb-12 md:mb-20 pb-4 border-b-4 border-emerald-600 tracking-tight">
          Planeta Vivo
      </h1>
      
      {sectionsData.map((section, index) => (
        <ContentSection key={index} section={section} index={index} openLightbox={openLightbox} />
      ))}
    </div>
  );
}