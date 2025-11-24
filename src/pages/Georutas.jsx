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

// ====================
// Corrección de íconos Leaflet
// ====================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ====================
// Componente para autoajustar el mapa a los límites
// ====================
function MapAutoFit({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      map.fitBounds(coords);
    }
  }, [coords, map]);
  return null;
}

// ====================
// Función auxiliar para extraer coordenadas de geometrías GeoJSON
// ====================
function extraerCoords(geometry) {
  if (!geometry) return [];
  if (geometry.type === "LineString") {
    return geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  }
  if (geometry.type === "Polygon") {
    return geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
  }
  if (geometry.type === "MultiLineString") {
    return geometry.coordinates.flat().map(([lng, lat]) => [lat, lng]);
  }
  return [];
}

// ====================
// Función para calcular la distancia total en km de una ruta
// ====================
function calcularDistancia(coords) {
  if (!coords || coords.length < 2) return 0;

  const R = 6371; // Radio de la Tierra en km
  let distancia = 0;

  for (let i = 0; i < coords.length - 1; i++) {
    const [lat1, lon1] = coords[i];
    const [lat2, lon2] = coords[i + 1];

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distancia += R * c;
  }

  return distancia; // en km
}

// ====================
// Componente principal
// ====================
export default function Georutas() {
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [limiteCaldas, setLimiteCaldas] = useState(null);

  // Cargar todas las rutas (excepto el límite de Caldas)
  useEffect(() => {
    const cargarRutas = async () => {
      try {
        const indexRes = await fetch("/rutas/index.json");
        const indexData = await indexRes.json();

        const rutasCargadas = await Promise.all(
          indexData.map(async (ruta, idx) => {
            const res = await fetch(`/rutas/${ruta.archivo}`);
            const data = await res.json();
            const feature = data.features[0];
            const coords = extraerCoords(feature.geometry);

            // Calcular distancia si no está definida en properties
            const distanciaCalculada = calcularDistancia(coords).toFixed(2);

            return {
              id: idx + 1,
              nombre: feature.properties.name || `Ruta ${idx + 1}`,
              coords,
              descripcion:
                feature.properties.descripcion || "Sin descripción disponible",
              distancia:
                feature.properties.distancia ||
                `${distanciaCalculada} km`,
              terreno: feature.properties.terreno || "No especificado",
              dificultad: feature.properties.dificultad || "No indicada",
            };
          })
        );

        const rutasSinLimite = rutasCargadas.filter(
          (r) => r.nombre !== "Limite Caldas"
        );

        setRutas(rutasSinLimite);
      } catch (error) {
        console.error("Error cargando rutas:", error);
      }
    };

    cargarRutas();
  }, []);

  // Cargar el límite de Caldas
  useEffect(() => {
    const cargarLimite = async () => {
      try {
        const res = await fetch("/rutas/limitecaldas.geojson");
        const data = await res.json();
        const feature = data.features[0];
        const coords = extraerCoords(feature.geometry);
        setLimiteCaldas({ coords });
      } catch (error) {
        console.error("Error cargando límite de Caldas:", error);
      }
    };

    cargarLimite();
  }, []);

  // ====================
  // Renderizado
  // ====================
  return (
    <section>
      <h2 className="text-2xl font-bold mb-3">Georutas</h2>

      <div className="h-[400px] w-full mb-3 relative">
        <MapContainer
          center={[5.07, -75.52]}
          zoom={9}
          scrollWheelZoom={true}
          className="h-full w-full rounded shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Punto principal */}
          <Marker position={[5.07, -75.52]}>
            <Popup>📍 Manizales</Popup>
          </Marker>

          {/* Límite de Caldas */}
          {limiteCaldas && limiteCaldas.coords && (
            <>
              <Polyline
                positions={limiteCaldas.coords}
                pathOptions={{
                  color: "orange",
                  weight: 3,
                  dashArray: "6,6",
                }}
              />
              <MapAutoFit coords={limiteCaldas.coords} />
            </>
          )}

          {/* Ruta seleccionada */}
          {rutaSeleccionada && (
            <>
              <Polyline
                positions={rutaSeleccionada.coords}
                pathOptions={{
                  color: "blue",
                  weight: 4,
                  dashArray: "4,9",
                }}
              />
              <MapAutoFit coords={rutaSeleccionada.coords} />
            </>
          )}
        </MapContainer>
      </div>

      {/* Información de la ruta seleccionada */}
      {rutaSeleccionada && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded shadow-sm">
          <h3 className="font-semibold text-lg mb-1">
            🗺️ {rutaSeleccionada.nombre}
          </h3>
          <p className="text-sm mb-1">
            <strong>Descripción:</strong> {rutaSeleccionada.descripcion}
          </p>
          <p className="text-sm mb-1">
            <strong>Distancia:</strong> {rutaSeleccionada.distancia}
          </p>
          <p className="text-sm mb-1">
            <strong>Terreno:</strong> {rutaSeleccionada.terreno}
          </p>
          <p className="text-sm">
            <strong>Dificultad:</strong> {rutaSeleccionada.dificultad}
          </p>
        </div>
      )}

      {/* Leyenda */}
      <div className="mb-6 text-sm text-slate-700">
        <span className="inline-block w-6 h-0.5 bg-orange-500 mr-2 border-t-2 border-orange-500 border-dashed"></span>
        <strong>Línea naranja punteada:</strong> Límite del departamento de Caldas
      </div>

      {/* Lista de rutas */}
      <div className="space-y-4">
        {rutas.map((ruta) => (
          <div
            key={ruta.id}
            className={`p-4 rounded shadow cursor-pointer transition ${
              rutaSeleccionada?.id === ruta.id
                ? "bg-blue-100 border border-blue-300"
                : "bg-white hover:bg-slate-50"
            }`}
            onClick={() => setRutaSeleccionada(ruta)}
          >
            <h3 className="font-semibold">{ruta.nombre}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
