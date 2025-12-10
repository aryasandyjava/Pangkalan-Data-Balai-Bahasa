const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// Semua route admin memerlukan autentikasi dan role admin
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// Dashboard statistik
router.get('/dashboard-stats', async (req, res) => {
  try {
    const [totalKaryawan] = await db.query('SELECT COUNT(*) as total FROM karyawan WHERE role = "karyawan"');
    const [izinPending] = await db.query('SELECT COUNT(*) as total FROM izin WHERE status = "pending"');
    const [izinDisetujui] = await db.query('SELECT COUNT(*) as total FROM izin WHERE status = "disetujui"');
    const [izinDitolak] = await db.query('SELECT COUNT(*) as total FROM izin WHERE status = "ditolak"');
    const [konsultasiPending] = await db.query('SELECT COUNT(*) as total FROM pengunjung WHERE status = "pending"');
    const [totalPelanggaran] = await db.query('SELECT COUNT(*) as total FROM pelanggaran');

    res.json({
      success: true,
      data: {
        totalKaryawan: totalKaryawan[0].total,
        izinPending: izinPending[0].total,
        izinDisetujui: izinDisetujui[0].total,
        izinDitolak: izinDitolak[0].total,
        konsultasiPending: konsultasiPending[0].total,
        totalPelanggaran: totalPelanggaran[0].total
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// CRUD Karyawan
router.get('/karyawan', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM karyawan ORDER BY created_at DESC');
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.get('/karyawan/:id', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM karyawan WHERE id = ?', [req.params.id]);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
    }
    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.post('/karyawan', async (req, res) => {
  const { nip, nama, jabatan, nomor, email, password, role } = req.body;

  try {
    await db.query(
      'INSERT INTO karyawan (nip, nama, jabatan, nomor, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nip, nama, jabatan, nomor, email, password, role || 'karyawan']
    );

    res.json({ success: true, message: 'Karyawan berhasil ditambahkan' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/karyawan/:id', async (req, res) => {
  const { nip, nama, jabatan, nomor, email, password, role } = req.body;

  try {
    let query = 'UPDATE karyawan SET nip = ?, nama = ?, jabatan = ?, nomor = ?, email = ?, role = ?';
    let params = [nip, nama, jabatan, nomor, email, role];

    if (password) {
      query += ', password = ?';
      params.push(password);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    await db.query(query, params);

    res.json({ success: true, message: 'Karyawan berhasil diperbarui' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.delete('/karyawan/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM karyawan WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Karyawan berhasil dihapus' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Verifikasi Izin
router.get('/izin', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT i.*, k.nama, k.nip, k.jabatan
      FROM izin i
      JOIN karyawan k ON i.id_karyawan = k.id
      ORDER BY i.tanggal_pengajuan DESC
    `);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/izin/:id', async (req, res) => {
  const { status } = req.body;

  try {
    await db.query('UPDATE izin SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Status izin berhasil diperbarui' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Pelanggaran
router.get('/pelanggaran', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT p.*, k.nama, k.nip, k.jabatan
      FROM pelanggaran p
      JOIN karyawan k ON p.id_karyawan = k.id
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.post('/pelanggaran', async (req, res) => {
  const { id_karyawan, keterangan, tanggal, jam } = req.body;

  try {
    await db.query(
      'INSERT INTO pelanggaran (id_karyawan, keterangan, tanggal, jam) VALUES (?, ?, ?, ?)',
      [id_karyawan, keterangan, tanggal, jam]
    );

    res.json({ success: true, message: 'Pelanggaran berhasil ditambahkan' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.delete('/pelanggaran/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM pelanggaran WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Pelanggaran berhasil dihapus' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Konsultasi
router.get('/konsultasi', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM pengunjung ORDER BY created_at DESC');
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.put('/konsultasi/:id', async (req, res) => {
  const { status } = req.body;

  try {
    await db.query('UPDATE pengunjung SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Status konsultasi berhasil diperbarui' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Laporan Grafik
router.get('/laporan/status-izin', async (req, res) => {
  const { bulan, tahun } = req.query;
  
  try {
    let query = 'SELECT status, COUNT(*) as jumlah FROM izin WHERE 1=1';
    let params = [];

    if (bulan && tahun) {
      query += ' AND MONTH(tanggal_mulai) = ? AND YEAR(tanggal_mulai) = ?';
      params.push(bulan, tahun);
    }

    query += ' GROUP BY status';

    const [result] = await db.query(query, params);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.get('/laporan/jenis-izin', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT jenis_izin, COUNT(*) as jumlah
      FROM izin
      GROUP BY jenis_izin
      ORDER BY jumlah DESC
    `);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.get('/laporan/tren-izin', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        DATE_FORMAT(tanggal_mulai, '%Y-%m') as bulan,
        COUNT(*) as jumlah
      FROM izin
      WHERE tanggal_mulai >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
      GROUP BY bulan
      ORDER BY bulan ASC
    `);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.get('/laporan/izin-per-jabatan', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT k.jabatan, COUNT(i.id) as jumlah
      FROM karyawan k
      LEFT JOIN izin i ON k.id = i.id_karyawan
      GROUP BY k.jabatan
      ORDER BY jumlah DESC
    `);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;