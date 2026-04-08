import type { Env, UserRow } from "./types";

export async function getUserByUsername(env: Env, username: string): Promise<UserRow | null> {
  const result = await env.DB.prepare(
    `SELECT * FROM users WHERE username = ?1 LIMIT 1`
  ).bind(username).first<UserRow>();
  return result ?? null;
}

export async function getUserById(env: Env, id: number): Promise<UserRow | null> {
  const result = await env.DB.prepare(
    `SELECT * FROM users WHERE id = ?1 LIMIT 1`
  ).bind(id).first<UserRow>();
  return result ?? null;
}

export async function listUsers(env: Env) {
  const result = await env.DB.prepare(
    `SELECT id, username, role, status, expire_at, max_devices, created_at, updated_at
     FROM users ORDER BY id DESC`
  ).all();
  return result.results;
}

export async function isUserExpired(user: Pick<UserRow, "expire_at">) {
  return Date.parse(user.expire_at) < Date.now();
}

export async function listEnabledChannels(env: Env) {
  const result = await env.DB.prepare(
    `SELECT id, slug, title, category, stream_url, image
     FROM channels WHERE enabled = 1 ORDER BY category, id`
  ).all();
  return result.results;
}

export async function getChannelBySlug(env: Env, slug: string) {
  return env.DB.prepare(
    `SELECT id, slug, title, category, stream_url, image, enabled
     FROM channels WHERE slug = ?1 LIMIT 1`
  ).bind(slug).first();
}
