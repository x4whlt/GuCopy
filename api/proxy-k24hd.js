<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Series Extractor Pro & M3U Playlist Generator</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- HLS.js for video streaming preview -->
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'Sarabun', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            gold: '#FBBF24',
                            darkBg: '#0B0F19',
                            cardBg: '#1E293B',
                            accent: '#3B82F6',
                            success: '#10B981',
                            danger: '#EF4444'
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #0B0F19;
            background-image: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1) 0%, transparent 60%);
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0B0F19;
        }
        ::-webkit-scrollbar-thumb {
            background: #3B82F6;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #60A5FA;
        }
        /* Glowing effects */
        .glow-blue {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.35);
        }
        .glow-gold {
            box-shadow: 0 0 15px rgba(251, 191, 36, 0.35);
        }
        /* Custom classes */
        .glassmorphism {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
    </style>
</head>
<body class="text-slate-100 min-h-screen pb-16 px-4 sm:px-6">

    <div class="max-w-7xl mx-auto pt-8">
        <!-- Header Section -->
        <header class="text-center mb-8">
            <div class="inline-flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700/50 mb-4">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-xs font-semibold text-slate-300 uppercase tracking-widest">Version 3.2 Enterprise (Smart Update)</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-blue-500 mb-2">
                SERIES HARVESTER PRO
            </h1>
            <p class="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-light">
                สุดยอดเครื่องมือดึงข้อมูลซีรีส์และสร้างเพลย์ลิสต์ <span class="text-amber-400 font-medium">M3U IPTV</span> ครบวงจร 
                พร้อมระบบจัดการความเร็ว (Concurrency) และอัปเดตข้อมูลอัจฉริยะ
            </p>
        </header>

        <!-- Controls & Dashboard Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Left Side Controls Panel -->
            <div class="lg:col-span-2 glassmorphism rounded-2xl p-6 glow-blue">
                <div class="flex items-center gap-3 mb-5 border-b border-slate-700/50 pb-3">
                    <i class="fa-solid fa-sliders text-blue-500 text-xl"></i>
                    <h2 class="text-lg font-bold">แผงควบคุมการสแกนข้อมูล</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <!-- Category Select -->
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 uppercase mb-2">เลือกหมวดหมู่ซีรีส์</label>
                        <select id="categorySelect" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors">
                            <option value="korean-series">ซีรีย์เกาหลี (Korean Series)</option>
                            <option value="chinese-series">ซีรีย์จีน (Chinese Series)</option>
                            <option value="thai-series">ซีรีย์ไทย (Thai Series)</option>
                            <option value="inter-series">ซีรีย์ฝรั่ง (Western Series)</option>
                            <option value="anime">อนิเมะ (Anime)</option>
                            <option value="netflix">ซีรีย์ Netflix</option>
                        </select>
                    </div>

                    <!-- Custom Proxy input -->
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 uppercase mb-2">ทางผ่านพร็อกซี (Proxy Endpoint)</label>
                        <input type="text" id="proxyInput" value="/api/proxy?url=" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" placeholder="/api/proxy?url=">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <!-- Page range start -->
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 uppercase mb-2">เริ่มจากหน้า</label>
                        <div class="flex items-center">
                            <button type="button" onclick="adjustPage('startPage', -1)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 w-10 h-9 rounded-l-lg border-y border-l border-slate-700 flex items-center justify-center transition-colors"><i class="fa-solid fa-minus text-xs"></i></button>
                            <input type="number" id="startPage" value="1" min="1" class="w-full bg-slate-900 border-y border-slate-700 text-center h-9 text-slate-100 font-bold focus:outline-none text-sm">
                            <button type="button" onclick="adjustPage('startPage', 1)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 w-10 h-9 rounded-r-lg border-y border-r border-slate-700 flex items-center justify-center transition-colors"><i class="fa-solid fa-plus text-xs"></i></button>
                        </div>
                    </div>

                    <!-- Page range end -->
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 uppercase mb-2">ถึงหน้า</label>
                        <div class="flex items-center">
                            <button type="button" onclick="adjustPage('endPage', -1)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 w-10 h-9 rounded-l-lg border-y border-l border-slate-700 flex items-center justify-center transition-colors"><i class="fa-solid fa-minus text-xs"></i></button>
                            <input type="number" id="endPage" value="1" min="1" class="w-full bg-slate-900 border-y border-slate-700 text-center h-9 text-slate-100 font-bold focus:outline-none text-sm">
                            <button type="button" onclick="adjustPage('endPage', 1)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 w-10 h-9 rounded-r-lg border-y border-r border-slate-700 flex items-center justify-center transition-colors"><i class="fa-solid fa-plus text-xs"></i></button>
                        </div>
                    </div>

                    <!-- Action buttons wrapper -->
                    <div class="flex flex-col justify-end">
                        <div class="grid grid-cols-2 gap-2">
                            <button id="btnStart" onclick="startHarvesting()" class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-9 rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all">
                                <i class="fa-solid fa-play text-xs"></i> สแกน
                            </button>
                            <button id="btnStop" onclick="stopHarvesting()" disabled class="bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold h-9 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-not-allowed">
                                <i class="fa-solid fa-circle-stop text-xs"></i> หยุด
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Live Status & Info Bar -->
                <div class="bg-slate-900/60 rounded-xl p-4 border border-slate-700/60">
                    <div class="flex items-center gap-3 mb-1">
                        <div class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" id="statusDot"></div>
                        <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">สถานะการทำงาน:</span>
                        <span id="loader" class="text-sm font-semibold text-slate-200">พร้อมดึงข้อมูลเสรีส์</span>
                    </div>
                    <div id="stats" class="text-xs text-slate-500 font-medium">ไม่มีกระบวนการทำงานในขณะนี้</div>
                </div>
            </div>

            <!-- Right Side Live Logs Terminal -->
            <div class="glassmorphism rounded-2xl p-6 glow-gold flex flex-col h-full min-h-[300px]">
                <div class="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-3">
                    <div class="flex items-center gap-3">
                        <i class="fa-solid fa-terminal text-amber-500 text-xl"></i>
                        <h2 class="text-lg font-bold">ประวัติกระบวนการทำงาน</h2>
                    </div>
                    <button onclick="clearConsole()" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-2.5 py-1 rounded border border-slate-700 transition-colors">ล้างประวัติ</button>
                </div>
                <!-- Console Box -->
                <div id="terminal" class="flex-grow bg-black/90 rounded-xl p-3 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[190px] lg:max-h-none lg:flex-1 text-slate-300">
                    <div class="text-blue-400">[SYSTEM]: ระบบแสตนบาย รอกดปุ่มเริ่มดึงข้อมูล...</div>
                </div>
            </div>
        </div>

        <!-- Global Actions / Playlists Download Section -->
        <div id="globalActions" class="hidden mb-6 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-slate-900/40 rounded-2xl p-6 border border-blue-500/30">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="p-3 bg-blue-500/20 rounded-xl border border-blue-500/40">
                        <i class="fa-solid fa-file-invoice text-2xl text-blue-400 animate-bounce"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-white">คลังข้อมูลพร้อมส่งออก M3U</h3>
                        <p class="text-xs text-slate-300">รวบรวมเพลย์ลิสต์ IPTV ครบจบทุกเรื่องในปุ่มเดียว! สามารถนำไปเปิดบนแอปเล่นวิดีโอทั่วไปได้ทันที</p>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <button onclick="downloadAllM3U()" class="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all">
                        <i class="fa-solid fa-circle-down text-lg"></i> ดาวน์โหลด M3U รวมทุกเรื่อง
                    </button>
                    <button onclick="copyAllM3UToClipboard()" class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all">
                        <i class="fa-solid fa-copy"></i> คัดลอก
                    </button>
                    <button onclick="clearLocalStorage()" class="bg-rose-900/50 hover:bg-rose-800 border border-rose-700/50 text-rose-300 font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all" title="ล้างแคชข้อมูลที่เคยดึง">
                        <i class="fa-solid fa-trash-can"></i> ล้างแคช
                    </button>
                </div>
            </div>
        </div>

        <!-- Filter and Search -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h2 class="text-2xl font-black text-slate-100 flex items-center gap-3">
                <i class="fa-solid fa-compact-disc text-blue-500"></i> ผลลัพธ์รายการซีรีส์ 
                <span id="countBadge" class="text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full">0 เรื่อง</span>
            </h2>
            <div class="relative w-full sm:w-80">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input type="text" id="searchInput" oninput="filterResults()" placeholder="ค้นหาซีรีส์ที่ดึงมาแล้ว..." class="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors">
            </div>
        </div>

        <!-- Grid Results -->
        <div id="output" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"></div>
        
        <!-- Empty Placeholder -->
        <div id="emptyState" class="text-center py-20 bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-800">
            <i class="fa-solid fa-layer-group text-slate-700 text-6xl mb-4"></i>
            <h3 class="text-lg font-semibold text-slate-400">ยังไม่มีข้อมูลที่จะแสดงผล</h3>
            <p class="text-sm text-slate-600 max-w-sm mx-auto mt-1">ตั้งค่าช่วงหน้าเว็บและคลิกปุ่มสแกนข้อมูลด้านบนเพื่อรับรายการคอนเทนต์</p>
        </div>
    </div>

    <!-- Built-in Video Stream Player Modal -->
    <div id="playerModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 hidden transition-opacity duration-300">
        <div class="bg-slate-900 rounded-2xl border border-slate-800 max-w-4xl w-full overflow-hidden shadow-2xl relative">
            <!-- Modal Header -->
            <div class="flex justify-between items-center p-4 border-b border-slate-800">
                <div>
                    <h3 id="modalTitle" class="font-bold text-white text-base md:text-lg">ทดลองเล่นสตรีมวิดีโอ</h3>
                    <p id="modalSubtitle" class="text-xs text-slate-400">กำลังสตรีมลิงก์วิดีโอ (.m3u8)</p>
                </div>
                <button onclick="closePlayer()" class="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <!-- Video Container -->
            <div class="aspect-video bg-black relative flex items-center justify-center">
                <video id="hlsPlayer" controls class="w-full h-full object-contain hidden"></video>
                <div id="videoPlaceholder" class="text-center p-6">
                    <i class="fa-solid fa-compact-disc text-blue-500 text-5xl animate-spin mb-3"></i>
                    <p class="text-slate-400 text-sm">กำลังเชื่อมต่อสัญญาณสตรีมสด...</p>
                </div>
            </div>
            <!-- Modal Footer -->
            <div class="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div class="w-full overflow-hidden">
                    <p class="text-[11px] font-mono text-slate-500 uppercase">Stream URL Path</p>
                    <p id="modalStreamUrl" class="text-xs font-mono text-emerald-400 break-all select-all pr-2 truncate"></p>
                </div>
                <button onclick="copyStreamUrl()" class="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1.5">
                    <i class="fa-solid fa-copy"></i> คัดลอกลิงก์สตรีม
                </button>
            </div>
        </div>
    </div>

    <!-- Toast Notification Custom Container -->
    <div id="toastContainer" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2"></div>

    <script>
        let BASE_CAT = 'https://kubhd24.net/category/';
        let activeHarvest = false;
        let isStopped = false;
        let gatheredSeries = []; // For compilation of all series
        
        // Native Web Audio API Synthesizer
        let audioCtx = null;
        function getAudioContext() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            return audioCtx;
        }

        function playTone(freq, duration, type = 'sine', delay = 0) {
            try {
                const ctx = getAudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = type;
                osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
                
                gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + delay + duration);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + duration);
            } catch (e) {
                console.warn("Audio playback failed: ", e);
            }
        }

        function triggerSound(type) {
            try {
                if (type === 'success') {
                    playTone(523.25, 0.15, 'sine', 0); // C5
                    playTone(659.25, 0.20, 'sine', 0.1); // E5
                } else if (type === 'done') {
                    playTone(783.99, 0.15, 'sine', 0); // G5
                    playTone(987.77, 0.15, 'sine', 0.1); // B5
                    playTone(1046.50, 0.30, 'sine', 0.2); // C6
                } else if (type === 'error') {
                    playTone(174.61, 0.35, 'triangle', 0); // Low warning
                } else if (type === 'tick') {
                    playTone(261.63, 0.06, 'triangle', 0); // Super short tick
                }
            } catch (e) {
                console.log("Sound trigger error: ", e);
            }
        }

        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm transition-all duration-300 transform translate-y-2 opacity-0 glassmorphism`;
            
            let icon = '<i class="fa-solid fa-circle-info text-blue-400"></i>';
            if (type === 'success') {
                icon = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
                toast.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            } else if (type === 'error') {
                icon = '<i class="fa-solid fa-circle-exclamation text-rose-400"></i>';
                toast.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            } else {
                toast.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }

            toast.innerHTML = `${icon} <span class="text-slate-200">${message}</span>`;
            const container = document.getElementById('toastContainer');
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.remove('opacity-0', 'translate-y-2');
            }, 10);

            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }

        function appendLog(text, colorClass = 'text-slate-300') {
            const terminal = document.getElementById('terminal');
            const time = new Date().toLocaleTimeString();
            const logItem = document.createElement('div');
            logItem.className = colorClass;
            logItem.innerHTML = `<span class="text-slate-500">[${time}]</span> ${text}`;
            terminal.appendChild(logItem);
            terminal.scrollTop = terminal.scrollHeight;
        }

        function clearConsole() {
            document.getElementById('terminal').innerHTML = `<div class="text-slate-500">[SYSTEM] เคลียร์บันทึกการทำงานเรียบร้อย</div>`;
        }

        function adjustPage(inputId, delta) {
            const input = document.getElementById(inputId);
            let val = parseInt(input.value) + delta;
            if (val < 1) val = 1;
            input.value = val;
        }

        // ==========================================
        // ENTERPRISE FEATURES & BUG FIXES SECTION
        // ==========================================

        // ฟังก์ชันป้องกัน Double Encoding และทำ URL ให้ปลอดภัยสำหรับ Node.js Proxy
        function getSafeUrl(url) {
            try {
                return encodeURI(decodeURI(url));
            } catch(e) {
                return encodeURI(url);
            }
        }

        // 1. ระบบหน่วงเวลา (Rate Limiting / Sleep Delay)
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // 2. ระบบดึงข้อมูลซ้ำอัตโนมัติ (Auto-Retry Mechanism)
        async function requestWithRetry(url, isJson = false, retries = 3) {
            const proxy = document.getElementById('proxyInput').value;
            for (let i = 0; i < retries; i++) {
                if (isStopped) return null;
                try {
                    // เข้ารหัส URL ให้ปลอดภัยสำหรับ Server
                    const targetUrl = getSafeUrl(url);
                    const res = await fetch(proxy + encodeURIComponent(targetUrl));
                    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
                    return isJson ? await res.json() : await res.text();
                } catch (e) {
                    if (i === retries - 1) {
                        appendLog(`❌ ล้มเหลวหลังพยายาม ${retries} ครั้ง: ${e.message}`, 'text-rose-500');
                        return null;
                    }
                    appendLog(`⚠️ เชื่อมต่อขัดข้อง (${e.message}) กำลังลองใหม่รอบ ${i+2}/${retries} ในอีก 2 วิ...`, 'text-amber-500');
                    await sleep(2000);
                }
            }
            return null;
        }

        // 3. ระบบเซฟข้อมูลชั่วคราว (LocalStorage Persistence)
        function saveToStorage() {
            localStorage.setItem('harvesterData', JSON.stringify(gatheredSeries));
        }

        function clearLocalStorage() {
            if(confirm('คุณต้องการลบข้อมูลซีรีส์ที่ดึงมาแล้วทั้งหมด ใช่หรือไม่?')) {
                localStorage.removeItem('harvesterData');
                gatheredSeries = [];
                document.getElementById('output').innerHTML = '';
                updateGlobalActions();
                showToast('ล้างแคชข้อมูลสำเร็จ!', 'success');
                appendLog('[SYSTEM] ล้างข้อมูลใน LocalStorage เรียบร้อยแล้ว', 'text-amber-400');
            }
        }

        // กู้คืนข้อมูลอัตโนมัติเมื่อโหลดหน้าเว็บ
        document.addEventListener('DOMContentLoaded', () => {
            const saved = localStorage.getItem('harvesterData');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed && parsed.length > 0) {
                        gatheredSeries = parsed;
                        appendLog(`[SYSTEM] 💾 กู้คืนข้อมูลเซสชันล่าสุด ${gatheredSeries.length} เรื่องจาก LocalStorage`, 'text-emerald-400');
                        gatheredSeries.forEach(data => renderCard(data, data.pageNum || 'Cache'));
                        updateGlobalActions();
                        showToast('โหลดข้อมูลที่เคยดึงไว้สำเร็จ', 'info');
                    }
                } catch (e) {
                    console.warn('Failed to parse localStorage data');
                }
            }
        });

        // 5. การดึงข้อมูลแบบขนานควบคุมได้ (Controlled Concurrency)
        async function processEpisodesConcurrently(buttons, limit) {
            let episodes = [];
            for (let i = 0; i < buttons.length; i += limit) {
                if (isStopped) break;
                const chunk = Array.from(buttons).slice(i, i + limit);
                appendLog(`⏳ ดึงลิงก์แบบขนาน (Chunk) ตอนที่ ${i+1} ถึง ${Math.min(i+limit, buttons.length)}...`, 'text-indigo-400');
                
                const promises = chunk.map(async (btn) => {
                    const url = await getStream(btn.id);
                    if (url) {
                        triggerSound('tick');
                        return { title: btn.textContent.trim(), url };
                    }
                    return null;
                });
                
                const results = await Promise.all(promises);
                episodes.push(...results.filter(r => r !== null));
                
                // ถนอม Proxy โดยการพักเบรกระหว่าง Chunk (500ms)
                if (i + limit < buttons.length) await sleep(500); 
            }
            return episodes;
        }

        async function getStream(postId) {
            const json = await requestWithRetry(`https://kubhd24.net/wp-admin/admin-ajax.php?action=mix_get_player&post_id=${postId}`, true);
            if (!json?.success) return null;
            const match = json.player.match(/data-src="([^"]+)"/);
            if (!match) return null;
            return `https://media.vdohls.com/${match[1].split('/').pop()}/playlist.m3u8`;
        }

        async function parseSeries(id, pageNum, categoryText) {
            const html = await requestWithRetry(`https://kubhd24.net/series/${id}/`);
            if (!html) return null;
            const doc = new DOMParser().parseFromString(html, "text/html");
            const title = doc.querySelector("h1")?.textContent.trim() || id;
            
            let poster = doc.querySelector("img.wp-post-image")?.getAttribute("data-src") || 
                         doc.querySelector("img.wp-post-image")?.src || 
                         'https://placehold.co/300x450/1e293b/fbbf24?text=' + encodeURIComponent(title);

            const epButtons = doc.querySelectorAll("#eplist button.ep");
            appendLog(`พบ ${epButtons.length} ตอน สำหรับเรื่อง "${title}"`, 'text-blue-300');
            
            // ใช้ฟังก์ชันดึงแบบขนาน
            let episodes = await processEpisodesConcurrently(epButtons, 5);
            
            return { id, title, poster, episodes, pageNum, categoryText };
        }

        async function startHarvesting() {
            if (activeHarvest) return;
            
            // FIX: ป้องกันเบราว์เซอร์บล็อกเสียง (AudioContext Autoplay Policy) ต้องถูกเรียกทันทีที่กดคลิก
            getAudioContext();
            
            activeHarvest = true;
            isStopped = false;

            document.getElementById('btnStart').disabled = true;
            document.getElementById('btnStart').className = "bg-slate-800 text-slate-500 font-bold h-9 rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed";
            document.getElementById('btnStop').disabled = false;
            document.getElementById('btnStop').className = "bg-rose-600 hover:bg-rose-500 text-white font-bold h-9 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md";
            
            const startPage = parseInt(document.getElementById("startPage").value);
            const endPage = parseInt(document.getElementById("endPage").value);
            const categorySelect = document.getElementById("categorySelect");
            const category = categorySelect.value;
            const categoryText = categorySelect.options[categorySelect.selectedIndex].text;
            
            const loader = document.getElementById("loader");
            const stats = document.getElementById("stats");
            const statusDot = document.getElementById("statusDot");

            statusDot.className = "w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse";
            appendLog(`[SYSTEM] เริ่มสแกนหมวด: ${categoryText} หน้า ${startPage} ถึง ${endPage}...`, 'text-blue-400');
            
            let totalSeriesFound = 0;

            for (let p = startPage; p <= endPage; p++) {
                if (isStopped) break;
                
                const pageUrl = p === 1 ? `${BASE_CAT}${category}/` : `${BASE_CAT}${category}/page/${p}/`;
                loader.textContent = `🔍 กำลังสแกนหมวดหมู่หน้า ${p}...`;
                appendLog(`เชื่อมต่อหน้าหมวดหมู่ ${p}: ${pageUrl}`, 'text-slate-400');
                
                const catHtml = await requestWithRetry(pageUrl);
                if (!catHtml) {
                    appendLog(`ข้ามหน้าที่ ${p} เนื่องจากโหลดล้มเหลว`, 'text-amber-500');
                    continue;
                }

                const regex = /href="https:\/\/kubhd24\.net\/series\/([^"\/]+)\//g;
                const ids = Array.from(new Set([...catHtml.matchAll(regex)].map(m => m[1]))).filter(i => i !== 'series');
                
                if(ids.length === 0) continue;

                totalSeriesFound += ids.length;
                stats.textContent = `กำลังประมวลผลหน้า ${p} (พบการสแกนในรอบนี้ ${totalSeriesFound} เรื่อง)`;

                for (let i = 0; i < ids.length; i++) {
                    if (isStopped) break;
                    
                    // หน่วงเวลาแบบสุ่ม (1000 - 2000 ms) ก่อนดึงแต่ละเรื่อง ลดอัตราโดนแบน
                    const delay = Math.floor(Math.random() * 1000) + 1000; 
                    appendLog(`⏱️ พักโหลด ${delay}ms...`, 'text-slate-500');
                    await sleep(delay);
                    
                    loader.textContent = `⏳ หน้าที่ ${p} | เรื่องที่ ${i+1}/${ids.length}`;
                    appendLog(`[ดึงข้อมูล]: ${ids[i]}`, 'text-indigo-300');
                    
                    const data = await parseSeries(ids[i], p, categoryText);
                    
                    if (data && data.episodes.length > 0) {
                        const existingIndex = gatheredSeries.findIndex(s => s.id === data.id);
                        
                        if (existingIndex !== -1) {
                            // FIX LOGIC: ถ้าเคยมีในระบบแล้ว ตรวจสอบว่ามีตอนใหม่หรือไม่?
                            const existingSeries = gatheredSeries[existingIndex];
                            if (data.episodes.length > existingSeries.episodes.length) {
                                gatheredSeries[existingIndex] = data; // อัปเดตข้อมูลทับ
                                saveToStorage();
                                
                                // ลบการ์ดเดิมออก และเรนเดอร์ใหม่
                                const oldCard = document.querySelector(`.card[data-id="${data.id}"]`);
                                if(oldCard) oldCard.remove();
                                renderCard(data, p);
                                
                                triggerSound('success');
                                showToast(`อัปเดตตอนใหม่ "${data.title}" สำเร็จ!`, 'success');
                                appendLog(`🔄 อัปเดตตอนใหม่ให้เรื่อง "${data.title}" (${existingSeries.episodes.length} -> ${data.episodes.length} ตอน)`, 'text-emerald-400');
                            } else {
                                appendLog(`⏭️ "${data.title}" มีข้อมูลล่าสุดอยู่แล้ว (ข้าม)`, 'text-slate-500');
                            }
                        } else {
                            // เรื่องใหม่
                            gatheredSeries.push(data);
                            renderCard(data, p);
                            saveToStorage(); 
                            
                            triggerSound('success');
                            showToast(`ดึง "${data.title}" สำเร็จ!`, 'success');
                        }
                    }
                }
            }

            activeHarvest = false;
            statusDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping";
            
            // FIX LOGIC: คำนวณจำนวนตอนที่ดึงมาได้ทั้งหมดโดยยึดฐานข้อมูลแคชทั้งหมด
            const totalEps = gatheredSeries.reduce((sum, s) => sum + s.episodes.length, 0);
            
            if (isStopped) {
                loader.textContent = `⏹ หยุดทำงานชั่วคราว`;
                appendLog(`⏹ ยกเลิกการทำงาน ข้อมูลสะสมปัจจุบัน ${gatheredSeries.length} เรื่อง รวม ${totalEps} ตอน`, 'text-rose-400');
            } else {
                loader.textContent = `✅ สำเร็จเสร็จสิ้น!`;
                appendLog(`✅ สแกนสมบูรณ์ ฐานข้อมูลปัจจุบันมี ${gatheredSeries.length} เรื่อง รวมทั้งสิ้น ${totalEps} ตอน`, 'text-emerald-400 font-bold');
                triggerSound('done');
            }

            updateGlobalActions();
            resetControlsState();
        }

        function stopHarvesting() {
            if (!activeHarvest) return;
            isStopped = true;
            appendLog(`[SYSTEM] กำลังส่งคำสั่งหยุดการทำงาน...`, 'text-rose-500');
            document.getElementById('btnStop').disabled = true;
            document.getElementById('btnStop').textContent = "กำลังหยุด...";
        }

        function resetControlsState() {
            document.getElementById('btnStart').disabled = false;
            document.getElementById('btnStart').className = "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-9 rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer";
            
            document.getElementById('btnStop').disabled = true;
            document.getElementById('btnStop').className = "bg-slate-800 text-slate-500 font-bold h-9 rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed";
            document.getElementById('btnStop').innerHTML = `<i class="fa-solid fa-circle-stop text-xs"></i> หยุด`;
        }

        function updateGlobalActions() {
            const container = document.getElementById('globalActions');
            const emptyState = document.getElementById('emptyState');
            const countBadge = document.getElementById('countBadge');
            
            countBadge.textContent = `${gatheredSeries.length} เรื่อง`;
            
            if (gatheredSeries.length > 0) {
                container.classList.remove('hidden');
                emptyState.classList.add('hidden');
            } else {
                container.classList.add('hidden');
                emptyState.classList.remove('hidden');
            }
        }

        function renderCard(data, pageNum) {
            let m3u = "#EXTM3U\n";
            const groupName = data.categoryText || "ซีรีส์ทั่วไป";
            data.episodes.forEach(ep => {
                m3u += `#EXTINF:-1 tvg-logo="${data.poster}" group-title="${groupName}" tvg-name="${data.title}", ${data.title} - ${ep.title}\n${ep.url}\n`;
            });

            const card = document.createElement("div");
            card.className = "card bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 flex flex-col group";
            card.setAttribute('data-title', data.title.toLowerCase());
            // เพื่อใช้สำหรับอ้างอิงตอนลบเมื่อมี Smart Update
            card.setAttribute('data-id', data.id); 
            
            let optionsHtml = '';
            data.episodes.forEach((ep, idx) => {
                optionsHtml += `<option value="${ep.url}">${ep.title}</option>`;
            });

            card.innerHTML = `
                <div class="relative overflow-hidden aspect-[16/10] bg-slate-900">
                    <img src="${data.poster}" alt="${data.title}" onerror="this.src='https://placehold.co/600x400/1e293b/fbbf24?text=No+Cover'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                    <span class="absolute top-3 left-3 bg-blue-500/90 text-slate-100 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md backdrop-blur-sm">หน้า ${pageNum}</span>
                    <span class="absolute bottom-3 right-3 bg-black/80 text-amber-400 text-xs font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm"><i class="fa-solid fa-layer-group text-[10px]"></i> ${data.episodes.length} ตอน</span>
                </div>
                <div class="p-4 flex-grow flex flex-col justify-between">
                    <div>
                        <h4 class="font-bold text-slate-100 text-sm line-clamp-2 min-h-[40px] group-hover:text-amber-400 transition-colors" title="${data.title}">${data.title}</h4>
                        <div class="mt-3">
                            <label class="block text-[10px] text-slate-400 mb-1 font-semibold uppercase">เลือกดูตอนย่อย:</label>
                            <div class="flex gap-1.5">
                                <select id="epSelect-${data.id}" class="flex-grow bg-slate-900 border border-slate-700 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-slate-300">
                                    ${optionsHtml}
                                </select>
                                <button onclick="previewEpisode('${data.id}')" class="bg-blue-600 hover:bg-blue-500 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-md" title="ทดสอบรับชมสตรีมสด">
                                    <i class="fa-solid fa-play text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 pt-3 border-t border-slate-700/50 flex flex-col gap-2">
                        <button onclick="toggleSingleM3U(this)" class="w-full text-xs font-semibold bg-slate-900 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors">
                            <i class="fa-solid fa-code text-[11px]"></i> ดูสคริปต์ M3U Playlist
                        </button>
                        <div class="hidden mt-2">
                            <div class="flex justify-end mb-1">
                                <button onclick="copySingleM3U(this)" class="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded text-amber-400 flex items-center gap-1"><i class="fa-solid fa-copy"></i> คัดลอก</button>
                            </div>
                            <textarea readonly class="w-full h-24 bg-black text-emerald-400 p-2 rounded text-[10px] font-mono leading-relaxed border border-slate-800 focus:outline-none select-all">${m3u}</textarea>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById("output").appendChild(card);
            updateGlobalActions();
        }

        function filterResults() {
            const term = document.getElementById('searchInput').value.toLowerCase();
            const cards = document.querySelectorAll('#output > div');
            
            cards.forEach(card => {
                const title = card.getAttribute('data-title');
                if (title.includes(term)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        function toggleSingleM3U(btn) {
            const wrapper = btn.nextElementSibling;
            wrapper.classList.toggle('hidden');
            if(wrapper.classList.contains('hidden')) {
                btn.innerHTML = `<i class="fa-solid fa-code text-[11px]"></i> ดูสคริปต์ M3U Playlist`;
            } else {
                btn.innerHTML = `<i class="fa-solid fa-xmark text-[11px]"></i> ปิดสคริปต์ M3U`;
            }
        }

        function copySingleM3U(btn) {
            const textarea = btn.parentElement.nextElementSibling;
            textarea.select();
            document.execCommand('copy');
            showToast("คัดลอก M3U ของภาพยนตร์เรื่องนี้แล้ว!", "success");
        }

        function compileMegaM3U() {
            let megaM3U = "#EXTM3U\n";
            gatheredSeries.forEach(series => {
                const groupName = series.categoryText || "ซีรีส์ทั่วไป";
                series.episodes.forEach(ep => {
                    megaM3U += `#EXTINF:-1 tvg-logo="${series.poster}" group-title="${groupName}" tvg-name="${series.title}", ${series.title} - ${ep.title}\n${ep.url}\n`;
                });
            });
            return megaM3U;
        }

        function downloadAllM3U() {
            if (gatheredSeries.length === 0) return;
            const content = compileMegaM3U();
            const category = document.getElementById("categorySelect").value;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `kubhd24-${category}-${new Date().toISOString().slice(0,10)}.m3u`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast("เริ่มการดาวน์โหลด M3U เรียบร้อย!", "success");
        }

        function copyAllM3UToClipboard() {
            if (gatheredSeries.length === 0) return;
            const content = compileMegaM3U();
            const dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = content;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            showToast("คัดลอกไฟล์รวม M3U ไปยังคลิปบอร์ดแล้ว!", "success");
        }

        let activeHls = null;

        function previewEpisode(id) {
            const select = document.getElementById(`epSelect-${id}`);
            if(!select) return;
            
            const url = select.value;
            const titleText = select.options[select.selectedIndex].text;
            
            const seriesObj = gatheredSeries.find(s => s.id === id);
            document.getElementById('modalTitle').textContent = `${seriesObj ? seriesObj.title : 'ทดลองเล่นวิดีโอ'}`;
            document.getElementById('modalSubtitle').textContent = `กำลังเปิดสตรีม: ${titleText}`;
            document.getElementById('modalStreamUrl').textContent = url;
            
            const modal = document.getElementById('playerModal');
            modal.classList.remove('hidden');
            
            const video = document.getElementById('hlsPlayer');
            const placeholder = document.getElementById('videoPlaceholder');
            
            video.classList.add('hidden');
            placeholder.classList.remove('hidden');

            if (Hls.isSupported()) {
                if (activeHls) {
                    activeHls.destroy();
                }
                const hls = new Hls();
                activeHls = hls;
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    video.classList.remove('hidden');
                    placeholder.classList.add('hidden');
                    video.play();
                });
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data.fatal) {
                        appendLog(`[PLAYER ERROR]: ไม่สามารถสตรีมวิดีโอได้ (${data.type})`, 'text-rose-500');
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                video.addEventListener('loadedmetadata', function() {
                    video.classList.remove('hidden');
                    placeholder.classList.add('hidden');
                    video.play();
                });
            } else {
                placeholder.innerHTML = `
                    <i class="fa-solid fa-circle-exclamation text-rose-500 text-5xl mb-3"></i>
                    <p class="text-slate-300 text-sm">เบราว์เซอร์ของคุณไม่รองรับการเล่นไฟล์สตรีมมิ่งสดประเภท HLS (.m3u8)</p>
                `;
            }
        }

        function closePlayer() {
            const modal = document.getElementById('playerModal');
            modal.classList.add('hidden');
            const video = document.getElementById('hlsPlayer');
            
            // FIX: ตัดการโหลดเบื้องหลัง (Buffering/Resource Leak) โดยสมบูรณ์เมื่อปิด Modal
            video.pause();
            video.removeAttribute('src'); 
            video.load(); 
            
            if (activeHls) {
                activeHls.destroy();
                activeHls = null;
            }
        }

        function copyStreamUrl() {
            const urlText = document.getElementById('modalStreamUrl').textContent;
            if(!urlText) return;
            
            const dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = urlText;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            showToast("คัดลอกทางสตรีมวิดีโอแล้ว!", "success");
        }

        window.onclick = function(event) {
            const modal = document.getElementById('playerModal');
            if (event.target == modal) {
                closePlayer();
            }
        }
    </script>
</body>
</html>
