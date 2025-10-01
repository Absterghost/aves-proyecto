import React from "react";

const birds = [
  {
    name: "Cardenal rojo",
    scientific: "Cardinalis cardinalis",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/Cardinalis_cardinalis_male_RWD2.jpg",
    description:
      "El macho es intensamente rojo, muy llamativo en jardines y bosques."
  },
  {
    name: "Barranquero andino",
    scientific: "Momotus aequatorialis",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Momotus_aequatorialis_-Ecuador-8.jpg",
    description:
      "Ave andina con cola en forma de raqueta, común en bosques húmedos."
  },
  {
    name: "Tucán toco",
    scientific: "Ramphastos toco",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7e/Toco_toucan_RWD3.jpg",
    description:
      "Con su enorme pico colorido, es uno de los tucanes más famosos."
  },
  {
    name: "Colibrí garganta rubí",
    scientific: "Archilochus colubris",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Ruby-throated_Hummingbird_-_male.jpg",
    description:
      "Un colibrí diminuto que puede batir sus alas hasta 50 veces por segundo."
  },
  {
    name: "Mirla común",
    scientific: "Turdus fuscater",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/26/Turdus_fuscater_-Bogota%2C_Colombia-8.jpg",
    description:
      "Ave urbana típica en ciudades andinas, canta fuerte al amanecer."
  }
];

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🐦 Aves destacadas</h1>
      <p className="text-gray-600 mb-8">
        Bienvenido al proyecto de avistamiento de aves. Aquí encontrarás algunas
        de las especies más representativas, con información básica y fotos
        reales.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {birds.map((bird, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={bird.image}
              alt={bird.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{bird.name}</h2>
              <p className="text-sm italic text-gray-500">
                {bird.scientific}
              </p>
              <p className="mt-2 text-gray-700">{bird.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
