const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sessionConfig = require('./config/session');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const karyawanRoutes = require('./routes/karyawan');
const pengunjungRoutes = require('./routes/pengunjung');
const exportRoutes = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionConfig);

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/karyawan', karyawanRoutes);
app.use('/api/pengunjung', pengunjungRoutes);
app.use('/api/export', exportRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/pengunjung/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/ajukan-konsultasi', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/pengunjung/ajukan-konsultasi.html'));
});

app.get('/daftar-konsultasi', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/pengunjung/daftar-konsultasi.html'));
});

app.get('/struktur-pegawai', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/pengunjung/struktur-pegawai.html'));
});

app.get('/detail/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/pengunjung/detail.html'));
});

// Karyawan pages
app.get('/karyawan/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/karyawan/dashboard.html'));
});

app.get('/karyawan/profil', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/karyawan/profil.html'));
});

app.get('/karyawan/izin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/karyawan/izin.html'));
});

app.get('/karyawan/status', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/karyawan/status.html'));
});

app.get('/karyawan/ganti-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/karyawan/ganti-password.html'));
});

// Admin pages
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin/dashboard.html'));
});

app.get('/admin/data-karyawan', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin/data-karyawan.html'));
});

app.get('/admin/verifikasi-izin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin/verifikasi-izin.html'));
});

app.get('/admin/pelanggaran', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin/pelanggaran.html'));
});

app.get('/admin/laporan', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin/laporan.html'));
});

app.get('/admin/konsultasi', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin/konsultasi.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📊 Pangkalan Data Balai Bahasa Provinsi Lampung`);
});