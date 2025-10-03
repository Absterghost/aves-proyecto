// src/pages/VerdeSaber.jsx
import React, { useState } from "react";
import FondoAnimado from "../components/FondoAnimado"; // el fondo animado que creamos
import CuentoAudio from "../components/CuentoAudio";   // componente de audio aleatorio
import JuegosInteractivos from "../components/JuegosInteractivos"; // placeholder para juegos

export default function VerdeSaber() {
  const [mostrarJuegos, setMostrarJuegos] = useState(false);

  return (
    <section className="relative min-h-screen">
      {/* Fondo animado */}
      <FondoAnimado />

      {/* Contenido sobre el fondo */}
      <div className="relative z-10 p-6 text-slate-800 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">Verde Saber</h2>

        <p className="mb-4 text-white drop-shadow-sm">
          Verde Saber es un espacio interactivo para profundizar en el conocimiento de las aves, su hábitat y todo lo relacionado con la biodiversidad de Manizales y el Eje Cafetero.
          Aprende sobre geografía, alimentación, árboles que habitan, migración y comportamiento de cada especie.
        </p>

        <ul className="list-disc pl-6 mb-6 text-white drop-shadow-sm space-y-2">
          <li>Explora la diversidad de aves residentes y migratorias.</li>
          <li>Conoce los ecosistemas de Manizales: bosques de niebla, cafetales y humedales urbanos.</li>
          <li>Aprende sobre la alimentación, reproducción y hábitos de cada especie.</li>
          <li>Participa en actividades interactivas y juegos educativos.</li>
        </ul>

        {/* Botón para mostrar juegos interactivos */}
        <button
          onClick={() => setMostrarJuegos(!mostrarJuegos)}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {mostrarJuegos ? "Ocultar Juegos" : "Mostrar Juegos Interactivos"}
        </button>

        {/* Componente de audio de cuentos aleatorios */}
        <CuentoAudio />

        {/* Componente de juegos */}
        {mostrarJuegos && <JuegosInteractivos />}
      </div>
    </section>
  );
}
