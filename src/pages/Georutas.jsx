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
import RouteInfoBox from "../components/RouteInfoBox";

// Fix for default Leaflet icon path issues with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom pulsating icon for the main marker
const mainIcon = L.divIcon({
  className: "pulsating-icon",
  html: `<div class="ring"></div><div class="dot"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Auto-fit component to nicely frame the selected route or default bounds
function MapAutoFit({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      map.flyToBounds(coords, { padding: [70, 70], duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

// Helper to extract coordinates
function extraerCoords(geometry) {
  if (!geometry || !geometry.type || !geometry.coordinates) {
    return [];
  }

  let coordsArray;

  switch (geometry.type) {
    case "LineString":
      coordsArray = geometry.coordinates;
      break;
    case "Polygon":
      coordsArray = geometry.coordinates[0];
      break;
    case "MultiLineString":
      coordsArray = geometry.coordinates.flat();
      break;
    default:
      return [];
  }

  if (!Array.isArray(coordsArray)) {
    return [];
  }

  // Defensive mapping to prevent crashes from malformed data
  return coordsArray
    .filter(point => Array.isArray(point) && point.length >= 2 && typeof point[0] === 'number' && typeof point[1] === 'number')
    .map(([lng, lat]) => [lat, lng]);
}

export default function Georutas() {
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [limiteCaldas, setLimiteCaldas] = useState(null);
  const [currentMapBounds, setCurrentMapBounds] = useState(null);
  const [hoveredRouteId, setHoveredRouteId] = useState(null); // Estado para el hover

  useEffect(() => {
    const fetchData = async (url) => (await fetch(url)).json();

    const cargarDatos = async () => {
      try {
        const indexData = await fetchData("/rutas/index.json");
        const rutasPromesas = indexData
          .filter(ruta => ruta.archivo !== "limitecaldas.geojson")
          .map(async (rutaInfo, idx) => {
            const data = await fetchData(`/rutas/${rutaInfo.archivo}`);
            const feature = data.features[0];
            return {
              id: idx,
              nombre: feature.properties.name || `Ruta ${idx + 1}`,
              coords: extraerCoords(feature.geometry),
              properties: feature.properties, // Keep all properties
            };
          });
        
        const limiteData = await fetchData("/rutas/limitecaldas.geojson");
        const limiteFeature = limiteData.features[0];

        setRutas(await Promise.all(rutasPromesas));
        const loadedLimiteCaldas = { coords: extraerCoords(limiteFeature.geometry) };
        setLimiteCaldas(loadedLimiteCaldas);
        
        // Inicializar currentMapBounds con los límites de Caldas al cargar
        setCurrentMapBounds(loadedLimiteCaldas.coords);

      } catch (error) {
        console.error("Error cargando datos geoespaciales:", error);
      }
    };

    cargarDatos();
  }, []);

  // Efecto para actualizar los límites del mapa cuando cambia la ruta seleccionada
  useEffect(() => {
    if (rutaSeleccionada) {
      setCurrentMapBounds(rutaSeleccionada.coords);
    } else if (limiteCaldas) {
      setCurrentMapBounds(limiteCaldas.coords);
    }
  }, [rutaSeleccionada, limiteCaldas]);

  const hoveredRoute = hoveredRouteId !== null ? rutas.find(r => r.id === hoveredRouteId) : null;

  return (
    <div className="bg-gray-900 min-h-screen -m-4 py-4 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Nuestras <span className="text-emerald-400">GeoRutas</span>
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
            Sumérgete en un viaje interactivo por las rutas de aviturismo de Caldas.
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-2xl shadow-emerald-900/50 p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Columna del Mapa */}
            <div className="lg:col-span-3 h-[500px] lg:h-[600px] rounded-lg overflow-hidden border border-gray-700">
              <MapContainer
                center={[5.07, -75.52]}
                zoom={9}
                scrollWheelZoom={true}
                className="h-full w-full bg-gray-800"
              >
                <TileLayer
                  url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OSM</a>'
                />
                <Marker position={[5.07, -75.52]} icon={mainIcon}><Popup>Manizales, Caldas</Popup></Marker>
                {limiteCaldas && <Polyline positions={limiteCaldas.coords} pathOptions={{ color: "#f59e0b", weight: 2, opacity: 0.7, dashArray: "5, 10" }} />}
                {rutaSeleccionada && <Polyline positions={rutaSeleccionada.coords} pathOptions={{ color: "#34d399", weight: 5, opacity: 1 }} />}
                
                {/* Polyline para el hover */}
                {hoveredRoute && !rutaSeleccionada && (
                  <Polyline positions={hoveredRoute.coords} pathOptions={{ color: "#fde047", weight: 5, opacity: 0.8 }} />
                )}

                {currentMapBounds && <MapAutoFit coords={currentMapBounds} />}
              </MapContainer>
            </div>

            {/* Columna de Contenido Dinámico */}
            <div className="lg:col-span-2">
              {rutaSeleccionada ? (
                <RouteInfoBox 
                  route={rutaSeleccionada} 
                  onBack={() => setRutaSeleccionada(null)} 
                  onCenter={() => setCurrentMapBounds([...rutaSeleccionada.coords])}
                />
              ) : (
                <div className="animate-fade-in h-full flex flex-col">
                  {/* Panel de Bienvenida */}
                  <div className="text-center border border-gray-700 rounded-lg p-6 mb-6 bg-gray-800/50">
                    <svg className="mx-auto h-12 w-12 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <h3 className="mt-2 text-xl font-bold text-white">Explora las Rutas</h3>
                    <p className="mt-1 text-sm text-gray-400">Pasa el cursor sobre una ruta para previsualizarla en el mapa o haz clic para ver sus detalles.</p>
                  </div>
                  
                  {/* Lista de Rutas */}
                  <div className="flex-grow overflow-hidden">
                    <div className="h-full overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {rutas.map((ruta) => (
                        <button
                          key={ruta.id}
                          onMouseEnter={() => setHoveredRouteId(ruta.id)}
                          onMouseLeave={() => setHoveredRouteId(null)}
                          className={`w-full p-4 rounded-lg text-left transition-all duration-300 ease-in-out group transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-400 bg-gray-700/50 border border-gray-600 hover:bg-gray-700 hover:border-gray-500`}
                          onClick={() => {
                            if (rutaSeleccionada?.id === ruta.id) {
                              setRutaSeleccionada(null);
                            } else {
                              setRutaSeleccionada(ruta);
                            }
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-lg text-emerald-100 group-hover:text-white">{ruta.nombre}</h4>
                            <svg className={`w-6 h-6 text-emerald-400 transition-transform duration-300 -translate-x-1 group-hover:translate-x-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
