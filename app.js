const express = require('express');
const indexRoutes = require("./routes/indexRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const productosRoutes = require("./routes/productosRoutes");
const app = express();
const PORT = 3000;
const productos = require("./models").productos;


app.set("view engine", "ejs");
app.set('views',__dirname + '/views' );

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());



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