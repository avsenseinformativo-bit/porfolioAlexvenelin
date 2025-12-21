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

    // ===== GLOBE PARALLAX ZOOM (Optimized) =====
    const globeContainer = document.querySelector('.globe-container');
    const hero = document.querySelector('.hero');
    const heroCenter = document.querySelector('.hero-center');
    const watermarkBlocker = document.getElementById('watermark-blocker');

    // Configuration
    const targetOffsetX = 40;
    const targetOffsetY = -8;
    const maxScale = 1.8;
    // Animation finishes at 40%, leaving a "static" section for the globe
    const animationEndPoint = 0.4;
    const smoothing = 0.08; // Slightly faster for more responsiveness

    // State
    let currentScale = 1;
    let currentX = 0;
    let currentY = 0;
    let currentOpacity = 1;
    let targetScale = 1;
    let targetX = 0;
    let targetY = 0;
    let targetOpacity = 1;
    let ticking = false;

    // Throttled scroll handler with SNAP Logic
    let isSnapping = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollValues();
                handleScrollSnap();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    function handleScrollSnap() {
        if (isSnapping) return;

        const scrollY = window.scrollY;
        const heroHeight = hero?.offsetHeight || 1;
        const viewportHeight = window.innerHeight;

        // Snap point should be where animation ends relative to scrollable height
        // Animation ends at 0.4 progress of (heroHeight - viewportHeight)
        const scrollableHeight = heroHeight - viewportHeight;
        const snapPoint = scrollableHeight * animationEndPoint;

        const snapRange = 50; // trigger snap if within 50px

        if (Math.abs(scrollY - snapPoint) < snapRange) {
            // User is near the "Globe Section", snap to it
            isSnapping = true;
            window.scrollTo({
                top: snapPoint,
                behavior: 'smooth'
            });

            // Release snap lock after animation
            setTimeout(() => {
                isSnapping = false;
            }, 500);
        }
    }

    function updateScrollValues() {
        const scrollY = window.scrollY;
        const heroHeight = hero?.offsetHeight || 1;
        const viewportHeight = window.innerHeight;

        const scrollProgress = Math.min(scrollY / (heroHeight - viewportHeight), 1);
        const animationProgress = Math.min(scrollProgress / animationEndPoint, 1);
        const easedProgress = easeOutCubic(animationProgress);

        targetScale = 1 + (easedProgress * (maxScale - 1));
        targetX = easedProgress * targetOffsetX;
        targetY = easedProgress * targetOffsetY;
        // ULTRA Instant fade: Text gone after 25px
        // DIRECTLY set targetOpacity (removed from loop interpolation for speed)
        const opacity = Math.max(0, 1 - (scrollY / 25));

        // Blur effect: 0px at top, 25px when invisible (Increased intensity)
        // Creates a strong "focus in" effect when scrolling up
        const blurAmount = (1 - opacity) * 25;

        if (heroCenter) {
            heroCenter.style.opacity = opacity;
            heroCenter.style.filter = `blur(${blurAmount}px)`;
        }

        // Watermark
        if (watermarkBlocker) {
            watermarkBlocker.style.opacity = scrollY > 50 ? '0' : '1';
        }

        // Scroll Indicator Fade
        const scrollCta = document.querySelector('.scroll-cta');
        if (scrollCta) {
            scrollCta.style.opacity = scrollY > 50 ? '0' : '0.7';
        }
    }

    // Main animation loop (GPU accelerated)
    function animate() {
        // Smooth interpolation for Globe (keep smooth)
        currentScale += (targetScale - currentScale) * smoothing;
        currentX += (targetX - currentX) * smoothing;
        currentY += (targetY - currentY) * smoothing;

        // REMOVED opacity interpolation - handled directly in updateScrollValues for instant effect

        // Apply transforms using translate3d for GPU acceleration
        if (globeContainer) {
            globeContainer.style.transform = `translate3d(${currentX}%, ${currentY}%, 0) scale(${currentScale})`;
        }

        requestAnimationFrame(animate);
    }
    animate();

    // Smoother easing function
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
});
