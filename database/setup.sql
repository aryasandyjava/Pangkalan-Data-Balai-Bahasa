-- Buat Database
CREATE DATABASE IF NOT EXISTS pangkalan_data_balai;
USE pangkalan_data_balai;

-- Tabel Karyawan
CREATE TABLE IF NOT EXISTS karyawan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nip VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  nomor VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  foto VARCHAR(255) DEFAULT 'default.jpg',
  role ENUM('karyawan', 'admin') DEFAULT 'karyawan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Izin
CREATE TABLE IF NOT EXISTS izin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_karyawan INT NOT NULL,
  jenis_izin VARCHAR(50) NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  jam_mulai TIME,
  jam_selesai TIME,
  alasan TEXT,
  status ENUM('pending', 'disetujui', 'ditolak') DEFAULT 'pending',
  tanggal_pengajuan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_karyawan) REFERENCES karyawan(id) ON DELETE CASCADE
);

-- Tabel Pelanggaran
CREATE TABLE IF NOT EXISTS pelanggaran (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_karyawan INT NOT NULL,
  keterangan TEXT NOT NULL,
  tanggal DATE NOT NULL,
  jam TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_karyawan) REFERENCES karyawan(id) ON DELETE CASCADE
);

-- Tabel Pengunjung (Konsultasi)
CREATE TABLE IF NOT EXISTS pengunjung (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  asal_instansi VARCHAR(150),
  nomor VARCHAR(20),
  keperluan VARCHAR(100) NOT NULL,
  keterangan TEXT,
  status ENUM('pending', 'disetujui', 'ditolak') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data Admin Default
INSERT INTO karyawan (nip, nama, jabatan, nomor, email, password, role) VALUES
('199001012020011001', 'Administrator', 'Kepala Balai', '081234567890', 'admin@balaibahasa.id', 'admin123', 'admin');

-- Data Karyawan Sample
INSERT INTO karyawan (nip, nama, jabatan, nomor, email, password, role) VALUES
('199102022020012001', 'Budi Santoso', 'Penyuluh Bahasa', '081234567891', 'budi@balaibahasa.id', 'karyawan123', 'karyawan'),
('199203033020013001', 'Siti Nurhaliza', 'Widyabasa Ahli Muda', '081234567892', 'siti@balaibahasa.id', 'karyawan123', 'karyawan'),
('199304044020014001', 'Ahmad Wijaya', 'Penerjemah Ahli Pertama', '081234567893', 'ahmad@balaibahasa.id', 'karyawan123', 'karyawan'),
('199405055020015001', 'Dewi Lestari', 'Pengadministrasi Perkantoran', '081234567894', 'dewi@balaibahasa.id', 'karyawan123', 'karyawan');