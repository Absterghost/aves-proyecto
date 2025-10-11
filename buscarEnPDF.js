import { PDFExtract } from "pdf.js-extract";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfExtract = new PDFExtract();

async function buscarEnPDF(termino) {
  const ruta = path.join(__dirname, "documentos", "guia_aves_villamaria.pdf");
  
  try {
    const data = await pdfExtract.extract(ruta, {});
    const textoCompleto = data.pages
      .map((page, i) => ({
        pagina: i + 1,
        texto: page.content.map(item => item.str).join(' ')
      }));
    
    console.log(`\n🔍 Buscando: "${termino}"\n`);
    
    const resultados = textoCompleto.filter(p => 
      p.texto.toLowerCase().includes(termino.toLowerCase())
    );
    
    if (resultados.length > 0) {
      console.log(`✅ Encontrado en ${resultados.length} página(s):\n`);
      
      resultados.slice(0, 5).forEach(r => {
        const inicio = r.texto.toLowerCase().indexOf(termino.toLowerCase());
        const contexto = r.texto.substring(
          Math.max(0, inicio - 100),
          Math.min(r.texto.length, inicio + 300)
        );
        
        console.log(`📄 Página ${r.pagina}:`);
        console.log(`   ...${contexto}...`);
        console.log();
      });
      
      if (resultados.length > 5) {
        console.log(`   ... y ${resultados.length - 5} página(s) más\n`);
      }
    } else {
      console.log(`❌ No se encontró "${termino}"`);
      
      // Sugerencias
      console.log("\n💡 Primeras 20 palabras del documento:");
      const palabras = textoCompleto[0].texto.split(/\s+/).slice(0, 30);
      console.log(palabras.join(' '));
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Ejecutar con el término de búsqueda
const termino = process.argv[2] || "descripción";
buscarEnPDF(termino);