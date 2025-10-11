import db from "../config/db.js";

const Usuario = {
  crear: (datos, callback) => {
    const query = "INSERT INTO usuarios (username, password) VALUES (?, ?)";
    db.query(query, [datos.username, datos.password], callback);
  },

  buscarPorUsername: (username, callback) => {
    const query = "SELECT * FROM usuarios WHERE username = ?";
    db.query(query, [username], callback);
  }
};

export default Usuario;
