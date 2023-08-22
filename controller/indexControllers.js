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

module.exports = {
  renderLogin,
  renderRegister,
  renderIndex,
  renderDetail_Products,
  renderCart


};