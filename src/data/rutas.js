// src/data/rutas.js
// Datos + utilidades para Georutas (Leaflet + compartir en Google Maps / Waze)

// --- Helpers ---
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/** Calcula la distancia total (km) de una lista de coordenadas [lat, lng] usando Haversine */
function computeLengthKm(coords) {
  if (!Array.isArray(coords) || coords.length < 2) return 0;
  const R = 6371; // radio de la Tierra en km
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lat1, lon1] = coords[i - 1];
    const [lat2, lon2] = coords[i];
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return Math.round(total * 100) / 100; // redondea a 2 decimales
}

/** Construye URL para Google Maps Directions.
 *  origin = primer punto, destination = último punto, waypoints = intermedios (si hay).
 *  travelmode: driving / walking / bicycling
 */
function coordsToGoogleMapsUrl(coords, travelmode = "walking") {
  if (!Array.isArray(coords) || coords.length === 0) return "https://www.google.com/maps";
  const origin = `${coords[0][0]},${coords[0][1]}`;
  const destination = `${coords[coords.length - 1][0]},${coords[coords.length - 1][1]}`;
  const waypoints =
    coords.length > 2 ? coords.slice(1, -1).map((c) => `${c[0]},${c[1]}`).join("|") : "";
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode,
  });
  let url = `https://www.google.com/maps/dir/?${params.toString()}`;
  if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
  return url;
}

/** Construye URL para Waze (navegar al último punto de la ruta) */
function coordsToWazeUrl(coords) {
  if (!Array.isArray(coords) || coords.length === 0) return "https://www.waze.com";
  const last = coords[coords.length - 1];
  const lat = last[0];
  const lon = last[1];
  return `https://www.waze.com/ul?ll=${lat},${lon}&navigate=yes`;
}

// --- Datos base de rutas (solo datos, sin lógica) ---
const rawRutas = [
  {
    id: 1,
    nombre: "Ruta Río Blanco",
    coords: [
      [5.062887793412195, -75.47347697745462],
      [5.065405825121418, -75.47117529888806],
      [5.0641220288314654, -75.46505582317155],
      [5.06967014164236, -75.45397770096494],
      [5.066433825407101, -75.44846642023799],
      [5.070157794351942, -75.44899769284298],
      [5.068413411597096, -75.440025085605],
      [5.076571448439857, -75.43703898188535]
    ],
    terreno: "Bosque húmedo, sendero ecológico",
    aves: "Gallito de roca, tangaras, colibríes",
    horario: "6:00 am - 10:00 am",
  },
  {
    id: 2,
    nombre: "Sendero Ecoparque Los Yarumos",
    coords: [
      [5.05, -75.5],
      [5.055, -75.495],
      [5.06, -75.49],
    ],
    terreno: "Sendero urbano con bosque secundario",
    aves: "Colibríes, atrapamoscas, tucanes pequeños",
    horario: "7:00 am - 11:00 am",
  },
  {
    id: 3,
    nombre: "Reserva Natural Río Otún",
    coords: [
      [4.81, -75.63],
      [4.82, -75.62],
      [4.825, -75.61],
    ],
    terreno: "Bosque húmedo montano",
    aves: "Pava caucana, búhos, carpinteros",
    horario: "5:30 am - 9:00 am",
  },
];

// --- Añade campos calculados (km) y exporta ---
export const rutas = rawRutas.map((r) => {
  const km = computeLengthKm(r.coords);
  return {
    ...r,
    km, // número en km (2 decimales)
    kmText: `${km} km`, // string para mostrar directamente
    // No generamos URLs aquí porque es mejor generarlas con la función dedicada al momento de usarlas
  };
});

export default rutas;

// --- utilidades exportadas para usar desde Georutas.jsx ---
export { computeLengthKm, coordsToGoogleMapsUrl, coordsToWazeUrl };
