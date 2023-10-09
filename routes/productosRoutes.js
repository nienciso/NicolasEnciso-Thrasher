const express = require("express");

const router = express.Router();

//productos
const {createProduct, renderProducto, actualizarProducto, eliminarProducto, obtenerProductoPorId} = require("../controller/productoControllers");
const validateProducto = require("../middleware/validateProducto");

//ruta productos
router.get("/agregar-productos", renderProducto);
router.post("/agregar-productos", validateProducto, createProduct);
router.get("/obtener-productos/:id",  obtenerProductoPorId);
router.put("/actualizar-productos/:id", validateProducto,actualizarProducto );
router.delete("/eliminar-productos/:id", eliminarProducto);


module.exports = router;