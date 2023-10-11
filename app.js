const express = require('express');
const indexRoutes = require("./routes/indexRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const productosRoutes = require("./routes/productosRoutes");
const app = express();
const PORT = 3000;
const productos = require("./models").productos;
const path = require("path");
const bodyParser = require('body-parser');
const session = require('./session');
const authRoutes = require('./routes/authRoutes');
const {checkSession } = require('./middleware/authmiddleware');



app.set("view engine", "ejs");
app.set('views',__dirname + '/views' );


app.use(express.static(path.join(__dirname, 'public'), { type: 'text/javascript' }));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session.middleware);

app.use(express.json());

app.get('/', function(req, res) {
    res.set('Content-Type', 'text/javascript');
    res.sendFile('/controller/cartControllers.js');
  });

  // Rutas de autenticación
app.use('/', authRoutes);

// Rutas protegidas
app.get('/dashboard', checkSession, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});



app.use("/", indexRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/productos", productosRoutes);

app.use("/admin", require("./routes/adminRoutes"));

app.use("/api/productos", async(req,res) =>{
    const data = await productos.findAll();
    res.json(data);
});

app.listen(PORT, ()=>{
    console.log("server ON",PORT);
});