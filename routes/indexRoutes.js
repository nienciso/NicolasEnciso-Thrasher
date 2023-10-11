const express = require("express");


//paginas
const {
    renderLogin,
    renderRegister,
    renderIndex,
    renderDetail_Products,
    renderCart,

} = require("../controller/indexControllers");
//  Controllers
const {getAllProductos, getProductosByCategoria} = require("../controller/productoControllers");

const {addToCart ,showCart} = require("../controller/cartControllers");
const router = express.Router();

// index

router.get("/login", renderLogin);

router.get("/register", renderRegister)
router.get("/index" ,renderIndex);
router.get("/productos" ,getAllProductos);
router.get("/productos" ,getProductosByCategoria);
router.post('/carrito/agregar/:id',addToCart); // Ruta para agregar producto al carrito
router.get('/productos', showCart); // Ruta para mostrar el carrito


router.get("/detail_products", renderDetail_Products);
router.get("/cart", renderCart);

// exportando
module.exports = router;