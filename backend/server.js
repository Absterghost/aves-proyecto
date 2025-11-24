// backend/server.js
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();

// Configuración CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('es-CO');
  console.log(`\n📨 [${timestamp}] ${req.method} ${req.path}`);
  if (req.body && req.body.message) {
    console.log(`   Pregunta: "${req.body.message.substring(0, 100)}${req.body.message.length > 100 ? '...' : ''}"`);
  }
  next();
});

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📂 CONFIGURACIÓN
const OLLAMA_MODEL = "llama3:latest";
const DOCS_SOURCE_DIR = path.join(process.cwd(), "documentos");
const CHUNKS_DIR = path.join(__dirname, "documentos_chunks");
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

console.log('🔍 CONFIGURACIÓN INICIAL:');
console.log('   DOCS_SOURCE_DIR:', DOCS_SOURCE_DIR);
console.log('   CHUNKS_DIR:', CHUNKS_DIR);

// Variables globales
let documentosChunks = new Map();
let estaProcesando = false;
let ultimaActualizacion = null;

// 🆕 CORRECCIÓN: Importación estática de pdf-parse
let pdfParse;
try {
  // Intentar importar pdf-parse de forma estática
  const pdfModule = await import('pdf-parse');
  pdfParse = pdfModule.default;
  console.log('✅ pdf-parse cargado correctamente');
} catch (error) {
  console.log('❌ pdf-parse no disponible. Usando fallback...');
  pdfParse = null;
}

