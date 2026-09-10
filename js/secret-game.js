// =================================================================
// 🎞️ VINTAGE QUEST CONTROLLER: CHUỖI 3 THỬ THÁCH MINIGAMES
// Stage 1: Hứng Quà (Canvas Catcher)
// Stage 2: Tìm Bông Hoa Đẹp Nhất & Album Ảnh
// Stage 3: Thổi Nến Bánh Kem Sinh Nhật
// =================================================================

class VintageQuestController {
    constructor() {
        this.currentStage = 1;

        // Stage 1 Catcher vars
        this.catcherCanvas = null;
        this.catcherCtx = null;
        this.catcherAnimId = null;
        this.catcherScore = 0;
        this.targetScore = (CONFIG.catcherGame && CONFIG.catcherGame.targetScore) || 10;
        this.basket = { x: 200, y: 245, width: 70, height: 40 };
        this.fallingItems = [];
        this.itemDropTimer = 0;
        this.isCatcherRunning = false;

        // Stage 2 Flower vars
        this.flowerAttempts = 0;
        this.currentPhotoIdx = 0;
        this.isFlowerRevealed = false;

        // Stage 3 Candle vars
        this.isCandleBlown = false;

        this.init();
    }

    init() {
        this.initCatcher();
        this.renderFlowerCards();
        this.initFlowerGallery();
        this.initCandleBlow();
    }

    // =============================================================
    // 0. CẬP NHẬT TRẠNG THÁI PHONG ẤN / TIẾN TRÌNH
    // =============================================================
    updateSealStatus(sealIndex, status) {
        const seal = document.getElementById(`seal-${sealIndex}`);
        if (!seal) return;

        if (status === 'active') {
            seal.classList.add('active');
            seal.classList.remove('unlocked');
        } else if (status === 'unlocked') {
            seal.classList.remove('active');
            seal.classList.add('unlocked');
            const labels = ['1: Đã Xong', '2: Đã Xong', '3: Đã Xong'];
            seal.innerHTML = `<span class="seal-icon">🔓</span> ${labels[sealIndex - 1]}`;
        }
    }

    // =============================================================
    // 1. THỬ THÁCH 1: GAME HỨNG QUÀ SINH NHẬT (CANVAS CATCHER)
    // =============================================================
    initCatcher() {
        this.catcherCanvas = document.getElementById('catcher-canvas');
        if (!this.catcherCanvas) return;

        this.catcherCtx = this.catcherCanvas.getContext('2d');
        const canvas = this.catcherCanvas;

        const moveBasket = (clientX) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const mouseX = (clientX - rect.left) * scaleX;
            this.basket.x = Math.max(0, Math.min(canvas.width - this.basket.width, mouseX - this.basket.width / 2));
        };

