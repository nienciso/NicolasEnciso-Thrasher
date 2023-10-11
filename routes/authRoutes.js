const express = require('express');
const {getLogin,postLogin,getRegister,postRegister,getLogout} = require('../controller/authController');

const router = express.Router();

// Página de inicio de sesión
router.get('/login', getLogin);

// Procesamiento del inicio de sesión
router.post('/login', postLogin);

// Página de registro
router.get('/register', getRegister);

// Procesamiento del registro
router.post('/register', postRegister);

// Cierre de sesión
router.get('/logout', getLogout);

// Exporta el router de autenticación
module.exports = router;