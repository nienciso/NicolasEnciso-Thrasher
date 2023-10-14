const connection = require('../db');

function checkSession(req, res) {
    if (req.session.user) {
      res.status(200).json({ isAuthenticated: true, user: req.session.user });
    } else {
      res.status(401).json({ isAuthenticated: false, user: null });
    }
  }
  

  function login(req, res) {
    const { email, password } = req.body;
  

    const query = 'SELECT * FROM usuario WHERE email = ?';
    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error('Error en la consulta a la base de datos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
      } else if (results.length > 0) {
        const user = results[0];
        
        bcrypt.compare(password, user.password, (err, passwordsMatch) => {
          if (err) {
            console.error('Error al comparar contraseñas:', err);
            res.status(500).json({ message: 'Error interno del servidor' });
          } else if (passwordsMatch) {
            req.session.user = { email, role: user.rol };
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
          } else {
           
            res.status(401).json({ message: 'Credenciales incorrectas' });
          }
        });
      } else {
       
        res.status(401).json({ message: 'Credenciales incorrectas' });
      }
    });
  }
  // Cerrar sesión
  function logout(req, res) {
    if (req.session.user) {
      delete req.session.user;
      res.status(200).json({ message: 'Cierre de sesión exitoso' });
    } else {
      res.status(401).json({ message: 'No se encontró una sesión activa' });
    }
  }
  

  module.exports =
    { 
    checkSession, 
    login,
    logout 
    };