        canvas.addEventListener('mousemove', (e) => moveBasket(e.clientX));
        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                moveBasket(e.touches[0].clientX);
            }
            e.preventDefault();
        }, { passive: false });

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                moveBasket(e.touches[0].clientX);
            }
        }, { passive: false });

        this.updateCatcherScore();
    }

    startCatcherGame() {
        if (!this.catcherCanvas) return;
        this.catcherScore = 0;
        this.fallingItems = [];
        this.itemDropTimer = 0;
        this.isCatcherRunning = true;
        this.updateCatcherScore();
        this.updateSealStatus(1, 'active');

        if (this.catcherAnimId) cancelAnimationFrame(this.catcherAnimId);
        this.runCatcherLoop();
    }

    updateCatcherScore() {
        const scoreEl = document.getElementById('catcher-score-num');
        if (scoreEl) {
            scoreEl.textContent = `${this.catcherScore} / ${this.targetScore}`;
        }
    }

    runCatcherLoop() {
        if (!this.isCatcherRunning || !this.catcherCtx) return;
        const ctx = this.catcherCtx;
        const canvas = this.catcherCanvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sinh vật phẩm rơi đều đặn
        this.itemDropTimer++;
        if (this.itemDropTimer % 32 === 0 && this.catcherScore < this.targetScore) {
            const emojis = ['🎁', '💖', '🎂', '⭐', '💎', '🌸', '🍬', '✨'];
            this.fallingItems.push({
                x: Math.random() * (canvas.width - 50) + 25,
                y: -25,
                speed: Math.random() * 2 + 2.2,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                size: 28,
                rotation: (Math.random() - 0.5) * 0.4
            });
        }

        // Vẽ giỏ hứng phong cách Vintage Arcade
        ctx.save();
        ctx.font = '38px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🧺', this.basket.x + this.basket.width / 2, this.basket.y + 18);
        ctx.restore();

        // Vẽ và kiểm tra va chạm
        for (let i = this.fallingItems.length - 1; i >= 0; i--) {
            const item = this.fallingItems[i];
            item.y += item.speed;

            ctx.save();
            ctx.font = `${item.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.emoji, item.x, item.y);
            ctx.restore();

            // Kiểm tra va chạm với miệng giỏ
            if (
                item.y >= this.basket.y - 10 &&
                item.y <= this.basket.y + this.basket.height &&
                item.x >= this.basket.x - 12 &&
                item.x <= this.basket.x + this.basket.width + 12
            ) {
                this.catcherScore++;
                this.updateCatcherScore();

                if (window.birthdaySound) window.birthdaySound.playPop();
                if (window.fireworks) {
                    window.fireworks.burstConfetti(item.x, item.y, 15);
                }

                this.fallingItems.splice(i, 1);

                // Hoàn thành Thử thách 1 -> Chuyển sang Thử thách 2
                if (this.catcherScore >= this.targetScore) {
                    this.isCatcherRunning = false;
                    cancelAnimationFrame(this.catcherAnimId);

                    this.updateSealStatus(1, 'unlocked');
                    if (window.birthdaySound) window.birthdaySound.playMagicChime();
                    if (window.fireworks) {
                        window.fireworks.burstConfetti();
                        window.fireworks.celebrateSequence(2200);
                    }

                    setTimeout(() => {
                        this.advanceToStage2();
                    }, 1000);
                    return;
                }
                continue;
            }

            // Xóa item khi rơi khỏi màn hình
            if (item.y > canvas.height + 30) {
                this.fallingItems.splice(i, 1);
            }
        }

        this.catcherAnimId = requestAnimationFrame(() => this.runCatcherLoop());
    }

    advanceToStage2() {
        const stage1 = document.getElementById('stage-catcher');
        const stage2 = document.getElementById('stage-flower');

        if (stage1) stage1.style.display = 'none';
        if (stage2) {
            stage2.style.display = 'flex';
            stage2.scrollIntoView({ behavior: 'smooth' });
        }
        this.updateSealStatus(2, 'active');
    }

    // =============================================================
    // 2. THỬ THÁCH 2: TRÒ CHƠI TÌM BÔNG HOA ĐẸP NHẤT & ALBUM ẢNH
    // =============================================================
    renderFlowerCards() {
        const grid = document.getElementById('flower-cards-grid');
        if (!grid || !CONFIG.flowerGame || !CONFIG.flowerGame.flowers) return;

        grid.innerHTML = '';
        CONFIG.flowerGame.flowers.forEach((flower) => {
            const card = document.createElement('div');
            card.className = 'flower-card';
            card.setAttribute('data-id', flower.id);
            card.innerHTML = `
                <div class="flower-icon">${flower.icon}</div>
                <div class="flower-info">
                    <h4 class="flower-name">${flower.name}</h4>
                    <p class="flower-desc">${flower.desc}</p>
                </div>
                <div class="flower-select-tag">${CONFIG.flowerGame.selectTag || 'CHỌN'}</div>
            `;

            card.addEventListener('click', (e) => this.handleFlowerClick(card, flower, e));
            grid.appendChild(card);
        });
    }

    handleFlowerClick(card, flower, event) {
        if (this.isFlowerRevealed) return;

        this.flowerAttempts++;
        if (window.birthdaySound) window.birthdaySound.playMechanicalClick();

        // Hiệu ứng rung thẻ
        card.classList.add('picked-shake');
        setTimeout(() => card.classList.remove('picked-shake'), 450);

        // Bắn hiệu ứng hoa rơi
        this.spawnFlowerBurst(event ? event.clientX : null, event ? event.clientY : null);

        // Cập nhật số lượt chọn
        const attemptsNum = document.getElementById('flower-attempts-num');
        if (attemptsNum) {
            attemptsNum.textContent = `${Math.min(3, this.flowerAttempts)} / 3`;
        }

        // Hiện thông báo phản hồi
        const feedbackBox = document.getElementById('flower-feedback-box');
        const failMsgs = (CONFIG.flowerGame && CONFIG.flowerGame.failMessages) || [
            "Hoa này rất đẹp, nhưng vẫn chưa phải đáp án chính xác đâu nha. Thử lại xem sao.",
            "Vẫn chưa chính xác nè. Bông hoa đẹp nhất không nằm trong số này đâu. Bạn chọn tiếp thử đi.",
            "Vẫn chưa đúng rồi. Thật ra không có loài hoa tự nhiên nào ở đây là đẹp nhất cả..."
        ];

        const currentMsg = failMsgs[Math.min(this.flowerAttempts - 1, failMsgs.length - 1)];
        if (feedbackBox) {
            feedbackBox.textContent = currentMsg;
            feedbackBox.style.display = 'block';
            feedbackBox.classList.remove('feedback-anim');
            void feedbackBox.offsetWidth;
            feedbackBox.classList.add('feedback-anim');
        }

        // Sau 3 lần chọn -> Mở màn bật mí bí mật
        if (this.flowerAttempts >= 3) {
            this.isFlowerRevealed = true;
            setTimeout(() => {
                this.revealFlowerConclusion();
            }, 1200);
        }
    }

    revealFlowerConclusion() {
        const grid = document.getElementById('flower-cards-grid');
        const feedbackBox = document.getElementById('flower-feedback-box');
        const conclusionCard = document.getElementById('flower-conclusion-card');
        const title = document.getElementById('flower-game-title');
        const subtitle = document.getElementById('flower-game-subtitle');
        const attemptsNum = document.getElementById('flower-attempts-num');

        const conclusionCfg = CONFIG.flowerGame && CONFIG.flowerGame.conclusion;
        const conclusionTitle = document.getElementById('conclusion-title');
        const conclusionSub = document.getElementById('conclusion-subtitle');
        const conclusionMsg = document.getElementById('conclusion-message');
        const conclusionBadge = document.querySelector('.conclusion-crown-badge');
        const toCandleBtn = document.getElementById('btn-to-candle-stage');

        if (grid) grid.style.display = 'none';
        if (feedbackBox) feedbackBox.style.display = 'none';
        if (title) title.textContent = (conclusionCfg && conclusionCfg.badge) || "BẬT MÍ BÍ MẬT";
        if (subtitle) subtitle.textContent = "Điều tuyệt vời nhất không nằm ở bất kỳ loài hoa nào ngoài kia...";
        if (attemptsNum) attemptsNum.textContent = "3 / 3";

        if (conclusionCfg) {
            if (conclusionTitle && conclusionCfg.title) conclusionTitle.textContent = conclusionCfg.title;
            if (conclusionSub && conclusionCfg.subtitle) conclusionSub.textContent = conclusionCfg.subtitle;
            if (conclusionMsg && conclusionCfg.message) conclusionMsg.textContent = conclusionCfg.message;
            if (conclusionBadge && conclusionCfg.badge) conclusionBadge.textContent = conclusionCfg.badge;
            if (toCandleBtn && conclusionCfg.btnText) {
                const btnSpan = toCandleBtn.querySelector('span');
                if (btnSpan) btnSpan.textContent = conclusionCfg.btnText;
            }
        }

        this.updateSealStatus(2, 'unlocked');

        if (conclusionCard) {
            conclusionCard.style.display = 'flex';
            conclusionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (window.birthdaySound) window.birthdaySound.playMagicChime();
        if (window.fireworks) {
            window.fireworks.burstConfetti();
            window.fireworks.celebrateSequence(3500);
        }
        this.spawnFlowerShower(50);

        this.renderGalleryPhoto(0);
    }

    initFlowerGallery() {
        const prevBtn = document.getElementById('btn-flower-prev');
        const nextBtn = document.getElementById('btn-flower-next');
        const dotsContainer = document.getElementById('flower-photo-dots');
        const thumbsContainer = document.getElementById('flower-thumbnails');

        const images = (CONFIG.flowerGame && CONFIG.flowerGame.conclusion && CONFIG.flowerGame.conclusion.images) || [
            "images/anh11.png", "images/anh12.png", "images/anh13.png", "images/anh14.png",
            "images/anh15.png", "images/anh16.png", "images/anh17.png", "images/anh18.png"
        ];

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            images.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.className = `film-dot ${idx === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    if (window.birthdaySound) window.birthdaySound.playCameraShutter();
                    this.renderGalleryPhoto(idx);
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (thumbsContainer) {
            thumbsContainer.innerHTML = '';
            images.forEach((imgSrc, idx) => {
                const thumb = document.createElement('img');
                thumb.className = `flower-thumb-item ${idx === 0 ? 'active' : ''}`;
                thumb.src = imgSrc;
                thumb.alt = `Ảnh ${idx + 1}`;
                thumb.onerror = () => {
                    if (thumb.src.endsWith('.png')) {
                        thumb.src = thumb.src.replace('.png', '.jpg');
                    } else if (thumb.src.endsWith('.jpg')) {
                        thumb.src = thumb.src.replace('.jpg', '.jpeg');
                    }
                };
                thumb.addEventListener('click', () => {
                    if (window.birthdaySound) window.birthdaySound.playCameraShutter();
                    this.renderGalleryPhoto(idx);
                });
                thumbsContainer.appendChild(thumb);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playCameraShutter();
                const newIdx = (this.currentPhotoIdx - 1 + images.length) % images.length;
                this.renderGalleryPhoto(newIdx);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playCameraShutter();
                const newIdx = (this.currentPhotoIdx + 1) % images.length;
                this.renderGalleryPhoto(newIdx);
            });
        }
    }

    renderGalleryPhoto(idx) {
        const images = (CONFIG.flowerGame && CONFIG.flowerGame.conclusion && CONFIG.flowerGame.conclusion.images) || [];
        if (!images[idx]) return;

        this.currentPhotoIdx = idx;
        const imgEl = document.getElementById('flower-current-img');
        const counterEl = document.getElementById('gallery-photo-idx');
        const dots = document.querySelectorAll('#flower-photo-dots .film-dot');
        const thumbs = document.querySelectorAll('.flower-thumb-item');

        if (counterEl) {
            counterEl.textContent = `BỨC ẢNH 0${idx + 1}`;
        }

        if (imgEl) {
            imgEl.style.opacity = '0.3';
            imgEl.onerror = () => {
                const src = imgEl.getAttribute('src');
                if (src && src.endsWith('.png')) {
                    imgEl.src = src.replace('.png', '.jpg');
                } else if (src && src.endsWith('.jpg')) {
                    imgEl.src = src.replace('.jpg', '.jpeg');
                }
            };
            setTimeout(() => {
                imgEl.src = images[idx];
                imgEl.style.opacity = '1';
            }, 100);
        }

        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
    }

    // =============================================================
    // 3. THỬ THÁCH 3: BÁNH KEM & THỔI NẾN ƯỚC NGUYỆN
    // =============================================================
    initCandleBlow() {
        const toCandleBtn = document.getElementById('btn-to-candle-stage');
        const stageFlower = document.getElementById('stage-flower');
        const stageCandle = document.getElementById('stage-candle');
        const candleWrapper = document.getElementById('vintage-candle-wrapper');
        const flame = document.getElementById('vintage-candle-flame');
        const cakeCfg = CONFIG.cakeGame;

        if (stageCandle && cakeCfg) {
            const cakeBadge = stageCandle.querySelector('.flower-badge');
            const cakeHeading = stageCandle.querySelector('.vintage-heading');
            const cakeSub = stageCandle.querySelector('.vintage-sub');
            const blowHintEl = document.getElementById('vintage-blow-hint');

            if (cakeBadge && cakeCfg.badge) cakeBadge.textContent = cakeCfg.badge;
            if (cakeHeading && cakeCfg.title) cakeHeading.textContent = cakeCfg.title;
            if (cakeSub && cakeCfg.hint) cakeSub.textContent = cakeCfg.hint;
            if (blowHintEl && cakeCfg.blowHint) blowHintEl.textContent = cakeCfg.blowHint;
        }

        if (toCandleBtn) {
            toCandleBtn.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playMagicChime();
                if (stageFlower) stageFlower.style.display = 'none';
                if (stageCandle) {
                    stageCandle.style.display = 'flex';
                    stageCandle.scrollIntoView({ behavior: 'smooth' });
                }
                this.updateSealStatus(3, 'active');
                if (window.fireworks) window.fireworks.launchFirework();
            });
        }

        if (candleWrapper) {
            candleWrapper.addEventListener('click', () => {
                if (this.isCandleBlown) return;
                this.isCandleBlown = true;

                if (flame) flame.classList.add('extinguished');

                // Tạo khói nến
                const smoke = document.createElement('div');
                smoke.className = 'candle-smoke-fx';
                candleWrapper.appendChild(smoke);

                this.updateSealStatus(3, 'unlocked');

                if (window.birthdaySound) window.birthdaySound.playMagicChime();
                if (window.fireworks) {
                    window.fireworks.burstConfetti();
                    window.fireworks.celebrateSequence(3000);
                }

                const blowHint = document.getElementById('vintage-blow-hint');
                const successMsg = (cakeCfg && cakeCfg.blownSuccessHint) || "Điều ước đã được gửi đi. Đang mở bức thư...";
                if (blowHint) blowHint.textContent = successMsg;

                setTimeout(() => {
                    if (window.mainController) {
                        window.mainController.showScreen('screen-letter');
                        window.mainController.typewriterLetter();
                    }
                }, 2200);
            });
        }
    }

    // =============================================================
    // HIỆU ỨNG ÁNH SAO LẤP LÁNH
    // =============================================================
    spawnFlowerBurst(x, y) {
        const icons = ['✦', '✧', '⋆', '•', '✨'];
        const originX = x || window.innerWidth / 2;
        const originY = y || window.innerHeight / 2;

        for (let i = 0; i < 10; i++) {
            const p = document.createElement('div');
            p.className = 'floating-flower-particle';
            p.textContent = icons[Math.floor(Math.random() * icons.length)];
            p.style.left = `${originX}px`;
            p.style.top = `${originY}px`;

            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 100;
            p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1200);
        }
    }

    spawnFlowerShower(count = 30) {
        const icons = ['✦', '✧', '⋆', '•'];
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.className = 'shower-flower-item';
                p.textContent = icons[Math.floor(Math.random() * icons.length)];
                p.style.left = `${Math.random() * 100}vw`;
                p.style.top = `-30px`;
                p.style.animationDuration = `${3 + Math.random() * 3}s`;
                p.style.fontSize = `${16 + Math.random() * 20}px`;

                document.body.appendChild(p);
                setTimeout(() => p.remove(), 6000);
            }, i * 60);
        }
    }
}

// Khởi tạo toàn cục
window.VintageQuestController = VintageQuestController;
window.FlowerGameController = VintageQuestController;