// 🆕 FUNCIÓN DE LIMPIEZA DE TEXTO
function limpiarTexto(texto) {
  if (!texto) return '';
  
  return texto
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/[^\w\sáéíóúÁÉÍÓÚñÑ.,!?;:()\-–—°"/+@#$%&*=\[\]{}<>|\\\n]/g, '')
    .replace(/ *\n */g, '\n')
    .trim();
}

// 🆕 CHUNKING INTELIGENTE
function dividirEnChunksInteligentes(texto, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  if (!texto || texto.trim().length === 0) return [];
  
  const textoLimpio = limpiarTexto(texto);
  if (textoLimpio.length <= chunkSize) return [textoLimpio];
  
  const chunks = [];
  const parrafos = textoLimpio.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  let chunkActual = '';
  
  for (const parrafo of parrafos) {
    const parrafoLimpio = parrafo.trim();
    
    if (parrafoLimpio.length > chunkSize) {
      // Dividir párrafos grandes en oraciones
      const oraciones = parrafoLimpio.split(/(?<=[.!?])\s+/).filter(o => o.length > 0);
      
      for (const oracion of oraciones) {
        if ((chunkActual + ' ' + oracion).length <= chunkSize) {
          chunkActual += (chunkActual ? ' ' : '') + oracion;
        } else {
          if (chunkActual.length >= chunkSize * 0.3) {
            chunks.push(chunkActual);
            // Overlap inteligente
            if (overlap > 0) {
              const palabras = chunkActual.split(' ');
              const overlapText = palabras.slice(-Math.floor(overlap / 10)).join(' ');
              chunkActual = overlapText + ' ' + oracion;
            } else {
              chunkActual = oracion;
            }
          } else {
            chunkActual = oracion;
          }
        }
      }
    } else {
      // Párrafo normal
      if ((chunkActual + '\n\n' + parrafoLimpio).length <= chunkSize) {
        chunkActual += (chunkActual ? '\n\n' : '') + parrafoLimpio;
      } else {
        if (chunkActual.length >= chunkSize * 0.3) {
          chunks.push(chunkActual);
          chunkActual = parrafoLimpio;
        } else {
          chunkActual = parrafoLimpio;
        }
      }
    }
  }
  
  if (chunkActual.length >= chunkSize * 0.3) {
    chunks.push(chunkActual);
  }
  
  console.log(`   📝 Generados ${chunks.length} chunks inteligentes`);
  return chunks.filter(chunk => chunk.length > 50);
}

// 🆕 CORRECCIÓN COMPLETA: Extracción de PDF robusta
async function extraerTextoDePDF(rutaPDF) {
  try {
    console.log(`   📄 Procesando PDF: ${path.basename(rutaPDF)}`);
    
    // PRIMERO: Intentar con pdf-parse si está disponible
    if (pdfParse) {
      try {
        const dataBuffer = fs.readFileSync(rutaPDF);
        const data = await pdfParse(dataBuffer);
        
        if (data.text && data.text.trim().length > 100) {
          const textoLimpio = limpiarTexto(data.text);
          console.log(`   ✅ PDF procesado con pdf-parse: ${textoLimpio.length} caracteres`);
          return textoLimpio;
        }
      } catch (pdfError) {
        console.log(`   ⚠️ pdf-parse falló: ${pdfError.message}`);
      }
    }
    
    // SEGUNDO: Fallback - leer PDF como texto binario
    console.log(`   🔄 Usando fallback para PDF...`);
    try {
      const dataBuffer = fs.readFileSync(rutaPDF);
      const textoBinario = dataBuffer.toString('utf8');
      
      // Filtrar líneas que parezcan texto real
      const lineasValidas = textoBinario.split('\n')
        .map(linea => linea.trim())
        .filter(linea => {
          return (
            linea.length > 10 &&
            !linea.startsWith('%') &&
            !linea.includes('stream') &&
            !linea.includes('endstream') &&
            !linea.includes('obj') &&
            !linea.includes('endobj') &&
            !linea.includes('xref') &&
            !linea.includes('trailer') &&
            /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(linea) &&
            linea.split(' ').length > 2
          );
        })
        .map(linea => linea.replace(/[^\w\sáéíóúÁÉÍÓÚñÑ.,!?;:()\-–—°"/+@#$%&*=\[\]{}<>|\\]/g, ''))
        .filter(linea => linea.length > 0);
      
      if (lineasValidas.length > 5) {
        const textoFallback = lineasValidas.join('\n');
        const textoLimpio = limpiarTexto(textoFallback);
        console.log(`   ✅ Fallback exitoso: ${textoLimpio.length} caracteres, ${lineasValidas.length} líneas`);
        return textoLimpio;
      }
    } catch (fallbackError) {
      console.log(`   ❌ Fallback falló: ${fallbackError.message}`);
    }
    
    // TERCERO: Último intento - leer como texto simple
    try {
      const dataBuffer = fs.readFileSync(rutaPDF);
      let texto = dataBuffer.toString('utf8');
      
      // Extraer texto entre paréntesis y corchetes (común en PDFs con texto)
      const textoEntreParentesis = texto.match(/\(([^)]+)\)/g) || [];
      const textoEntreCorchetes = texto.match(/<([^>]+)>/g) || [];
      
      const fragmentos = [
        ...textoEntreParentesis.map(t => t.slice(1, -1)),
        ...textoEntreCorchetes.map(t => t.slice(1, -1))
      ].filter(f => f.length > 10 && /[a-zA-Z]/.test(f));
      
      if (fragmentos.length > 0) {
        const textoSegundoFallback = fragmentos.join(' ');
        const textoLimpio = limpiarTexto(textoSegundoFallback);
        console.log(`   ✅ Segundo fallback: ${textoLimpio.length} caracteres`);
        return textoLimpio;
      }
    } catch (error) {
      console.log(`   ❌ Todos los métodos fallaron para: ${path.basename(rutaPDF)}`);
    }
    
    return '';
    
  } catch (error) {
    console.error(`   ❌ Error general procesando PDF:`, error.message);
    return '';
  }
}

// 🆕 PROCESAMIENTO DE DOCUMENTOS
async function procesarDocumento(archivo) {
  try {
    const rutaCompleta = path.join(DOCS_SOURCE_DIR, archivo);
    
    if (!fs.existsSync(rutaCompleta)) {
      console.log(`   ❌ Archivo no encontrado: ${archivo}`);
      return 0;
    }

    console.log(`   🔄 Procesando: ${archivo}`);
    let contenido = '';

    const extension = path.extname(archivo).toLowerCase();
    
    if (extension === '.txt') {
      contenido = fs.readFileSync(rutaCompleta, 'utf-8');
      console.log(`   ✅ TXT leído: ${contenido.length} caracteres`);
    } else if (extension === '.json') {
      const data = JSON.parse(fs.readFileSync(rutaCompleta, 'utf-8'));
      contenido = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
      console.log(`   ✅ JSON procesado: ${contenido.length} caracteres`);
    } else if (extension === '.pdf') {
      contenido = await extraerTextoDePDF(rutaCompleta);
      if (!contenido || contenido.length < 100) {
        console.log(`   ❌ No se pudo extraer texto útil del PDF: ${archivo}`);
        return 0;
      }
    } else {
      console.log(`   ⚠️ Formato no soportado: ${archivo}`);
      return 0;
    }

    // Limpieza final
    const textoLimpio = limpiarTexto(contenido);
    if (textoLimpio.length < 100) {
      console.log(`   ⚠️ Texto muy corto: ${archivo} (${textoLimpio.length} chars)`);
      return 0;
    }

    console.log(`   📄 Preview: "${textoLimpio.substring(0, 100)}..."`);

    // Chunking inteligente
    const chunks = dividirEnChunksInteligentes(textoLimpio);
    if (chunks.length === 0) {
      console.log(`   ⚠️ No se generaron chunks válidos: ${archivo}`);
      return 0;
    }

    // Guardar chunks con metadatos
    const nombreBase = path.basename(archivo, path.extname(archivo));
    const nombreSalida = `${nombreBase}_chunks.json`;
    const rutaSalida = path.join(CHUNKS_DIR, nombreSalida);
    
    const datosChunks = {
      metadata: {
        nombreOriginal: archivo,
        fechaProcesamiento: new Date().toISOString(),
        totalChunks: chunks.length,
        totalCaracteres: textoLimpio.length,
        metodo: extension === '.pdf' ? 'pdf-parse + fallback' : 'directo'
      },
      chunks: chunks
    };
    
    fs.writeFileSync(rutaSalida, JSON.stringify(datosChunks, null, 2));
    console.log(`   ✅ ${archivo} → ${chunks.length} chunks guardados`);
    return chunks.length;
    
  } catch (error) {
    console.error(`   ❌ Error procesando ${archivo}:`, error.message);
    return 0;
  }
}

// 🆕 CARGA EN MEMORIA
function cargarDocumentosEnMemoria() {
  documentosChunks.clear();
  
  if (!fs.existsSync(CHUNKS_DIR)) {
    console.log('📁 No existe carpeta de chunks, se creará automáticamente');
    fs.mkdirSync(CHUNKS_DIR, { recursive: true });
    return 0;
  }

  const archivos = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith("_chunks.json"));
  let totalChunks = 0;

  console.log(`📂 Cargando ${archivos.length} archivos de chunks...`);

  for (const archivo of archivos) {
    try {
      const rutaCompleta = path.join(CHUNKS_DIR, archivo);
      const data = JSON.parse(fs.readFileSync(rutaCompleta, "utf-8"));
      const nombreDoc = data.metadata.nombreOriginal;
      
      if (data.chunks && Array.isArray(data.chunks)) {
        const chunksValidos = data.chunks.filter(chunk => 
          chunk && typeof chunk === 'string' && chunk.length > 50
        );
        
        if (chunksValidos.length > 0) {
          documentosChunks.set(nombreDoc, chunksValidos);
          totalChunks += chunksValidos.length;
          console.log(`   📖 ${nombreDoc}: ${chunksValidos.length} chunks`);
        }
      }
    } catch (err) {
      console.error(`❌ Error cargando ${archivo}:`, err.message);
    }
  }

  console.log(`✅ Cargados ${documentosChunks.size} documentos con ${totalChunks} chunks`);
  return totalChunks;
}

// 🆕 BÚSQUEDA SEMÁNTICA MEJORADA
function buscarEnDocumentos(query, limite = 8) {
  const resultados = [];
  const queryLower = limpiarTexto(query).toLowerCase();
  
  if (documentosChunks.size === 0) {
    console.log('   ❌ No hay documentos cargados en memoria');
    return resultados;
  }

  // Palabras clave más relevantes
  const palabrasClave = queryLower.split(/\s+/)
    .filter(palabra => palabra.length > 2)
    .slice(0, 6);

  console.log(`   🔍 Búsqueda: "${query}"`);
  console.log(`   📊 Palabras clave: [${palabrasClave.join(', ')}]`);

  for (const [nombreDoc, chunks] of documentosChunks) {
    chunks.forEach((chunk, index) => {
      const chunkLower = chunk.toLowerCase();
      let puntuacion = 0;

      // Puntuación por coincidencias
      palabrasClave.forEach(palabra => {
        if (chunkLower.includes(palabra)) {
          const regex = new RegExp(palabra, 'gi');
          const coincidencias = (chunkLower.match(regex) || []).length;
          puntuacion += coincidencias * 15;
          
          // Bonus por coincidencia exacta al inicio
          if (chunkLower.startsWith(palabra)) {
            puntuacion += 10;
          }
        }
      });

      // Bonus por posición temprana en el documento
      if (index < 10) {
        puntuacion += (10 - index);
      }

      if (puntuacion > 5) {
        resultados.push({
          archivo: nombreDoc,
          chunkIndex: index,
          texto: chunk.substring(0, 1200),
          puntuacion: puntuacion,
          palabrasCoincidentes: palabrasClave.filter(p => chunkLower.includes(p))
        });
      }
    });
  }

  // Ordenar y limitar resultados
  return resultados
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .slice(0, limite)
    .map((item, idx) => ({
      ...item,
      relevancia: Math.min(100, Math.floor(item.puntuacion * 3))
    }));
}

// 🆕 OBTENER RESPUESTA IA
async function obtenerRespuestaIA(pregunta, contexto = "", modoEstricto = true) {
  console.log("🤖 Generando respuesta IA...");

  const tieneContexto = contexto && contexto.length > 200;
  
  if (modoEstricto && !tieneContexto) {
    return "🔍 No encontré información específica sobre tu pregunta en los documentos cargados. Puedes:\n\n• Intentar con el modo investigativo\n• Verificar que los documentos contengan información relacionada\n• Reformular tu pregunta";
  }

  try {
    const prompt = modoEstricto ? 
      `Eres un asistente especializado en aves de Colombia. Responde ÚNICAMENTE con la información proporcionada.

CONTEXTO:
${contexto}

PREGUNTA: ${pregunta}

Responde solo con la información del contexto. Si no hay información suficiente, indica claramente qué falta.` :

      `Eres un ornitólogo experto en aves de Colombia. Combina la información del contexto con tu conocimiento.

CONTEXTO:
${contexto}

PREGUNTA: ${pregunta}

Usa principalmente la información del contexto y complementa con conocimiento general cuando sea útil.`;

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: modoEstricto ? 0.3 : 0.6,
          num_predict: 1200,
          top_k: 40,
          top_p: 0.85
        }
      })
    });

    if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
    
    const data = await res.json();
    return data?.response?.trim() || "No pude generar una respuesta en este momento.";

  } catch (err) {
    console.error("❌ Error con IA:", err.message);
    
    if (contexto && contexto.length > 300) {
      return `📄 **Información encontrada:**\n\n${contexto.substring(0, 800)}...\n\n💡 *Respuesta limitada - verifica conexión con Ollama.*`;
    }
    
    return "❌ Error de conexión con Ollama. Verifica que esté ejecutándose en http://localhost:11434";
  }
}

