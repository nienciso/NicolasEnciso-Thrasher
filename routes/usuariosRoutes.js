
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

const { getLogin,postLogin, getRegister,
  postRegister,
  getLogout
    
} = require("../controller/authController");

//validaciones
router.get('/register', getRegister);

// Ruta para procesar el formulario de registro
router.post('/register', postRegister);

const { validateUsuario} = require("../middleware/validateRegister");


router.get('/user', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
  
    if (req.session.user.role !== 'user') {
      return res.redirect('/login');
    }
  
    res.render('userDashboard');
  });
  
  router.get('/admin', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
  
    if (req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
  
    res.render('adminDashboard');
  });
  
  router.route('/login')
    .get(getLogin)
    .post(postLogin);
  
  router.get('/logout', getLogout);
  
  module.exports = router;




//usuarios 
router.get("/agregar-usuarios", renderUsuario);
router.post("/agregar-usuarios", validateUsuario,registrarUsuario);
router.get("/obtener-usuarios/:id", obtenerUsuarioPorId);
router.put("/actualizar-usuarios/:id", validateUsuario,actualizarUsuario );
router.delete("/eliminar-usuarios/:id", eliminarUsuario);

module.exports = router;