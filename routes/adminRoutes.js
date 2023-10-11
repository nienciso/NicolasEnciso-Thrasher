const express = require("express");
const {renderAdmin, renderProduct} = require("../controller/adminControllers");
const router = express.Router();

router.get("/productos", renderProduct);

module.exports =  router;