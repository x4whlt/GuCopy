// api/proxy.js
// Vercel Serverless Function
// ใช้ proxy ไฟล์ m3u8/mp4/ts และ rewrite m3u8 ให้ segment วิ่งผ่าน proxy ด้วย

const ALLOWED_HOSTS = [
  "avmisohd.to",
  "www.avmisohd.to",
  "moviesdoofree.com",
  "www.moviesdoofree.com",
  "surrit.com",
  "www.surrit.com",
  "ezycdn.com",
  "www.ezycdn.com",
  "turboviplay.com",
  "www.turboviplay.com",
  "vdohls.com",
  "www.vdohls.com",
  "hdplayfull.xyz",
  "www.hdplayfull.xyz"
];

const DEFAULT_REFERER = "https://avmisohd.to/";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Range, Origin, Accept");
  res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
}

function getOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

function parseTarget(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url;
  } catch {
    return null;
  }
}

function isAllowedTarget(urlObj) {
  if (!urlObj) return false;
  if (urlObj.protocol !== "https:" && urlObj.protocol !== "http:") return false;

  return ALLOWED_HOSTS.some(host => {
    return urlObj.hostname === host || urlObj.hostname.endsWith(`.${host}`);
  });
}

function isPlaylist(targetUrl, contentType) {
  const pathname = targetUrl.pathname.toLowerCase();

  return (
    pathname.endsWith(".m3u8") ||
    pathname.endsWith(".m3u") ||
    contentType.includes("application/vnd.apple.mpegurl") ||
    contentType.includes("application/x-mpegurl") ||
    contentType.includes("audio/mpegurl") ||
    contentType.includes("mpegurl")
  );
}

function rewritePlaylist(text, targetUrl, req) {
  const origin = getOrigin(req);

  return text
    .split(/\r?\n/)
    .map(line => {
      const trimmed = line.trim();

      if (!trimmed) return line;

      // URI อยู่ใน tag เช่น #EXT-X-KEY:URI="key.key"
      if (trimmed.startsWith("#")) {
        return line.replace(/URI="([^"]+)"/g, (match, uri) => {
          try {
            const absolute = new URL(uri, targetUrl.href).href;
            const proxied = `${origin}/api/proxy?url=${encodeURIComponent(absolute)}`;
            return `URI="${proxied}"`;
          } catch {
            return match;
          }
        });
      }

      // segment หรือ nested playlist
      try {
        const absolute = new URL(trimmed, targetUrl.href).href;
        return `${origin}/api/proxy?url=${encodeURIComponent(absolute)}`;
      } catch {
        return line;
      }
    })
    .join("\n");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({
      error: "Method Not Allowed"
    });
  }

  const rawTarget = req.query.url;

  if (!rawTarget || typeof rawTarget !== "string") {
    return res.status(400).json({
      error: "Missing url parameter",
      example: "/api/proxy?url=https%3A%2F%2Fexample.com%2Fvideo.m3u8"
    });
  }

  const targetUrl = parseTarget(rawTarget);

  if (!isAllowedTarget(targetUrl)) {
    return res.status(403).json({
      error: "Target host is not allowed",
      target: targetUrl ? targetUrl.hostname : rawTarget,
      allowedHosts: ALLOWED_HOSTS
    });
  }

  try {
    const upstreamHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "Referer": DEFAULT_REFERER,
      "Origin": DEFAULT_REFERER.replace(/\/$/, ""),
      "Accept": req.headers.accept || "*/*"
    };

    if (req.headers.range) {
      upstreamHeaders["Range"] = req.headers.range;
    }

    const upstream = await fetch(targetUrl.href, {
      method: req.method,
      headers: upstreamHeaders,
      redirect: "follow"
    });

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");
    const contentRange = upstream.headers.get("content-range");
    const acceptRanges = upstream.headers.get("accept-ranges");
    const cacheControl = upstream.headers.get("cache-control") || "public, s-maxage=60, stale-while-revalidate=300";

    res.status(upstream.status);
    res.setHeader("Cache-Control", cacheControl);
    res.setHeader("Content-Type", contentType);

    if (contentRange) res.setHeader("Content-Range", contentRange);
    if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);

    if (req.method === "HEAD") {
      if (contentLength) res.setHeader("Content-Length", contentLength);
      return res.end();
    }

    if (!upstream.ok && upstream.status !== 206) {
      const errorText = await upstream.text().catch(() => "");
      return res.send(errorText || `Upstream error: ${upstream.status}`);
    }

    // ถ้าเป็น m3u8 ให้ rewrite segment ด้านใน
    if (isPlaylist(targetUrl, contentType)) {
      const playlistText = await upstream.text();
      const rewritten = rewritePlaylist(playlistText, targetUrl, req);

      res.setHeader("Content-Type", "application/vnd.apple.mpegurl; charset=utf-8");
      return res.send(rewritten);
    }

    // ไฟล์ video/segment ส่ง binary
    const arrayBuffer = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Length", buffer.length);
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({
      error: "Proxy fetch failed",
      message: err.message
    });
  }
}
