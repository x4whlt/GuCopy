import type { Env } from "../lib/types";
import { badRequest, json, unauthorized } from "../lib/response";
import { getUserById, listUsers } from "../lib/db";
import { requireAdmin } from "./auth";
import { simplePasswordHash } from "../lib/security";

export async function handleAdminUsers(request: Request, env: Env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return unauthorized();

  if (request.method === "GET") {
    return json({ ok: true, users: await listUsers(env) });
  }

  if (request.method === "POST") {
    const body = await request.json<any>().catch(() => null);
    if (!body?.username || !body?.password || !body?.expire_at) {
      return badRequest("Missing username, password, or expire_at");
    }
    const hash = await simplePasswordHash(body.password, env.ADMIN_JWT_SECRET);
    const result = await env.DB.prepare(
      `INSERT INTO users (username, password_hash, role, status, expire_at, max_devices)
       VALUES (?1, ?2, 'vip', 'active', ?3, ?4)`
    ).bind(body.username, hash, body.expire_at, body.max_devices ?? 1).run();

    return json({ ok: true, inserted: result.meta.last_row_id });
  }

  return badRequest("Method not allowed");
}

export async function handleAdminBan(request: Request, env: Env, userId: number) {
  const admin = await requireAdmin(request, env);
  if (!admin) return unauthorized();

  const user = await getUserById(env, userId);
  if (!user) return badRequest("User not found");

  await env.DB.prepare(`UPDATE users SET status = 'banned', updated_at = CURRENT_TIMESTAMP WHERE id = ?1`)
    .bind(userId).run();

  return json({ ok: true, user_id: userId, status: "banned" });
}

export async function handleAdminUnban(request: Request, env: Env, userId: number) {
  const admin = await requireAdmin(request, env);
  if (!admin) return unauthorized();

  const user = await getUserById(env, userId);
  if (!user) return badRequest("User not found");

  await env.DB.prepare(`UPDATE users SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?1`)
    .bind(userId).run();

  return json({ ok: true, user_id: userId, status: "active" });
}

export async function handleAdminExtend(request: Request, env: Env, userId: number) {
  const admin = await requireAdmin(request, env);
  if (!admin) return unauthorized();

  const body = await request.json<any>().catch(() => null);
  if (!body?.expire_at) return badRequest("Missing expire_at");

  await env.DB.prepare(`UPDATE users SET expire_at = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2`)
    .bind(body.expire_at, userId).run();

  return json({ ok: true, user_id: userId, expire_at: body.expire_at });
}
