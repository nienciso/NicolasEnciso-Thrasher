const fs = require("fs");

function saveProductos(productos) {
  const stringifiedUsers = JSON.stringify(productos, null, 2);
  const result = fs.writeFileSync("productos.json", stringifiedUsers, "utf-8");
  return result;
}

function readProductos() {
  const productos = fs.readFileSync("productos.json", "utf-8");
  const productosParsed = JSON.parse(productos);
  return productosParsed;
}

module.exports = {
  saveProductos,
  readProductos,
};