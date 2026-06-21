const container = document.getElementById("detail-produk");

// Format harga: tampilkan USD utama dan IDR sebagai perkiraan kecil
function formatIDR(harga) {
  const idkRate = 15000; // 1 USD = 15,000 IDR (dipakai hanya untuk perkiraan)
  const rupiah = harga * idkRate;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(rupiah);
}

function formatUSD(harga) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(harga);
}

// Ambil ID dari URL
const urlParams = new URLSearchParams(window.location.search);
const produkId = urlParams.get("id");

if (!produkId) {
  container.innerHTML = `<p class="text-red-500">ID produk tidak ditemukan. Silakan buka halaman detail dari daftar produk.</p>`;
} else {
  ambilDetailProduk(produkId);
}

async function ambilDetailProduk(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!res.ok) {
      throw new Error(`Detail fetch failed: ${res.status} ${res.statusText}`);
    }
    const produk = await res.json();

    container.innerHTML = `
    <div class="max-w-6xl mx-auto p-4">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="flex flex-col lg:flex-row gap-8 bg-gray-100 p-6">
          <div class="flex-1 flex items-center justify-center">
            <img
              src="${produk.image}"
              alt="${produk.title}"
              class="w-full max-w-sm h-auto object-contain rounded-lg hover:scale-105 transition duration-300"
            >
          </div>

          <div class="flex-1 flex flex-col justify-center gap-6">
            <span class="bg-gray-300 text-gray-600 text-sm px-4 py-1 rounded-full w-fit mb-2 capitalize">
              ${produk.category}
            </span>

            <h1 class="text-3xl font-bold text-gray-800 mb-4">
              ${produk.title}
            </h1>

            <div class="mb-6">
              <div class="text-4xl font-bold text-green-500">
                ${formatUSD(produk.price)}
              </div>
              <div class="text-sm text-gray-500">
                ≈ ${formatIDR(produk.price)}
              </div>
            </div>

            <p class="text-gray-600 leading-relaxed mb-6">
              ${produk.description}
            </p>

            <div class="flex flex-col sm:flex-row gap-3">
              <button type="button" onclick="tambahKeKeranjang(${produk.id})" class="bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold transition">
                Tambah ke Keranjang
              </button>
              <button type="button" onclick="tambahKeKeranjang(${produk.id})" class="bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold transition">
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
`;

  } catch (error) {
    container.innerHTML =` <p>Gagal memuat detail produk.</p>`;
  }
}

window.isLoggedIn = function() {
  return localStorage.getItem("user") !== null;
};

window.requireLogin = function(event, targetUrl) {
  if (!window.isLoggedIn()) {
    if (event) event.preventDefault();
    window.location.href = "./login.html";
    return false;
  }
  if (targetUrl) {
    window.location.href = targetUrl;
  }
  return true;
};

window.tambahKeKeranjang = function(id) {
  if (!localStorage.getItem("user")) {
    window.location.href = "./login.html";
    return;
  }

  if (!id) {
    return;
  }

  function getKeranjang() {
    try {
      return JSON.parse(localStorage.getItem("keranjang")) || [];
    } catch (error) {
      console.warn("Detail: LocalStorage keranjang parse error, reset to []", error);
      return [];
    }
  }

  function setKeranjang(keranjang) {
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
  }

  const keranjang = getKeranjang();
  const angkaId = Number(id);
  if (!keranjang.map(Number).includes(angkaId)) {
    keranjang.push(angkaId);
    setKeranjang(keranjang);
    console.log("Detail: Ditambahkan id:", angkaId, "Keranjang:", keranjang);
  } else {
    console.log("Detail: Produk sudah ada di keranjang:", angkaId);
  }
  window.location.href = "./Keranjang.html";
};

// ambilDetailProduk sudah dipanggil di atas ketika `produkId` ada