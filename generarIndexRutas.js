// generarIndexRutas.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Para simular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta donde están los GeoJSON de rutas
const rutasDir = path.join(__dirname, "public", "rutas");

// Archivo index.json que vamos a generar
const indexFile = path.join(rutasDir, "index.json");

// Leer todos los archivos .geojson de la carpeta
const archivos = fs.readdirSync(rutasDir).filter((f) => f.endsWith(".geojson"));

// Crear lista de rutas
const rutas = archivos.map((archivo, idx) => {
  const data = JSON.parse(fs.readFileSync(path.join(rutasDir, archivo), "utf-8"));
  const feature = data.features[0];
  return {
    id: idx + 1,
    nombre: feature.properties.name || `Ruta ${idx + 1}`,
    archivo: archivo
  };
});

// Guardar en index.json
fs.writeFileSync(indexFile, JSON.stringify(rutas, null, 2));

console.log(`Index generado con ${rutas.length} rutas en ${indexFile}`);
