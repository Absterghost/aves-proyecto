// src/pages/Georutas.jsx
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Centrar el mapa en la ruta seleccionada
function MapAutoFit({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      map.fitBounds(coords);
    }
  }, [coords, map]);
  return null;
}

// Enlaces externos
function coordsToGoogleMapsUrl(coords) {
  if (!coords || coords.length === 0) return "#";
  const path = coords.map((c) => `${c[0]},${c[1]}`).join("/");
  return `https://www.google.com/maps/dir/${path}`;
}

function coordsToWazeUrl(coords) {
  if (!coords || coords.length === 0) return "#";
  const [lat, lng] = coords[0];
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

// Función para calcular distancia total en metros
function calcularDistancia(coords) {
  let distancia = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const puntoA = L.latLng(coords[i][0], coords[i][1]);
    const puntoB = L.latLng(coords[i + 1][0], coords[i + 1][1]);
    distancia += puntoA.distanceTo(puntoB); // metros
  }
  return distancia;
}

export default function Georutas() {
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);

  useEffect(() => {
    const cargarRutas = async () => {
      const archivos = ["ecoparquealcazaresarenillo.geojson"];

      const rutasCargadas = await Promise.all(
        archivos.map(async (file, idx) => {
          const res = await fetch(`/rutas/${file}`);
          const data = await res.json();
          console.log("GeoJSON cargado:", data);

          // Tomamos solo la primera feature del archivo (o puedes iterar si hay varias)
          const feature = data.features[0];

          const coords =
            feature.geometry.type === "LineString"
              ? feature.geometry.coordinates.map(([lng, lat]) => [lat, lng])
              : [];

          return {
            id: idx + 1,
            nombre: feature.properties.name || `Ruta ${idx + 1}`,
            terreno: feature.properties.terreno || "Mixto",
            kmText: feature.properties.km || "N/A",
            aves: feature.properties.aves || "No definido",
            horario: feature.properties.horario || "Cualquier hora",
            descripcion: feature.properties.descripcion || "Sin descripción",
            coords,
            distancia: calcularDistancia(coords), // en metros
          };
        })
      );

      setRutas(rutasCargadas);
    };

    cargarRutas();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-3">Georutas</h2>
      <p className="text-slate-600 mb-6">
        Explora rutas de avistamiento en Caldas. Selecciona una ruta para ver su
        recorrido, información y opciones de abrir en mapas.
      </p>

      {/* Mapa */}
      <div className="h-[400px] w-full mb-6">
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

          {/* Punto principal */}
          <Marker position={[5.07, -75.52]}>
            <Popup>📍 Punto principal en Manizales</Popup>
          </Marker>

          {/* Dibujar la ruta seleccionada */}
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
        {rutas.map((ruta) => (
          <div
            key={ruta.id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-slate-50"
            onClick={() => setRutaSeleccionada(ruta)}
          >
            <h3 className="font-semibold">{ruta.nombre}</h3>
            <p className="text-sm text-slate-500">
              {ruta.terreno} – {(ruta.distancia / 1000).toFixed(2)} km
            </p>
          </div>
        ))}
      </div>

      {/* Info de la ruta seleccionada */}
      {rutaSeleccionada && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded shadow">
          <h3 className="text-lg font-bold mb-2">{rutaSeleccionada.nombre}</h3>
          <p className="text-sm mb-1">
            <strong>Distancia:</strong> {(rutaSeleccionada.distancia / 1000).toFixed(2)} km
          </p>
          <p className="text-sm mb-1">
            <strong>Terreno:</strong> {rutaSeleccionada.terreno}
          </p>
          <p className="text-sm mb-1">
            <strong>Aves:</strong> {rutaSeleccionada.aves.join ? rutaSeleccionada.aves.join(", ") : rutaSeleccionada.aves}
          </p>
          <p className="text-sm mb-1">
            <strong>Horario ideal:</strong> {rutaSeleccionada.horario}
          </p>
          <p className="text-sm mb-3">
            <strong>Descripción:</strong> {rutaSeleccionada.descripcion}
          </p>

          <div className="flex gap-3">
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
