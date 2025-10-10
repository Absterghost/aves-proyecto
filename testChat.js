import fetch from "node-fetch";

const preguntas = [
  "colibries",
  "hablame de colibries",
  "tucan",
  "guia de aves"
];

async function probarChat() {
  for (let i = 0; i < preguntas.length; i++) {
    const pregunta = preguntas[i];
    console.log(`\n🔹 Pregunta: "${pregunta}"`);
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: pregunta }),
      });
      const data = await res.json();
      console.log("✅ Respuesta del servidor:");
      console.log(data.reply);
    } catch (err) {
      console.error("❌ Error conectando al servidor:", err);
    }
  }
}

probarChat();
