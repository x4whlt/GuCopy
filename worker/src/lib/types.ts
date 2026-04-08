export interface Env {
  DB: D1Database;
  TOKENS: KVNamespace;
  ADMIN_JWT_SECRET: string;
  STREAM_SIGNING_SECRET: string;
  API_BASE_URL: string;
  PLAYLIST_BRAND_NAME: string;
}

export interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  status: string;
  expire_at: string;
  max_devices: number;
  created_at: string;
  updated_at: string;
}
