import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFExtract } from "pdf.js-extract";

const pdfExtract = new PDFExtract();

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta donde pondrás tus PDFs
const CARPETA_DOCS = path.join(__dirname, "documentos");

// Leer PDF y extraer texto
async function leerPDF(ruta) {
  try {
    const data = await pdfExtract.extract(ruta, {});
    const texto = data.pages
      .map(page => page.content.map(item => item.str).join(' '))
      .join('\n');
    return texto;
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

  console.log(`📚 Encontrados ${archivos.length} archivo(s) PDF\n`);

  for (const archivo of archivos) {
    const ruta = path.join(CARPETA_DOCS, archivo);
    console.log("📄 Procesando:", archivo);
    const texto = await leerPDF(ruta);
    
    if (!texto || texto.trim().length === 0) {
      console.warn(`⚠️  PDF ${archivo} no contiene texto legible.\n`);
      continue;
    }

    const chunks = chunkTexto(texto, 2000, 500);
    console.log(`✅ ${archivo} dividido en ${chunks.length} chunks.`);

    // Guardar los chunks en JSON
    const salidaDir = path.join(__dirname, "documentos_chunks");
    if (!fs.existsSync(salidaDir)) fs.mkdirSync(salidaDir, { recursive: true });
    const salida = path.join(salidaDir, archivo + ".json");
    fs.writeFileSync(salida, JSON.stringify(chunks, null, 2), "utf-8");
    console.log(`   → Chunks guardados en ${salida}\n`);
  }
  
  console.log("🎉 ¡Proceso completado!");
}

// Ejecutar
procesarDocumentos().catch(console.error);

export { leerPDF, chunkTexto, procesarDocumentos };