// 🆕 PROCESAMIENTO AUTOMÁTICO
async function procesarDocumentosAutomatico() {
  if (estaProcesando) {
    console.log('⏳ Procesamiento ya en curso...');
    return false;
  }

  estaProcesando = true;
  console.log('\n🔄 INICIANDO PROCESAMIENTO AUTOMÁTICO...');

  try {
    // Crear directorios necesarios
    if (!fs.existsSync(DOCS_SOURCE_DIR)) {
      fs.mkdirSync(DOCS_SOURCE_DIR, { recursive: true });
      console.log('📁 Carpeta documentos creada');
    }
    if (!fs.existsSync(CHUNKS_DIR)) {
      fs.mkdirSync(CHUNKS_DIR, { recursive: true });
    }

    const archivos = fs.existsSync(DOCS_SOURCE_DIR) ? 
      fs.readdirSync(DOCS_SOURCE_DIR).filter(f => 
        f.toLowerCase().endsWith('.pdf') || 
        f.toLowerCase().endsWith('.txt') || 
        f.toLowerCase().endsWith('.json')
      ) : [];

    console.log(`📚 Archivos encontrados: ${archivos.length}`);
    console.log(`   📄 ${archivos.join(', ')}`);

    if (archivos.length === 0) {
      console.log('💡 Coloca documentos en:', DOCS_SOURCE_DIR);
      return false;
    }

    let totalChunks = 0;
    let exitosos = 0;

    for (const archivo of archivos) {
      const chunks = await procesarDocumento(archivo);
      if (chunks > 0) {
        totalChunks += chunks;
        exitosos++;
      }
      // Pequeña pausa entre archivos
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    ultimaActualizacion = new Date().toLocaleString('es-CO');
    cargarDocumentosEnMemoria();

    console.log(`\n🎉 PROCESAMIENTO COMPLETADO:`);
    console.log(`   ✅ ${exitosos}/${archivos.length} documentos procesados`);
    console.log(`   🧩 ${totalChunks} chunks generados`);
    console.log(`   🕒 ${ultimaActualizacion}`);

    return exitosos > 0;

  } catch (error) {
    console.error('❌ Error en procesamiento automático:', error);
    return false;
  } finally {
    estaProcesando = false;
  }
}

// 📊 ENDPOINTS

app.get("/status", (req, res) => {
  const totalChunks = Array.from(documentosChunks.values()).reduce((sum, chunks) => sum + chunks.length, 0);
  
  res.json({
    servidor: "🟢 ACTIVO",
    documentos: documentosChunks.size,
    chunksTotales: totalChunks,
    procesando: estaProcesando,
    ultimaActualizacion: ultimaActualizacion,
    modelo: OLLAMA_MODEL,
    timestamp: new Date().toLocaleString('es-CO')
  });
});

app.post("/procesar-documentos", async (req, res) => {
  try {
    console.log('🔄 Solicitud de reprocesamiento manual');
    const resultado = await procesarDocumentosAutomatico();
    
    res.json({ 
      success: resultado,
      message: resultado ? "Documentos procesados exitosamente" : "Error al procesar documentos",
      documentos: documentosChunks.size,
      ultimaActualizacion: ultimaActualizacion
    });
  } catch (error) {
    console.error('❌ Error en reprocesamiento:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno: " + error.message 
    });
  }
});

