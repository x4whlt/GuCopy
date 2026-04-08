import type { Env } from "../lib/types";
import { badRequest, notFound, unauthorized } from "../lib/response";
import { getChannelBySlug, getUserByUsername, isUserExpired } from "../lib/db";
import { verifyShortToken } from "../lib/security";

export async function handleStream(request: Request, env: Env, slug: string) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  const token = url.searchParams.get("token");

  if (!username || !token) return badRequest("Missing username or token");

  const verified = await verifyShortToken(token, env.STREAM_SIGNING_SECRET);
  if (!verified.ok) return unauthorized("Invalid token");
  if (verified.username !== username || verified.slug !== slug) return unauthorized("Token mismatch");

  const user = await getUserByUsername(env, username);
  if (!user) return unauthorized("Unknown user");
  if (user.status !== "active") return unauthorized("User inactive");
  if (await isUserExpired(user)) return unauthorized("User expired");

  const channel = await getChannelBySlug(env, slug);
  if (!channel || !channel.enabled) return notFound("Channel not found");

  const headers = new Headers();
  headers.set("cache-control", "no-store");
  headers.set("location", String(channel.stream_url));
  return new Response(null, { status: 302, headers });
}
