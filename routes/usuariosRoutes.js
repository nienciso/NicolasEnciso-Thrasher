
const express = require("express");

const router = express.Router();

//  controllers
const {
    renderUsuario,
    registrarUsuario,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
} = require("../controller/usuarioControllers");

const { validateUsuario} = require("../middleware/validateRegister");


//usuarios 
router.get("/agregar-usuarios", renderUsuario);
router.post("/agregar-usuarios", validateUsuario,registrarUsuario);
router.get("/obtener-usuarios/:id", obtenerUsuarioPorId);
router.put("/actualizar-usuarios/:id", validateUsuario,actualizarUsuario );
router.delete("/eliminar-usuarios/:id", eliminarUsuario);

module.exports = router;