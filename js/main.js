// =================================================================
// 💖 MAIN CONTROLLER (Happy Birthday Interactive Experience)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Khởi tạo Canvas Effects
    const bgEffects = new BackgroundEffects('bg-canvas');
    const fireworks = new FireworksController('fireworks-canvas');

    // 2. Audio Controller
    const bgAudio = document.getElementById('bg-audio');
    const musicBtn = document.getElementById('floating-music-btn');
    const diskIcon = document.getElementById('disk-icon');
    let isMusicPlaying = false;

    function startMusic() {
        if (isMusicPlaying) return;
        isMusicPlaying = true;
        if (diskIcon) diskIcon.classList.add('playing');

        // Thử phát qua thẻ Audio nếu tải được, nếu không thì chạy Web Audio Synth siêu chuẩn
        if (bgAudio && bgAudio.src && bgAudio.src.startsWith('http')) {
            bgAudio.play().catch(() => {
                if (window.birthdaySound) window.birthdaySound.startBirthdayMelody();
            });
        } else {
            if (window.birthdaySound) window.birthdaySound.startBirthdayMelody();
        }
    }

    function stopMusic() {
        isMusicPlaying = false;
        if (diskIcon) diskIcon.classList.remove('playing');
        if (bgAudio) bgAudio.pause();
        if (window.birthdaySound) window.birthdaySound.stopBirthdayMelody();
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }

    // Tự động bật nhạc ngay khi người dùng chạm hoặc click lần đầu vào trang
    document.addEventListener('pointerdown', () => {
        if (!isMusicPlaying) {
            startMusic();
        }
    }, { once: true });

    // 3. Screen Switcher
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // =================================================================
    // MÀN 1: MẬT KHẨU MỞ KHÓA (PASSWORD CHECK)
    // =================================================================
    const passInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('btn-unlock');
    const passCard = document.getElementById('lock-card');
    const hintText = document.getElementById('password-hint');

    function cleanString(str) {
        return str.trim().toLowerCase().replace(/[\s\-\/\.]/g, '');
    }

    function checkPassword() {
        const val = passInput.value.trim();
        if (!val) {
            triggerShake();
            return;
        }

        const cleanedInput = cleanString(val);
        const isCorrect = CONFIG.passwords.some(p => cleanString(p) === cleanedInput);

        if (isCorrect) {
            // Mở khóa thành công
            passInput.blur();
            if (window.birthdaySound) window.birthdaySound.playMagicChime();
            fireworks.burstConfetti();
            fireworks.celebrateSequence(2500);
            startMusic();

            setTimeout(() => {
                showScreen('screen-slideshow');
                renderSlide(0);
            }, 1000);
        } else {
            triggerShake();
        }
    }

    function triggerShake() {
        passCard.classList.remove('shake-animation');
        void passCard.offsetWidth; // trigger reflow
        passCard.classList.add('shake-animation');
    }

    if (unlockBtn) {
        unlockBtn.addEventListener('click', checkPassword);
    }
    if (passInput) {
        // Chỉ cho phép nhập số
        passInput.addEventListener('input', (e) => {
            passInput.value = passInput.value.replace(/[^0-9]/g, '');
        });
        passInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPassword();
        });
    }

    // =================================================================
    // MÀN 2: TRÌNH CHIẾU ALBUM ẢNH (SLIDESHOW)
    // =================================================================
    let currentSlide = 0;
    const polaroidImg = document.getElementById('polaroid-img');
    const polaroidCaption = document.getElementById('polaroid-caption');
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');
    const dotsContainer = document.getElementById('slide-dots');
    const toGamesBtn = document.getElementById('btn-to-games');

    // Tạo các dấu chấm tròn chỉ số slide
    if (dotsContainer && CONFIG.gallery) {
        dotsContainer.innerHTML = '';
        CONFIG.gallery.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => renderSlide(idx));
            dotsContainer.appendChild(dot);
        });
    }

    function renderSlide(index) {
        if (!CONFIG.gallery || CONFIG.gallery.length === 0) return;
        currentSlide = (index + CONFIG.gallery.length) % CONFIG.gallery.length;

        const data = CONFIG.gallery[currentSlide];
        if (polaroidImg) polaroidImg.src = data.src;
        if (polaroidCaption) polaroidCaption.textContent = data.caption;

        // Cập nhật dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    if (prevSlideBtn) prevSlideBtn.addEventListener('click', () => renderSlide(currentSlide - 1));
    if (nextSlideBtn) nextSlideBtn.addEventListener('click', () => renderSlide(currentSlide + 1));

    if (toGamesBtn) {
        toGamesBtn.addEventListener('click', () => {
            showScreen('screen-games');
            initCatcherGame();
        });
    }

    // =================================================================
    // MÀN 3: THỬ THÁCH MINIGAMES (3 GIAI ĐOẠN)
    // =================================================================
    const stage1Box = document.getElementById('stage-1');
    const stage2Box = document.getElementById('stage-2');
    const stage3Box = document.getElementById('stage-3');
    const seal1 = document.getElementById('seal-1');
    const seal2 = document.getElementById('seal-2');
    const seal3 = document.getElementById('seal-3');
    const scoreDisplay = document.getElementById('score-display');

    // -------------------------------------------------------------
    // GIAI ĐOẠN 1: GAME HỨNG QUÀ & TIM (CANVAS CATCHER)
    // -------------------------------------------------------------
    const catcherCanvas = document.getElementById('catcher-canvas');
    let catcherCtx = null;
    let catcherAnimId = null;
    let catcherScore = 0;
    const targetCatcherScore = (CONFIG.game1 && CONFIG.game1.targetScore) || 10;

    let basket = { x: 200, y: 235, width: 65, height: 35 };
    let fallingItems = [];
    let itemDropTimer = 0;

    function initCatcherGame() {
        if (!catcherCanvas) return;
        catcherCtx = catcherCanvas.getContext('2d');
        catcherScore = 0;
        fallingItems = [];
        updateCatcherScore();

        // Lắng nghe di chuyển chuột / vuốt ngón tay
        function moveBasket(clientX) {
            const rect = catcherCanvas.getBoundingClientRect();
            const scaleX = catcherCanvas.width / rect.width;
            const mouseX = (clientX - rect.left) * scaleX;
            basket.x = Math.max(0, Math.min(catcherCanvas.width - basket.width, mouseX - basket.width / 2));
        }

        catcherCanvas.addEventListener('mousemove', (e) => moveBasket(e.clientX));
        catcherCanvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                moveBasket(e.touches[0].clientX);
            }
            e.preventDefault();
        }, { passive: false });

        if (catcherAnimId) cancelAnimationFrame(catcherAnimId);
        runCatcherLoop();
    }

    function updateCatcherScore() {
        if (scoreDisplay) {
            scoreDisplay.textContent = `💖 Điểm: ${catcherScore}/${targetCatcherScore}`;
        }
    }

    function runCatcherLoop() {
        if (!catcherCtx) return;
        catcherCtx.clearRect(0, 0, catcherCanvas.width, catcherCanvas.height);

        // Sinh vật phẩm rơi
        itemDropTimer++;
        if (itemDropTimer % 35 === 0 && catcherScore < targetCatcherScore) {
            const emojis = ['💖', '🎁', '🎂', '⭐', '💎', '🌸', '🍬'];
            fallingItems.push({
                x: Math.random() * (catcherCanvas.width - 40) + 10,
                y: -20,
                speed: Math.random() * 2 + 2,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                size: 26
            });
        }

        // Vẽ giỏ quà
        catcherCtx.font = '36px sans-serif';
        catcherCtx.textAlign = 'center';
        catcherCtx.fillText('🧺', basket.x + basket.width / 2, basket.y + 25);

        // Vẽ và kiểm tra va chạm các vật phẩm
        for (let i = fallingItems.length - 1; i >= 0; i--) {
            let item = fallingItems[i];
            item.y += item.speed;

            // Vẽ emoji rơi
            catcherCtx.font = `${item.size}px sans-serif`;
            catcherCtx.fillText(item.emoji, item.x, item.y);

            // Kiểm tra va chạm với miệng giỏ
            if (
                item.y >= basket.y &&
                item.y <= basket.y + basket.height &&
                item.x >= basket.x - 10 &&
                item.x <= basket.x + basket.width + 10
            ) {
                // Hứng trúng!
                catcherScore++;
                updateCatcherScore();
                if (window.birthdaySound) window.birthdaySound.playPop();
                fireworks.burstConfetti(basket.x + 30, basket.y + 100);
                fallingItems.splice(i, 1);

                if (catcherScore >= targetCatcherScore) {
                    // Hoàn thành Thử thách 1
                    cancelAnimationFrame(catcherAnimId);
                    if (window.birthdaySound) window.birthdaySound.playMagicChime();
                    seal1.classList.add('unlocked');
                    seal1.innerHTML = `<span class="seal-icon">🔓</span> 1: Đã Xong`;
                    fireworks.launchFirework();

                    setTimeout(() => {
                        stage1Box.style.display = 'none';
                        stage2Box.style.display = 'flex';
                        initFlowerGame();
                    }, 800);
                    return;
                }
                continue;
            }

            // Xóa khi rơi quá màn hình
            if (item.y > catcherCanvas.height + 30) {
                fallingItems.splice(i, 1);
            }
        }

        catcherAnimId = requestAnimationFrame(runCatcherLoop);
    }

    // -------------------------------------------------------------
    // GIAI ĐOẠN 2: TRÒ CHƠI CHỌN BÔNG HOA ĐẸP NHẤT
    // (3 lần chọn đều sai -> Kết luận em mới là bông hoa đẹp nhất)
    // -------------------------------------------------------------
    let flowerAttempts = 0;
    const flowerProgressBadge = document.getElementById('flower-progress-badge');
    const flowerGameTitle = document.getElementById('flower-game-title');
    const flowerGameSubtitle = document.getElementById('flower-game-subtitle');
    const flowerFeedbackBox = document.getElementById('flower-feedback-box');
    const flowerCardsGrid = document.getElementById('flower-cards-grid');
    const flowerConclusionCard = document.getElementById('flower-conclusion-card');
    const conclusionTitle = document.getElementById('conclusion-title');
    const conclusionSubtitle = document.getElementById('conclusion-subtitle');
    const conclusionMessage = document.getElementById('conclusion-message');
    const conclusionLoverImg = document.getElementById('conclusion-lover-img');
    const btnToStage3 = document.getElementById('btn-to-stage-3');

    function initFlowerGame() {
        flowerAttempts = 0;
        if (flowerProgressBadge) flowerProgressBadge.textContent = `🌸 Lượt chọn: 0/3`;
        if (flowerFeedbackBox) {
            flowerFeedbackBox.style.display = 'none';
            flowerFeedbackBox.textContent = '';
        }
        if (flowerGameTitle) flowerGameTitle.style.display = 'block';
        if (flowerGameSubtitle) flowerGameSubtitle.style.display = 'block';
        if (flowerCardsGrid) flowerCardsGrid.style.display = 'grid';
        if (flowerConclusionCard) flowerConclusionCard.style.display = 'none';

        renderFlowerCards();
    }

    function renderFlowerCards() {
        if (!flowerCardsGrid) return;
        flowerCardsGrid.innerHTML = '';

        const gameConfig = CONFIG.flowerGame || {
            flowers: [
                { id: "rose", name: "Hoa Hồng Đỏ", icon: "🌹", desc: "Nữ hoàng quyến rũ kiêu sa" },
                { id: "sunflower", name: "Hoa Hướng Dương", icon: "🌻", desc: "Rạng rỡ hướng ánh mặt trời" },
                { id: "tulip", name: "Hoa Tulip", icon: "🌷", desc: "Ngọt ngào và thanh khiết" },
                { id: "sakura", name: "Hoa Anh Đào", icon: "🌸", desc: "Mộng mơ và dịu dàng" },
                { id: "lavender", name: "Hoa Oải Hương", icon: "💐", desc: "Nhẹ nhàng và thơm ngát" },
                { id: "peony", name: "Hoa Mẫu Đơn", icon: "🌺", desc: "Vương giả và đài các" }
            ]
        };

        gameConfig.flowers.forEach((flower) => {
            const card = document.createElement('div');
            card.className = 'flower-card';
            card.innerHTML = `
                <div class="flower-icon">${flower.icon}</div>
                <div class="flower-name">${flower.name}</div>
                <div class="flower-desc">${flower.desc}</div>
            `;

            card.addEventListener('click', (e) => handleFlowerPick(card, flower, e));
            flowerCardsGrid.appendChild(card);
        });
    }

    function spawnFlowerBurst(x, y) {
        const flowerIcons = ['🌸', '🌹', '🌺', '🌷', '🌻', '🌼', '💐', '💮', '✨', '💕'];
        for (let i = 0; i < 14; i++) {
            const flower = document.createElement('div');
            flower.className = 'flying-flower-emoji';
            flower.textContent = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];
            flower.style.left = `${x || window.innerWidth / 2}px`;
            flower.style.top = `${y || window.innerHeight / 2}px`;

            const kx = (Math.random() - 0.5) * 350;
            const ky = (Math.random() - 0.7) * 350;
            const kx2 = kx * 1.6;
            const ky2 = ky * 1.6;

            flower.style.setProperty('--kx', `${kx}px`);
            flower.style.setProperty('--ky', `${ky}px`);
            flower.style.setProperty('--kx2', `${kx2}px`);
            flower.style.setProperty('--ky2', `${ky2}px`);

            document.body.appendChild(flower);
            setTimeout(() => flower.remove(), 1800);
        }
    }

    function spawnFlowerShower(count = 35) {
        const flowerIcons = ['🌸', '🌹', '🌺', '🌷', '🌻', '🌼', '💐', '💮', '✨', '💖'];
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const petal = document.createElement('div');
                petal.className = 'falling-petal-emoji';
                petal.textContent = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];
                petal.style.left = `${Math.random() * 95}vw`;
                petal.style.top = `-30px`;
                petal.style.fontSize = `${Math.random() * 1.8 + 1.2}rem`;
                petal.style.animationDuration = `${Math.random() * 2.5 + 2.5}s`;
                document.body.appendChild(petal);
                setTimeout(() => petal.remove(), 5500);
            }, i * 90);
        }
    }

    function handleFlowerPick(cardElem, flowerData, event) {
        if (flowerAttempts >= 3) return;

        flowerAttempts++;
        if (flowerProgressBadge) {
            flowerProgressBadge.textContent = `🌸 Lượt chọn: ${flowerAttempts}/3`;
        }

        // Rung thẻ hoa khi chọn sai
        cardElem.classList.remove('flower-shake');
        void cardElem.offsetWidth;
        cardElem.classList.add('flower-shake');

        // Bắn chùm hoa bay lượn từ vị trí click
        const clickX = event ? (event.clientX || event.pageX) : window.innerWidth / 2;
        const clickY = event ? (event.clientY || event.pageY) : window.innerHeight / 2;
        spawnFlowerBurst(clickX, clickY);

        if (window.birthdaySound) window.birthdaySound.playPop();

        const failMsgs = (CONFIG.flowerGame && CONFIG.flowerGame.failMessages) || [
            "❌ Hoa này rất đẹp, nhưng vẫn chưa phải đáp án đúng đâu nha! Thử lại xem 🌹",
            "❌ Vẫn chưa chính xác nè! Bông hoa đẹp nhất không nằm trong số này đâu. Chọn tiếp thử đi 🌷",
            "❌ Vẫn chưa đúng rồi! Thật ra không có loài hoa tự nhiên nào là đẹp nhất cả..."
        ];

        const currentMsg = failMsgs[flowerAttempts - 1] || failMsgs[failMsgs.length - 1];

        if (flowerFeedbackBox) {
            flowerFeedbackBox.textContent = currentMsg;
            flowerFeedbackBox.style.display = 'block';
        }

        // Nếu đã thử đủ 3 lần sai -> Tung màn kết luận ngọt ngào
        if (flowerAttempts >= 3) {
            setTimeout(() => {
                revealFlowerConclusion();
            }, 1200);
        }
    }

    function revealFlowerConclusion() {
        // Ẩn lưới hoa & tiêu đề cũ
        if (flowerCardsGrid) flowerCardsGrid.style.display = 'none';
        if (flowerFeedbackBox) flowerFeedbackBox.style.display = 'none';
        if (flowerGameTitle) flowerGameTitle.style.display = 'none';
        if (flowerGameSubtitle) flowerGameSubtitle.style.display = 'none';
        if (flowerProgressBadge) flowerProgressBadge.textContent = `✨ Kết quả: Hoàn thành xuất sắc! ✨`;

        // Lấy thông tin kết luận
        const conclusionConfig = (CONFIG.flowerGame && CONFIG.flowerGame.conclusion) || {
            title: "🌸 VỚI ANH, EM MỚI LÀ BÔNG HOA ĐẸP NHẤT 🌸",
            subtitle: "Mỗi người một vẻ, nhưng em luôn là điều đặc biệt nhất ✨",
            message: "Hoa đẹp đến đâu rồi cũng có lúc tàn, nhưng nét duyên dáng, sự chân thành và nụ cười rạng rỡ của em luôn để lại ấn tượng đẹp nhất. Chúc em luôn tự tin, tỏa sáng và hạnh phúc theo cách của riêng mình nhé! 🌿✨",
            image: "images/max1.jpg"
        };

        if (conclusionTitle) conclusionTitle.textContent = conclusionConfig.title;
        if (conclusionSubtitle) conclusionSubtitle.textContent = conclusionConfig.subtitle;
        if (conclusionMessage) conclusionMessage.textContent = conclusionConfig.message;
        if (conclusionLoverImg) conclusionLoverImg.src = conclusionConfig.image || "images/max1.jpg";

        // Hiện thẻ kết luận
        if (flowerConclusionCard) flowerConclusionCard.style.display = 'flex';

        // Cơn mưa hoa rực rỡ khắp màn hình
        spawnFlowerShower(45);

        // Âm thanh và hiệu ứng ăn mừng bùng nổ
        if (window.birthdaySound) window.birthdaySound.playMagicChime();
        fireworks.burstConfetti();
        fireworks.celebrateSequence(3200);
    }

    if (btnToStage3) {
        btnToStage3.addEventListener('click', () => {
            if (window.birthdaySound) window.birthdaySound.playMagicChime();
            seal2.classList.add('unlocked');
            seal2.innerHTML = `<span class="seal-icon">🔓</span> 2: Đã Xong`;
            fireworks.launchFirework();

            setTimeout(() => {
                stage2Box.style.display = 'none';
                stage3Box.style.display = 'flex';
            }, 600);
        });
    }

    // -------------------------------------------------------------
    // GIAI ĐOẠN 3: BÁNH SINH NHẬT & THỔI NẾN
    // -------------------------------------------------------------
    const candle = document.getElementById('cake-candle');
    const flame = document.getElementById('candle-flame');
    let isBlown = false;

    if (candle) {
        candle.addEventListener('click', () => {
            if (isBlown) return;
            isBlown = true;
            if (flame) flame.classList.add('extinguished');

            // Tạo khói
            const smoke = document.createElement('div');
            smoke.className = 'smoke';
            candle.appendChild(smoke);

            // Âm thanh ăn mừng và pháo hoa đại tiệc
            if (window.birthdaySound) window.birthdaySound.playMagicChime();
            fireworks.burstConfetti();
            fireworks.celebrateSequence(3500);

            seal3.classList.add('unlocked');
            seal3.innerHTML = `<span class="seal-icon">🔓</span> 3: Đã Xong`;

            setTimeout(() => {
                showScreen('screen-letter');
                startTypewriterLetter();
            }, 2000);
        });
    }

    // =================================================================
    // MÀN 4: BỨC THƯ & NÚT THẢ TIM YÊU THƯƠNG
    // =================================================================
    const letterBody = document.getElementById('letter-body');
    const letterGreeting = document.getElementById('letter-greeting');
    const letterSignature = document.getElementById('letter-signature');
    const sendLoveBtn = document.getElementById('btn-send-love');
    const kissCountSpan = document.getElementById('kiss-count');
    const kissBadge = document.getElementById('kiss-counter-badge');
    let totalHearts = 0;

    function startTypewriterLetter() {
        if (!CONFIG.secretLetter) return;
        if (letterGreeting) letterGreeting.textContent = CONFIG.secretLetter.greeting;
        if (letterSignature) letterSignature.textContent = CONFIG.secretLetter.signature;
        if (!letterBody) return;

        letterBody.innerHTML = '';
        const paragraphs = CONFIG.secretLetter.paragraphs;
        let pIndex = 0;

        function typeParagraph() {
            if (pIndex >= paragraphs.length) {
                fireworks.launchFirework();
                return;
            }

            const pElem = document.createElement('p');
            letterBody.appendChild(pElem);
            const text = paragraphs[pIndex];
            let charIndex = 0;

            const timer = setInterval(() => {
                pElem.textContent += text[charIndex];
                charIndex++;
                if (charIndex >= text.length) {
                    clearInterval(timer);
                    pIndex++;
                    setTimeout(typeParagraph, 400);
                }
            }, 30);
        }

        typeParagraph();
    }

    // Hiệu ứng Thả Tim / Hoa bay lượn khi bấm nút
    if (sendLoveBtn) {
        sendLoveBtn.addEventListener('click', (e) => {
            totalHearts += 9;
            if (kissCountSpan) kissCountSpan.textContent = totalHearts.toLocaleString();
            if (kissBadge) kissBadge.style.display = 'block';

            if (window.birthdaySound) window.birthdaySound.playMagicChime();
            fireworks.burstConfetti(e.clientX, e.clientY);

            // Bắn các biểu tượng tim và hoa bay lượn nhẹ nhàng
            const heartEmojis = ['💖', '✨', '🌸', '💕', '🌷', '🌿', '🎁'];
            for (let i = 0; i < 16; i++) {
                const item = document.createElement('div');
                item.className = 'flying-kiss-emoji';
                item.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                item.style.left = `${e.clientX || window.innerWidth / 2}px`;
                item.style.top = `${e.clientY || window.innerHeight / 2}px`;

                const kx = (Math.random() - 0.5) * 350;
                const ky = (Math.random() - 0.8) * 350;
                const kx2 = kx * 1.6;
                const ky2 = ky * 1.6;

                item.style.setProperty('--kx', `${kx}px`);
                item.style.setProperty('--ky', `${ky}px`);
                item.style.setProperty('--kx2', `${kx2}px`);
                item.style.setProperty('--ky2', `${ky2}px`);

                document.body.appendChild(item);
                setTimeout(() => item.remove(), 1800);
            }
        });
    }
});