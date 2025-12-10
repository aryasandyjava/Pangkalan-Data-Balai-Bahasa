const session = require('express-session');

const sessionConfig = session({
  secret: 'balai-bahasa-lampung-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 jam
    httpOnly: true
  }
});

module.exports = sessionConfig;