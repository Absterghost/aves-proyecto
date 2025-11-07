import React from 'react';

// Importar imágenes de aves y QR
import barranqueroImg from '../../assets/CODIGOS-QR/barranquero .png';
import carriquiImg from '../../assets/CODIGOS-QR/carriqui.png';
import colibriImg from '../../assets/CODIGOS-QR/colibri.png';
import tangaraImg from '../../assets/CODIGOS-QR/Tangara.png';

import barranqueroQR from '../../assets/CODIGOS-QR/QR_barranquero.jpeg';
import carriquiQR from '../../assets/CODIGOS-QR/QR_Carriquí.jpeg';
import colibriQR from '../../assets/CODIGOS-QR/QR_Colibri_chispi.jpeg';
import tangaraQR from '../../assets/CODIGOS-QR/QR_Tangara.jpeg';

const VerdeSaberContent = () => {
  const avesParaMostrar = [
    {
      nombreComun: "Barranquero",
      descripcion: "El Momotus aequatorialis, un ave grande y vistosa con una cola larga y distintiva. Su plumaje combina tonos de verde, azul y canela.",
      imagen: barranqueroImg,
      qr: barranqueroQR,
    },
    {
      nombreComun: "Carriquí",
      descripcion: "El Cyanocorax yncas, o chara verde, es un córvido social e inteligente. Presenta un plumaje verde brillante con cabeza y pecho negros.",
      imagen: carriquiImg,
      qr: carriquiQR,
    },
    {
      nombreComun: "Colibrí Chispi",
      descripcion: "Aves diminutas y ágiles, famosas por su capacidad de cernerse en el aire. Su plumaje iridiscente brilla con múltiples colores bajo la luz.",
      imagen: colibriImg,
      qr: colibriQR,
    },
    {
      nombreComun: "Tángara",
      descripcion: "Aves coloridas de bosques tropicales. El macho posee un plumaje rojo intenso, mientras que la hembra es de tonos amarillos y olivas.",
      imagen: tangaraImg,
      qr: tangaraQR,
    }
  ];

  return (
    <div className="py-8 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-8">Conecta con la Naturaleza en 3 Pasos</h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto text-gray-300">
          
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50">
            <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-gray-900 font-bold text-2xl">1</span>
            <p className="text-left text-lg">Elige un ave y admira su ilustración.</p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50">
            <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-gray-900 font-bold text-2xl">2</span>
            <p className="text-left text-lg">Abre la cámara de tu móvil y escanea el QR.</p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50">
            <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-gray-900 font-bold text-2xl">3</span>
            <p className="text-left text-lg">Apunta a la imagen y ¡deja que el ave te cuente su historia!</p>
          </div>

        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {avesParaMostrar.map((ave, index) => (
          <div 
            key={index} 
            className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-700 transition-all duration-300 hover:shadow-emerald-500/30 hover:border-emerald-500 transform hover:-translate-y-2"
          >
            <div className="md:w-1/2 w-full bg-black flex items-center justify-center p-4">
              <img src={ave.imagen} alt={`Imagen de ${ave.nombreComun}`} className="object-contain w-full h-64 md:h-full" />
            </div>
            <div className="md:w-1/2 w-full p-6 flex flex-col justify-center items-center text-center">
              <h2 className="text-2xl font-bold text-white mb-3">{ave.nombreComun}</h2>
              <p className="text-gray-400 text-base mb-5">{ave.descripcion}</p>
              <div className="bg-white p-2 rounded-lg">
                <img src={ave.qr} alt={`Código QR para ${ave.nombreComun}`} className="w-32 h-32" />
              </div>
              <p className="mt-4 text-sm text-emerald-400 font-semibold">Escanea para descubrir más</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerdeSaberContent;