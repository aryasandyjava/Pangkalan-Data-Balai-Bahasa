const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      'SELECT * FROM karyawan WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    const user = users[0];
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.nama = user.nama;

    res.json({ 
      success: true, 
      message: 'Login berhasil',
      role: user.role,
      nama: user.nama
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal logout' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Logout berhasil' 
    });
  });
});

// Check session
router.get('/check', (req, res) => {
  if (req.session.userId) {
    res.json({ 
      success: true, 
      userId: req.session.userId,
      role: req.session.role,
      nama: req.session.nama
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Tidak ada sesi aktif' 
    });
  }
});

module.exports = router;