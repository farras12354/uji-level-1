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

const api = "https://fakestoreapi.com/products";

fetch(api)
  .then((respon) => {
    if (!respon.ok) {
      throw new Error(`API fetch failed: ${respon.status} ${respon.statusText}`);
    }
    return respon.json();
  })
  .then((data) => {
    let hasil = "";
    data.forEach((element) => {
      hasil += `
        <div class="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-4 flex flex-col">
          <img src="${element.image}" alt="Gambar Produk" class="w-32 h-32 object-contain mx-auto mb-4">
          <span class="bg-gray-300 text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-full w-fit mb-4 capitalize">${element.category}</span>
          <h2 class="text-sm font-semibold mb-2 line-clamp-2 flex-1">${element.title}</h2>
          <p class="text-green-500 font-bold mt-2 mb-3">${formatRupiah(element.price)}</p>
          <div class="flex gap-2 mt-auto">
            <a href="Detail.html?id=${element.id}" class="flex-1 text-center border border-gray-300 hover:border-blue-400 hover:text-blue-500 text-gray-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
              Lihat Detail
            </a>
            <button type="button" onclick="tambahKeKeranjang(${element.id})" class="flex-1 text-center bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
              + Keranjang
            </button>
          </div>
        </div>
      `;
    });
    document.getElementById("container").innerHTML = hasil;
  })
  .catch((err) => {
    console.error("Fetch error:", err);
    document.getElementById("container").innerHTML = `<p class="text-red-500">Gagal memuat produk. Coba refresh halaman.</p>`;
  });
    function isLoggedIn() {
      return localStorage.getItem("user") !== null;
    }

    function requireLogin(event, targetUrl) {
      if (!isLoggedIn()) {
        event.preventDefault();
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

    function tambahKeKeranjang(id) {
      if (!isLoggedIn()) {
        window.location.href = "./login.html";
        return;
      }
      const keranjang = getKeranjang();
      const angkaId = Number(id);
      if (!keranjang.map(Number).includes(angkaId)) {
        keranjang.push(angkaId);
        localStorage.setItem("keranjang", JSON.stringify(keranjang));
      }
      window.location.href = "./Keranjang.html";
    }
  
    
    const user = localStorage.getItem("user");
    const btn = document.getElementById("btn-login");
    const brandTitle = document.getElementById("brand-title");

    if (user) {
      btn.textContent = 'Logout';
      btn.href = "#";
      btn.onclick = () => {
        localStorage.removeItem("user");
        location.reload();
      };
      if (brandTitle) {
        brandTitle.textContent = "ShopEase";
      }
    } else if (brandTitle) {
      brandTitle.textContent = "Toko Online";
    }
 function filterProduk(keyword) {
      const cards = document.querySelectorAll("#container > div");
      const q = keyword.toLowerCase();
      cards.forEach((card) => {
        const title = card.querySelector("h2")?.textContent.toLowerCase() || "";
        const cat = card.querySelector("span")?.textContent.toLowerCase() || "";
        card.style.display = (title.includes(q) || cat.includes(q)) ? "" : "none";
      });
    }

    document.getElementById("search-input").addEventListener("input", function() {
      filterProduk(this.value);
    });