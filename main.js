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
   TNT GİRİŞ ANİMASYONU
   — Otomatik başlar, ~3.2sn sonra biter
   — Skip butonu ile atlanabilir
================================================================ */
function initTNTIntro() {
    const intro  = document.getElementById('tnt-intro');
    const skipBtn = document.getElementById('tnt-skip');
    if (!intro) return;

    const FALL_DURATION    = 1400; // ms — TNT düşüş süresi
    const EXPLODE_DELAY    = 200;  // ms — düştükten sonra patlama gecikmesi
    const OUTRO_DELAY      = 800;  // ms — patlama sonrası overlay kalkma süresi
    const TOTAL            = FALL_DURATION + EXPLODE_DELAY + OUTRO_DELAY;

    function triggerExplosion() {
        const box        = document.querySelector('.tnt-box');
        const fuse       = document.querySelector('.tnt-fuse');
        const explosion  = document.querySelector('.tnt-explosion');
        const particles  = document.querySelector('.exp-particles');

        // TNT'yi gizle
        if (box)  { box.style.opacity  = '0'; box.style.transition  = 'none'; }
        if (fuse) { fuse.style.opacity = '0'; fuse.style.transition = 'none'; }

        // Flash
        const flash = document.createElement('div');
        flash.className = 'exp-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 700);

        // Screen shake
        document.body.classList.add('shaking');
        setTimeout(() => document.body.classList.remove('shaking'), 600);

        // Explosion rings
        if (explosion) explosion.classList.add('boom');

        // Generate particles
        if (particles) {
            const colors = ['#ff4400','#ff8800','#ffcc00','#fff','#cc0000','#ff6600'];
            const count  = 28;
            for (let i = 0; i < count; i++) {
                const p    = document.createElement('div');
                p.className = 'exp-particle';
                const angle = (i / count) * Math.PI * 2;
                const speed = 120 + Math.random() * 220;
                const dx    = Math.cos(angle) * speed;
                const dy    = Math.sin(angle) * speed;
                const rot   = Math.random() * 720 - 360;
                const size  = 5 + Math.random() * 10;
                p.style.cssText = `
                    width:${size}px; height:${size}px;
                    background:${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
                    animation: particle-${i} 0.8s ease-out forwards;
                `;
                // Inject per-particle keyframe
                const styleTag = document.createElement('style');
                styleTag.textContent = `
                    @keyframes particle-${i} {
                        0%   { opacity:1; transform:translate(0,0) rotate(0deg); }
                        100% { opacity:0; transform:translate(${dx}px,${dy}px) rotate(${rot}deg); }
                    }
                `;
                document.head.appendChild(styleTag);
                particles.appendChild(p);
            }
        }

        // Fade out overlay after explosion
        setTimeout(endIntro, OUTRO_DELAY);
    }

    function endIntro() {
        const intro = document.getElementById('tnt-intro');
        if (!intro) return;
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.classList.add('hidden');
            // Trigger scroll-reveal on visible elements
            revealAll();
        }, 650);
    }

    // Kick off explosion after TNT lands
    setTimeout(triggerExplosion, FALL_DURATION + EXPLODE_DELAY);

    // Skip button
    skipBtn && skipBtn.addEventListener('click', endIntro);
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
    initTNTIntro();
    renderAuthors();
    revealAll();
    resetTimer();
});
