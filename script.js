document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursor();
});

function initParticles() {
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(26, 60, 255, 0.4)';
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p, i) => {
            p.update();
            p.draw();
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(26, 60, 255, ${0.1 * (1 - dist / 150)})`;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }

    animate();
}

function initCursor() {
    const core = document.querySelector('.cursor-core');
    const aura = document.querySelector('.cursor-aura');
    let mouse = { x: -100, y: -100 };
    let auraPos = { x: -100, y: -100 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        core.style.left = mouse.x + 'px';
        core.style.top = mouse.y + 'px';
    });

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    function animate() {
        auraPos.x = lerp(auraPos.x, mouse.x, 0.15);
        auraPos.y = lerp(auraPos.y, mouse.y, 0.15);
        aura.style.left = auraPos.x + 'px';
        aura.style.top = auraPos.y + 'px';
        requestAnimationFrame(animate);
    }

    animate();

    document.querySelectorAll('a, .menu-toggle').forEach(el => {
        el.addEventListener('mouseenter', () => {
            aura.style.width = '60px';
            aura.style.height = '60px';
            aura.style.borderColor = 'rgba(26, 60, 255, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            aura.style.width = '30px';
            aura.style.height = '30px';
            aura.style.borderColor = 'rgba(26, 60, 255, 0.5)';
        });
    });
}
