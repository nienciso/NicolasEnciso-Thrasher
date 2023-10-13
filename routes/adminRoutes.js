const express = require("express");
const {renderProduct} = require("../controller/adminControllers");
const router = express.Router();

router.get("/productos", renderProduct);

module.exports =  router;