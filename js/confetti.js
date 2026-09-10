// =================================================================
// 🎞️ VINTAGE GOLDEN SPARKS & FILM CELEBRATION
// =================================================================

class FireworksController {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    // Pháo hoa đơn lẻ
    launchFirework(x = null, y = null) {
        this.burstConfetti(x, y, 60);
    }

    // Bắn hạt pháo kim tuyến màu vàng kim / hổ phách / đồng vintage
    burstConfetti(originX = null, originY = null, count = 75) {
        const x = originX !== null ? originX : this.width / 2;
        const y = originY !== null ? originY : this.height / 2;

        const vintageColors = ['#f39c12', '#e8aa42', '#d4af37', '#f1c40f', '#fdf8f0', '#c2593f', '#e67e22'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 8 + 3;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 2.5,
                color: vintageColors[Math.floor(Math.random() * vintageColors.length)],
                size: Math.random() * 5 + 3,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2,
                gravity: 0.18,
                friction: 0.98,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.01,
                shape: Math.random() > 0.4 ? 'rect' : 'circle'
            });
        }
    }

    // Chuỗi pháo kim tuyến chúc mừng
    celebrateSequence(duration = 3000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            if (Date.now() - startTime > duration) {
                clearInterval(interval);
                return;
            }
            const randX = Math.random() * (this.width * 0.8) + this.width * 0.1;
            const randY = Math.random() * (this.height * 0.4) + this.height * 0.2;
            this.burstConfetti(randX, randY, 40);
        }, 350);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            p.alpha -= p.decay;

            if (p.alpha <= 0 || p.y > this.height + 20) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = '#e8aa42';
            this.ctx.shadowBlur = 4;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        requestAnimationFrame(this.animate);
    }
}
