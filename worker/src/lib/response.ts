export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data, null, 2), { ...init, headers });
}

export function text(data: string, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "text/plain; charset=utf-8");
  return new Response(data, { ...init, headers });
}

export function unauthorized(message = "Unauthorized") {
  return json({ ok: false, error: message }, { status: 401 });
}

export function badRequest(message = "Bad request") {
  return json({ ok: false, error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return json({ ok: false, error: message }, { status: 404 });
}
