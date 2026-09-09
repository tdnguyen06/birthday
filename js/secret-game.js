// =================================================================
// 🌸 SECRET GAME: TÌM BÔNG HOA ĐẸP NHẤT & ALBUM ẢNH ANH11 - ANH18
// =================================================================

class FlowerGameController {
    constructor() {
        this.attempts = 0;
        this.currentPhotoIdx = 0;
        this.isRevealed = false;
        this.isCandleBlown = false;

        this.init();
    }

    init() {
        this.renderFlowerCards();
        this.initFlowerGallery();
        this.initCandleBlow();
    }

    // =============================================================
    // 1. RENDER 12 THẺ BÔNG HOA
    // =============================================================
    renderFlowerCards() {
        const grid = document.getElementById('flower-cards-grid');
        if (!grid || !CONFIG.flowerGame || !CONFIG.flowerGame.flowers) return;

        grid.innerHTML = '';
        CONFIG.flowerGame.flowers.forEach((flower, idx) => {
            const card = document.createElement('div');
            card.className = 'flower-card';
            card.setAttribute('data-id', flower.id);
            card.innerHTML = `
                <div class="flower-icon">${flower.icon}</div>
                <div class="flower-info">
                    <h4 class="flower-name">${flower.name}</h4>
                    <p class="flower-desc">${flower.desc}</p>
                </div>
                <div class="flower-select-tag">CHỌN</div>
            `;

            card.addEventListener('click', (e) => this.handleFlowerClick(card, flower, e));
            grid.appendChild(card);
        });
    }

    handleFlowerClick(card, flower, event) {
        if (this.isRevealed) return;

        this.attempts++;
        if (window.birthdaySound) window.birthdaySound.playMechanicalClick();

        // Hiệu ứng rung thẻ
        card.classList.add('picked-shake');
        setTimeout(() => card.classList.remove('picked-shake'), 450);

        // Bắn hoa rơi tại vị trí click
        this.spawnFlowerBurst(event.clientX, event.clientY);

        // Cập nhật số lượt chọn
        const attemptsNum = document.getElementById('flower-attempts-num');
        if (attemptsNum) {
            attemptsNum.textContent = `${Math.min(3, this.attempts)} / 3`;
        }

        // Hiện thông báo phản hồi
        const feedbackBox = document.getElementById('flower-feedback-box');
        const failMsgs = (CONFIG.flowerGame && CONFIG.flowerGame.failMessages) || [
            "Hoa này rất đẹp, nhưng vẫn chưa phải đáp án chính xác đâu nha. Thử lại xem sao.",
            "Vẫn chưa chính xác nè. Bông hoa đẹp nhất không nằm trong số này đâu. Bạn chọn tiếp thử đi.",
            "Vẫn chưa đúng rồi. Thật ra không có loài hoa tự nhiên nào ở đây là đẹp nhất cả..."
        ];

        const currentMsg = failMsgs[Math.min(this.attempts - 1, failMsgs.length - 1)];
        if (feedbackBox) {
            feedbackBox.textContent = currentMsg;
            feedbackBox.style.display = 'block';
            feedbackBox.classList.remove('feedback-anim');
            void feedbackBox.offsetWidth; // Reflow
            feedbackBox.classList.add('feedback-anim');
        }

        // Sau 3 lần chọn -> Kích hoạt bí mật bất ngờ!
        if (this.attempts >= 3) {
            this.isRevealed = true;
            setTimeout(() => {
                this.revealFlowerConclusion();
            }, 1200);
        }
    }

    // =============================================================
    // 2. MÀN BẬT MÍ: BẠN MỚI CHÍNH LÀ BÔNG HOA ĐẸP NHẤT
    // =============================================================
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

        if (conclusionCard) {
            conclusionCard.style.display = 'flex';
            conclusionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Bùng nổ hiệu ứng ăn mừng
        if (window.birthdaySound) window.birthdaySound.playMagicChime();
        if (window.fireworks) {
            window.fireworks.burstConfetti();
            window.fireworks.celebrateSequence(3500);
        }
        this.spawnFlowerShower(50);

        // Hiển thị ảnh đầu tiên của album
        this.renderGalleryPhoto(0);
    }

    // =============================================================
    // 3. ALBUM BỘ ẢNH TỪ ANH11 -> ANH18
    // =============================================================
    initFlowerGallery() {
        const prevBtn = document.getElementById('btn-flower-prev');
        const nextBtn = document.getElementById('btn-flower-next');
        const dotsContainer = document.getElementById('flower-photo-dots');
        const thumbsContainer = document.getElementById('flower-thumbnails');

        const images = (CONFIG.flowerGame && CONFIG.flowerGame.conclusion && CONFIG.flowerGame.conclusion.images) || [
            "images/anh11.png", "images/anh12.png", "images/anh13.png", "images/anh14.png",
            "images/anh15.png", "images/anh16.png", "images/anh17.png", "images/anh18.png"
        ];

        // Tạo dots
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

        // Tạo thumbnails
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
                } else if (src && src.endsWith('.jpeg')) {
                    imgEl.src = src.replace('.jpeg', '.jfif');
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
    // 4. THỔI NẾN BÁNH KEM & CHUYỂN SANG BỨC THƯ
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
                    stageCandle.style.display = 'block';
                    stageCandle.scrollIntoView({ behavior: 'smooth' });
                }
                if (window.fireworks) window.fireworks.launchFirework();
            });
        }

        if (candleWrapper) {
            candleWrapper.addEventListener('click', () => {
                if (this.isCandleBlown) return;
                this.isCandleBlown = true;

                if (flame) flame.classList.add('extinguished');

                // Tạo khói
                const smoke = document.createElement('div');
                smoke.className = 'candle-smoke-fx';
                candleWrapper.appendChild(smoke);

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

// Khởi tạo khi load
window.VintageQuestController = FlowerGameController;
window.FlowerGameController = FlowerGameController;
