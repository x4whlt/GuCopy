export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function signToken(payload: string, secret: string): Promise<string> {
  const raw = `${payload}.${secret}`;
  return sha256Hex(raw);
}

export async function buildShortToken(username: string, slug: string, secret: string, ttlSeconds = 120) {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${username}:${slug}:${expiresAt}`;
  const sig = await signToken(payload, secret);
  return `${payload}:${sig}`;
}

export async function verifyShortToken(token: string, secret: string) {
  const parts = token.split(":");
  if (parts.length < 4) return { ok: false };
  const [username, slug, exp, sig] = parts;
  const payload = `${username}:${slug}:${exp}`;
  const expected = await signToken(payload, secret);
  if (expected !== sig) return { ok: false };
  if (Number(exp) < Math.floor(Date.now() / 1000)) return { ok: false };
  return { ok: true, username, slug, exp: Number(exp) };
}

export async function simplePasswordHash(password: string, pepper: string) {
  return sha256Hex(`${password}:${pepper}`);
}

export function readBearer(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) return null;
  return auth.slice(7);
}
