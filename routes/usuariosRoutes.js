const express = require('express');
const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require("../controller/usuarioControllers");
const routerUsuarios = express.Router();

//  CRUD 

//get : recupera datos de un recurso
routerUsuarios.get("/", obtenerUsuarios);
//post : envia datos para crear un recurso
routerUsuarios.post("/", crearUsuario);
//put : actaliza un recurso existente de datos
routerUsuarios.get("/:id", actualizarUsuario);
//delete : elimina un recurso existente de datos
routerUsuarios.get("/:id", eliminarUsuario);


module.exports = routerUsuarios;