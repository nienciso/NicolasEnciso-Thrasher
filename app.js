const express = require('express');
const indexRoutes = require("./routes/indexRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const productosRoutes = require("./routes/productosRoutes");
const app = express();
const PORT = 3000;
const connection = require('./db')
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.set("view engine", "ejs");
app.set('views',__dirname + '/views' );



app.use(express.static(path.join(__dirname, 'public'), { type: 'text/javascript' }));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function(req, res) {
    res.set('Content-Type', 'text/javascript');
    res.sendFile('/controller/cartControllers.js');
  });

app.use("/", indexRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/productos", productosRoutes);

app.use("/admin", require("./routes/adminRoutes"));
///
app.use(bodyParser.json());

// Ruta para obtener productos
app.get('/api/productos', (req, res) => {
  const query = 'SELECT * FROM productos'; // Tu consulta SQL para obtener productos

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los productos de la base de datos: ' + error);
      res.status(500).json({ error: 'Error al obtener los productos de la base de datos' });
    } else {
      // Respondemos con los productos en formato JSON
      res.json(results);
    }
  });
});

app.delete('/api/productos/eliminar-producto/:id', (req, res) => {
    const productIdToDelete = req.params.id;
  
    const deleteQuery = 'DELETE FROM productos WHERE id = ?';
  
    connection.query(deleteQuery, [productIdToDelete], (error, results) => {
      if (error) {
        console.error('Error al eliminar el producto de la base de datos:', error);
        res.status(500).json({ error: 'Error al eliminar el producto de la base de datos.' });
      } else {
        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
      }
    });
  });
///

const corsOptions = {
    origin: 'http://localhost:3001',  // Cambia a tu URL de frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Habilita el intercambio de cookies y credenciales
  };
  
  app.use(cors(corsOptions));

app.listen(PORT, ()=>{
    console.log("server ON",PORT);
});