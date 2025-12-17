/* ========================================
   PREMIUM EFFECTS - Portfolio Alex Venelin
   Advanced interactions and animations
   ======================================== */

// ==========================================
// SMOOTH SCROLL - DISABLED
// ==========================================
class SmoothScroll {
    constructor() {
        // Disabled - using native scroll
    }
}

// ==========================================
// CUSTOM CURSOR
// ==========================================
class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.init();
    }

    init() {
        // Only on desktop
        if (window.innerWidth < 968) return;

        this.createCursor();
        this.bindEvents();
        this.animate();
    }

    createCursor() {
        // Main cursor circle
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);

        // Small dot
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'custom-cursor-dot';
        document.body.appendChild(this.cursorDot);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .filter-pill, .hero-cta-pill');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
                this.cursorDot.classList.add('cursor-hover');
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
                this.cursorDot.classList.remove('cursor-hover');
            });
        });

        // Hide on mouse leave
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorDot.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorDot.style.opacity = '1';
        });
    }

    animate() {
        // Smooth follow for main cursor
        this.cursorX += (this.mouseX - this.cursorX) * 0.15;
        this.cursorY += (this.mouseY - this.cursorY) * 0.15;

        // Faster follow for dot
        this.dotX += (this.mouseX - this.dotX) * 0.5;
        this.dotY += (this.mouseY - this.dotY) * 0.5;

        if (this.cursor) {
            this.cursor.style.transform = `translate(${this.cursorX - 20}px, ${this.cursorY - 20}px)`;
        }
        if (this.cursorDot) {
            this.cursorDot.style.transform = `translate(${this.dotX - 4}px, ${this.dotY - 4}px)`;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// MAGNETIC BUTTONS
// ==========================================
class MagneticButtons {
    constructor() {
        this.buttons = [];
        this.init();
    }

    init() {
        const magneticElements = document.querySelectorAll('.hero-cta-pill, .filter-pill, .nav-menu, .project-view-btn');

        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.onMouseMove(e, el));
            el.addEventListener('mouseleave', (e) => this.onMouseLeave(e, el));
        });
    }

    onMouseMove(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const strength = 0.3;

        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    }

    onMouseLeave(e, el) {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.3s ease';

        setTimeout(() => {
            el.style.transition = '';
        }, 300);
    }
}

// ==========================================
// TEXT REVEAL ON SCROLL
// ==========================================
class TextReveal {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.elements = document.querySelectorAll('.reveal-text, .animate-line, .project-card, .work-cta-content');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => {
            el.classList.add('reveal-ready');
            observer.observe(el);
        });
    }
}

// ==========================================
// PROGRESS BAR
// ==========================================
class ProgressBar {
    constructor() {
        this.bar = null;
        this.init();
    }

    init() {
        this.createBar();
        this.updateOnScroll();
    }

    createBar() {
        this.bar = document.createElement('div');
        this.bar.className = 'scroll-progress-bar';
        document.body.appendChild(this.bar);
    }

    updateOnScroll() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;

            if (this.bar) {
                this.bar.style.width = `${progress}%`;
            }
        });
    }
}

// ==========================================
// 3D TILT EFFECT FOR PROJECT CARDS
// ==========================================
class TiltEffect {
    constructor() {
        this.cards = [];
        this.init();
    }

    init() {
        this.cards = document.querySelectorAll('.project-card');

        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.onMouseLeave(e, card));
        });
    }

    onMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    onMouseLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';

        setTimeout(() => {
            card.style.transition = '';
        }, 500);
    }
}

// ==========================================
// THEME CHANGE ON PROJECT HOVER
// ==========================================
class ThemeChanger {
    constructor() {
        this.init();
    }

    init() {
        const cards = document.querySelectorAll('.project-card[data-color]');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const color = card.dataset.color;
                if (color) {
                    document.body.style.backgroundColor = color;
                    document.body.classList.add('theme-transitioning');
                }
            });

            card.addEventListener('mouseleave', () => {
                document.body.style.backgroundColor = '';
                document.body.classList.remove('theme-transitioning');
            });
        });
    }
}

// ==========================================
// WORLD CLOCK
// ==========================================
class WorldClock {
    constructor(elementId, timezone = 'Europe/Madrid') {
        this.element = document.getElementById(elementId);
        this.timezone = timezone;
        if (this.element) {
            this.init();
        }
    }

