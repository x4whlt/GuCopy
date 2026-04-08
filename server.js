const express = require("express");
const fs = require("fs");
const crypto = require("crypto");

const app = express();

let users = JSON.parse(fs.readFileSync("users.json"));

function save() {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

function createToken(user) {
    const raw = user.username + Date.now() + Math.random();
    return crypto.createHash("md5").update(raw).digest("hex");
}

// PLAYLIST per user
app.get("/playlist/:username.m3u", (req, res) => {
    const user = users.find(u => u.username === req.params.username);
    if (!user) return res.send("no user");

    if (user.banned) return res.send("banned");
    if (new Date(user.expire) < new Date()) return res.send("expired");

    if (!user.ip) user.ip = req.ip;
    if (user.ip !== req.ip) return res.send("IP BLOCK");

    let playlist = "#EXTM3U\n\n";

    const channels = [
        { name: "LIVE 1", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
    ];

    channels.forEach(ch => {
        const token = createToken(user);
        user.token = token;
        user.tokenExpire = Date.now() + 5 * 60 * 1000;

        playlist += `#EXTINF:-1, ${ch.name}\n`;
        playlist += `https://YOUR-RENDER.onrender.com/stream?token=${token}\n\n`;
    });

    save();
    res.setHeader("Content-Type", "application/x-mpegURL");
    res.send(playlist);
});

// STREAM
app.get("/stream", (req, res) => {
    const token = req.query.token;
    const user = users.find(u => u.token === token);

    if (!user) return res.send("denied");

    if (Date.now() > user.tokenExpire) return res.send("TOKEN EXPIRED");

    if (user.ip !== req.ip) return res.send("IP BLOCK");

    res.redirect("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
});

app.listen(3000, () => console.log("Server running"));
