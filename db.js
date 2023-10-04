const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "localhost", 
  user: "root", 
  password: "", 
  database: "thrasher", 
});

connection.connect((err) => {
  if (err) {
    console.error('Error en la conexión a la base de datos:', err);
    throw err;
  }
  console.log('Conexión a la base de datos MySQL establecida');
});

module.exports = connection
;