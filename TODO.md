# TODO - Perbaikan Login (tidak bisa diakali via localStorage)

- [ ] Buat backend Node/Express untuk register & login
- [ ] Implement hashing password (bcrypt) dan simpan user di storage lokal backend
- [ ] Gunakan session cookie untuk autentikasi
- [ ] Ubah `js/Register.js` agar POST ke `/api/register`
- [ ] Ubah `js/Login.js` agar POST ke `/api/login`
- [ ] Ubah proteksi halaman (cek login) di `js/Keranjang.js` dan `js/main.js` agar tidak pakai `localStorage` lagi
- [ ] Tambahkan endpoint `/api/me` (cek status login) untuk frontend
- [ ] Test end-to-end: register→login→keranjang; login salah; logout

