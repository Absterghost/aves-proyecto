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

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Auto-fit component
function MapAutoFit({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      map.fitBounds(coords);
    }
  }, [coords, map]);
  return null;
}

// Convert coordinates to [lat, lng]
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

export default function Georutas() {
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [limiteCaldas, setLimiteCaldas] = useState(null);

  // Load all routes except the Caldas boundary
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

            return {
              id: idx + 1,
              nombre: feature.properties.name || `Ruta ${idx + 1}`,
              coords,
            };
          })
        );

        // Filtra el límite
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

  // Load Caldas boundary directly
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
            <Popup>📍 Punto principal en Manizales</Popup>
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
              {/* Centrar el mapa sobre el límite al cargar */}
              <MapAutoFit coords={limiteCaldas.coords} />
            </>
          )}

          {/* Ruta seleccionada */}
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
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-slate-50"
            onClick={() => setRutaSeleccionada(ruta)}
          >
            <h3 className="font-semibold">{ruta.nombre}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
