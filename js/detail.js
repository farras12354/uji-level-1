const container = document.getElementById("detail-produk");

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

// Ambil ID dari URL
const urlParams = new URLSearchParams(window.location.search);
const produkId = urlParams.get("id");

async function ambilDetailProduk(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!res.ok) {
      throw new Error(`Detail fetch failed: ${res.status} ${res.statusText}`);
    }
    const produk = await res.json();

    container.innerHTML = `
    <div class="p-2 mr-10 ">
    <div class="max-w-6xl max-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gray-100 rounded-2xl flex items-center justify-center  ">
    
      <img
      src="${produk.image}"
      alt="${produk.title}"
      class= " bg-gray-200 rounded-lg overflow-hidden w-full h-70 object-contain hover:scale-105 transition duration-300 ml-10"
     >
     

      <div class="flex flex-col justify-center px-9">
            
            <span class="bg-gray-300 text-gray-600 text-sm px-4 py-1 rounded-full w-fit mb-4 capitalize">
              ${produk.category}
            </span>

            <h1 class="text-3xl font-bold text-gray-800 mb-4">
              ${produk.title}
            </h1>

            <div class="text-4xl font-bold text-green-500 mb-6">
              ${formatRupiah(produk.price)}
            </div>

          <p class="text-gray-600 leading-relaxed mb-8">
              ${produk.description}
            </p>
            <div class="flex gap-2">
            <button type="button" onclick="tambahKeKeranjang(${produk.id})" class="bg-blue-600 text-white px-3 py-2 rounded-xl font-semibold transition inline-block text-center">
              Tambah ke Keranjang
            </button>

            <button type="button" onclick="tambahKeKeranjang(${produk.id})" class="bg-blue-600 text-white px-3 py-2 rounded-xl font-semibold transition inline-block text-center">
              Beli Sekarang
            </button>

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

ambilDetailProduk(produkId);