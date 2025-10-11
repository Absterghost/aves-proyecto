import { useState } from "react";
import colibriImg from "../assets/colibri.png";

export default function ChatBox() {
  const [mensajes, setMensajes] = useState([
    {
      texto: "¡Hola! Soy tu asistente de EcoAlas 🐦. Tengo dos modos de respuesta. ¿En qué puedo ayudarte?",
      de: "colibri",
    },
  ]);
  const [input, setInput] = useState("");
  const [abierto, setAbierto] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [modoEstricto, setModoEstricto] = useState(true);

  const palabrasClaveDescarga = [
    "informe", "descargar", "descarga", "documento", 
    "pdf", "información", "archivo", "reporte"
  ];

  const detectarSolicitudDescarga = (texto) => {
    const textoLower = texto.toLowerCase();
    return palabrasClaveDescarga.some(palabra => textoLower.includes(palabra));
  };

  // 🎯 Función para formatear respuestas - MÁS LIMPIA
  const formatearRespuesta = (texto) => {
    if (!texto) return texto;
    
    // Eliminar prefijos duplicados como "🔒 🔒"
    let textoLimpio = texto.replace(/^(🔒\s*)+|^(🔍\s*)+/, (match) => {
      return match.includes('🔒') ? '🔒 ' : '🔍 ';
    });
    
    // Limpiar respuestas de error de Ollama
    if (textoLimpio.includes('Ollama no disponible')) {
      // Extraer solo la parte útil de la respuesta
      const lineas = textoLimpio.split('\n');
      const lineasLimpias = lineas.filter(linea => 
        !linea.includes('Ollama no disponible') && 
        !linea.includes('Información de documentos:') &&
        !linea.includes('[DOCUMENTO:') &&
        linea.trim().length > 10
      );
      
      textoLimpio = lineasLimpias.join('\n');
      
      if (textoLimpio.length < 50) {
        return "🔒 No pude procesar tu pregunta en este momento. El sistema de IA no está disponible, pero los documentos están cargados correctamente.";
      }
    }
    
    return textoLimpio;
  };

  const enviarMensaje = async () => {
    if (!input.trim()) return;

    const mensajeUsuario = input.trim();
    const solicitaDescarga = detectarSolicitudDescarga(mensajeUsuario);
    
    setMensajes((prev) => [...prev, { 
      texto: mensajeUsuario, 
      de: "usuario",
      solicitaDescarga: solicitaDescarga
    }]);
    setInput("");
    setCargando(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: mensajeUsuario,
          modoEstricto: modoEstricto,
        }),
      });

      const data = await res.json();
      
      // Formatear la respuesta para hacerla más bonita
      const respuestaFormateada = formatearRespuesta(data.reply);

      setMensajes((prev) => [
        ...prev,
        {
          texto: respuestaFormateada,
          de: "colibri",
          mensajeOriginal: mensajeUsuario,
          modoUsado: data.modoUsado,
          solicitaDescarga: solicitaDescarga,
          fuentes: data.fuentes || []
        },
      ]);
    } catch (error) {
      console.error("Error en ChatBox:", error);
      setMensajes((prev) => [
        ...prev,
        { 
          texto: "⚠️ Error al conectar con el servidor.", 
          de: "colibri",
          mensajeOriginal: mensajeUsuario,
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") enviarMensaje();
  };

  const descargarRespuesta = (texto, pregunta, modoUsado = "estricto", fuentes = []) => {
    const modoTexto = modoUsado === "estricto" 
      ? "🔒 MODO ESTRICTO (Solo documentación cargada)" 
      : "🔍 MODO INVESTIGATIVO (Documentación + conocimiento general)";
    
    // Agrupar fuentes por documento para evitar duplicados
    const fuentesAgrupadas = agruparFuentes(fuentes);
    
    const fuentesTexto = fuentesAgrupadas.length > 0 
      ? `FUENTES CONSULTADAS:\n${fuentesAgrupadas.map(grupo => 
          `• ${grupo.archivo} (Fragmentos: ${grupo.chunks.join(', ')})`
        ).join('\n')}`
      : "No se especificaron fuentes";
    
    const contenido = `ECOALAS - AVES DE CALDAS
=================================
${modoTexto}
Pregunta: ${pregunta}
Fecha: ${new Date().toLocaleString('es-CO')}

${fuentesTexto}

RESPUESTA:
==========
${texto}

---
Generado por EcoAlas - Sistema de consulta ornitológica
`;
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecoalas_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const debeMostrarDescarga = (mensaje) => {
    const noEsError = !mensaje.texto.includes("⚠️") && 
                     !mensaje.texto.includes("No encontré") &&
                     mensaje.texto.length > 100;
    const solicitoDescarga = mensaje.solicitaDescarga;
    
    return (noEsError || solicitoDescarga);
  };

  // 🎯 Función para agrupar fuentes y evitar duplicados
  const agruparFuentes = (fuentes) => {
    const agrupadas = fuentes.reduce((acc, fuente) => {
      if (!acc[fuente.archivo]) {
        acc[fuente.archivo] = new Set();
      }
      acc[fuente.archivo].add(fuente.chunkIndex);
      return acc;
    }, {});

    return Object.entries(agrupadas).map(([archivo, chunks]) => ({
      archivo,
      chunks: Array.from(chunks).sort((a, b) => a - b)
    }));
  };

  if (!abierto) {
    return (
      <button
        className="fixed bottom-16 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-green-700 transition-colors duration-200"
        onClick={() => setAbierto(true)}
        title="Abrir chat"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-14 right-14 w-96 bg-white rounded-lg shadow-xl flex flex-col z-50 border border-green-200"
         style={{ minHeight: "420px", maxHeight: "600px" }}>
      
      {/* Cabecera Mejorada */}
      <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h4 className="font-bold text-green-800">🌿 EcoChat - Caldas</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModoEstricto(!modoEstricto)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              modoEstricto 
                ? "bg-green-600 text-white shadow-md hover:bg-green-700" 
                : "bg-blue-500 text-white shadow-md hover:bg-blue-600"
            }`}
          >
            {modoEstricto ? "🔒 Estricto" : "🔍 Investigativo"}
          </button>
          <button 
            onClick={() => setAbierto(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-200 transition-colors"
            title="Minimizar chat"
          >
            ➖
          </button>
        </div>
      </div>

      {/* Indicador de modo mejorado */}
      <div className={`px-4 py-2 text-xs font-medium text-center transition-colors duration-300 ${
        modoEstricto 
          ? "bg-green-100 text-green-700 border-b border-green-200" 
          : "bg-blue-100 text-blue-700 border-b border-blue-200"
      }`}>
        {modoEstricto 
          ? "🔒 Respuestas basadas únicamente en tu documentación" 
          : "🔍 Combinando documentación con conocimiento general"}
      </div>

      {/* Cuerpo del chat mejorado */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {mensajes.map((m, idx) => (
          <div key={idx} className="group">
            <div className={`flex ${m.de === "colibri" ? "justify-start" : "justify-end"} items-start space-x-2`}>
              {m.de === "colibri" && (
                <div className="flex-shrink-0">
                  {/* 🐦 COLIBRÍ CON ANIMACIÓN MANTENIDA */}
                  <img 
                    src={colibriImg} 
                    alt="Colibrí" 
                    className="w-10 h-10 animate-bounce transition-transform duration-300" 
                  />
                </div>
              )}
              <div className={`px-4 py-3 rounded-2xl max-w-[85%] transition-all duration-300 ${
                m.de === "colibri" 
                  ? "bg-white text-gray-800 border border-green-200 shadow-sm" 
                  : "bg-green-500 text-white shadow-sm"
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {m.texto}
                </div>
                
                {m.de === "usuario" && m.solicitaDescarga && (
                  <div className="text-xs text-blue-600 mt-2 flex items-center bg-blue-50 px-2 py-1 rounded-full">
                    <span className="mr-1">📥</span>
                    <em>Solicitud de descarga detectada</em>
                  </div>
                )}

                {/* Fuentes agrupadas y más bonitas - SIN DUPLICADOS */}
                {m.de === "colibri" && m.fuentes && m.fuentes.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-1 flex items-center">
                      <span className="mr-1">📚</span>
                      <strong>Fuentes consultadas:</strong>
                    </div>
                    <div className="space-y-1">
                      {agruparFuentes(m.fuentes).map((grupo, index) => (
                        <div key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex justify-between items-center">
                          <span className="truncate flex-1">{grupo.archivo}</span>
                          <span className="ml-2 text-gray-400 text-xs bg-white px-1 rounded">
                            Frag. {grupo.chunks.join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botón de descarga mejorado */}
            {m.de === "colibri" && m.mensajeOriginal && debeMostrarDescarga(m) && (
              <div className="flex justify-start ml-12 mt-2">
                <button
                  onClick={() => descargarRespuesta(m.texto, m.mensajeOriginal, m.modoUsado, m.fuentes || [])}
                  className="text-xs bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all duration-300 flex items-center space-x-1"
                >
                  <span>📥</span>
                  <span>{m.solicitaDescarga ? "DESCARGAR INFORME" : "Descargar respuesta"}</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {cargando && (
          <div className="flex justify-start items-start space-x-2">
            <div className="flex-shrink-0">
              {/* 🐦 COLIBRÍ CON ANIMACIÓN EN ESTADO DE CARGA */}
              <img 
                src={colibriImg} 
                alt="Colibrí" 
                className="w-10 h-10 animate-bounce" 
              />
            </div>
            <div className="bg-white border border-green-200 px-4 py-3 rounded-2xl shadow-sm">
              <div className="text-sm text-green-800">Colibrí está pensando...</div>
              <div className="text-xs text-green-600 mt-1">
                {modoEstricto ? "🔍 Buscando en documentación..." : "🌿 Investigando en múltiples fuentes..."}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pie del chat mejorado */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            placeholder={modoEstricto 
              ? "💭 Pregunta sobre la documentación de Caldas..." 
              : "🔍 Pregunta sobre aves del departamento de Caldas..."
            }
            disabled={cargando}
          />
          <button
            onClick={enviarMensaje}
            disabled={cargando || !input.trim()}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              cargando 
                ? "bg-gray-400 cursor-not-allowed" 
                : modoEstricto 
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-md" 
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
            } ${!input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {cargando ? "⏳" : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
}