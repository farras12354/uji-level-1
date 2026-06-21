const listEl = document.getElementById("list-keranjang");
const totalEl = document.getElementById("total");
const hargaSatuEl = document.getElementById("harga-satu");

let produkData = {};
let qty = {};

// Format harga ke Rupiah
function formatRupiah(harga) {
  const idkRate = 15000; // 1 USD = 15,000 IDR
  const rupiah = harga * idkRate;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(rupiah);
}

function isLoggedIn() {
  return localStorage.getItem("user") !== null;
}

function requireLogin(event, targetUrl) {
  if (!isLoggedIn()) {
    if (event) event.preventDefault();
    window.location.href = "login.html";
    return false;
  }
  if (targetUrl) {
    window.location.href = targetUrl;
  }
  return true;
}

function getKeranjang() {
  try {
    const raw = localStorage.getItem("keranjang");
    if (!raw || raw.trim() === "") return [];
    return JSON.parse(raw);
  } catch (e) {
    localStorage.removeItem("keranjang");
    return [];
  }
}

function updateBrandTitle() {
  const brandTitle = document.getElementById("brand-title");
  if (brandTitle && localStorage.getItem("user")) {
    brandTitle.textContent = "ShopEase";
  }
}

async function init() {
  if (!localStorage.getItem("user")) {
    window.location.href = "login.html";
    return;
  }

  updateBrandTitle();
  const ids = getKeranjang();

  if (ids.length === 0) {
    listEl.innerHTML = `<p class="text-gray-400 py-6 text-center">Keranjang kamu kosong.</p>`;
    hitungTotal();
    return;
  }

  const fetches = ids.map((id) =>
    fetch(`https://fakestoreapi.com/products/${id}`).then((r) => r.json())
  );
  const produkList = await Promise.all(fetches);

  produkList.forEach((p) => {
    produkData[p.id] = p;
    qty[p.id] = 1;
  });

  renderList();
}

function renderList() {
  listEl.innerHTML = "";

  if (Object.keys(produkData).length === 0) {
    listEl.innerHTML = `<p class="text-gray-400 py-6 text-center">Keranjang kamu kosong.</p>`;
    hitungTotal();
    return;
  }

  Object.values(produkData).forEach((p) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-4 flex flex-col gap-4 sm:flex-row sm:items-center";
    card.innerHTML = `
      <div class="flex items-start gap-3">
        <input type="checkbox" id="check-${p.id}" onchange="hitungTotal()" checked
          class="w-4 h-4 accent-orange-500 cursor-pointer mt-1 shrink-0">
        <img src="${p.image}" alt="${p.title}" class="w-24 h-24 object-contain rounded-lg shrink-0">
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-800 line-clamp-2">${p.title}</p>
        <p class="text-xs text-gray-400 mt-1 capitalize">${p.category}</p>
        <div class="mt-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button onclick="kurang(${p.id})" class="w-8 h-8 rounded-full border border-gray-300 hover:border-orange-400 text-gray-600 hover:text-orange-500 flex items-center justify-center text-lg transition-colors">−</button>
            <span id="qty-${p.id}" class="w-8 text-center text-sm font-medium">${qty[p.id]}</span>
            <button onclick="tambah(${p.id})" class="w-8 h-8 rounded-full border border-gray-300 hover:border-orange-400 text-gray-600 hover:text-orange-500 flex items-center justify-center text-lg transition-colors">+</button>
          </div>
          <button onclick="hapus(${p.id})" class="text-gray-500 hover:text-red-500 transition-colors text-sm font-semibold">Hapus</button>
        </div>
      </div>
      <div class="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <span id="harga-${p.id}" class="text-green-500 font-bold text-sm">${formatRupiah(p.price * qty[p.id])}</span>
      </div>
    `;
    listEl.appendChild(card);
  });

  hitungTotal();
}

function tambah(id) {
  qty[id]++;
  document.getElementById(`qty-${id}`).textContent = qty[id];
  document.getElementById(`harga-${id}`).textContent = formatRupiah(produkData[id].price * qty[id]);
  hitungTotal();
}

function kurang(id) {
  if (qty[id] > 1) {
    qty[id]--;
    document.getElementById(`qty-${id}`).textContent = qty[id];
    document.getElementById(`harga-${id}`).textContent = formatRupiah(produkData[id].price * qty[id]);
    hitungTotal();
  }
}

function hapus(id) {
  delete produkData[id];
  delete qty[id];
  const keranjang = getKeranjang().filter((k) => Number(k) !== Number(id));
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  renderList();
}

function hapusSemua() {
  produkData = {};
  qty = {};
  localStorage.removeItem("keranjang");
  renderList();
}

function hitungTotal() {
  let total = 0;
  let subtotal = 0;
  let totalQty = 0;

  Object.values(produkData).forEach((p) => {
    const checkbox = document.getElementById(`check-${p.id}`);
    if (checkbox && checkbox.checked) {
      subtotal += p.price * qty[p.id];
      totalQty += qty[p.id];
      total += p.price * qty[p.id];
    }
  });

  // Harga satuan = rata-rata harga per item
  const hargaSatu = totalQty > 0 ? subtotal / totalQty : 0;

  if (totalEl) totalEl.textContent = formatRupiah(total);

  const hargaSatuEl = document.getElementById("harga-satu");
  const subtotalEl = document.getElementById("subtotal");
  if (hargaSatuEl) hargaSatuEl.textContent = formatRupiah(hargaSatu);
  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
}

init();

function updateHargaSatu() {
  if (!hargaSatuEl) return;

  const checkedProduk = Object.values(produkData).filter((p) => {
    const checkbox = document.getElementById(`check-${p.id}`);
    return checkbox && checkbox.checked;
  });

  if (checkedProduk.length === 0) {
    hargaSatuEl.textContent = formatRupiah(0);
    return;
  }

  const totalQty = checkedProduk.reduce((sum, p) => sum + qty[p.id], 0);
  const totalHarga = checkedProduk.reduce((sum, p) => sum + p.price * qty[p.id], 0);
  hargaSatuEl.textContent = formatRupiah(totalQty ? totalHarga / totalQty : 0);
}

function checkout() {
  const user = localStorage.getItem("user");
  if (!user) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
    return;
  }
  
  let u;
  try {
    u = JSON.parse(user);
  } catch (error) {
    u = { nama: user };
  }
  
  const total = Object.values(produkData).reduce((sum, p) => {
    const checkbox = document.getElementById(`check-${p.id}`);
    return checkbox && checkbox.checked ? sum + (p.price * qty[p.id]) : sum;
  }, 0);
  
  alert(`Checkout berhasil!\nTerima kasih, ${u.nama || "Pelanggan"}, sudah berbelanja di ShopEase`);
  
  localStorage.removeItem("keranjang");
  produkData = {};
  qty = {};
  renderList();
}
