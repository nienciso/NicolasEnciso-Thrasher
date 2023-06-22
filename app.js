const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname + "/public"));

app.get("/index.html", (req,res) =>{
    res.send("Pagina de index")
});

app.get("/detail_products.html", (req,res) =>{
    res.send("Pagina de detalles del producto")
});

app.get("/cart.html", (req,res) =>{
    res.send("Pagina de cart")
});

app.get("/login.html", (req,res) =>{
    res.send("Pagina de login")
});

app.get("/register.html", (req,res) =>{
    res.send("Pagina de registro")
});


app.listen(PORT, ()=>{
    console.log("server ON",PORT);
});