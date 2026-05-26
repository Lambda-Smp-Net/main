/* ================================================================
   Lambda SMP Network — Main Script
   main.js
================================================================ */

/* ================================================================
   ✏️  YAPIMCILAR — Buradan kişi ekle / çıkar
   Her obje:
     name:  Görüntülenecek isim
     role:  Rol (örn: "Kurucu", "Admin", "Moderatör", "Builder")
     mc:    Minecraft kullanıcı adı (avatar için kullanılır)
     emoji: mc avatar yerine emoji göster (opsiyonel, boş bırakırsan MC avatar gelir)
================================================================ */
const AUTHORS = [
    { name: "LambdaOwner", role: "Kurucu",    mc: "LambdaOwner", emoji: "👑" },
    { name: "Yapımcı2",    role: "Admin",      mc: "Yapimci2",    emoji: "⚡" },
    { name: "Yapımcı3",    role: "Moderatör",  mc: "Yapimci3",    emoji: "🛡️" }
    // Yeni eklemek için üstteki son satırın sonuna virgül koy ve buraya ekle:
    // , { name: "Oyuncu", role: "Builder", mc: "McIsim", emoji: "" }
];

/* ================================================================
   GİRİŞ EKRANI
   Typewriter efektiyle mesaj yazar, progress bar dolar, sonra kaybolur.
================================================================ */
function initIntro() {
    const intro   = document.getElementById('intro');
    if (!intro) return;

    const msgEl   = document.getElementById('intro-msg');
    const fillEl  = document.getElementById('intro-fill');
    const pctEl   = document.getElementById('intro-pct');

    /* ── Typewriter ── */
    const MESSAGES = [
        'Bir macera yükleniyor...',
        'Dünya oluşturuluyor...',
        'Nefesini tut, neredeyse hazır.'
    ];
    let msgIndex = 0, charIndex = 0, typing = true;

    function typeStep() {
        if (!typing) return;
        const current = MESSAGES[msgIndex];
        if (charIndex <= current.length) {
            msgEl.textContent = current.slice(0, charIndex);
            charIndex++;
            setTimeout(typeStep, 42 + Math.random() * 28);
        } else if (msgIndex < MESSAGES.length - 1) {
            // Kısa bekleme, sonraki mesaja geç
            setTimeout(() => {
                charIndex = 0;
                msgIndex++;
                setTimeout(typeStep, 60);
            }, 700);
        }
    }
    setTimeout(typeStep, 400);

    /* ── Progress bar ── */
    const TOTAL_MS   = 3200;   // toplam yüklenme süresi (ms)
    const TICK_MS    = 40;     // güncelleme sıklığı
    const STEPS      = TOTAL_MS / TICK_MS;
    let   step       = 0;
    let   pct        = 0;

    fillEl.classList.add('started');

    const barTimer = setInterval(() => {
        step++;
        // Easing: başta hızlı, sonda biraz yavaşlar — gerçekçi his
        const ease = step / STEPS;
        const target = Math.min(100, Math.round(
            ease < 0.7
                ? ease * 130         // hızlı bölüm
                : 91 + (ease - 0.7) / 0.3 * 9  // son %91→100 yavaş
        ));

        if (target > pct) {
            pct = target;
            fillEl.style.width = pct + '%';
            pctEl.textContent  = pct + '%';
        }

        if (pct >= 100) {
            clearInterval(barTimer);
            typing = false;
            msgEl.textContent = 'Hazır. İyi oyunlar!';
            setTimeout(endIntro, 520);
        }
    }, TICK_MS);

    function endIntro() {
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.classList.add('hidden');
            revealAll();
        }, 720);
    }
}

/* ── Author kartları ── */
function renderAuthors() {
    document.getElementById('authGrid').innerHTML = AUTHORS.map(a => `
        <div class="author-card rv">
            <div class="a-avatar">
                ${a.emoji
                    ? `<span style="font-size:2rem">${a.emoji}</span>`
                    : `<img src="https://minotar.net/avatar/${encodeURIComponent(a.mc)}/72"
                            alt="${a.name}"
                            onerror="this.parentElement.innerHTML='<span style=font-size:2rem>🎮</span>'">`
                }
            </div>
            <div class="a-name">${a.name}</div>
            <div class="a-role">${a.role}</div>
            <div class="a-mc">⛏ ${a.mc}</div>
        </div>`).join('');
    revealAll();
}

/* ── Slideshow ── */
let cur = 0, total = 5, timer;
function updSS() {
    document.getElementById('ssTrack').style.transform = `translateX(-${cur * 100}%)`;
    document.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('on', i === cur));
}
function chSlide(d) { cur = (cur + d + total) % total; updSS(); resetTimer(); }
function goSlide(n)  { cur = n; updSS(); resetTimer(); }
function resetTimer(){ clearInterval(timer); timer = setInterval(() => chSlide(1), 4500); }

/* Touch swipe */
let tx = 0;
const trk = document.getElementById('ssTrack');
trk.addEventListener('touchstart', e => tx = e.touches[0].clientX, {passive:true});
trk.addEventListener('touchend',   e => { const d = tx - e.changedTouches[0].clientX; if(Math.abs(d)>40) chSlide(d>0?1:-1); }, {passive:true});

/* Keyboard */
document.addEventListener('keydown', e => {
    if(e.key==='ArrowLeft')  chSlide(-1);
    if(e.key==='ArrowRight') chSlide(1);
});

/* ── Copy IP ── */
function copyIP() {
    const btn = document.getElementById('cpyBtn');
    navigator.clipboard.writeText('play.lambdasmp.net').then(() => {
        btn.textContent = 'Kopyalandı ✓';
        btn.style.background = '#fff';
        setTimeout(() => { btn.textContent = 'Kopyala'; btn.style.background = ''; }, 2200);
    }).catch(() => prompt('Sunucu IP:', 'play.lambdasmp.net'));
}

/* ── Mobile menu ── */
function mOpen()  { document.getElementById('mMen').classList.add('open'); }
function mClose() { document.getElementById('mMen').classList.remove('open'); }

/* ── Scroll reveal ── */
function revealAll() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); io.unobserve(e.target); } });
    }, {threshold:.1});
    document.querySelectorAll('.rv').forEach(el => io.observe(el));
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    renderAuthors();
    revealAll();
    resetTimer();
});
