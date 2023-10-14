const express = require('express');
const indexRoutes = require("./routes/indexRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const productosRoutes = require("./routes/productosRoutes");
const {login, checkSession, logout} = require('./routes/authRoutes');
const app = express();
const PORT = 3000;
const connection = require('./db')
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

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

  app.use(cookieParser());
  app.use(session({
    secret: 'Password',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, 
      httpOnly: true, 
    },
  }));


app.use("/", indexRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/productos", productosRoutes);

app.use("/admin", require("./routes/adminRoutes"));
///

app.get('/validate-session', checkSession);

// Ruta para iniciar sesión
app.post('/login', login);

// Ruta para cerrar sesión
app.get('/logout', logout);


app.use(bodyParser.json());

app.get('/api/productos', (req, res) => {
  const query = 'SELECT * FROM productos'; 

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los productos de la base de datos: ' + error);
      res.status(500).json({ error: 'Error al obtener los productos de la base de datos' });
    } else {
     
      res.json(results);
    }
  });
});

app.get('/api/productos/detalles/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM productos WHERE id = ?';
  
    connection.query(query, [productId], (error, result) => {
      if (error) {
        console.error('Error al obtener los detalles del producto de la base de datos: ' + error);
        res.status(500).json({ error: 'Error al obtener los detalles del producto de la base de datos' });
      } else if (result.length === 0) {
        res.status(404).json({ error: 'Producto no encontrado' });
      } else {
        res.json(result[0]);
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

  ////





///cors
const corsOptions = {
    origin: 'http://localhost:3001',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  
  };
  
  app.use(cors(corsOptions));

app.listen(PORT, ()=>{
    console.log("server ON",PORT);
});