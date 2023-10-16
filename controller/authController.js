const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db');

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM usuario WHERE email = ?';
    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error('Error al buscar el usuario en la base de datos:', error);
        return res.status(500).json({ error: 'Error al buscar el usuario.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      const usuario = results[0];

      const passwordMatch = bcrypt.compareSync(password, usuario.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta.' });
      }

      const token = crearToken(usuario);

      // Devolver el token en la respuesta
      res.status(200).json({ token, rol: usuario.rol });
    });
  } catch (error) {
    console.error('Error al procesar la solicitud de inicio de sesión:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud de inicio de sesión.' });
  }
}

function crearToken(usuario) {
  const payload = {
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
  };

  // Generar un token con jwt.sign
  const token = jwt.sign(payload, 'password', { expiresIn: '1h' });

  return token;
}

module.exports = {
  loginUser,
  crearToken
};