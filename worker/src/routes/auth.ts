import type { Env } from "../lib/types";
import { badRequest, json, unauthorized } from "../lib/response";
import { getUserByUsername, isUserExpired } from "../lib/db";
import { readBearer, sha256Hex, simplePasswordHash } from "../lib/security";

async function createAdminToken(username: string, secret: string) {
  const ts = Date.now().toString();
  const sig = await sha256Hex(`${username}:${ts}:${secret}`);
  return `${username}.${ts}.${sig}`;
}

async function verifyAdminToken(token: string, secret: string) {
  const [username, ts, sig] = token.split(".");
  if (!username || !ts || !sig) return null;
  const expected = await sha256Hex(`${username}:${ts}:${secret}`);
  if (expected !== sig) return null;
  const ageMs = Date.now() - Number(ts);
  if (ageMs > 1000 * 60 * 60 * 12) return null;
  return { username };
}

export async function handleAdminLogin(request: Request, env: Env) {
  const body = await request.json<any>().catch(() => null);
  if (!body?.username || !body?.password) return badRequest("Missing username or password");
  const user = await getUserByUsername(env, body.username);
  if (!user || user.role !== "admin") return unauthorized("Invalid credentials");
  const passwordHash = await simplePasswordHash(body.password, env.ADMIN_JWT_SECRET);
  if (passwordHash !== user.password_hash) return unauthorized("Invalid credentials");
  const token = await createAdminToken(user.username, env.ADMIN_JWT_SECRET);
  return json({ ok: true, token, user: { id: user.id, username: user.username, role: user.role } });
}

export async function requireAdmin(request: Request, env: Env) {
  const token = readBearer(request);
  if (!token) return null;
  return verifyAdminToken(token, env.ADMIN_JWT_SECRET);
}

export async function handleHeartbeat(request: Request, env: Env) {
  const body = await request.json<any>().catch(() => null);
  if (!body?.username) return badRequest("Missing username");
  const user = await getUserByUsername(env, body.username);
  if (!user) return unauthorized("Unknown user");
  if (user.status !== "active") return unauthorized("User inactive");
  if (await isUserExpired(user)) return unauthorized("User expired");

  const key = `online:${user.username}`;
  await env.TOKENS.put(key, JSON.stringify({
    username: user.username,
    last_seen: new Date().toISOString(),
    device: body.device ?? "unknown"
  }), { expirationTtl: 90 });

  return json({ ok: true });
}
