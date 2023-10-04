const express = require('express');
const indexRoutes = require("./routes/indexRoutes");
const app = express();
const PORT = 3000;
const productos = require("./models").productos;

app.use(express.static('public')); 
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/", indexRoutes);

app.use("/admin", require("./routes/adminRoutes"));

app.use("/api/productos", async(req,res) =>{
    const data = await productos.findAll();
    res.json(data);
});

app.listen(PORT, ()=>{
    console.log("server ON",PORT);
});