    init() {
        this.update();
        setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date();
        const options = {
            timeZone: this.timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        const timeString = now.toLocaleTimeString('es-ES', options);
        this.element.textContent = timeString;
    }
}

// ==========================================
// COPY TO CLIPBOARD
// ==========================================
class CopyToClipboard {
    constructor() {
        this.init();
    }

    init() {
        const copyButtons = document.querySelectorAll('[data-copy]');

        copyButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const textToCopy = btn.dataset.copy;

                try {
                    await navigator.clipboard.writeText(textToCopy);
                    btn.classList.add('copied');

                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✓ Copied!';

                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = originalText;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
        });
    }
}

// ==========================================
// BACK TO TOP
// ==========================================
class BackToTop {
    constructor() {
        this.button = null;
        this.init();
    }

    init() {
        this.button = document.getElementById('backToTop');

        if (this.button) {
            window.addEventListener('scroll', () => this.toggleVisibility());
            this.button.addEventListener('click', () => this.scrollToTop());
        }
    }

    toggleVisibility() {
        if (window.scrollY > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ==========================================
// CONFETTI EFFECT
// ==========================================
class ConfettiEffect {
    constructor() {
        this.init();
    }

    init() {
        const ctaButtons = document.querySelectorAll('.hero-cta-pill.primary');

        ctaButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => this.createConfetti(btn));
        });
    }

    createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

        for (let i = 0; i < 15; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = `${rect.left + rect.width / 2}px`;
            confetti.style.top = `${rect.top}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.setProperty('--x', `${(Math.random() - 0.5) * 200}px`);
            confetti.style.setProperty('--y', `${-Math.random() * 150 - 50}px`);
            confetti.style.setProperty('--r', `${Math.random() * 360}deg`);

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 1000);
        }
    }
}

// ==========================================
// LOADING SKELETON
// ==========================================
class LoadingSkeleton {
    constructor() {
        this.init();
    }

    init() {
        const images = document.querySelectorAll('.project-image-container img');

        images.forEach(img => {
            if (!img.complete) {
                img.parentElement.classList.add('loading');

                img.addEventListener('load', () => {
                    img.parentElement.classList.remove('loading');
                });
            }
        });
    }
}

// ==========================================
// HAPTIC FEEDBACK (Mobile)
// ==========================================
class HapticFeedback {
    constructor() {
        this.init();
    }

    init() {
        if (!('vibrate' in navigator)) return;

        const interactiveElements = document.querySelectorAll('button, a, .project-card');

        interactiveElements.forEach(el => {
            el.addEventListener('touchstart', () => {
                navigator.vibrate(10);
            });
        });
    }
}

// ==========================================
// INTRO ANIMATION (Cinematic)
// ==========================================
class IntroAnimation {
    constructor() {
        this.overlay = null;
        this.hasPlayed = sessionStorage.getItem('introPlayed');

        if (!this.hasPlayed) {
            this.init();
        }
    }

    init() {
        this.createOverlay();
        this.playAnimation();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'intro-overlay';
        this.overlay.innerHTML = `
            <div class="intro-content">
                <span class="intro-logo">AV</span>
                <span class="intro-text">Alex Venelin</span>
            </div>
        `;
        document.body.appendChild(this.overlay);
        document.body.style.overflow = 'hidden';
    }

    playAnimation() {
        setTimeout(() => {
            this.overlay.classList.add('intro-fade-out');
            document.body.style.overflow = '';

            setTimeout(() => {
                this.overlay.remove();
                sessionStorage.setItem('introPlayed', 'true');
            }, 800);
        }, 1500);
    }
}

// ==========================================
// INITIALIZE ALL EFFECTS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Core effects
    new SmoothScroll();
    new CustomCursor();
    new MagneticButtons();
    new TextReveal();
    new ProgressBar();

    // Project effects
    new TiltEffect();
    new ThemeChanger();

    // Interactions
    new CopyToClipboard();
    new BackToTop();
    new ConfettiEffect();
    new LoadingSkeleton();
    new HapticFeedback();

    // Special effects
    new IntroAnimation();

    // World clock (if element exists)
    new WorldClock('worldClock', 'Europe/Madrid');

    console.log('✨ Premium effects loaded');
});

// Export for use in other files
window.PremiumEffects = {
    SmoothScroll,
    CustomCursor,
    MagneticButtons,
    TextReveal,
    ProgressBar,
    TiltEffect,
    ThemeChanger,
    WorldClock,
    CopyToClipboard,
    BackToTop,
    ConfettiEffect,
    LoadingSkeleton,
    HapticFeedback,
    IntroAnimation
};
