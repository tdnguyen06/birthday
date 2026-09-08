// Hiệu ứng Canvas: Tim bay lơ lửng & Sao lấp lánh (Floating Hearts & Stars)
class BackgroundEffects {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.stars = [];
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
        this.particles = [];
        this.stars = [];

        // Tạo các ngôi sao lấp lánh nền
        for (let i = 0; i < 70; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.02 + 0.005
            });
        }

        // Tạo các hạt trái tim & cánh hoa bay
        for (let i = 0; i < 35; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle(y = null) {
        const colors = ['#ff758c', '#ff7eb3', '#ff4d6d', '#ff85a1', '#f72585', '#ffd166'];
        const flowerEmojis = ['🌸', '🌺', '🌹', '🌷', '🌼', '💐', '✨'];
        const isEmoji = Math.random() < 0.45; // 45% là các bông hoa lơ lửng

        return {
            x: Math.random() * this.width,
            y: y !== null ? y : Math.random() * this.height,
            size: isEmoji ? Math.random() * 12 + 14 : Math.random() * 14 + 10,
            speedY: Math.random() * 0.9 + 0.4,
            speedX: (Math.random() - 0.5) * 0.7,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.6 + 0.35,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.025,
            isEmoji: isEmoji,
            emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)]
        };
    }

    drawHeart(ctx, x, y, size, color, alpha, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        
        // Cánh trái tim
        ctx.bezierCurveTo(
            0, 0, 
            -size / 2, 0, 
            -size / 2, topCurveHeight
        );
        ctx.bezierCurveTo(
            -size / 2, (size + topCurveHeight) / 2, 
            0, size, 
            0, size * 1.2
        );
        ctx.bezierCurveTo(
            0, size, 
            size / 2, (size + topCurveHeight) / 2, 
            size / 2, topCurveHeight
        );
        ctx.bezierCurveTo(
            size / 2, 0, 
            0, 0, 
            0, topCurveHeight
        );
        
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Vẽ sao
        for (let star of this.stars) {
            star.alpha += star.speed;
            if (star.alpha > 0.9 || star.alpha < 0.2) star.speed = -star.speed;
            this.ctx.save();
            this.ctx.globalAlpha = star.alpha;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        // Vẽ và cập nhật tim & hoa
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.y -= p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotSpeed;

            if (p.y < -30 || p.x < -30 || p.x > this.width + 30) {
                this.particles[i] = this.createParticle(this.height + 20);
            }

            if (p.isEmoji) {
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation);
                this.ctx.globalAlpha = p.alpha;
                this.ctx.font = `${p.size}px sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(p.emoji, 0, 0);
                this.ctx.restore();
            } else {
                this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
            }
        }

        requestAnimationFrame(this.animate);
    }
}
