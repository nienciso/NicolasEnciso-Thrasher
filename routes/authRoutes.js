const express = require('express');
const { loginUser } = require('../controller/authController');

const router = express.Router();

router.post('/login', loginUser);

router.get('/', (req, res) => {
  if (req.session.userId) {
    res.send('Panel de control');
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;