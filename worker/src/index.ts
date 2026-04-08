import type { Env } from "./lib/types";
import { badRequest, json, notFound } from "./lib/response";
import { handleAdminBan, handleAdminExtend, handleAdminUnban, handleAdminUsers } from "./routes/admin";
import { handleAdminLogin, handleHeartbeat } from "./routes/auth";
import { handlePlaylist } from "./routes/playlist";
import { handleStream } from "./routes/stream";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    try {
      if (url.pathname === "/") {
        return json({
          ok: true,
          service: "wiseplay-vip-worker",
          endpoints: [
            "/api/admin/login",
            "/api/admin/users",
            "/api/playlist",
            "/api/stream/:slug",
            "/api/heartbeat"
          ]
        }, { headers: corsHeaders() });
      }

      if (url.pathname === "/api/admin/login" && request.method === "POST") {
        return withCors(await handleAdminLogin(request, env));
      }

      if (url.pathname === "/api/admin/users") {
        return withCors(await handleAdminUsers(request, env));
      }

      const banMatch = url.pathname.match(/^\/api\/admin\/users\/(\d+)\/ban$/);
      if (banMatch && request.method === "POST") {
        return withCors(await handleAdminBan(request, env, Number(banMatch[1])));
      }

      const unbanMatch = url.pathname.match(/^\/api\/admin\/users\/(\d+)\/unban$/);
      if (unbanMatch && request.method === "POST") {
        return withCors(await handleAdminUnban(request, env, Number(unbanMatch[1])));
      }

      const extendMatch = url.pathname.match(/^\/api\/admin\/users\/(\d+)\/extend$/);
      if (extendMatch && request.method === "POST") {
        return withCors(await handleAdminExtend(request, env, Number(extendMatch[1])));
      }

      if (url.pathname === "/api/playlist" && request.method === "GET") {
        return withCors(await handlePlaylist(request, env));
      }

      const streamMatch = url.pathname.match(/^\/api\/stream\/([a-zA-Z0-9-_]+)$/);
      if (streamMatch && request.method === "GET") {
        return withCors(await handleStream(request, env, streamMatch[1]));
      }

      if (url.pathname === "/api/heartbeat" && request.method === "POST") {
        return withCors(await handleHeartbeat(request, env));
      }

      return withCors(notFound());
    } catch (error: any) {
      return withCors(json({
        ok: false,
        error: error?.message ?? "Internal error"
      }, { status: 500 }));
    }
  }
};

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization"
  };
}

function withCors(response: Response) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(corsHeaders())) headers.set(k, v);
  return new Response(response.body, { status: response.status, headers });
}
