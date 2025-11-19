import React, { useState } from 'react';
import Lightbox from '../Lightbox';

// Importar las imágenes locales
import afre from '../../assets/Zonotrichia/afre.JPG';
import afrechero from '../../assets/Zonotrichia/Afrechero .JPG';
import dscn0173 from '../../assets/Zonotrichia/DSCN0173.jpg';
import dscn0187 from '../../assets/Zonotrichia/DSCN0187.jpg';
import dscn0201 from '../../assets/Zonotrichia/DSCN0201.jpg';
import img5625 from '../../assets/Zonotrichia/IMG_5625.JPG';
import img7548 from '../../assets/Zonotrichia/IMG_7548.jpg';
import zono from '../../assets/zonotrichia/zono.jpg';
import zonootri from '../../assets/zonotrichia/zonootri.jpg';
import zonot from '../../assets/zonotrichia/zonot.jpg';

const sectionsData = [
  {
    title: 'Información científica y ecológica sobre Zonotrichia capensis',
    image: dscn0173,
    alt: 'Zonotrichia capensis en su hábitat natural',
    content: [
      '<strong>Nombre científico:</strong> Zonotrichia capensis ',
      '<strong>Nombre común:</strong> Copetón, Chingolo, Gorrión andino',
      '<strong>Familia:</strong> Passerellidae ',
    ],
  },
  {
    title: 'Distribución geográfica',
    image: dscn0187,
    alt: 'Paisaje andino, hábitat del Zonotrichia capensis',
    content: [
      'En Colombia, está presente desde el nivel del mar hasta aproximadamente 4.000 metros de altitud, siendo muy común en los Andes, especialmente en Caldas, donde se encuentra tanto en áreas rurales como urbanas, parques, jardines, potreros y zonas de borde de bosque.',
    ],
  },
  {
    title: 'Hábitat y comportamiento en Caldas',
    image: dscn0201,
    alt: 'Zonotrichia capensis perchado en una rama',
    content: [
      'En el departamento de Caldas, el copetón es una de las especies más abundantes y visibles. Se le puede observar en municipios como Manizales, Villamaría, Neira, Salamina, Riosucio y Chinchiná, entre otros. Prefiere ambientes abiertos, donde puede alimentarse fácilmente en el suelo. Durante las primeras horas de la mañana y el atardecer es especialmente activo, y su canto es un sonido característico de nuestras montañas.',
      '<ul><li>Altitud en Caldas: entre 1.200 y 3.200 m s. n. m.</li><li>Hábitats frecuentes: bordes de caminos, cafetales, praderas, jardines escolares y zonas de reforestación.</li><li>Adaptabilidad: resiste muy bien las transformaciones del paisaje y la presencia humana.</li></ul>',
    ],
  },
  {
    title: 'Alimentación',
    image: afre,
    alt: 'Zonotrichia capensis buscando alimento',
    content: [
      'Es un ave omnívora con tendencia granívora. En Caldas se alimenta principalmente de:',
      '<ul><li>Semillas de gramíneas y malezas comunes.</li><li>Pequeños insectos (especialmente en época reproductiva).</li><li>Restos orgánicos y migas en zonas urbanas.</li></ul>',
      'Durante los meses lluviosos aumenta su consumo de insectos, ya que estos aportan proteínas esenciales para el desarrollo de los polluelos.',
    ],
  },
  {
    title: 'Morfología',
    image: afrechero,
    alt: 'Detalle del plumaje del Zonotrichia capensis',
    content: [
      '<ul><li>Tamaño: entre 13 y 15 cm de longitud.</li><li>Peso: alrededor de 20–25 gramos.</li><li>Plumaje: pecho grisáceo, abdomen blanco, coronilla gris con franjas negras, y un característico copete eréctil. En los adultos destaca una franja castaña en la nuca y una línea negra ocular.</li><li>Dimorfismo sexual poco evidente: machos y hembras son similares, aunque los machos suelen cantar más y tener colores ligeramente más marcados.</li></ul>',
    ],
  },
  {
    title: 'Canto y comunicación',
    image: img5625,
    alt: 'Zonotrichia capensis cantando',
    content: [
      'El canto del copetón es uno de los sonidos más reconocibles en el paisaje sonoro andino. Cada individuo presenta variaciones regionales en su canto, lo que lo convierte en un excelente modelo de estudio para la bioacústica y el aprendizaje vocal en aves.',
      'En Caldas se ha registrado que:',
      '<ul><li>Los individuos urbanos presentan cantos más agudos y cortos debido al ruido ambiental (contaminación acústica).</li><li>En zonas rurales, el canto es más largo y complejo, favoreciendo la comunicación entre parejas y la defensa de territorio.</li></ul>',
    ],
  },
  {
    title: 'Reproducción',
    image: img7548,
    alt: 'Nido de Zonotrichia capensis con huevos',
    content: [
      '<ul><li>Época reproductiva: principalmente entre marzo y agosto, coincidiendo con el aumento de lluvias y disponibilidad de alimento.</li><li>Nido: en forma de taza, hecho con pastos y fibras vegetales, generalmente a baja altura (entre 10 y 50 cm del suelo).</li><li>Huevos: de 2 a 3 por puesta, con coloración verdosa o azulada con manchas oscuras.</li><li>Incubación: 12–14 días, a cargo principalmente de la hembra.</li></ul>',
    ],
  },
  {
    title: 'Importancia ecológica',
    image: zono,
    alt: 'Zonotrichia capensis en un entorno natural',
    content: [
      'El Zonotrichia capensis cumple roles ecológicos clave:',
      '<ul><li>Control biológico de insectos.</li><li>Dispersión de semillas.</li><li>Indicador biológico del grado de perturbación del paisaje: su presencia en ambientes urbanos demuestra su adaptabilidad, pero una disminución en zonas rurales podría indicar alteraciones en el ecosistema.</li></ul>',
    ],
  },
  {
    title: 'Amenazas y conservación',
    image: zonootri,
    alt: 'Zonotrichia capensis en un área urbana',
    content: [
      'Aunque no se encuentra en categoría de amenaza (según la UICN: Preocupación menor LC), enfrenta varios desafíos locales:',
      '<ul><li>Contaminación acústica (interfiere en su comunicación y comportamiento).</li><li>Fragmentación del hábitat rural.</li><li>Uso de agroquímicos que reducen la disponibilidad de insectos.</li></ul>',
      'Por ello, su estudio en Caldas como bioindicador y especie bandera para programas de educación ambiental es fundamental.',
    ],
  },
  {
    title: 'Dato científico interesante',
    image: zonot,
    alt: 'Primer plano de un Zonotrichia capensis',
    content: [
      'Investigaciones realizadas en el Eje Cafetero (incluyendo Manizales y Villamaría) han demostrado que los copetones modifican su canto para adaptarse al ruido del tráfico urbano, un fenómeno de plasticidad acústica que revela su capacidad de ajuste frente a la presión humana. Esto lo convierte en un excelente modelo para estudios de ecología urbana, comunicación animal y conservación acústica.',
    ],
  },
];

