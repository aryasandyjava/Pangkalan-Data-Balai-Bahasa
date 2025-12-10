const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Semua route karyawan memerlukan autentikasi
router.use(authMiddleware);

// Get profil karyawan
router.get('/profil', async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT id, nip, nama, jabatan, nomor, email, foto FROM karyawan WHERE id = ?',
      [req.session.userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Update profil karyawan
router.put('/profil', async (req, res) => {
  const { nama, jabatan, nomor, email } = req.body;

  try {
    await db.query(
      'UPDATE karyawan SET nama = ?, jabatan = ?, nomor = ?, email = ? WHERE id = ?',
      [nama, jabatan, nomor, email, req.session.userId]
    );

    res.json({ success: true, message: 'Profil berhasil diperbarui' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Upload foto profil
router.post('/upload-foto', upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload' });
    }

    await db.query(
      'UPDATE karyawan SET foto = ? WHERE id = ?',
      [req.file.filename, req.session.userId]
    );

    res.json({ 
      success: true, 
      message: 'Foto berhasil diupload',
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Ajukan izin baru
router.post('/izin', async (req, res) => {
  const { jenis_izin, tanggal_mulai, tanggal_selesai, jam_mulai, jam_selesai, alasan } = req.body;

  try {
    await db.query(
      'INSERT INTO izin (id_karyawan, jenis_izin, tanggal_mulai, tanggal_selesai, jam_mulai, jam_selesai, alasan) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.session.userId, jenis_izin, tanggal_mulai, tanggal_selesai, jam_mulai, jam_selesai, alasan]
    );

    res.json({ success: true, message: 'Izin berhasil diajukan' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get daftar izin karyawan
router.get('/izin', async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT * FROM izin WHERE id_karyawan = ? ORDER BY tanggal_pengajuan DESC',
      [req.session.userId]
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get statistik izin per bulan (untuk grafik)
router.get('/statistik-izin', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        DATE_FORMAT(tanggal_mulai, '%Y-%m') as bulan,
        COUNT(*) as jumlah,
        status
      FROM izin
      WHERE id_karyawan = ?
      AND tanggal_mulai >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY bulan, status
      ORDER BY bulan ASC
    `, [req.session.userId]);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Ganti password
router.put('/ganti-password', async (req, res) => {
  const { password_lama, password_baru } = req.body;

  try {
    const [user] = await db.query(
      'SELECT password FROM karyawan WHERE id = ?',
      [req.session.userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    if (user[0].password !== password_lama) {
      return res.status(400).json({ success: false, message: 'Password lama tidak sesuai' });
    }

    await db.query(
      'UPDATE karyawan SET password = ? WHERE id = ?',
      [password_baru, req.session.userId]
    );

    res.json({ success: true, message: 'Password berhasil diubah' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;