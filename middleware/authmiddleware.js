const checkSession = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    next();
  };
  
  // Exporta el middleware de verificación de sesión
  module.exports = { checkSession };