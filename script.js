// ============================================
// SPARKLE PARTICLES — Canvas-based for
// maximum performance & density
// ============================================

class SparkleParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 200; // LOTS of shiny dots
        this.mouse = { x: -1000, y: -1000 };
        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        // Gold-ish warm colors
        const colors = [
            'rgba(212, 168, 83,',   // gold
            'rgba(232, 201, 122,',  // light gold
            'rgba(255, 223, 150,',  // warm yellow
            'rgba(201, 144, 142,',  // rose
            'rgba(245, 224, 216,',  // blush
            'rgba(255, 255, 255,',  // white sparkle
        ];

        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8 - 0.3, // slight upward drift
            opacity: Math.random() * 0.7 + 0.1,
            opacitySpeed: (Math.random() - 0.5) * 0.008,
            opacityMin: 0.05,
            opacityMax: 0.85,
            color: colors[Math.floor(Math.random() * colors.length)],
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2,
            glowSize: Math.random() * 6 + 2,
        };
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
        });

        // Interactive mouse glow
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let p of this.particles) {
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;

            // Twinkle effect
            p.twinklePhase += p.twinkleSpeed;
            const twinkle = (Math.sin(p.twinklePhase) + 1) / 2;
            const currentOpacity = p.opacity * (0.3 + twinkle * 0.7);

            // Mouse proximity glow boost
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mouseBoost = dist < 120 ? (1 - dist / 120) * 0.6 : 0;

            // Draw glow
            const finalOpacity = Math.min(currentOpacity + mouseBoost, 1);
            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.glowSize * (1 + mouseBoost)
            );
            gradient.addColorStop(0, p.color + (finalOpacity) + ')');
            gradient.addColorStop(0.4, p.color + (finalOpacity * 0.4) + ')');
            gradient.addColorStop(1, p.color + '0)');

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.glowSize * (1 + mouseBoost), 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Draw core dot
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + finalOpacity + ')';
            this.ctx.fill();

            // Wrap around screen edges
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = this.canvas.height + 10;
            if (p.y > this.canvas.height + 10) p.y = -10;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// FLOWER PETAL BURST — triggered on curtain open
