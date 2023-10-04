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
const {registrarProducto, renderProducto, actualizarProducto, eliminarProducto, obtenerProductoPorId,} = require("../controller/productoControllers");
const validateProducto = require("../middleware/validateProducto");

const { validateUsuario} = require("../middleware/validateRegister");

const router = express.Router();

//  rutas

// index
router.get("/login", renderLogin);
router.post("/login", renderLogin);
router.get("/register",renderRegister)
router.get("/register", renderUsuario);
router.get("/index" ,renderIndex);

router.get("/detail_products", renderDetail_Products);
router.get("/cart", renderCart);

//productos
router.get("/productos", renderProducto);
router.post("/productos", validateProducto, registrarProducto);
router.get("/productos/:id", obtenerProductoPorId);
router.put("/actualizar-productos/:id", validateProducto,actualizarProducto );
router.delete("/eliminar-productos/:id", eliminarProducto);

//usuarios 
router.get("/usuarios", renderUsuario);
router.post("/usuarios", validateUsuario,registrarUsuario);
router.get("/usuarios/:id", obtenerUsuarioPorId);
router.put("/actualizar-usuarios/:id", validateUsuario,actualizarUsuario );
router.delete("/eliminar-usuarios/:id", eliminarUsuario);


// exportando
module.exports = router;