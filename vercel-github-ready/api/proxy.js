// api/proxy.js
// Vercel Serverless Function
// ใช้เป็น proxy สำหรับ frontend ที่ deploy บน GitHub Pages / Vercel
// หมายเหตุ: จำกัดโดเมนด้วย ALLOWED_HOSTS เพื่อลดความเสี่ยงไม่ให้กลายเป็น open proxy

const ALLOWED_HOSTS = [
  "avmisohd.to",
  "www.avmisohd.to"
];

// ปรับได้ตามเว็บต้นทางที่คุณได้รับอนุญาต
const DEFAULT_REFERER = "https://avmisohd.to/";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Range");
}

function isAllowedUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === "https:" && ALLOWED_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const target = req.query.url;

  if (!target || typeof target !== "string") {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  if (!isAllowedUrl(target)) {
    return res.status(403).json({
      error: "Target host is not allowed",
      allowedHosts: ALLOWED_HOSTS
    });
  }

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Referer": DEFAULT_REFERER,
        "Accept": req.headers.accept || "*/*",
        ...(req.headers.range ? { "Range": req.headers.range } : {})
      },
      redirect: "follow"
    });

    const contentType = upstream.headers.get("content-type") || "text/html; charset=utf-8";
    const cacheControl = upstream.headers.get("cache-control") || "s-maxage=60, stale-while-revalidate=300";

    res.status(upstream.status);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", cacheControl);

    const acceptRanges = upstream.headers.get("accept-ranges");
    const contentRange = upstream.headers.get("content-range");
    const contentLength = upstream.headers.get("content-length");

    if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);
    if (contentRange) res.setHeader("Content-Range", contentRange);
    if (contentLength) res.setHeader("Content-Length", contentLength);

    if (!upstream.ok && upstream.status !== 206) {
      const text = await upstream.text().catch(() => "");
      return res.send(text || `Upstream error: ${upstream.status}`);
    }

    if (req.method === "HEAD") {
      return res.end();
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({
      error: "Proxy fetch failed",
      message: err.message
    });
  }
}
