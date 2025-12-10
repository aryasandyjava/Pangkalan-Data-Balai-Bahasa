const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Export izin karyawan ke Excel
router.get('/izin-karyawan', async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT * FROM izin WHERE id_karyawan = ? ORDER BY tanggal_pengajuan DESC',
      [req.session.userId]
    );

    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Izin');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=data-izin-saya.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Export semua izin (admin)
router.get('/izin-semua', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT i.*, k.nama, k.nip, k.jabatan
      FROM izin i
      JOIN karyawan k ON i.id_karyawan = k.id
      ORDER BY i.tanggal_pengajuan DESC
    `);

    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Izin');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=data-izin-semua.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Export pelanggaran (admin)
router.get('/pelanggaran', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT p.*, k.nama, k.nip, k.jabatan
      FROM pelanggaran p
      JOIN karyawan k ON p.id_karyawan = k.id
      ORDER BY p.created_at DESC
    `);

    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Pelanggaran');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=data-pelanggaran.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Export konsultasi (admin)
router.get('/konsultasi', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM pengunjung ORDER BY created_at DESC');

    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Konsultasi');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=data-konsultasi.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;