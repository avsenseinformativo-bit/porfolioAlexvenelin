// Premium Portfolio - Alex Venelín
// Optimized for performance and smooth animations

document.addEventListener('DOMContentLoaded', () => {
    // ===== CUSTOM CURSOR (GPU Accelerated) =====
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor="link"]');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    // Use passive listener for better scroll performance
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    // ===== MAGNETIC MENU PILL =====
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const pill = document.querySelector('.nav-pill-background');

    function updatePillPosition(element) {
        if (!pill || !element) return;

        // Calculate position relative to the NAV container (parent of pill)
        const parentRect = nav.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        const left = elementRect.left - parentRect.left;
        const width = elementRect.width;

        pill.style.opacity = '1';
        pill.style.transform = `translateX(${left}px)`;
        pill.style.width = `${width}px`;
    }

    // Hover effects for menu
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            updatePillPosition(link);
        });
    });

    // Reset to active link on mouse leave
    if (nav) {
        nav.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) {
                updatePillPosition(activeLink);
            } else {
                if (pill) pill.style.opacity = '0';
            }
        });
    }

    // Initial position
    setTimeout(() => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) updatePillPosition(activeLink);
    }, 100);


    // ===== ACTIVE SECTION OBSERVER =====
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.3
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update active class
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                        // Move pill to new active if not hovering
                        if (!nav.matches(':hover')) {
                            updatePillPosition(link);
                        }
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Optimized cursor animation with GPU acceleration
    function animateCursor() {
        // Smoother interpolation
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;

        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;

        // Use transform for GPU acceleration instead of left/top
        if (cursor) {
            cursor.style.transform = `translate3d(${cursorX - 4}px, ${cursorY - 4}px, 0)`;
        }

        if (cursorFollower) {
            cursorFollower.style.transform = `translate3d(${followerX - 20}px, ${followerY - 20}px, 0)`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor?.classList.add('hover');
            cursorFollower?.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor?.classList.remove('hover');
            cursorFollower?.classList.remove('hover');
        });
    });

    // ===== GLOBE FADE (Simplified - No animation) =====
    const globeContainer = document.querySelector('.globe-container');
    const hero = document.querySelector('.hero');
    const heroCenter = document.querySelector('.hero-center');
    let ticking = false;

    // Throttled scroll handler with SNAP Logic
    let isSnapping = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollValues();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    function updateScrollValues() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // ===== CINEMATIC HERO EXIT =====
        // Transition range increased for smoother effect (0px to 500px)
        const transitionRange = 500;
        const progress = Math.min(scrollY / transitionRange, 1);

        // Opacity: Gradual fade
        const textOpacity = 1 - progress;

        // Blur: Increases as we scroll (creates depth)
        const blurAmount = progress * 10;

        // Scale: Shrinks slightly to look like it's moving backward
        const scaleAmount = 1 - (progress * 0.1);

        if (heroCenter) {
            heroCenter.style.opacity = textOpacity;
            heroCenter.style.filter = `blur(${blurAmount}px)`;
            heroCenter.style.transform = `scale(${scaleAmount})`;
        }

        // Globe fade to black (matches text but slightly delayed)
        if (globeContainer) {
            globeContainer.style.opacity = textOpacity;
            globeContainer.style.transform = `scale(${scaleAmount})`;
        }



        // Scroll Indicator Fade
        const scrollCta = document.querySelector('.scroll-cta');
        if (scrollCta) {
            scrollCta.style.opacity = scrollY > 50 ? '0' : '0.7';
        }
    }

    // Smoother easing function
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // ===== SCROLL REVEAL OBSERVER (Vision Section) =====
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
});
