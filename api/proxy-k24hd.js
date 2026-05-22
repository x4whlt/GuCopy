// api/proxy.js
export default async function handler(req, res) {
  // 1. ตั้งค่า CORS Headers ไว้บนสุด เพื่อให้ครอบคลุมทั้งกรณี Success และ Error
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 2. จัดการ Preflight Request (OPTIONS) ที่เบราว์เซอร์ส่งมาเช็กก่อน Fetch จริง
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const target = req.query.url;
  if (!target) {
    res.status(400).json({ error: "Missing url parameter" });
    return;
  }

  try {
    const response = await fetch(target, {
      headers: {
        // อัปเดต User-Agent ให้ดูเหมือนเบราว์เซอร์ยุคใหม่มากขึ้น
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        // 3. แก้ไข Referer ให้ตรงกับโดเมนที่ Frontend กำลังดึง (kubhd24.net ไม่ใช่ kub24hd.com)
        "Referer": "https://kubhd24.net/"
      }
    });

    // 4. ดึง Content-Type จากเว็บต้นทางมาใช้เลย (เพราะ Frontend ดึงทั้ง HTML และ JSON)
    const contentType = response.headers.get("content-type") || "text/html; charset=utf-8";
    res.setHeader("Content-Type", contentType);

    if (!response.ok) {
      res.status(response.status).json({ error: `Failed to fetch target: ${response.statusText}` });
      return;
    }

    const text = await response.text();
    res.status(200).send(text);
    
  } catch (err) {
    // ฝั่ง Frontend จะได้รับค่า 500 พร้อมอ่านข้อความ Error นี้ได้โดยไม่ติด CORS
    res.status(500).json({ error: err.message });
  }
}