// 💬 ENDPOINT CHAT
app.post("/chat", async (req, res) => {
  const { message, modoEstricto = true } = req.body;
  
  if (!message?.trim()) {
    return res.json({ 
      reply: "⚠️ Por favor, escribe tu pregunta sobre las aves de Caldas.",
      fuentes: [],
      documentosEncontrados: 0,
      modoUsado: "none"
    });
  }

  const pregunta = message.trim();
  
  try {
    // Verificar documentos
    if (documentosChunks.size === 0) {
      return res.json({ 
        reply: `📚 No hay documentos cargados.\n\nPor favor:\n1. Coloca documentos en la carpeta 'documentos'\n2. Ejecuta: POST http://localhost:5000/procesar-documentos\n3. O reinicia el servidor`,
        fuentes: [],
        documentosEncontrados: 0,
        modoUsado: "none"
      });
    }

    // Búsqueda
    const resultados = buscarEnDocumentos(pregunta);
    let contexto = "";
    let fuentes = [];

    if (resultados.length > 0) {
      fuentes = [...new Set(resultados.map(r => r.archivo))];
      contexto = "INFORMACIÓN RELEVANTE:\n\n";
      
      resultados.forEach((resultado, idx) => {
        contexto += `--- Fragmento ${idx + 1} (${resultado.archivo}) ---\n`;
        contexto += resultado.texto + "\n\n";
      });
    } else {
      contexto = "No se encontró información específica sobre: " + pregunta;
    }

    // Generar respuesta
    const respuesta = await obtenerRespuestaIA(pregunta, contexto, modoEstricto);

    res.json({ 
      reply: respuesta,
      modoUsado: modoEstricto ? "estricto" : "investigativo",
      documentosEncontrados: resultados.length,
      fuentes: fuentes,
      chunksAnalizados: resultados.length
    });

  } catch (error) {
    console.error("❌ ERROR en /chat:", error);
    res.status(500).json({ 
      reply: "❌ Error interno del servidor. Intenta nuevamente.",
      documentosEncontrados: 0,
      fuentes: []
    });
  }
});

