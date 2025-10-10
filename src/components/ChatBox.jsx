import { useState } from "react";
import colibriImg from "../assets/colibri.png";

export default function ChatBox() {
  const [mensajes, setMensajes] = useState([
    { texto: "¡Hola! Soy tu asistente de EcoAlas 🐦. ¿Qué respuesta quieres que te cante?", de: "colibri" },
  ]);
  const [input, setInput] = useState("");
  const [abierto, setAbierto] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [iaOn, setIaOn] = useState(true); // Botón para activar/desactivar IA

  const enviarMensaje = async () => {
    if (!input.trim()) return;

    const nuevoMensaje = { texto: input, de: "usuario" };
    setMensajes([...mensajes, nuevoMensaje]);
    setInput("");
    setCargando(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, iaOn }),
      });
      const data = await res.json();

      // 🔹 Respuesta en una sola burbuja
      setMensajes((prev) => [...prev, { texto: data.reply, de: "colibri" }]);
    } catch (error) {
      setMensajes((prev) => [
        ...prev,
        { texto: "⚠️ Error al conectar con el servidor.", de: "colibri" },
      ]);
      console.error("Error en ChatBox:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") enviarMensaje();
  };

  if (!abierto)
    return (
      <button
        className="fixed bottom-16 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setAbierto(true)}
        title="Abrir chat"
      >
        💬
      </button>
    );

  return (
    <div
      className="fixed bottom-14 right-14 w-80 bg-white rounded shadow-lg flex flex-col z-50"
      style={{ minHeight: "300px", maxHeight: "500px", resize: "vertical" }}
    >
      <div className="flex justify-between items-center p-3 border-b">
        <h4 className="font-bold">🌿 EcoChat</h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIaOn(!iaOn)}
            className={`px-2 py-1 rounded ${iaOn ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
          >
            {iaOn ? "IA ON" : "IA OFF"}
          </button>
          <button onClick={() => setAbierto(false)} title="Minimizar chat">
            ➖
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {mensajes.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.de === "colibri" ? "justify-start" : "justify-end"}`}
          >
            {m.de === "colibri" && (
              <img
                src={colibriImg}
                alt="Colibrí"
                className="w-8 h-8 mr-2 animate-bounce"
              />
            )}
            <div
              className={`px-3 py-2 rounded-lg max-w-[70%] ${
                m.de === "colibri" ? "bg-green-100 text-green-900" : "bg-slate-200 text-slate-800"
              }`}
            >
              {m.texto}
            </div>
          </div>
        ))}
        {cargando && <div className="text-green-500">Colibrí está pensando...</div>}
      </div>

      <div className="flex border-t p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Escribe tu pregunta..."
        />
        <button
          onClick={enviarMensaje}
          className="ml-2 bg-green-600 text-white px-3 rounded"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
