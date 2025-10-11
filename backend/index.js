import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/routeUsuario.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/usuarios", usuarioRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

