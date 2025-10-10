import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta principal del chat
app.post("/chat", async (req, res) => {
  const { message } = req.body; // <-- debe coincidir con el frontend

  try {
    // Enviamos el mensaje al modelo Llama 3 de Ollama
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: message,
      stream: false,
    });

    const reply = response.data.response; // <-- se llamará 'reply'
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al comunicarse con Ollama" });
  }
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor de chat corriendo en http://localhost:${PORT}`);
});