// 🚀 INICIALIZACIÓN Y INICIO
async function inicializarSistema() {
  console.log('\n🌿 INICIALIZANDO ECOALAS SERVER...');
  
  // Crear directorios
  if (!fs.existsSync(DOCS_SOURCE_DIR)) {
    fs.mkdirSync(DOCS_SOURCE_DIR, { recursive: true });
    console.log('📁 Carpeta documentos creada');
  }
  if (!fs.existsSync(CHUNKS_DIR)) {
    fs.mkdirSync(CHUNKS_DIR, { recursive: true });
    console.log('📁 Carpeta chunks creada');
  }

  // Cargar chunks existentes primero
  const chunksCargados = cargarDocumentosEnMemoria();

  // Procesar solo si no hay chunks existentes
  const archivosFuente = fs.existsSync(DOCS_SOURCE_DIR) ? 
    fs.readdirSync(DOCS_SOURCE_DIR).filter(f => 
      f.toLowerCase().endsWith('.pdf') || 
      f.toLowerCase().endsWith('.txt') || 
      f.toLowerCase().endsWith('.json')
    ) : [];

  if (archivosFuente.length > 0 && chunksCargados === 0) {
    console.log(`📚 Procesando ${archivosFuente.length} documentos automáticamente...`);
    await procesarDocumentosAutomatico();
  } else if (chunksCargados > 0) {
    console.log(`📚 Usando ${chunksCargados} chunks ya procesados`);
  }
}

const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, async () => {
  await inicializarSistema();
  
  console.log(`\n🚀 Servidor EcoAlas ejecutándose en http://localhost:${PORT}`);
  console.log(`📚 Documentos cargados: ${documentosChunks.size}`);
  console.log(`🔧 Modo: Extracción directa de PDFs (sin OCR)`);
  console.log(`🤖 Modelo: ${OLLAMA_MODEL}`);
  console.log(`📁 Ruta documentos: ${DOCS_SOURCE_DIR}`);
  
  console.log(`\n💡 Endpoints disponibles:`);
  console.log(`   GET  /status              - Estado del sistema`);
  console.log(`   POST /procesar-documentos - Reprocesar documentos`);
  console.log(`   POST /chat                - Chat con documentos`);
  
  if (documentosChunks.size === 0) {
    console.log(`\n⚠️  PARA CARGAR DOCUMENTOS:`);
    console.log(`   1. Coloca PDFs/TXT en: ${DOCS_SOURCE_DIR}`);
    console.log(`   2. Ejecuta: POST http://localhost:${PORT}/procesar-documentos`);
    console.log(`   3. O reinicia el servidor`);
  }
});