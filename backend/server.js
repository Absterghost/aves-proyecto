// backend/server.js
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📂 Carpeta donde están los documentos procesados
const CHUNKS_DIR = path.join(__dirname, "..", "documentos_chunks");

// 📚 Cargar todos los documentos en memoria
let documentosChunks = {};

// FUNCIÓN MEJORADA PARA LIMPIAR TEXTO
function limpiarTexto(texto) {
  if (!texto || typeof texto !== 'string') return '';
  
  return texto
    .replace(/[^\w\sáéíóúñÁÉÍÓÚÑ.,;:!?()\-@/\\#\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(\w)([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

function cargarDocumentos() {
  if (!fs.existsSync(CHUNKS_DIR)) {
    console.error("❌ No existe la carpeta 'documentos_chunks'. Corre procesarDocs.js primero.");
    return;
  }

  const archivos = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith(".json"));
  
  if (archivos.length === 0) {
    console.warn("⚠️ No hay documentos procesados en documentos_chunks/");
    return;
  }

  for (const archivo of archivos) {
    try {
      const rutaCompleta = path.join(CHUNKS_DIR, archivo);
      const data = JSON.parse(fs.readFileSync(rutaCompleta, "utf-8"));
      const nombreDoc = archivo.replace(".json", "");
      
      documentosChunks[nombreDoc] = Array.isArray(data) ? 
        data.map(chunk => limpiarTexto(chunk)).filter(chunk => chunk && chunk.length > 20) : [];
      console.log(`✅ Cargado: ${nombreDoc} (${documentosChunks[nombreDoc].length} chunks válidos)`);
    } catch (err) {
      console.error(`❌ Error cargando ${archivo}:`, err.message);
    }
  }
}

// Cargar al iniciar
cargarDocumentos();

// 🔍 BUSCAR EN DOCUMENTOS - VERSIÓN MEJORADA
function buscarEnDocumentos(query, nombreDocumento = null) {
  const resultados = [];
  const queryLower = query.toLowerCase().trim();
  
  const palabrasExcluidas = new Set(['el', 'la', 'los', 'las', 'de', 'del', 'en', 'y', 'o', 'un', 'una', 'unos', 'unas', 'con', 'para', 'por', 'que', 'es', 'son']);
  const palabrasClave = queryLower.split(/\s+/)
    .filter(palabra => palabra.length > 2 && !palabrasExcluidas.has(palabra));

  console.log(`🔍 Búsqueda: "${query}" -> Palabras clave: [${palabrasClave.join(', ')}]`);

  const calcularRelevancia = (texto) => {
    if (!texto || texto.length < 20) return 0;
    
    const textoLower = texto.toLowerCase();
    let puntos = 0;

    if (textoLower.includes(queryLower)) {
      puntos += 50;
    }

    palabrasClave.forEach(palabra => {
      const regex = new RegExp(palabra, 'gi');
      const coincidencias = (textoLower.match(regex) || []).length;
      puntos += coincidencias * 10;
      
      if (palabra.length > 4) puntos += coincidencias * 5;
    });

    return puntos;
  };

  const documentosABuscar = nombreDocumento ? 
    [[nombreDocumento, documentosChunks[nombreDocumento]]] : 
    Object.entries(documentosChunks);

  for (const [nombreDoc, chunks] of documentosABuscar) {
    if (!chunks || !Array.isArray(chunks)) continue;

    chunks.forEach((chunk, i) => {
      const chunkLimpio = limpiarTexto(chunk);
      if (chunkLimpio.length < 25) return;

      const relevancia = calcularRelevancia(chunkLimpio);
      
      if (relevancia > 5) {
        resultados.push({
          archivo: nombreDoc,
          chunkIndex: i + 1,
          texto: chunkLimpio.substring(0, 400),
          relevancia: relevancia
        });
      }
    });
  }

  resultados.sort((a, b) => b.relevancia - a.relevancia);
  const resultadosFiltrados = resultados.slice(0, 5);

  console.log(`✅ ${resultadosFiltrados.length} fragmentos relevantes encontrados`);
  return resultadosFiltrados;
}

// 🤖 OBTENER RESPUESTA IA - SIN TIMEOUT
async function obtenerRespuestaIA(pregunta, contexto = "", modoEstricto = true) {
  try {
    const systemPrompt = modoEstricto ? 
      `Eres un experto en aves de Caldas, Colombia. Responde SOLO con información del contexto proporcionado. 
       Si no hay información relevante, di: "No hay información sobre esto en los documentos."
       Reglas: 
       1. Responde únicamente en español
       2. Usa solo la información del contexto
       3. Sé específico sobre aves y ecología de Caldas
       4. No inventes información` 
      : 
      `Eres un ornitólogo experto en aves de Colombia. 
       Usa principalmente el contexto proporcionado, pero puedes complementar con conocimiento general sobre aves.
       Siempre cita cuando uses información de los documentos.`;

    let mensajeUsuario;
    if (contexto && contexto !== "No se encontraron fragmentos relevantes en los documentos.") {
      mensajeUsuario = `Basándote en esta información sobre aves de Caldas:\n\n${contexto}\n\nResponde a esta pregunta: ${pregunta}`;
    } else {
      mensajeUsuario = `Pregunta: ${pregunta}\n\nNota: ${modoEstricto ? 'Responde solo si hay información en los documentos.' : 'Puedes usar conocimiento general.'}`;
    }

    console.log("🔄 Enviando solicitud a Ollama...");
    
    // ✅ SIN TIMEOUT - SOLICITUD DIRECTA
    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: mensajeUsuario }
        ],
        stream: false,
        options: {
          temperature: modoEstricto ? 0.1 : 0.3,
          num_predict: 1500
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    let respuesta = data?.message?.content?.trim() || "❌ No se pudo generar respuesta.";

    if (!respuesta || respuesta.length < 5 || respuesta.includes('�')) {
      throw new Error("Respuesta vacía o corrupta");
    }

    console.log("✅ Respuesta recibida de Ollama");
    return (modoEstricto ? "🔒 " : "🔍 ") + respuesta;
    
  } catch (err) {
    console.error("❌ Error con Ollama:", err.message);
    
    if (modoEstricto) {
      if (contexto && contexto !== "No se encontraron fragmentos relevantes en los documentos.") {
        const lineasUtiles = contexto.split('\n')
          .filter(linea => linea.length > 20 && !linea.includes('FRAGMENTO'))
          .slice(0, 3)
          .map(linea => linea.substring(0, 100) + '...');
        
        return `📄 Información encontrada en documentos:\n\n${lineasUtiles.join('\n\n')}\n\n⚠️ No se pudo procesar con IA.`;
      }
      return "🔒 No hay información suficiente en los documentos para responder esta pregunta.";
    }
    
    return "🔍 Error de conexión con el servicio de IA. Intenta con el modo estricto.";
  }
}

// 💬 ENDPOINT DEL CHAT
app.post("/chat", async (req, res) => {
  const { message, modoEstricto = true } = req.body;
  
  if (!message || message.trim().length === 0) {
    return res.json({ reply: "⚠️ Por favor, escribe una pregunta." });
  }

  const mensajeLimpio = message.trim();
  console.log(`\n💬 Usuario: ${mensajeLimpio}`);
  console.log(`🔧 Modo: ${modoEstricto ? 'ESTRICTO 🔒' : 'INVESTIGATIVO 🔍'}`);

  try {
    const encontrados = buscarEnDocumentos(mensajeLimpio);
    
    let contexto;
    if (encontrados.length === 0) {
      console.log("ℹ️ No se encontraron fragmentos relevantes");
      contexto = "No se encontraron fragmentos relevantes en los documentos.";
    } else {
      console.log(`📚 ${encontrados.length} fragmentos relevantes encontrados`);
      contexto = encontrados
        .map(e => `[DOCUMENTO: ${e.archivo}]\n${e.texto}`)
        .join("\n\n---\n\n");
    }

    const respuesta = await obtenerRespuestaIA(mensajeLimpio, contexto, modoEstricto);
    
    console.log(`✅ Respuesta generada (${respuesta.length} caracteres)`);

    res.json({ 
      reply: respuesta,
      modoUsado: modoEstricto ? "estricto" : "investigativo",
      documentosEncontrados: encontrados.length
    });

  } catch (error) {
    console.error("❌ Error en endpoint /chat:", error);
    res.json({ 
      reply: "❌ Error interno del servidor. Intenta nuevamente.",
      modoUsado: modoEstricto ? "estricto" : "investigativo",
      documentosEncontrados: 0
    });
  }
});

// 📊 Endpoint para ver documentos disponibles
app.get("/documentos", (req, res) => {
  const docs = Object.keys(documentosChunks).map(nombre => ({
    nombre,
    chunks: documentosChunks[nombre].length,
    estado: documentosChunks[nombre].length > 0 ? "✅ Cargado" : "❌ Vacío"
  }));
  res.json({ 
    documentos: docs, 
    total: docs.length,
    mensaje: "Sistema listo para consultas sobre aves de Caldas"
  });
});

// 🏥 Health check - SIN TIMEOUT
app.get("/health", async (req, res) => {
  let ollamaStatus = "desconectado";
  
  try {
    // ✅ SIN TIMEOUT
    const healthRes = await fetch("http://localhost:11434/api/version");
    ollamaStatus = healthRes.ok ? "conectado" : "error";
  } catch (err) {
    ollamaStatus = "desconectado";
  }

  res.json({ 
    status: "ok", 
    documentos: Object.keys(documentosChunks).length,
    ollama: ollamaStatus,
    timestamp: new Date().toLocaleString('es-CO')
  });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌿 Servidor EcoAlas - Caldas corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentos cargados: ${Object.keys(documentosChunks).length}`);
  console.log(`🔧 Modos disponibles: Estricto 🔒 | Investigativo 🔍`);
  console.log(`📍 Región: Departamento de Caldas, Colombia`);
  console.log(`⏰ Hora de inicio: ${new Date().toLocaleString('es-CO')}`);
  
  const totalChunks = Object.values(documentosChunks).reduce((sum, chunks) => sum + chunks.length, 0);
  console.log(`📊 Total de chunks válidos: ${totalChunks}`);
  
  if (totalChunks === 0) {
    console.log("\n⚠️  ADVERTENCIA: No hay documentos cargados.");
    console.log("   Ejecuta: node procesarDocs.js\n");
  }
});