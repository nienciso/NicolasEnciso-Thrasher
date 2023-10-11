const fs = require('fs');
const bcrypt = require('bcrypt');

const usuarios = JSON.parse(fs.readFileSync('db/usuarios.json')); // Lee el archivo JSON con los usuarios

function iniciarSesion(req, res) {
  const { correo, contrasena, tipoUsuario } = req.body;

  const usuario = usuarios.find(u => u.correo === correo); // Busca el usuario por correo electrónico

  if (usuario && bcrypt.compareSync(contrasena, usuario.contrasena) && usuario.tipoUsuario === tipoUsuario) {
    // Si las credenciales proporcionadas son válidas y el tipo de usuario es correcto, inicia sesión en el usuario
    req.session.usuario = usuario;
    res.redirect('/perfil'); // Redirige a la página de perfil del usuario
  } else {
    // Si las credenciales o el tipo de usuario son inválidos, muestra un mensaje de error
    res.render('login', { errorMessage: 'El correo y/o la contraseña son incorrectos' });
  }
}

module.exports = { iniciarSesion}