import { PDFExtract } from "pdf.js-extract";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfExtract = new PDFExtract();

async function testPDF() {
  const ruta = path.join(__dirname, "documentos", "guia_aves_villamaria.pdf");
  console.log("🔍 Analizando:", ruta);
  
  try {
    const data = await pdfExtract.extract(ruta, {});
    console.log("\n📊 Resultados:");
    console.log("- Total de páginas:", data.pages.length);
    console.log("- Contenido primera página:");
    
    const primerasPalabras = data.pages[0].content
      .slice(0, 50)
      .map(item => item.str)
      .join(' ');
    
    console.log(primerasPalabras);
    
    // Buscar "DESCRIPCIÓN"
    const textoCompleto = data.pages
      .map(page => page.content.map(item => item.str).join(' '))
      .join('\n');
    
    const indice = textoCompleto.indexOf("DESCRIPCIÓN");
    if (indice !== -1) {
      console.log("\n✅ Encontrado 'DESCRIPCIÓN' en posición:", indice);
      console.log("Contexto:", textoCompleto.substring(indice, indice + 500));
    } else {
      console.log("\n❌ No se encontró 'DESCRIPCIÓN' en el documento");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testPDF();