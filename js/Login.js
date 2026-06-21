async function login() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    const errEl = document.getElementById("error-msg");

    if (!email.endsWith("@gmail.com")) {
        errEl.classList.remove("hidden");
        errEl.textContent = "Gunakan email Gmail (@gmail.com).";
        return;
    }

    if (password.length < 6) {
        errEl.classList.remove("hidden");
        errEl.textContent = "Password minimal 6 karakter.";
        return;
    }

    const nama = email.split("@")[0];
    sessionStorage.setItem("nama", nama);
    sessionStorage.setItem("email", email);
    window.location.href = "index.html";
}

function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

function togglePassword() {
    const input = document.getElementById('password');
    const iconEye = document.getElementById('icon-eye');
    const iconEyeOff = document.getElementById('icon-eye-off');
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    iconEye.style.display = isHidden ? 'none' : 'block';
    iconEyeOff.style.display = isHidden ? 'block' : 'none';
}
const loginForm = document.getElementById('login-form');

    const errorMsg = document.getElementById('error-msg');

    const passwordInput = document.getElementById('password');

    const toggleButton = document.getElementById('toggle-password');



    function showError(message) {

      errorMsg.textContent = message;

      errorMsg.classList.remove('hidden');

    }



    function hideError() {

      errorMsg.textContent = '';

      errorMsg.classList.add('hidden');

    }



    toggleButton.addEventListener('click', function () {

      const isPassword = passwordInput.type === 'password';

      passwordInput.type = isPassword ? 'text' : 'password';

      toggleButton.textContent = isPassword ? 'Sembunyikan' : 'Tampilkan';

    });



    loginForm.addEventListener('submit', function (event) {

      event.preventDefault();

      hideError();



      const email = document.getElementById('email').value.trim();

      const password = document.getElementById('password').value;



      if (!email) {

        showError('Email harus diisi.');

        return;

      }

      if (!email.includes('@')) {

        showError('Masukkan email yang valid.');

        return;

      }

      if (password.length < 6) {

        showError('Password minimal 6 karakter.');

        return;

      }



      localStorage.setItem('user', JSON.stringify({ email, nama: email.split('@')[0] }));

      window.location.href = 'index.html';

    });