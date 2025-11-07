import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { rutas as initialRutasData, coordsToGoogleMapsUrl, coordsToWazeUrl } from "../data/rutas";

// Fix iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapAutoFit({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      map.fitBounds(coords);
    }
  }, [coords, map]);
  return null;
}

export default function Georutas() {
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);

  // Cargar rutas desde localStorage o datos iniciales
  useEffect(() => {
    const storedRutas = localStorage.getItem('georutasData');
    if (storedRutas) {
      try {
        const parsedRutas = JSON.parse(storedRutas);
        setRutas(parsedRutas.map((ruta, index) => ({
          ...ruta,
          id: ruta.id || index + 1,
          coords: Array.isArray(ruta.coords) ? ruta.coords : [],
          isArchived: ruta.isArchived || false,
        })));
      } catch (e) {
        console.error("Error parsing georutasData from localStorage", e);
        setRutas(initialRutasData.map((ruta, index) => ({
          ...ruta,
          id: index + 1,
          coords: ruta.coords || [],
          isArchived: false,
        })));
      }
    } else {
      setRutas(initialRutasData.map((ruta, index) => ({
        ...ruta,
        id: index + 1,
        coords: ruta.coords || [],
        isArchived: false,
      })));
    }
  }, []);

  // Filtrar solo las rutas que NO están archivadas para mostrar en la página pública
  const activeRutas = rutas.filter(ruta => !ruta.isArchived);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-3">Georutas</h2>
      <p className="text-gray-400 mb-6">
        Explora rutas de avistamiento en Caldas. Selecciona una ruta para ver su
        recorrido, información y opciones de compartir.
      </p>

      {/* Mapa */}
      <div className="h-[300px] sm:h-[400px] w-full mb-6">
        <MapContainer
          center={[5.07, -75.52]}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full rounded shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Punto central */}
          <Marker position={[5.07, -75.52]}>
            <Popup>📍 Punto principal en Manizales</Popup>
          </Marker>

          {/* Dibujar solo la ruta seleccionada */}
          {rutaSeleccionada && (
            <>
              <Polyline
                positions={rutaSeleccionada.coords}
                pathOptions={{ color: "blue", weight: 4 }}
              />
              <MapAutoFit coords={rutaSeleccionada.coords} />
            </>
          )}
        </MapContainer>
      </div>

      {/* Lista de rutas */}
      <div className="space-y-4">
        {activeRutas.map((ruta) => (
          <div
            key={ruta.id}
            className="p-4 bg-gray-800 rounded shadow cursor-pointer hover:bg-gray-700"
            onClick={() => setRutaSeleccionada(ruta)}
          >
            <h3 className="font-semibold">{ruta.nombre}</h3>
            <p className="text-sm text-gray-400">
              {ruta.terreno} – {ruta.kmText}
            </p>
          </div>
        ))}
      </div>

      {/* Panel con info de la ruta seleccionada */}
      {rutaSeleccionada && (
        <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded shadow">
          <h3 className="text-lg font-bold mb-2 text-gray-200">{rutaSeleccionada.nombre}</h3>
          <p className="text-sm mb-1 text-gray-200">
            <strong>Distancia:</strong> {rutaSeleccionada.kmText}
          </p>
          <p className="text-sm mb-1 text-gray-200">
            <strong>Terreno:</strong> {rutaSeleccionada.terreno}
          </p>
          <p className="text-sm mb-1 text-gray-200">
            <strong>Aves:</strong> {rutaSeleccionada.aves}
          </p>
          <p className="text-sm mb-3 text-gray-200">
            <strong>Horario ideal:</strong> {rutaSeleccionada.horario}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={coordsToGoogleMapsUrl(rutaSeleccionada.coords)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Abrir en Google Maps
            </a>
            <a
              href={coordsToWazeUrl(rutaSeleccionada.coords)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Abrir en Waze
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
