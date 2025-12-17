/**
 * Ultra-Minimalist Portfolio
 * Sophisticated interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initScrollAnimations();
    initParallax();
    initMenuInteraction();
    initSmoothScroll();
    initCursorEffect();
    initContactForm();
});

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        // Initial state for animation (optional, can be done in CSS)
        // el.style.opacity = '0';
        // el.style.transform = 'translateY(40px)';
        // el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Add visible state styles (if not already in CSS)
    // This part is often handled by CSS classes directly
    // const style = document.createElement('style');
    // style.textContent = `
    //     .is-visible {
    //         opacity: 1 !important;
    //         transform: translateY(0) !important;
    //     }
    // `;
    // document.head.appendChild(style);
}

/**
 * Subtle parallax effect on scroll
 */
function initParallax() {
    const hero = document.querySelector('.hero-visual');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;

                // Parallax for brain visual
                if (hero && scrollY < windowHeight) {
                    const parallaxValue = scrollY * 0.3;
                    hero.style.transform = `translateY(${parallaxValue}px)`;
                }

                // Fade out scroll indicator
                if (scrollIndicator) {
                    const fadeStart = 50;
                    const fadeEnd = 200;
                    const opacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
                    scrollIndicator.style.opacity = opacity;
                }

                ticking = false;
            });

            ticking = true;
        }
    }, { passive: true });
}

/**
 * Menu overlay interaction
 */
function initMenuInteraction() {
    const menuBtn = document.querySelector('.nav-menu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.querySelector('.menu-close');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (menuBtn && menuOverlay) {
        // Open menu
        menuBtn.addEventListener('click', () => {
            menuOverlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        });

        // Close menu
        if (menuClose) {
            menuClose.addEventListener('click', () => {
                menuOverlay.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        }

        // Close menu when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOverlay.classList.contains('is-open')) {
                menuOverlay.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80; // Adjust this value if you have a fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Utility: Scroll to element
 */
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Optional: Custom cursor effect for desktop
 * Uncomment to enable
 */
/**
 * Custom Cursor with Magnetic Effect
 */
// Custom Cursor - Particle Trail (GPU Optimized)
function initCursorEffect() {
    // Only valid for devices with fine pointer
    if (window.matchMedia('(pointer: fine)').matches) {

        // Clean up any old elements
        document.querySelectorAll('.cursor-orb, .cursor-trail').forEach(el => el.remove());

        // Create main orb
        const cursorOrb = document.createElement('div');
        cursorOrb.className = 'cursor-orb';
        document.body.appendChild(cursorOrb);

        // Create trail elements
        const trailLength = 12; // Slightly longer trail
        const trailDots = [];

        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            document.body.appendChild(dot);
            trailDots.push({
                element: dot,
                x: 0,
                y: 0
            });
        }

        // Mouse coordinates
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Move orb using transform (better performance)
            cursorOrb.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        // Animation loop for smooth trail
        function animate() {
            trailDots.forEach((dot, index) => {
                // Physics: Follow the previous point (or mouse for first point)
                const nextDot = trailDots[index - 1] || { x: mouseX, y: mouseY };

                const targetX = index === 0 ? mouseX : nextDot.x;
                const targetY = index === 0 ? mouseY : nextDot.y;

                // Ease factor - dynamic smoothness
                const ease = 0.45 - (index * 0.025);

                dot.x += (targetX - dot.x) * ease;
                dot.y += (targetY - dot.y) * ease;

                // Move trail using transform
                // Important: We keep translate(-50%, -50%) for centering in the transform string
                const scale = 1 - (index / trailLength);
                dot.element.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%) scale(${scale})`;
                dot.element.style.opacity = scale * 0.6;
            });

            requestAnimationFrame(animate);
        }
        animate();

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .nav-menu');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOrb.classList.add('hovered');
                document.body.classList.add('is-hovering'); // For trail styling
            });

            el.addEventListener('mouseleave', () => {
                cursorOrb.classList.remove('hovered');
                document.body.classList.remove('is-hovering');
            });
        });
    }
}

/**
 * Contact Form Logic
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMsg = form.querySelector('.form-success-message');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate (simple check)
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderBottomColor = 'red';
                } else {
                    input.style.borderBottomColor = ''; // Reset
                }
            });

            if (isValid) {
                // Check if we are really sending or just mocking
                // For now, we simulate success

                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;

                btn.innerHTML = '<span>Sending...</span>';
                btn.style.pointerEvents = 'none';

                setTimeout(() => {
                    form.reset();
                    btn.innerHTML = originalText;
                    btn.style.pointerEvents = '';

                    successMsg.classList.add('visible');

                    setTimeout(() => {
                        successMsg.classList.remove('visible');
                    }, 5000);
                }, 1500);
            }
        });
    }
}

/**
 * Initialize Lenis Smooth Scroll
 */
function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }
}

/**
 * Parallax Effect for HUD Elements
 */
function initParallaxEffect() {
    const hudTopLeft = document.querySelector('.hero-hud-top-left');
    const hudBottomRight = document.querySelector('.hero-hud-bottom-right');
    const heroSection = document.querySelector('.hero');

    if (hudTopLeft && hudBottomRight && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            // Move elements in opposite directions for depth
            // Increased multiplier for visibility (from 2 to 5)
            hudTopLeft.style.transform = `translateX(${x * 5}px) translateY(${y * 5}px)`;
            hudBottomRight.style.transform = `translateX(${x * -5}px) translateY(${y * -5}px)`;
        });
    }
}
