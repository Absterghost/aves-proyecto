import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // o el usuario que uses en Workbench
  password: "Skoidats.1",
  database: "aves_db"
});

connection.connect((err) => {
  if (err) throw err;
  console.log("✅ Conectado a MySQL");
});

export default connection;

