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

// Verificar que la carpeta exista
if (!fs.existsSync(rutasDir)) {
  console.error(`La carpeta ${rutasDir} no existe.`);
  process.exit(1);
}

// Leer todos los archivos .geojson de la carpeta
const archivos = fs.readdirSync(rutasDir).filter((f) => f.endsWith(".geojson"));

if (archivos.length === 0) {
  console.warn("No se encontraron archivos .geojson en la carpeta.");
}

// Crear lista de rutas
const rutas = archivos.map((archivo, idx) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(rutasDir, archivo), "utf-8"));
    const feature = data.features?.[0];
    return {
      id: idx + 1,
      nombre: feature?.properties?.name || `Ruta ${idx + 1}`,
      archivo: archivo
    };
  } catch (err) {
    console.error(`Error leyendo ${archivo}:`, err.message);
    return null;
  }
}).filter(r => r !== null); // eliminar rutas con error

// Guardar en index.json
fs.writeFileSync(indexFile, JSON.stringify(rutas, null, 2));

console.log(`Index generado con ${rutas.length} rutas en ${indexFile}`);
