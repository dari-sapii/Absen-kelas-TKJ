document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('attendance-form');
  const list = document.getElementById('attendance-list');
  const emptyState = document.getElementById('empty-state');

  const countHadir = document.getElementById('count-hadir');
  const countIzin = document.getElementById('count-izin');
  const countSakit = document.getElementById('count-sakit');
  const countAlpha = document.getElementById('count-alpha');

  const SHEET_URL = "https://script.google.com/macros/s/AKfycbyPBj6M3qc2KNrYK81Mbgx6CD7efSpbBnds66_Qq70aaj1Xm9SNiVhSgYpuTi1pAM2zzg/exec";

  let data = [];

  function render() {
    list.innerHTML = '';
    list.appendChild(emptyState);

    if (data.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }

    let stat = { Hadir: 0, Izin: 0, Sakit: 0, Alpha: 0 };

    data.forEach(item => {
      stat[item.status]++;

      const div = document.createElement('div');
      div.className = 'rounded-xl p-4 shadow-lg flex justify-between items-center';
      div.style.background = '#f8fafc';

      div.innerHTML = `
        <div>
          <div class="font-semibold">${item.nama}</div>
          <div class="text-sm text-gray-500">${item.kelas} • ${item.waktu}</div>
        </div>
        <span class="font-medium">${item.status}</span>
      `;

      list.appendChild(div);
    });

    countHadir.textContent = stat.Hadir;
    countIzin.textContent = stat.Izin;
    countSakit.textContent = stat.Sakit;
    countAlpha.textContent = stat.Alpha;
  }

  // AMBIL DATA SAAT LOAD
  fetch(SHEET_URL)
    .then(r => r.json())
    .then(res => {
      data = res;
      render();
    });

  // SIMPAN DATA
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const kelas = document.getElementById('kelas').value;
    const statusEl = document.querySelector('input[name="status"]:checked');

    if (!nama || !kelas || !statusEl) return;

    const now = new Date();

    const item = {
      nama,
      kelas,
      status: statusEl.value,
      waktu: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    data.push(item);
    render();
    form.reset();

    fetch(SHEET_URL, {
      method: "POST",
      body: JSON.stringify(item)
    });
  });

});