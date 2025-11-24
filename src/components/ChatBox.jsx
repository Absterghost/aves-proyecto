import { useState, useRef, useEffect } from "react";
import colibriImg from "../assets/colibri.png";

export default function ChatBox() {
  const [mensajes, setMensajes] = useState([
    {
      texto: "¡Hola! Soy Colibrí, tu asistente de aves 🐦\n\nTengo dos modos:\n\n🔒 **Modo Estricto**: Solo uso tu documentación cargada\n🔍 **Modo Investigativo**: Combino documentación con conocimiento general\n\n¿En qué puedo ayudarte hoy?",
      de: "colibri",
    },
  ]);
  const [input, setInput] = useState("");
  const [abierto, setAbierto] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [modoEstricto, setModoEstricto] = useState(true);
  const chatContainerRef = useRef(null);

  // Auto-scroll al final
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Detectar errores en respuestas
  const esError = (texto) => {
    if (!texto) return false;
    const lower = texto.toLowerCase();
    return lower.includes("error") || 
           lower.includes("❌") || 
           lower.includes("no pude") ||
           lower.includes("conexión") ||
           lower.includes("verifica") ||
           lower.includes("localhost:11434");
  };

  // Determinar si mostrar botón de descarga
  const debeMostrarDescarga = (mensaje) => {
    if (!mensaje || !mensaje.texto) return false;
    
    if (esError(mensaje.texto) || 
        mensaje.texto.includes("¡Hola!") || 
        mensaje.texto.includes("No hay documentos") ||
        mensaje.texto.length < 100) {
      return false;
    }
    
    return mensaje.de === "colibri" && 
           mensaje.mensajeOriginal && 
           (mensaje.fuentes?.length > 0 || mensaje.documentosEncontrados > 0);
  };

  // Enviar mensaje al servidor
  const enviarMensaje = async () => {
    if (!input.trim() || cargando) return;

    const mensajeUsuario = input.trim();
    const nuevoMensajeUsuario = {
      texto: mensajeUsuario, 
      de: "usuario",
      timestamp: new Date()
    };
    
    setMensajes(prev => [...prev, nuevoMensajeUsuario]);
    setInput("");
    setCargando(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: mensajeUsuario,
          modoEstricto: modoEstricto,
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const nuevoMensajeColibri = {
        texto: data.reply || "No recibí respuesta del servidor.",
        de: "colibri",
        mensajeOriginal: mensajeUsuario,
        modoUsado: data.modoUsado || "estricto",
        documentosEncontrados: data.documentosEncontrados || 0,
        fuentes: data.fuentes || [],
        timestamp: new Date()
      };
      
      setMensajes(prev => [...prev, nuevoMensajeColibri]);

    } catch (error) {
      console.error("❌ Error:", error);
      
      let mensajeError = "";
      if (error.message.includes('fetch') || error.message.includes('Failed')) {
        mensajeError = `🔌 **Error de conexión**\n\nVerifica que:\n• El servidor esté corriendo en http://localhost:5000\n• Ejecutes: node server.js\n• No haya bloqueos del firewall`;
      } else {
        mensajeError = `⚠️ Error: ${error.message}`;
      }
      
      const nuevoMensajeError = {
        texto: mensajeError, 
        de: "colibri",
        mensajeOriginal: mensajeUsuario,
        fuentes: [],
        timestamp: new Date()
      };
      
      setMensajes(prev => [...prev, nuevoMensajeError]);
    } finally {
      setCargando(false);
    }
  };

  // Manejar teclado
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  // Descargar respuesta
  const descargarRespuesta = (texto, pregunta, modoUsado = "estricto", documentosEncontrados = 0, fuentes = []) => {
    const modoTexto = modoUsado === "estricto" 
      ? "🔒 MODO ESTRICTO (Solo documentación)" 
      : "🔍 MODO INVESTIGATIVO (Documentación + conocimiento)";
    
    const contenido = `ECOALAS - CONSULTA ORNITOLÓGICA
=================================
${modoTexto}
Pregunta: ${pregunta}
Fecha: ${new Date().toLocaleString('es-CO')}
Documentos encontrados: ${documentosEncontrados}
Fuentes: ${fuentes.length > 0 ? fuentes.join(', ') : 'No especificadas'}

RESPUESTA:
==========
${texto}

---
EcoAlas - Sistema de consulta ornitológica
Caldas, Colombia | ${new Date().getFullYear()}
`;
    
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `ecoalas_consulta_${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Limpiar conversación
  const limpiarConversacion = () => {
    setMensajes([{
      texto: "¡Hola! Soy Colibrí, tu asistente de aves 🐦\n\nTengo dos modos:\n\n🔒 **Modo Estricto**: Solo uso tu documentación cargada\n🔍 **Modo Investigativo**: Combino documentación con conocimiento general\n\n¿En qué puedo ayudarte hoy?",
      de: "colibri",
    }]);
  };

  // Chat minimizado
  if (!abierto) {
    return (
      <button
        className="fixed bottom-16 right-4 bg-green-600 text-white p-4 rounded-full shadow-xl z-50 hover:bg-green-700 transition-all duration-300 hover:scale-110"
        onClick={() => setAbierto(true)}
        title="Abrir chat de EcoAlas"
      >
        <div className="flex items-center justify-center">
          <span className="text-lg">💬</span>
          <span className="w-2 h-2 bg-green-300 rounded-full animate-ping absolute -top-1 -right-1"></span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-14 right-14 w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-green-300 overflow-hidden"
         style={{ minHeight: "500px", maxHeight: "700px", height: "70vh" }}>
      
      {/* Cabecera mejorada */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <img 
            src={colibriImg} 
            alt="Colibrí" 
            className="w-8 h-8 animate-bounce" 
          />
          <div>
            <h4 className="font-bold text-sm">🌿 EcoChat - Caldas</h4>
            <div className="text-xs opacity-90">Asistente de aves</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={limpiarConversacion}
            className="p-1.5 rounded-lg hover:bg-green-600 transition-colors"
            title="Nueva conversación"
          >
            🗑️
          </button>
          <button 
            onClick={() => setAbierto(false)}
            className="p-1.5 rounded-lg hover:bg-green-600 transition-colors"
            title="Minimizar"
          >
            ➖
          </button>
        </div>
      </div>

      {/* Indicador de modo */}
      <div className={`px-4 py-2 text-xs font-semibold text-center transition-all ${
        modoEstricto 
          ? "bg-green-100 text-green-800 border-b border-green-200" 
          : "bg-blue-100 text-blue-800 border-b border-blue-200"
      }`}>
        <button
          onClick={() => setModoEstricto(!modoEstricto)}
          className="flex items-center justify-center space-x-2 w-full py-1 rounded-lg hover:opacity-80 transition-opacity"
        >
          <span>{modoEstricto ? "🔒" : "🔍"}</span>
          <span>
            {modoEstricto 
              ? "Modo Estricto (solo documentación)" 
              : "Modo Investigativo (+ conocimiento)"}
          </span>
          <span className="text-xs opacity-70">[click para cambiar]</span>
        </button>
      </div>

      {/* Área de mensajes */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-green-50"
        style={{ maxHeight: "calc(70vh - 140px)" }}
      >
        {mensajes.map((m, idx) => (
          <div key={idx} className="group">
            <div className={`flex ${m.de === "colibri" ? "justify-start" : "justify-end"} items-start space-x-3`}>
              {m.de === "colibri" && (
                <div className="flex-shrink-0">
                  <img 
                    src={colibriImg} 
                    alt="Colibrí" 
                    className="w-8 h-8 animate-bounce" 
                  />
                </div>
              )}
              <div className={`px-4 py-3 rounded-2xl max-w-[85%] transition-all shadow-sm ${
                m.de === "colibri" 
                  ? esError(m.texto)
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-white text-gray-800 border border-green-200"
                  : "bg-green-500 text-white"
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed text-sm">
                  {m.texto}
                </div>

                {/* Metadatos de la respuesta */}
                {m.de === "colibri" && !esError(m.texto) && (
                  <div className="mt-3 pt-2 border-t border-gray-200 space-y-2">
                    {/* Fuentes */}
                    {m.fuentes && m.fuentes.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">📚 Fuentes:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {m.fuentes.map((fuente, i) => (
                            <span 
                              key={i}
                              className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs border border-green-200"
                            >
                              {fuente}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Estadísticas */}
                    {(m.documentosEncontrados > 0 || m.modoUsado) && (
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        {m.documentosEncontrados > 0 && (
                          <span>📊 {m.documentosEncontrados} fragmentos</span>
                        )}
                        {m.modoUsado && (
                          <span>{m.modoUsado === "estricto" ? "🔒 Estricto" : "🔍 Investigativo"}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Botón de descarga */}
            {debeMostrarDescarga(m) && (
              <div className="flex justify-start ml-12 mt-2">
                <button
                  onClick={() => descargarRespuesta(
                    m.texto, 
                    m.mensajeOriginal, 
                    m.modoUsado, 
                    m.documentosEncontrados,
                    m.fuentes
                  )}
                  className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2 hover:scale-105"
                >
                  <span>📥</span>
                  <span>Descargar respuesta</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Indicador de carga mejorado */}
        {cargando && (
          <div className="flex justify-start items-start space-x-3">
            <div className="flex-shrink-0">
              <img 
                src={colibriImg} 
                alt="Colibrí" 
                className="w-8 h-8 animate-bounce" 
              />
            </div>
            <div className="bg-white border border-green-200 px-4 py-3 rounded-2xl shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <div className="text-sm text-green-800">
                  {modoEstricto ? "Buscando en documentos..." : "Investigando..."}
                </div>
              </div>
              <div className="text-xs text-green-600 mt-1">
                {modoEstricto ? "🔍 Analizando contenido cargado" : "🌿 Consultando base de conocimiento"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Área de input mejorada */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all"
            placeholder={modoEstricto 
              ? "💭 Pregunta sobre los documentos de aves..." 
              : "🔍 Pregunta sobre aves de Caldas..."
            }
            disabled={cargando}
          />
          <button
            onClick={enviarMensaje}
            disabled={cargando || !input.trim()}
            className={`px-4 py-3 rounded-full transition-all duration-200 ${
              cargando 
                ? "bg-gray-400 cursor-not-allowed" 
                : modoEstricto 
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg" 
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
            } ${!input.trim() ? 'opacity-50' : 'hover:scale-105'}`}
          >
            {cargando ? "⏳" : "➤"}
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center flex justify-between">
          <span>Enter para enviar</span>
          <span>•</span>
          <span>http://localhost:5000</span>
        </div>
      </div>
    </div>
  );
}