const ContentSection = ({ section, index, onImageClick }) => {
  const isImageLeft = index % 2 === 0;

  if (!section.image) {
    return (
      <section className="my-12 md:my-20 py-10 px-8 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-emerald-300 leading-tight text-center">
          {section.title}
        </h2>
        <div className="list-disc list-inside ml-6 space-y-3 text-lg text-gray-200 text-justify" dangerouslySetInnerHTML={{ __html: section.content.join('') }} />
      </section>
    );
  }

  return (
    <section className="my-12 md:my-20">
      <div className={`flex flex-col md:flex-row items-center gap-10 ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>
        <div className="w-full md:w-1/2" style={{height: '30rem'}}>
          <img 
            src={section.image} 
            alt={section.alt}
            className="rounded-lg shadow-2xl object-cover w-full h-full transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => onImageClick(section.image)}
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-6 text-emerald-300 leading-tight">
            {section.title}
          </h2>
          <div className="list-none space-y-4 text-lg text-gray-300" dangerouslySetInnerHTML={{ __html: section.content.join('') }} />
        </div>
      </div>
    </section>
  );
};

export default function ZonotrichiaContent() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-900 text-gray-100 max-w-5xl">
      <h1 className="text-5xl font-extrabold text-center text-emerald-400 mb-12 md:mb-20 pb-4 border-b-4 border-emerald-600 tracking-tight">
          Zonotrichia capensis
      </h1>
      
      {sectionsData.map((section, index) => (
        <ContentSection key={index} section={section} index={index} onImageClick={handleImageClick} />
      ))}

      {selectedImage && (
        <Lightbox data={selectedImage} onClose={handleCloseLightbox} />
      )}
    </div>
  );
}