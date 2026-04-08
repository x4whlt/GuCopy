import type { Env } from "../lib/types";
import { json, unauthorized, badRequest } from "../lib/response";
import { buildShortToken } from "../lib/security";
import { getUserByUsername, isUserExpired, listEnabledChannels } from "../lib/db";

export async function handlePlaylist(request: Request, env: Env) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  if (!username) return badRequest("Missing username");

  const user = await getUserByUsername(env, username);
  if (!user) return unauthorized("Unknown user");
  if (user.status !== "active") return unauthorized("User inactive");
  if (await isUserExpired(user)) return unauthorized("User expired");

  const channels = await listEnabledChannels(env);
  const grouped = new Map<string, any[]>();

  for (const ch of channels) {
    const token = await buildShortToken(username, String(ch.slug), env.STREAM_SIGNING_SECRET, 120);
    const item = {
      name: ch.title,
      image: ch.image,
      imageScale: "center",
      url: `${env.API_BASE_URL}/api/stream/${ch.slug}?username=${encodeURIComponent(username)}&token=${encodeURIComponent(token)}`,
      import: false
    };
    const arr = grouped.get(String(ch.category)) ?? [];
    arr.push(item);
    grouped.set(String(ch.category), arr);
  }

  const groups = [...grouped.entries()].map(([category, items]) => ({
    name: category.toUpperCase(),
    image: "https://via.placeholder.com/320x180.png?text=" + encodeURIComponent(category.toUpperCase()),
    imageScale: "center",
    groups: items
  }));

  const payload = {
    name: env.PLAYLIST_BRAND_NAME,
    author: `${env.PLAYLIST_BRAND_NAME} VIP`,
    url: `${env.API_BASE_URL}/api/playlist?username=${encodeURIComponent(username)}`,
    image: "https://via.placeholder.com/512x512.png?text=VIP",
    imageScale: "center",
    groups
  };

  return json(payload);
}
