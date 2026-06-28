async function register() {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let confirmPassword = document.getElementById("confirm-password").value.trim();
  let namaInput = document.getElementById("nama").value.trim();
  let alamatInput = document.getElementById("alamat").value.trim();
  const errEl = document.getElementById("error-msg");


  const showError = (msg) => {
    errEl.classList.remove("hidden");
    errEl.textContent = msg;
  };

  const hideError = () => {
    errEl.classList.add("hidden");
    errEl.textContent = "";
  };

  hideError();

  if (!email) {
    showError("Email harus diisi.");
    return;
  }

  if (!email.includes("@")) {
    showError("Masukkan email yang valid.");
    return;
  }

  if (!email.endsWith("@gmail.com")) {
    showError("Gunakan email Gmail (@gmail.com)." );
    return;
  }




  if (password.length < 6) {
    showError("Password minimal 6 karakter.");
    return;
  }

  if (!confirmPassword) {
    showError("Konfirmasi password harus diisi.");
    return;
  }

  if (password !== confirmPassword) {
    showError("Password dan konfirmasi password tidak sama.");
    return;
  }

  if (!namaInput) {
    showError("Nama harus diisi.");
    return;
  }

  if (!alamatInput) {
    showError("Alamat harus diisi.");
    return;
  }

  // Simpan user lengkap agar bisa diverifikasi saat login
  // (Login.js saat ini hanya butuh nama dari localStorage, namun tetap kita simpan password + alamat.)
  const user = { email, nama: namaInput, alamat: alamatInput, password };
  localStorage.setItem("user", JSON.stringify(user));



  // Simpan sesi bila ingin langsung masuk setelah daftar
  sessionStorage.setItem("nama", namaInput);
  sessionStorage.setItem("email", email);


  window.location.href = "index.html";
}

function togglePassword() {
  const input = document.getElementById("password");
  const iconEye = document.getElementById("icon-eye");
  const iconEyeOff = document.getElementById("icon-eye-off");

  // Karena UI register akan pakai tombol text seperti login,
  // ikon mata (jika ada) opsional.
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";

  if (iconEye && iconEyeOff) {
    iconEye.style.display = isHidden ? "none" : "block";
    iconEyeOff.style.display = isHidden ? "block" : "none";
  }

  const toggleButton = document.getElementById("toggle-password");
  if (toggleButton) {
    toggleButton.textContent = isHidden ? "Sembunyikan" : "Tampilkan";
  }
}

const registerForm = document.getElementById("register-form");
const errorMsg = document.getElementById("error-msg");
const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("toggle-password");

const showError = (message) => {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
};

const hideError = () => {
  errorMsg.textContent = "";
  errorMsg.classList.add("hidden");
};

if (toggleButton && passwordInput) {
  toggleButton.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleButton.textContent = isPassword ? "Sembunyikan" : "Tampilkan";
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    register();
  });
}

