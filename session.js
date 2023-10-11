const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const  connection  = require('./db');

const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  connection: connection,
  schema: {
    tableName: 'sessions'
  },
  secret: '123Thrasher321' // Agrega una cadena secreta aquí
});

module.exports = {
  middleware: session({
    secret: 'password',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  }),

  checkSession: function(req, res, next) {
    if (req.session.user) {
      return next();
    } else {
      return res.redirect('/login');
    }
  },

  checkAdmin: function(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
      return next();
    } else {
      return res.redirect('/login');
    }
  },
};