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

const router = express.Router();



router.get("/login", renderLogin);

router.get("/register", renderRegister)
router.get("/index" ,renderIndex);
router.get("/productos" ,getAllProductos);
router.get("/productos" ,getProductosByCategoria);

router.get("/detail_products", renderDetail_Products);
router.get("/cart", renderCart);

// exportando
module.exports = router;