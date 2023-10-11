const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { connection } = require('./db');

const sessionStore = new MySQLStore({}, connection);

module.exports = {
  middleware: session({
    secret: 'my-secret-key',
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