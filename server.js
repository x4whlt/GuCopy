const express = require("express");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// โหลด user
let users = JSON.parse(fs.readFileSync("users.json"));

// บันทึก user
function save() {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

// =========================
// 🔐 LOGIN (สำหรับเว็บ)
// =========================
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) return res.send({ status: "fail" });
    if (user.banned) return res.send({ status: "banned" });
    if (new Date(user.expire) < new Date()) return res.send({ status: "expired" });

    const token = crypto.randomBytes(16).toString("hex");

    user.token = token;
    user.ip = req.ip;

    save();

    res.send({ status: "ok", user });
});

// =========================
// 📺 PLAYLIST (Wiseplay VIP)
// =========================
app.get("/playlist/:username.m3u", (req, res) => {
    const user = users.find(u => u.username === req.params.username);

    if (!user) return res.send("no user");
    if (user.banned) return res.send("banned");
    if (new Date(user.expire) < new Date()) return res.send("expired");

    // 🔒 ล็อค IP ครั้งแรก
    if (!user.ip) {
        user.ip = req.ip;
    }

    if (user.ip !== req.ip) {
        return res.send("IP BLOCK");
    }

    let playlist = "#EXTM3U\n\n";

    const channels = [
const channels = [
    {
        name: "3HD",
        url: "https://ch3-33-web.cdn.byteark.com/live/playlist_720p/index.m3u8"
    },
    {
        name: "CH5",
        url: "https://639bc5877c5fe.streamlock.net/tv5hdlive/tv5hdlive/playlist.m3u8"
    },
    {
        name: "7HD",
        url: "https://live-cdn.ch7.com/out/v1/eafeb02c55b64a15b278b1e66c7fc776/playlist_9.m3u8"
    },
    {
        name: "Mono29",
        url: "https://monomax-uiripn.cdn.byteark.com/plain/th/1080p/index.m3u8"
    },
    {
        name: "Thai PBS",
        url: "http://thaipbs-live.cdn.byteark.com/live/playlist_1080p/index.m3u8"
    },
    {
        name: "Workpoint",
        url: "https://global-media.sooplive.com/live/workpoint/master.m3u8"
    },
    {
        name: "GMM25",
        url: "https://bcovlive-a.akamaihd.net/57d4bf695e80436d9335f4f50adbe438/ap-southeast-1/6415628290001/7e85dc4a59904e45b4fdffebd62e1d82/playlist_ssaiM.m3u8"
    },
    {
        name: "ONE31",
        url: "https://bcovlive-a.akamaihd.net/b6603a14ea59440a95e9235e14bc9332/ap-southeast-1/6415628290001/9c3d7fc7d10840a69e48b5939ae886e0/playlist_ssaiM.m3u8"
    },
    {
        name: "TopNews",
        url: "https://live.topnews.co.th/hls/topnews_a_FHD1080.m3u8"
    },
    {
        name: "TNN16",
        url: "https://aisplay.ais.co.th/portal/live?vid=59671d1cd817de1df19711a6"
    }
];

    channels.forEach(ch => {
        const token = crypto.randomBytes(16).toString("hex");

        user.token = token;
        user.tokenExpire = Date.now() + 5 * 60 * 1000; // 5 นาที

        playlist += `#EXTINF:-1, ${ch.name}\n`;
        playlist += `https://gucopy.onrender.com/stream?token=${token}\n\n`;
    });

    save();

    res.setHeader("Content-Type", "application/x-mpegURL");
    res.send(playlist);
});

// =========================
// 🎬 STREAM (กันแชร์)
// =========================
app.get("/stream", (req, res) => {
    const token = req.query.token;

    const user = users.find(u => u.token === token);

    if (!user) return res.send("DENIED");

    // ⏳ token หมดอายุ
    if (Date.now() > user.tokenExpire) {
        return res.send("TOKEN EXPIRED");
    }

    // 🔒 IP
    if (user.ip !== req.ip) {
        return res.send("IP BLOCK");
    }

    if (user.banned) return res.send("BANNED");

    // 🔁 redirect ไป stream จริง
    res.redirect("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
});

// =========================
// 👤 ADMIN
// =========================

// ดู user ทั้งหมด
app.get("/users", (req, res) => {
    res.send(users);
});

// แบน
app.post("/ban", (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (user) user.banned = true;
    save();
    res.send("ok");
});

// ตั้ง VIP
app.post("/vip", (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (user) user.expire = req.body.expire;
    save();
    res.send("ok");
});

// =========================
// 🚀 START SERVER
// =========================
app.listen(3000, () => {
    console.log("🔥 Server running on port 3000");
});
