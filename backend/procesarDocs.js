const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

// Carpeta donde pondrás tus PDFs
const CARPETA_DOCS = path.join(__dirname, "../documentos");

// Leer PDF y extraer texto
async function leerPDF(ruta) {
  try {
    const buffer = fs.readFileSync(ruta);
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error(`❌ Error leyendo PDF ${ruta}:`, error.message);
    return "";
  }
}

// Dividir texto en chunks con contexto
function chunkTexto(texto, chunkSize = 2000, contexto = 500) {
  const palabras = texto.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < palabras.length; i += chunkSize - contexto) {
    const chunk = palabras.slice(i, i + chunkSize).join(" ");
    chunks.push(chunk);
  }
  return chunks;
}

// Procesar todos los PDFs en la carpeta
async function procesarDocumentos() {
  if (!fs.existsSync(CARPETA_DOCS)) {
    console.error(`❌ No existe la carpeta ${CARPETA_DOCS}. Créala y pon tus PDFs allí.`);
    return;
  }

  const archivos = fs.readdirSync(CARPETA_DOCS).filter((f) => f.endsWith(".pdf"));

  if (archivos.length === 0) {
    console.log("⚠️ No se encontraron PDFs en la carpeta 'documentos'.");
    return;
  }

  for (const archivo of archivos) {
    const ruta = path.join(CARPETA_DOCS, archivo);
    console.log("Procesando:", archivo);
    const texto = await leerPDF(ruta);
    if (!texto) {
      console.warn(`⚠️ PDF ${archivo} no contiene texto legible.`);
      continue;
    }

    const chunks = chunkTexto(texto, 2000, 500);
    console.log(`✅ ${archivo} dividido en ${chunks.length} chunks.`);

    // Guardar los chunks en JSON
    const salidaDir = path.join(__dirname, "../documentos_chunks");
    if (!fs.existsSync(salidaDir)) fs.mkdirSync(salidaDir, { recursive: true });
    const salida = path.join(salidaDir, archivo + ".json");
    fs.writeFileSync(salida, JSON.stringify(chunks, null, 2), "utf-8");
    console.log(`   → Chunks guardados en ${salida}`);
  }
}

// Ejecutar si se corre directamente
if (require.main === module) {
  procesarDocumentos();
}

module.exports = { leerPDF, chunkTexto, procesarDocumentos };
