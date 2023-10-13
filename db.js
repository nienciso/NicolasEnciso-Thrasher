
const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Especifica una cadena vacía como contraseña
  database: "thrasher"
});

module.exports = connection;