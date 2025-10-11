// backend/server.js - VERSIÓN REPARADA Y SIMPLIFICADA
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHUNKS_DIR = path.join(__dirname, "..", "documentos_chunks");

// Cargar documentos
let documentos = {};
try {
    const archivos = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith(".json"));
    archivos.forEach(archivo => {
        const ruta = path.join(CHUNKS_DIR, archivo);
        const data = JSON.parse(fs.readFileSync(ruta, "utf-8"));
        documentos[archivo.replace(".json", "")] = data;
    });
    console.log(`📚 Documentos cargados: ${Object.keys(documentos).length}`);
} catch (error) {
    console.log("❌ Error cargando documentos");
}

// BÚSQUEDA SIMPLE Y EFECTIVA
function buscarEnDocumentos(query) {
    const queryLower = query.toLowerCase().trim();
    console.log(`🔍 Buscando: "${query}"`);
    
    const resultados = [];
    const palabras = queryLower.split(/\s+/).filter(p => p.length > 3);
    
    // Si no hay palabras válidas, buscar por query completa
    const terminosBusqueda = palabras.length > 0 ? palabras : [queryLower];
    
    Object.entries(documentos).forEach(([docNombre, chunks]) => {
        chunks.forEach((chunk, index) => {
            if (!chunk || chunk.length < 50) return;
            
            const chunkLower = chunk.toLowerCase();
            let encontrado = false;
            
            // Buscar cada término
            for (const termino of terminosBusqueda) {
                if (chunkLower.includes(termino)) {
                    encontrado = true;
                    break;
                }
            }
            
            if (encontrado) {
                // LIMPIAR el texto antes de agregarlo
                const textoLimpio = limpiarTexto(chunk);
                if (textoLimpio.length > 50) {
                    resultados.push({
                        archivo: docNombre,
                        chunkIndex: index + 1,
                        texto: textoLimpio
                    });
                }
            }
        });
    });
    
    console.log(`✅ Encontrados: ${resultados.length} fragmentos`);
    return resultados.slice(0, 3); // Solo 3 mejores
}

// FUNCIÓN CRÍTICA: Limpiar texto de caracteres corruptos
function limpiarTexto(texto) {
    if (!texto) return "";
    
    return texto
        // Eliminar caracteres de control y no imprimibles
        .replace(/[^\x20-\x7E\n\ráéíóúñÁÉÍÓÚÑ¿¡]/g, '')
        // Eliminar secuencias de caracteres extraños
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        // Eliminar múltiples espacios
        .replace(/\s+/g, ' ')
        // Limitar longitud
        .substring(0, 400)
        .trim();
}

// RESPUESTAS PREDEFINIDAS MEJORADAS
const respuestasPredefinidas = {
    'colibri': {
        estricto: "🔒 No encontré información específica sobre colibríes en la documentación de Caldas.",
        investigativo: "🔍 Los colibríes (familia Trochilidae) son aves emblemáticas de Colombia, conocidas por su vuelo ágil y capacidad de cernerse. Colombia alberga más de 160 especies. En Caldas es común encontrar diversas especies en jardines y zonas boscosas."
    },
    'pinguino': {
        estricto: "🔒 No existen pingüinos en Caldas. Los pingüinos son aves antárticas que no habitan en regiones tropicales.",
        investigativo: "🔍 Los pingüinos no se encuentran en Caldas ni en Colombia. Son aves adaptadas exclusivamente a climas fríos del hemisferio sur."
    },
    'murcielago': {
        estricto: "🔒 No encontré información sobre murciélagos en la documentación de aves de Caldas.",
        investigativo: "🔍 Los murciélagos son mamíferos voladores importantes para los ecosistemas. En Caldas existen diversas especies que habitan en cuevas y bosques."
    },
    'gavilan': {
        estricto: "🔒 No encontré información específica sobre gavilanes en la documentación de Caldas.",
        investigativo: "🔍 Los gavilanes son aves rapaces diurnas. En Caldas podrían habitar especies como el Gavilán Aliancho y el Gavilán Pollero."
    },
    'tangara': {
        estricto: "🔒 No encontré información específica sobre tangaras en la documentación de Caldas.",
        investigativo: "🔍 Las tangaras son aves coloridas de la familia Thraupidae. En Colombia existen numerosas especies que podrían habitar en zonas boscosas de Caldas."
    }
};

// ENDPOINT PRINCIPAL SIMPLIFICADO
app.post("/chat", async (req, res) => {
    const { message, modoEstricto = true } = req.body;
    
    if (!message) {
        return res.json({ reply: "⚠️ No recibí tu mensaje." });
    }

    console.log(`💬: "${message}" | Modo: ${modoEstricto ? 'ESTRICTO' : 'INVESTIGATIVO'}`);

    try {
        const fragmentos = buscarEnDocumentos(message);
        const preguntaLower = message.toLowerCase();
        
        let respuesta = "";
        let respuestaEncontrada = false;

        // 1. BUSCAR RESPUESTA PREDEFINIDA
        for (const [key, resp] of Object.entries(respuestasPredefinidas)) {
            if (preguntaLower.includes(key)) {
                respuesta = modoEstricto ? resp.estricto : resp.investigativo;
                respuestaEncontrada = true;
                console.log(`🎯 Usando respuesta predefinida para: ${key}`);
                break;
            }
        }

        // 2. SI NO HAY PREDEFINIDA PERO HAY FRAGMENTOS
        if (!respuestaEncontrada && fragmentos.length > 0) {
            respuesta = (modoEstricto ? "🔒 " : "🔍 ") + 
                       "Encontré esta información en los documentos:\n\n" +
                       fragmentos.map(f => f.texto).join('\n\n');
            console.log(`📄 Mostrando ${fragmentos.length} fragmentos encontrados`);
        }
        
        // 3. SI NO HAY NADA
        if (!respuesta) {
            respuesta = modoEstricto ? 
                "🔒 No encontré información específica sobre este tema en la documentación de Caldas." :
                "🔍 No encontré información específica en los documentos.";
        }

        res.json({ 
            reply: respuesta,
            modoUsado: modoEstricto ? "estricto" : "investigativo",
            documentosEncontrados: fragmentos.length,
            fuentes: fragmentos.map(f => ({ archivo: f.archivo, chunkIndex: f.chunkIndex }))
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.json({ 
            reply: "⚠️ Error temporal del servidor.",
            modoUsado: "estricto",
            documentosEncontrados: 0,
            fuentes: []
        });
    }
});

// ENDPOINTS BÁSICOS
app.get("/documentos", (req, res) => {
    const docs = Object.keys(documentos).map(nombre => ({
        nombre,
        chunks: documentos[nombre].length
    }));
    res.json({ documentos: docs, total: docs.length });
});

app.get("/health", (req, res) => {
    res.json({ 
        status: "✅ OK", 
        documentos: Object.keys(documentos).length,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor EcoAlas REPARADO - http://localhost:${PORT}`);
    console.log(`📚 Documentos: ${Object.keys(documentos).length}`);
    console.log(`⚡ Sistema funcional sin Ollama`);
});