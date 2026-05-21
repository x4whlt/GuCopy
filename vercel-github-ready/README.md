# GitHub Pages + Vercel Proxy

โปรเจกต์นี้แยกการทำงานเป็น 2 ส่วน:

- `index.html`, `stream.html`, `playerjs.js`, `icon.svg` ใช้กับ GitHub Pages หรือ Vercel Static Hosting
- `api/proxy.js` ใช้รันบน Vercel Serverless Function

## โครงสร้าง

```txt
.
├─ api/
│  └─ proxy.js
├─ index.html
├─ stream.html
├─ playerjs.js
├─ icon.svg
├─ package.json
└─ vercel.json
```

## วิธี deploy proxy บน Vercel

1. สร้าง repository ใหม่ใน GitHub
2. อัปโหลดไฟล์ทั้งหมดใน ZIP นี้ขึ้น GitHub
3. เข้า Vercel แล้วกด Add New Project
4. เลือก repository นี้
5. Framework Preset เลือก Other
6. กด Deploy

หลัง deploy จะได้ URL ประมาณนี้:

```txt
https://your-project.vercel.app/api/proxy?url=https%3A%2F%2Favmisohd.to%2F
```

## วิธีแก้โดเมนที่อนุญาต

เปิดไฟล์:

```txt
api/proxy.js
```

แล้วแก้:

```js
const ALLOWED_HOSTS = [
  "avmisohd.to",
  "www.avmisohd.to"
];
```

ถ้าต้องการเพิ่มโดเมนที่คุณมีสิทธิ์ใช้งาน ให้เพิ่ม hostname เข้าไป เช่น:

```js
const ALLOWED_HOSTS = [
  "avmisohd.to",
  "www.avmisohd.to",
  "example.com"
];
```

## ทดสอบ local

ติดตั้ง Vercel CLI:

```bash
npm i -g vercel
```

รัน:

```bash
npm install
npm run dev
```

ทดสอบ:

```txt
http://localhost:3000/api/proxy?url=https%3A%2F%2Favmisohd.to%2F
```

## หมายเหตุ

ไฟล์ proxy นี้ตั้งใจทำให้ปลอดภัยกว่า proxy ทั่วไป โดยจำกัด `ALLOWED_HOSTS` ไม่ให้กลายเป็น open proxy
