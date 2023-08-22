const express = require("express");

//paginas
const {
    renderLogin,
    renderRegister,
    renderIndex,
    renderDetail_Products,
    renderCart,

} = require("../controller/indexControllers");

//usuarios
const {
    renderUsuario,
    registrarUsuario,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
} = require("../controller/usuarioControllers");


//productos
const { registrarProducto, renderProducto, actualizarProducto, eliminarProducto, obtenerProductoPorId } = require("../controller/productoControllers");
const validateProducto = require("../middleware/validateProducto");

const {validateRegister, validateUpdate} = require("../middleware/validateRegister");

const router = express.Router();

//  rutas

// index
router.get("/login", renderLogin);
router.post("/login", renderLogin);
router.get("register",renderRegister)
router.get("/register", renderUsuario);
router.get("/", renderIndex);
router.get("/detail_products", renderDetail_Products);
router.get("/cart", renderCart);

//productos
router.get("/productos", renderProducto);
router.post("/productos", validateProducto, registrarProducto);
router.get("/productos/:id", obtenerProductoPorId);
router.put("/actualizar-productos/:id", actualizarProducto );
router.delete("/eliminar-productos/:id", eliminarProducto);

//usuarios 
router.get("/register", renderUsuario);
router.post("/register", validateRegister,registrarUsuario);
router.get("/register/:id", obtenerUsuarioPorId);
router.put("/actualizar-register/:id", validateUpdate, actualizarProducto );
router.delete("/eliminar-register/:id", eliminarUsuario);


// exportando
module.exports = router;