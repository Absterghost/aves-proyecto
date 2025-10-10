import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

const CARPETA_DOCS = path.join(process.cwd(), "documentos");

async function leerPDF(ruta) {
  const buffer = fs.readFileSync(ruta);
  const data = await pdfParse(buffer);
  return data.text;
}

export async function procesarDocumentos() {
  if (!fs.existsSync(CARPETA_DOCS)) {
    console.error(`No existe la carpeta ${CARPETA_DOCS}`);
    return;
  }

  const archivos = fs.readdirSync(CARPETA_DOCS).filter(f => f.endsWith(".pdf"));
  for (const archivo of archivos) {
    const ruta = path.join(CARPETA_DOCS, archivo);
    console.log("Procesando:", archivo);
    const texto = await leerPDF(ruta);
    const salida = path.join(process.cwd(), "documentos_chunks", archivo + ".json");
    if (!fs.existsSync(path.dirname(salida))) fs.mkdirSync(path.dirname(salida), { recursive: true });
    fs.writeFileSync(salida, JSON.stringify(texto, null, 2));
    console.log("   → Chunks guardados en:", salida);
  }
}

if (process.argv[1].endsWith("procesarDocsClean.js")) {
  procesarDocumentos();
}
