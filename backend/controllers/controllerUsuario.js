import db from "../config/db.js";

export function registrarUsuario(req, res) {
  const { username, password } = req.body;

  // Verificar si el usuario ya existe
  const buscarQuery = "SELECT * FROM usuarios WHERE username = ?";
  db.query(buscarQuery, [username], (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: "Error al buscar usuario" });
    }

    if (resultados.length > 0) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Insertar nuevo usuario
    const insertarQuery = "INSERT INTO usuarios (username, password) VALUES (?, ?)";
    db.query(insertarQuery, [username, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ mensaje: "Error al registrar usuario" });
      }
      res.json({ mensaje: "Usuario registrado correctamente" });
    });
  });
}


