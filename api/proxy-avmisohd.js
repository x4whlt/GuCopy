// api/proxy.js
export default async function handler(req, res) {
  const target = req.query.url;
  
  if (!target) {
    res.status(400).json({ error: "Missing url parameter" });
    return;
  }

  // อนุญาตให้ frontend เรียกใช้งานข้ามโดเมนได้ (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const response = await fetch(target, {
      method: "GET",
      headers: {
        // เพิ่ม Headers ให้เหมือนเบราว์เซอร์ของคนจริงๆ เพื่อลดโอกาสโดน Cloudflare บล็อค
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://avmisohd.to/",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      }
    });

    const text = await response.text();
    const contentType = response.headers.get("content-type") || "text/html; charset=utf-8";

    // ส่งคืน Content-Type ตามจริงที่ได้จากเว็บเป้าหมาย
    res.setHeader("Content-Type", contentType);

    // แม้จะไม่ใช่สถานะ 200 (เช่น 404 Not Found) ก็ส่งเนื้อหากลับไปให้ Frontend จัดการต่อ
    res.status(response.status).send(text);
    
  } catch (err) {
    res.status(500).json({ error: "Proxy server error: " + err.message });
  }
}
