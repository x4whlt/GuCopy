const express = require("express");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(express.static("public"));

let users = JSON.parse(fs.readFileSync("users.json"));

let online = 0;

// บันทึก
function save() {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

// 🔐 LOGIN
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

// 👥 online
app.get("/online", (req, res) => {
    res.send({ online });
});

// 📊 middleware check token
function auth(req, res, next) {
    const token = req.query.token;
    const user = users.find(u => u.token === token);

    if (!user) return res.send("unauthorized");

    // กันแชร์ (เช็ค IP)
    if (user.ip !== req.ip) {
        return res.send("IP BLOCK");
    }

    if (user.banned) return res.send("banned");
    if (new Date(user.expire) < new Date()) return res.send("expired");

    next();
}

// 📺 PLAYLIST (ต้องผ่าน auth)
app.get("/playlist", auth, (req, res) => {
    res.sendFile(__dirname + "/playlist.json");
});

// 🚫 BAN
app.post("/ban", (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (user) user.banned = true;
    save();
    res.send("ok");
});

// 💎 VIP
app.post("/vip", (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (user) user.expire = req.body.expire;
    save();
    res.send("ok");
});

// 👤 USERS
app.get("/users", (req, res) => {
    res.send(users);
});

// 👥 online tracking
app.use((req,res,next)=>{
    online++;
    setTimeout(()=>online--, 10000);
    next();
});

app.listen(3000, () => console.log("🔥 running"));
