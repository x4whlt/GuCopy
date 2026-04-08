PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'vip',
  status TEXT NOT NULL DEFAULT 'active',
  expire_at TEXT NOT NULL,
  max_devices INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  fingerprint TEXT NOT NULL,
  user_agent TEXT,
  ip_hash TEXT,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, fingerprint),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  stream_url TEXT NOT NULL,
  image TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  info TEXT,
  image TEXT,
  url TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  reason TEXT,
  banned_by TEXT,
  banned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  meta_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO channels (slug, title, category, stream_url, image)
VALUES
  ('live-1', 'LIVE 1', 'live', 'https://example.com/live1.m3u8', 'https://via.placeholder.com/320x180.png?text=LIVE+1'),
  ('movie-1', 'MOVIES 1', 'movies', 'https://example.com/movie1.m3u8', 'https://via.placeholder.com/320x180.png?text=MOVIES+1'),
  ('series-1', 'SERIES 1', 'series', 'https://example.com/series1.m3u8', 'https://via.placeholder.com/320x180.png?text=SERIES+1');

INSERT OR IGNORE INTO announcements (title, info, image, url, active)
VALUES
  ('ข่าวระบบ', 'ระบบพร้อมใช้งาน', 'https://via.placeholder.com/320x180.png?text=NEWS', 'https://example.com/news', 1);

INSERT OR IGNORE INTO users (username, password_hash, role, status, expire_at, max_devices)
VALUES
  ('admin', 'CHANGE_ME', 'admin', 'active', '2099-12-31T23:59:59Z', 1);
