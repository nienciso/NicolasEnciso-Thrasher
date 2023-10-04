const express = require("express");
const {renderAdmin, renderProduct} = require("../controller/adminControllers");
const router = express.Router();

router.get("/admin", renderAdmin);
router.get("/productos", renderProduct);

module.exports =  router;