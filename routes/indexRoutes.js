const express = require("express");

const {
    renderLogin,
    renderRegister,
    renderIndex,
    renderDetail_Products,
    renderCart,
    registrarNuevo,
} = require("../controller/indexControllers");

//productos
const { registrarProducto, renderProducto, actualizarProducto, eliminarProducto, obtenerProductoPorId } = require("../controller/productoControllers");
const validateProducto = require("../middleware/validateProducto");


const validateRegister = require("../middleware/validateRegister");


const router = express.Router();

//  rutas

// index
router.get("/login", renderLogin);
router.post("/login", renderLogin);
router.get("/register", renderRegister);
router.post("/register", validateRegister ,registrarNuevo);
router.get("/", renderIndex);
router.get("/detail_products", renderDetail_Products);
router.get("/cart", renderCart);

//productos
router.get("/productos", renderProducto);
router.post("/productos", validateProducto, registrarProducto);
router.get("/productos/:id", obtenerProductoPorId);
router.post("/actualizar-productos/:id", actualizarProducto );
router.delete("/eliminar-productos/:id", eliminarProducto);


// exportando
module.exports = router;