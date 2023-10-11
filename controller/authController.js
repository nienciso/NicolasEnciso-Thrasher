const bcrypt = require('bcrypt');
const db = require('../db');

// Controlador para obtener la página de inicio de sesión
const getLogin = (req, res) => {
  res.render('login', { error: null });
};

// Controlador para procesar el formulario de inicio de sesión
const postLogin = async (req, res) => {
  const { username, password } = req.body;

  // Busca el usuario en la base de datos
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  const user = rows[0];

  // Si el usuario existe y la contraseña es correcta
  if (user && await bcrypt.compare(password, user.password)) {
    // Configura la sesión con la información del usuario
    req.session.user = { id: user.id, username: user.username };
    // Redirige al panel de control
    return res.redirect('/dashboard');
  } else {
    // Si las credenciales son incorrectas, muestra un mensaje de error
    return res.render('login', { error: 'Usuario o contraseña incorrectos' });
  }
};

// Controlador para obtener la página de registro
const getRegister = (req, res) => {
  res.render('register', { error: null });
};

// Controlador para procesar el formulario de registro
const postRegister = async (req, res) => {
  const { username, password } = req.body;

  // Verifica que no haya otro usuario registrado con ese username
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    return res.render('register', { error: 'El nombre de usuario ya está en uso' });
  }

  // Cifra la contraseña del usuario
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // Registra al usuario en la base de datos
  await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

  // Redirige al usuario a la página de inicio de sesión
  return res.redirect('/auth/login');
};

// Controlador para el cierre de sesión
const getLogout = (req, res) => {
  // Destruye la sesión del usuario
  req.session.destroy();
  // Redirige al inicio de sesión
  return res.redirect('/auth/login');
};

// Exporta los controladores de autenticación
module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getLogout
};