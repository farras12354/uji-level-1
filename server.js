const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend static files will be served from project root.
app.use(express.static(__dirname));

// CORS not strictly needed if same origin, but keep for safety.
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      // secure: true, // enable when using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function findUserByEmail(email) {
  const users = loadUsers();
  const needle = String(email).toLowerCase();
  return users.find((u) => String(u.email).toLowerCase() === needle);
}

function upsertUser({ email, nama, alamat, passwordHash }) {
  const users = loadUsers();
  const needle = String(email).toLowerCase();
  const existingIdx = users.findIndex((u) => String(u.email).toLowerCase() === needle);
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], email, nama, alamat, passwordHash };
  } else {
    users.push({ email, nama, alamat, passwordHash });
  }
  saveUsers(users);
}

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, nama, alamat } = req.body || {};

    if (!email || typeof email !== 'string') return res.status(400).json({ message: 'Email harus diisi.' });
    if (!email.includes('@')) return res.status(400).json({ message: 'Masukkan email yang valid.' });
    // Sesuai UI kamu: pakai aturan Gmail.
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Gunakan email Gmail (@gmail.com).' });
    }
    if (!nama) return res.status(400).json({ message: 'Nama harus diisi.' });
    if (!alamat) return res.status(400).json({ message: 'Alamat harus diisi.' });
    if (!password || typeof password !== 'string') return res.status(400).json({ message: 'Password harus diisi.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password minimal 6 karakter.' });

    const exists = findUserByEmail(email);
    if (exists) return res.status(409).json({ message: 'Email sudah terdaftar.' });

    const passwordHash = await bcrypt.hash(password, 10);
    upsertUser({ email, nama, alamat, passwordHash });

    return res.json({ ok: true, message: 'Registrasi berhasil.' });
  } catch (e) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || typeof email !== 'string') return res.status(400).json({ message: 'Email harus diisi.' });
    if (!password || typeof password !== 'string') return res.status(400).json({ message: 'Password harus diisi.' });

    const user = findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Email atau password salah.' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Email atau password salah.' });

    // Session login
    req.session.user = {
      email: user.email,
      nama: user.nama,
      alamat: user.alamat,
    };

    return res.json({ ok: true, user: req.session.user });
  } catch {
    return res.status(500).json({ message: 'Server error.' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  return res.json({ loggedIn: false });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan: http://localhost:${PORT}`);
});

