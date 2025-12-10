const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get pegawai yang sedang izin hari ini
router.get('/pegawai-izin-hari-ini', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT k.nama, k.jabatan, k.foto, i.tanggal_mulai, i.tanggal_selesai, i.jenis_izin
      FROM izin i
      JOIN karyawan k ON i.id_karyawan = k.id
      WHERE i.status = 'disetujui'
      AND CURDATE() BETWEEN i.tanggal_mulai AND i.tanggal_selesai
      ORDER BY i.tanggal_mulai DESC
    `);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get struktur pegawai
router.get('/struktur-pegawai', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT id, nip, nama, jabatan, nomor, email, foto
      FROM karyawan
      ORDER BY 
        CASE 
          WHEN jabatan = 'Kepala Balai' THEN 1
          WHEN jabatan LIKE '%Kepala%' THEN 2
          ELSE 3
        END,
        nama ASC
    `);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get detail pegawai
router.get('/pegawai/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT id, nip, nama, jabatan, nomor, email, foto FROM karyawan WHERE id = ?',
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Pegawai tidak ditemukan' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Ajukan konsultasi
router.post('/konsultasi', async (req, res) => {
  const { nama, email, asal_instansi, nomor, keperluan, keterangan } = req.body;

  try {
    await db.query(
      'INSERT INTO pengunjung (nama, email, asal_instansi, nomor, keperluan, keterangan) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, email, asal_instansi, nomor, keperluan, keterangan]
    );

    res.json({ success: true, message: 'Permohonan konsultasi berhasil diajukan' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get daftar konsultasi dengan filter dan pagination
router.get('/konsultasi', async (req, res) => {
  const { bulan, tahun, search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM pengunjung WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM pengunjung WHERE 1=1';
    let params = [];

    if (bulan && tahun) {
      query += ' AND MONTH(created_at) = ? AND YEAR(created_at) = ?';
      countQuery += ' AND MONTH(created_at) = ? AND YEAR(created_at) = ?';
      params.push(bulan, tahun);
    }

    if (search) {
      query += ' AND (nama LIKE ? OR email LIKE ? OR asal_instansi LIKE ? OR keperluan LIKE ?)';
      countQuery += ' AND (nama LIKE ? OR email LIKE ? OR asal_instansi LIKE ? OR keperluan LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [result] = await db.query(query, params);

    res.json({ 
      success: true, 
      data: result,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get grafik konsultasi per keperluan
router.get('/grafik-konsultasi', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT keperluan, COUNT(*) as jumlah
      FROM pengunjung
      GROUP BY keperluan
      ORDER BY jumlah DESC
    `);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;