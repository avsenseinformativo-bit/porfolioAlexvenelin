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

    // ===== SCROLL REVEAL OBSERVER (Vision Section & Stats) =====
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const statsContainer = document.querySelector('.stats-container');
    let statsPlayed = false;

    // Stats Counting Animation
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out expo
            const easeProgress = 1 - Math.pow(1 - progress, 4);

            let currentVal = Math.floor(easeProgress * (end - start) + start);

            // Format: Add '+' or '%' based on original content
            if (obj.dataset.target.includes('+')) {
                // Not handled here, we passed raw number. 
                // We'll rely on innerHTML logic below or pure text
            }

            // Naive text update
            // We need to keep symbols
            const originalText = obj.getAttribute('data-original') || obj.textContent;
            const isPercent = originalText.includes('%');
            const isPlus = originalText.includes('+');
            const isPlusEnd = originalText.endsWith('+'); // e.g. 50+ or +50? 

            // Let's stick to the raw target value passed to function
            let text = currentVal;
            if (isPercent) text += '%';
            if (isPlus && !isPlusEnd) text = '+' + text; // +50
            if (isPlus && isPlusEnd) text = text + '+'; // 50+

            obj.innerHTML = text;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = originalText; // Snap to final exact string from HTML to be safe
            }
        };
        window.requestAnimationFrame(step);
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If this is the stats container, trigger counter
                if (entry.target.classList.contains('stats-container') && !statsPlayed) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        // Store original text
                        counter.setAttribute('data-original', counter.textContent);
                        const target = parseInt(counter.getAttribute('data-target'));
                        animateValue(counter, 0, target, 2000);
                    });
                    statsPlayed = true;
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
    if (statsContainer) revealObserver.observe(statsContainer);

    // ===== BLOB PARALLAX =====
    const blob = document.querySelector('.vision-blob');
    if (blob) {
        document.addEventListener('mousemove', (e) => {
            if (!blob) return;
            // Calculate center
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;

            const mouseX = e.clientX - x;
            const mouseY = e.clientY - y;

            // Subtle movement (inverted)
            const moveX = mouseX * -0.05;
            const moveY = mouseY * -0.05;

            // Apply translation on top of the centering translate(-50%, -50%) 
            // We use CSS variable or just overwrite transform safely?
            // Animation is already running on transform.
            // Better to animate LEFT/TOP or use margins to avoid conflict with keyframes
            // Or use a wrapper.
            // Let's use margin-left/top for subtle offset to not break 'blobFloat' transform

            blob.style.marginLeft = `${moveX}px`;
            blob.style.marginTop = `${moveY}px`;
        }, { passive: true });
    }
    // ===== SPOTLIGHT EFFECT FOR CARDS =====
    const cards = document.querySelectorAll("[data-spotlight]");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // ===== PROJECT TOGGLE SWITCH =====
    const toggleOptions = document.querySelectorAll('.toggle-option');
    const toggleBg = document.querySelector('.toggle-bg');
    const projectGrids = document.querySelectorAll('.projects-grid');

    if (toggleOptions.length > 0) {
        toggleOptions.forEach((option, index) => {
            option.addEventListener('click', () => {
                // Update Toggle State
                toggleOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                // Move Background Pill
                // Assuming 2 options, 0 = 0% left, 1 = 50% left (approx, depends on styling)
                // Better approach: calculate offset based on option position
                const parentRect = option.parentElement.getBoundingClientRect();
                const optionRect = option.getBoundingClientRect();
                const relativeLeft = optionRect.left - parentRect.left;

                // Adjust for padding (4px)
                toggleBg.style.transform = `translateX(${index === 0 ? '0' : '100%'})`;


                // Show/Hide Grids
                const mode = option.dataset.mode;
                const targetGrid = document.getElementById(`grid-${mode}`);

                // Fade out all grids
                projectGrids.forEach(grid => {
                    grid.style.opacity = '0';
                    grid.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        grid.style.display = 'none';
                        grid.classList.remove('active');
                    }, 400);
                });

                // Fade in target grid after delay
                setTimeout(() => {
                    targetGrid.style.display = 'grid';
                    // Trigger reflow
                    targetGrid.offsetHeight;
                    targetGrid.style.opacity = '1';
                    targetGrid.style.transform = 'translateY(0)';
                    targetGrid.classList.add('active');
                }, 400);
            });
        });
    }
});
