// Global functions

// Check session
async function checkSession() {
  try {
    const response = await fetch('/api/auth/check');
    const data = await response.json();
    return data.success ? data : null;
  } catch (error) {
    return null;
  }
}

// Logout
async function logout() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    });
    const data = await response.json();
    
    if (data.success) {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Format tanggal Indonesia
function formatTanggal(tanggal) {
  const date = new Date(tanggal);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

// Format tanggal singkat
function formatTanggalSingkat(tanggal) {
  const date = new Date(tanggal);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Format waktu
function formatWaktu(waktu) {
  if (!waktu) return '-';
  const [jam, menit] = waktu.split(':');
  return `${jam}:${menit}`;
}

// Show alert
function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alertDiv.style.zIndex = '9999';
  alertDiv.style.minWidth = '300px';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// Show loading
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="spinner"></div>';
  }
}

// Get status badge
function getStatusBadge(status) {
  const badges = {
    'pending': '<span class="badge badge-pending">Pending</span>',
    'disetujui': '<span class="badge badge-disetujui">Disetujui</span>',
    'ditolak': '<span class="badge badge-ditolak">Ditolak</span>'
  };
  return badges[status] || status;
}

// Validasi email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validasi nomor HP
function validatePhone(phone) {
  const re = /^[0-9]{10,15}$/;
  return re.test(phone);
}

// Export tabel ke Excel (client-side)
function exportTableToExcel(tableId, filename = 'export.xlsx') {
  const table = document.getElementById(tableId);
  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, filename);
}

// Pagination helper
function createPagination(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !data.pagination) return;

  const { page, totalPages } = data.pagination;
  let html = '<nav><ul class="pagination">';

  // Previous button
  html += `
    <li class="page-item ${page === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${page - 1}">Previous</a>
    </li>
  `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
      html += `
        <li class="page-item ${i === page ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    } else if (i === page - 3 || i === page + 3) {
      html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    }
  }

  // Next button
  html += `
    <li class="page-item ${page === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${page + 1}">Next</a>
    </li>
  `;

  html += '</ul></nav>';
  container.innerHTML = html;

  // Add click handlers
  container.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const newPage = parseInt(e.target.dataset.page);
      if (newPage && !e.target.parentElement.classList.contains('disabled')) {
        if (window.loadData) {
          window.loadData(newPage);
        }
      }
    });
  });
}

// Confirm dialog
function confirmAction(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

// Daftar jabatan
const DAFTAR_JABATAN = [
  'Kepala Balai',
  'Penelaah Teknis Kebijakan',
  'Penyuluh Bahasa',
  'Perencana Ahli Pertama',
  'Kepala Subbagian Umum',
  'Analis Pengelolaan Keuangan APBN Ahli Pertama',
  'Widyabasa Ahli Muda',
  'Penerjemah Ahli Pertama',
  'Penerjemah Ahli Muda',
  'Widyabasa Ahli Pertama',
  'Pengolah Data dan Informasi',
  'Arsiparis Ahli Pertama',
  'Pengadministrasi Perkantoran',
  'Operator Layanan Operasional'
];

// Populate jabatan select
function populateJabatanSelect(selectId) {
  const select = document.getElementById(selectId);
  if (select) {
    select.innerHTML = '<option value="">-- Pilih Jabatan --</option>';
    DAFTAR_JABATAN.forEach(jabatan => {
      select.innerHTML += `<option value="${jabatan}">${jabatan}</option>`;
    });
  }
}

// Daftar keperluan konsultasi
const KEPERLUAN_KONSULTASI = [
  'Ahli bahasa & fasilitasi kebahasaan',
  'UKBI',
  'Penerjemah',
  'Permohonan data dan informasi',
  'PKL/Magang',
  'Peminjaman aula handak',
  'Lainnya'
];

// Populate keperluan select
function populateKeperluanSelect(selectId) {
  const select = document.getElementById(selectId);
  if (select) {
    select.innerHTML = '<option value="">-- Pilih Keperluan --</option>';
    KEPERLUAN_KONSULTASI.forEach(keperluan => {
      select.innerHTML += `<option value="${keperluan}">${keperluan}</option>`;
    });
  }
}

// Auto logout saat session habis
setInterval(async () => {
  const session = await checkSession();
  if (!session && window.location.pathname !== '/login' && !window.location.pathname.startsWith('/ajukan') && window.location.pathname !== '/') {
    showAlert('Sesi Anda telah berakhir. Silakan login kembali.', 'warning');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }
}, 60000); // Check setiap 1 menit