// ============================================
function launchPetalBurst() {
    const canvas = document.getElementById('petalCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');

    const petals = [];
    const petalCount = 70;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Blush/rose petal colors matching the curtain
    const colors = [
        '#e8b4b8', // blush pink
        '#d4918e', // rose
        '#f5d5d8', // light pink
        '#c97b7b', // dusty rose
        '#f0c4c8', // soft pink
        '#e6a0a0', // warm rose
        '#fce4ec', // very light pink
        '#d4a08a', // warm peach
        '#fff5f5', // cream white
    ];

    for (let i = 0; i < petalCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        petals.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3, // slight upward bias
            size: Math.random() * 10 + 6,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            gravity: 0.08 + Math.random() * 0.04,
            sway: Math.random() * 2 - 1,
            swaySpeed: 0.02 + Math.random() * 0.03,
            swayPhase: Math.random() * Math.PI * 2,
            life: 0,
        });
    }

    let animId;
    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        // Draw petal shape (teardrop)
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.5);
        ctx.bezierCurveTo(
            p.size * 0.4, -p.size * 0.3,
            p.size * 0.4, p.size * 0.3,
            0, p.size * 0.5
        );
        ctx.bezierCurveTo(
            -p.size * 0.4, p.size * 0.3,
            -p.size * 0.4, -p.size * 0.3,
            0, -p.size * 0.5
        );
        ctx.fillStyle = p.color;
        ctx.fill();

        // Subtle vein line
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.4);
        ctx.lineTo(0, p.size * 0.35);
        ctx.strokeStyle = `rgba(255,255,255,0.25)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        for (const p of petals) {
            p.life++;
            p.x += p.vx + Math.sin(p.swayPhase) * p.sway;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.995;
            p.rotation += p.rotSpeed;
            p.swayPhase += p.swaySpeed;

            // Start fading after 60 frames
            if (p.life > 60) {
                p.opacity -= 0.008;
            }

            if (p.opacity > 0) {
                alive = true;
                drawPetal(p);
            }
        }

        if (alive) {
            animId = requestAnimationFrame(animate);
        } else {
            canvas.classList.remove('active');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();

    // Safety cleanup after 5s
    setTimeout(() => {
        cancelAnimationFrame(animId);
        canvas.classList.remove('active');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
}

// ============================================
// FIREWORKS BURST (On Click)
// ============================================
function initFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Firework colors (gold, rose, light yellow, white)
    const colors = ['#d4a853', '#f0c4c8', '#ffe5b4', '#ffffff', '#e8b4b8'];
    
    function createExplosion(x, y) {
        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2.5 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: 1,
                gravity: 0.05,
                friction: 0.96,
                decay: Math.random() * 0.02 + 0.015
            });
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            
            p.x += p.vx;
            p.y += p.vy;
            p.opacity -= p.decay;
            
            if (p.opacity <= 0) {
                particles.splice(i, 1);
                continue;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '255, 255, 255';
    }
    
    // Trigger on click anywhere
    document.addEventListener('click', (e) => {
        createExplosion(e.clientX, e.clientY);
    });
    
    // Start animation loop
    animate();
}

// ============================================
// INITIALIZATION
// ============================================

// Force scroll to top on refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {

    // Fix for jumping 100vh on mobile browsers (due to address bar shrinking)
    function fixMobileHeight() {
        const vh = window.innerHeight;
        const hero = document.getElementById('hero');
        const curtain = document.getElementById('curtainOverlay');
        
        // Lock the height exactly in pixels so it doesn't recalculate on scroll
        if (hero) hero.style.height = `${vh}px`;
        if (curtain) curtain.style.height = `${vh}px`;
    }
    // Run immediately
    fixMobileHeight();
    // Only update on orientation change (not on scroll/resize which causes the jitter)
    window.addEventListener('orientationchange', () => {
        setTimeout(fixMobileHeight, 300);
    });

    // Initialize fireworks system
    initFireworks();

    // Initialize sparkle particle system
    new SparkleParticleSystem('sparkleCanvas');

    // Curtain logic
    const curtainOverlay = document.getElementById('curtainOverlay');
    const openRibbon = document.getElementById('openRibbon');

    // Audio Elements
    const bgMusic = document.getElementById('bgMusic');
    const audioToggle = document.getElementById('audioToggle');
    const musicIcon = document.getElementById('musicIcon');
    let isMusicPlaying = false;

    if (openRibbon && curtainOverlay) {
        openRibbon.addEventListener('click', () => {
            // Open curtains
            curtainOverlay.classList.add('opened');
            
            // Trigger flower petal burst
            launchPetalBurst();

            // Play background music
            if (bgMusic) {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    if (audioToggle) {
                        audioToggle.classList.add('visible');
                    }
                }).catch(e => {
                    console.log("Audio autoplay prevented by browser", e);
                });
            }

            // Trigger entrance animations in the hero (delayed slightly)
            setTimeout(() => {
                document.body.classList.add('animations-active');
            }, 600);
        });
    }

    // Audio toggle button logic
    if (audioToggle && bgMusic) {
        audioToggle.addEventListener('click', () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicIcon.classList.add('muted');
            } else {
                bgMusic.play();
                musicIcon.classList.remove('muted');
            }
            isMusicPlaying = !isMusicPlaying;
        });
    }

    // ============================================
    // COUNTDOWN TIMER — 2 Aug 2026, 8:00 PM IST
    // ============================================
    const targetDate = new Date('2026-08-02T20:00:00+05:30').getTime();

    const cdDays = document.getElementById('cdDays');
    const cdHours = document.getElementById('cdHours');
    const cdMinutes = document.getElementById('cdMinutes');
    const cdSeconds = document.getElementById('cdSeconds');

    function updateCountdown() {
        const now = Date.now();
        const diff = targetDate - now;

        if (diff <= 0) {
            cdDays.textContent = '0';
            cdHours.textContent = '00';
            cdMinutes.textContent = '00';
            cdSeconds.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update with flip animation
        updateNumber(cdDays, String(days));
        updateNumber(cdHours, String(hours).padStart(2, '0'));
        updateNumber(cdMinutes, String(minutes).padStart(2, '0'));
        updateNumber(cdSeconds, String(seconds).padStart(2, '0'));
    }

    function updateNumber(el, newVal) {
        if (el.textContent !== newVal) {
            el.classList.add('flip');
            el.textContent = newVal;
            setTimeout(() => el.classList.remove('flip'), 300);
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ============================================
    // BLESSING BUTTON — shows random Islamic dua
    // ============================================
    const blessings = [
        { icon: '🤲', text: 'Barakallahu Feekuma — May Allah bless you both!' },
        { icon: '💐', text: 'Barakallahu laka, wa baraka alaika, wa jama\'a bainakuma fi khair' },
        { icon: '🌙', text: 'May Allah fill your lives with happiness, barakah & sabr. Ameen!' },
        { icon: '✨', text: 'May this bond be a source of mercy & tranquility. Ameen!' },
        { icon: '🕊️', text: 'May Allah make you the coolness of each other\'s eyes. Ameen!' },
        { icon: '💍', text: 'Mabrook! May your engagement be blessed with love & iman!' },
        { icon: '🌺', text: 'May Allah grant you both a righteous & beautiful future together. Ameen!' },
        { icon: '🤍', text: 'JazakAllahu Khairan — May this engagement be full of barakah!' },
        { icon: '🌟', text: 'May your future together be a journey towards Jannah. Ameen!' },
        { icon: '🕌', text: 'May Allah keep your hearts united in His remembrance. Ameen!' },
    ];

    const blessingBtn = document.getElementById('blessingBtn');
    const blessingToast = document.getElementById('blessingToast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = blessingToast?.querySelector('.toast-icon');
    let toastTimeout = null;

    if (blessingBtn && blessingToast) {
        blessingBtn.addEventListener('click', () => {
            // Pick a random blessing
            const b = blessings[Math.floor(Math.random() * blessings.length)];

            // Update toast content
            toastIcon.textContent = b.icon;
            toastMessage.textContent = b.text;

            // Clear any existing timeout
            if (toastTimeout) clearTimeout(toastTimeout);

            // Show toast
            blessingToast.classList.remove('show');
            // Force reflow for re-animation
            void blessingToast.offsetWidth;
            blessingToast.classList.add('show');

            // Hide after 3.5s
            toastTimeout = setTimeout(() => {
                blessingToast.classList.remove('show');
            }, 3500);
        });
    }
});
