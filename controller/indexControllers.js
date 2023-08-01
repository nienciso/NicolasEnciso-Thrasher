const fs = require("fs");

const renderLogin = (req,res) => {
    res.render("login");
};

const renderRegister = (req,res) => {
    res.render("register", {errors: [] });
};

const renderIndex = (req,res) => {
    res.render("index");
};

const renderDetail_Products = (req,res) => {
    res.render("detail_Products");
};

const renderCart = (req,res) => {
    res.render("cart");
};

//Logica de register

const registrarNuevo= (req, res) => {
  const { email, password} = req.body;
  const nuevoUsuario ={
    email,
    password
  };
  fs.writeFileSync(
    "usuarios.json",
    JSON.stringify(nuevoUsuario,null,2),
    "utf-8"
  );
 res.send("Nuevo usuario agregado con exito");
};

module.exports = {
  renderLogin,
  renderRegister,
  renderIndex,
  renderDetail_Products,
  renderCart,
  registrarNuevo

};