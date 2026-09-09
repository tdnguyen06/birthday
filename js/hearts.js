// =================================================================
// 🎞️ VINTAGE ATMOSPHERE CANVAS: FILM DUST, BOKEH & LIGHT LEAKS
// =================================================================

class BackgroundEffects {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.dustParticles = [];
        this.bokehOrbs = [];
        this.lightLeaks = [];
        this.grainPattern = null;
        
        this.resize();
        this.init();
        window.addEventListener('resize', () => this.resize());
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    init() {
        this.dustParticles = [];
        this.bokehOrbs = [];

        // 1. Warm Golden Bokeh Orbs (Đốm sáng bokeh ống kính ấm áp)
        const bokehCount = Math.floor(Math.min(window.innerWidth / 40, 25));
        for (let i = 0; i < bokehCount; i++) {
            this.bokehOrbs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 60 + 25,
                color: Math.random() > 0.5 ? 'rgba(232, 170, 66, ' : 'rgba(212, 122, 60, ',
                alpha: Math.random() * 0.12 + 0.04,
                targetAlpha: Math.random() * 0.15 + 0.05,
                speedX: (Math.random() - 0.5) * 0.25,
                speedY: (Math.random() - 0.5) * 0.25,
                pulseSpeed: Math.random() * 0.015 + 0.005
            });
        }

        // 2. Analog Film Dust & Embers (Hạt bụi phim và tàn sáng hoài niệm)
        const dustCount = Math.floor(Math.min(window.innerWidth / 15, 60));
        for (let i = 0; i < dustCount; i++) {
            this.dustParticles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2.2 + 0.6,
                speedY: -(Math.random() * 0.45 + 0.15), // Lơ lửng nhẹ nhàng bay lên
                speedX: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.7 + 0.2,
                color: Math.random() > 0.3 ? '#ffd59e' : '#fcedd8',
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.03 + 0.01
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Vẽ Bokeh ánh sáng ấm
        for (let orb of this.bokehOrbs) {
            orb.x += orb.speedX;
            orb.y += orb.speedY;
            if (orb.x < -orb.radius) orb.x = this.width + orb.radius;
            if (orb.x > this.width + orb.radius) orb.x = -orb.radius;
            if (orb.y < -orb.radius) orb.y = this.height + orb.radius;
            if (orb.y > this.height + orb.radius) orb.y = -orb.radius;

            orb.alpha += Math.sin(Date.now() * orb.pulseSpeed) * 0.002;
            const currentAlpha = Math.max(0.02, Math.min(0.2, orb.alpha));

            const grad = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.radius
            );
            grad.addColorStop(0, `${orb.color}${currentAlpha})`);
            grad.addColorStop(0.7, `${orb.color}${currentAlpha * 0.4})`);
            grad.addColorStop(1, `${orb.color}0)`);

            this.ctx.beginPath();
            this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = grad;
            this.ctx.fill();
        }

        // 2. Vẽ Hạt bụi phim Analog
        for (let p of this.dustParticles) {
            p.y += p.speedY;
            p.wobble += p.wobbleSpeed;
            p.x += Math.sin(p.wobble) * 0.4 + p.speedX;

            if (p.y < -10) {
                p.y = this.height + 10;
                p.x = Math.random() * this.width;
            }
            if (p.x < -10) p.x = this.width + 10;
            if (p.x > this.width + 10) p.x = -10;

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = '#e8aa42';
            this.ctx.shadowBlur = p.size > 1.8 ? 6 : 2;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        requestAnimationFrame(this.animate);
    }
}
