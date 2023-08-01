const express = require("express");
const {renderPerfil} = require("../controller/adminControllers");
const router = express.Router();

router.get("/perfil", renderPerfil);

module.exports =  router;