// Hiệu ứng Pháo hoa & Hoa giấy (Fireworks & Confetti Burst)
class FireworksController {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.confetti = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    // Bắn pháo hoa nở bung
    launchFirework(x = null, y = null) {
        const startX = x !== null ? x : Math.random() * this.width * 0.8 + this.width * 0.1;
        const targetY = y !== null ? y : Math.random() * this.height * 0.4 + this.height * 0.1;
        const colors = ['#ff4d6d', '#ffd166', '#06d6a0', '#118ab2', '#ff70a6', '#ff9770', '#e0aaff', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const count = 40;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = Math.random() * 5 + 2;
            this.fireworks.push({
                x: startX,
                y: targetY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.01,
                color: color,
                radius: Math.random() * 2.5 + 1.5
            });
        }
    }

    // Nổ hoa giấy confetti từ 2 góc hoặc trung tâm
    burstConfetti(originX = null, originY = null) {
        const ox = originX !== null ? originX : this.width / 2;
        const oy = originY !== null ? originY : this.height / 2;
        const colors = ['#ff007f', '#ffb703', '#fb8500', '#219ebc', '#8ecae6', '#ff0054', '#70e000', '#ffd60a'];

        for (let i = 0; i < 70; i++) {
            this.confetti.push({
                x: ox,
                y: oy,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.8) * 16,
                size: Math.random() * 8 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                alpha: 1,
                gravity: 0.25,
                decay: Math.random() * 0.008 + 0.005
            });
        }
    }

    // Bắn chuỗi pháo hoa chúc mừng liên tiếp
    celebrateSequence(durationMs = 4000) {
        const interval = setInterval(() => {
            this.launchFirework();
            if (Math.random() > 0.5) {
                this.burstConfetti(Math.random() * this.width, Math.random() * this.height * 0.5);
            }
        }, 300);

        setTimeout(() => clearInterval(interval), durationMs);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Render Fireworks
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            let f = this.fireworks[i];
            f.x += f.vx;
            f.y += f.vy;
            f.vy += 0.05; // trọng lực nhẹ
            f.vx *= 0.98;
            f.vy *= 0.98;
            f.alpha -= f.decay;

            if (f.alpha <= 0) {
                this.fireworks.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = f.alpha;
            this.ctx.fillStyle = f.color;
            this.ctx.shadowColor = f.color;
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        // Render Confetti
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            let c = this.confetti[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += c.gravity;
            c.vx *= 0.99;
            c.rotation += c.rotSpeed;
            c.alpha -= c.decay;

            if (c.alpha <= 0 || c.y > this.height) {
                this.confetti.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = c.alpha;
            this.ctx.translate(c.x, c.y);
            this.ctx.rotate((c.rotation * Math.PI) / 180);
            this.ctx.fillStyle = c.color;
            this.ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
            this.ctx.restore();
        }

        requestAnimationFrame(this.animate);
    }
}
