const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connection = require('./db');
const crypto = require('crypto');

// Genera una cadena secreta aleatoria de 32 bytes
const secretKey = crypto.randomBytes(32).toString('hex');

const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  connection: connection,
  schema: {
    tableName: 'sessions'
  },
  secret: secretKey, // Usa la cadena secreta generada
});

module.exports = {
  middleware: session({
    secret: secretKey, // Usa la misma cadena secreta generada
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  }),

  checkSession: function (req, res, next) {
    if (req.session.user) {
      return next();
    } else {
      return res.redirect('/login');
    }
  },

  checkAdmin: function (req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
      return next();
    } else {
      return res.redirect('/login');
    }
  },
};