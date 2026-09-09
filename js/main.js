// =================================================================
// 🎞️ MAIN CONTROLLER: VINTAGE FILM & CASSETTE MEMORY EXPERIENCE
// =================================================================

class MainController {
    constructor() {
        this.bgEffects = null;
        this.fireworks = null;
        this.questController = null;
        this.currentSlide = 0;
        this.isMusicPlaying = false;
        this.stampCount = 0;
        this.isTypewriting = false;

        this.init();
    }

    init() {
        // 0. Cập nhật toàn bộ text từ file CONFIG.js
        this.applyConfigTexts();

        // 1. Khởi tạo canvas
        this.bgEffects = new BackgroundEffects('bg-canvas');
        this.fireworks = new FireworksController('fireworks-canvas');
        window.fireworks = this.fireworks;

        // 2. Âm nhạc & Widget Cassette
        this.initAudio();

        // 3. Khởi tạo màn hình 1: Keypad & Cassette Deck
        this.initCassetteDeck();

        // 4. Khởi tạo màn hình 2: Cuộn phim 35mm
        this.initFilmSlideshow();

        // 5. Khởi tạo các Quest
        this.questController = new VintageQuestController();

        // 6. Khởi tạo con dấu sáp
        this.initWaxSeal();

        // 7. Khởi tạo ngôi sao bí mật góc dưới trái màn hình
        this.initSecretStar();

        // Tự động tương tác phát nhạc khi người dùng chạm
        document.addEventListener('pointerdown', () => {
            if (!this.isMusicPlaying) {
                this.startMusic();
            }
        }, { once: true });
    }

    // =============================================================
    // ĐỒNG BỘ TOÀN BỘ TEXT TỪ CONFIG.JS VÀO GIAO DIỆN
    // =============================================================
    applyConfigTexts() {
        if (typeof CONFIG === 'undefined') return;

        // 1. Tiêu đề tab
        if (CONFIG.titleWeb) document.title = CONFIG.titleWeb;

        // 2. Floating cassette
        if (CONFIG.floatingCassette) {
            const titleEl = document.querySelector('.floating-cassette .cassette-title');
            const statusEl = document.getElementById('cassette-status');
            if (titleEl && CONFIG.floatingCassette.title) titleEl.textContent = CONFIG.floatingCassette.title;
            if (statusEl && CONFIG.floatingCassette.statusReady) statusEl.textContent = CONFIG.floatingCassette.statusReady;
        }

        // 3. Màn 1: Screen lock
        if (CONFIG.screenLock) {
            const deckBrand = document.querySelector('.deck-brand');
            const counterLabel = document.querySelector('.counter-label');
            const badge = document.querySelector('.cassette-label-sticker .label-badge');
            const side = document.querySelector('.cassette-label-sticker .label-side');
            const tapeTitle = document.querySelector('.cassette-main-title');
            const tapeSub = document.querySelector('.cassette-sub-text');
            const pinHint = document.querySelector('.deck-hint-text');
            const pinInput = document.getElementById('password-input');
            const unlockBtn = document.getElementById('btn-unlock');

            if (deckBrand && CONFIG.screenLock.deckBrand) deckBrand.textContent = CONFIG.screenLock.deckBrand;
            if (counterLabel && CONFIG.screenLock.counterLabel) counterLabel.textContent = CONFIG.screenLock.counterLabel;
            if (badge && CONFIG.screenLock.badge) badge.textContent = CONFIG.screenLock.badge;
            if (side && CONFIG.screenLock.side) side.textContent = CONFIG.screenLock.side;
            if (tapeTitle && CONFIG.screenLock.tapeTitle) tapeTitle.textContent = CONFIG.screenLock.tapeTitle;
            if (tapeSub && CONFIG.screenLock.tapeSub) tapeSub.textContent = CONFIG.screenLock.tapeSub;
            if (pinHint && CONFIG.screenLock.pinHint) pinHint.innerHTML = CONFIG.screenLock.pinHint;
            if (pinInput && CONFIG.screenLock.pinPlaceholder) pinInput.placeholder = CONFIG.screenLock.pinPlaceholder;
            if (unlockBtn && CONFIG.screenLock.unlockBtnText) {
                const btnSpan = unlockBtn.querySelector('span:last-child');
                if (btnSpan) btnSpan.textContent = CONFIG.screenLock.unlockBtnText;
            }
        }

        // 4. Màn 2: Slideshow
        if (CONFIG.screenSlideshow) {
            const heading = document.querySelector('#screen-slideshow .vintage-heading');
            const sub = document.querySelector('#screen-slideshow .vintage-sub');
            const btnToGames = document.getElementById('btn-to-games');
            const recBadge = document.querySelector('.rec-badge');
            const batteryBadge = document.querySelector('.battery-badge');

            if (heading && CONFIG.screenSlideshow.heading) heading.textContent = CONFIG.screenSlideshow.heading;
            if (sub && CONFIG.screenSlideshow.sub) sub.textContent = CONFIG.screenSlideshow.sub;
            if (btnToGames && CONFIG.screenSlideshow.btnToGamesText) {
                const span = btnToGames.querySelector('span');
                if (span) span.textContent = CONFIG.screenSlideshow.btnToGamesText;
            }
            if (recBadge && CONFIG.screenSlideshow.recBadge) {
                recBadge.innerHTML = `<span class="rec-dot"></span> ${CONFIG.screenSlideshow.recBadge}`;
            }
            if (batteryBadge && CONFIG.screenSlideshow.batteryBadge) {
                batteryBadge.textContent = CONFIG.screenSlideshow.batteryBadge;
            }
        }

        // 5. Màn 4: Thư tay & Con dấu
        if (CONFIG.secretLetter) {
            const archiveCode = document.querySelector('.archive-code');
            const paperTitle = document.querySelector('.paper-title-main');
            const paperDate = document.querySelector('.paper-date-tag');
            const greeting = document.getElementById('letter-greeting');
            const signature = document.getElementById('letter-signature');
            const waxMonogram = document.querySelector('.wax-monogram');
            const waxSub = document.querySelector('.wax-sub');

            if (archiveCode && CONFIG.secretLetter.archiveCode) archiveCode.textContent = CONFIG.secretLetter.archiveCode;
            if (paperTitle && CONFIG.secretLetter.title) paperTitle.textContent = CONFIG.secretLetter.title;
            if (paperDate && CONFIG.secretLetter.date) paperDate.textContent = CONFIG.secretLetter.date;
            if (greeting && CONFIG.secretLetter.greeting) greeting.textContent = CONFIG.secretLetter.greeting;
            if (signature && CONFIG.secretLetter.signature) signature.textContent = CONFIG.secretLetter.signature;
            if (waxMonogram && CONFIG.secretLetter.stampMonogram) waxMonogram.textContent = CONFIG.secretLetter.stampMonogram;
            if (waxSub && CONFIG.secretLetter.stampSub) waxSub.textContent = CONFIG.secretLetter.stampSub;
        }
    }

    // =============================================================
    // AUDIO CONTROLLER
    // =============================================================
    initAudio() {
        const floatingCassette = document.getElementById('floating-music-btn');
        const bgAudio = document.getElementById('bg-audio');

        if (floatingCassette) {
            floatingCassette.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playMechanicalClick();
                this.toggleMusic();
            });
        }
    }

    startMusic() {
        if (this.isMusicPlaying) return;
        this.isMusicPlaying = true;
        const floatingCassette = document.getElementById('floating-music-btn');
        const cassetteStatus = document.getElementById('cassette-status');
        const bgAudio = document.getElementById('bg-audio');

        if (floatingCassette) floatingCassette.classList.add('playing');
        if (cassetteStatus) cassetteStatus.textContent = 'Side A • Playing';

        // Xoay trục băng lớn
        document.querySelectorAll('.cassette-reel').forEach(reel => reel.classList.add('spinning'));

        if (window.birthdaySound) {
            window.birthdaySound.startBirthdayMelody();
        } else if (bgAudio && bgAudio.src && bgAudio.src.startsWith('http')) {
            bgAudio.play().catch(() => {});
        }
    }

    stopMusic() {
        this.isMusicPlaying = false;
        const floatingCassette = document.getElementById('floating-music-btn');
        const cassetteStatus = document.getElementById('cassette-status');
        const bgAudio = document.getElementById('bg-audio');

        if (floatingCassette) floatingCassette.classList.remove('playing');
        if (cassetteStatus) cassetteStatus.textContent = 'Side A • Paused';

        document.querySelectorAll('.cassette-reel').forEach(reel => reel.classList.remove('spinning'));

        if (bgAudio) bgAudio.pause();
        if (window.birthdaySound) window.birthdaySound.stopBirthdayMelody();
    }

    toggleMusic() {
        if (this.isMusicPlaying) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
    }

    // =============================================================
    // SCREEN NAVIGATION
    // =============================================================
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // =============================================================
    // MÀN 1: MÁY BĂNG CASSETTE & MẬT KHẨU
    // =============================================================
    initCassetteDeck() {
        const passInput = document.getElementById('password-input');
        const unlockBtn = document.getElementById('btn-unlock');
        const tapeCounter = document.getElementById('tape-counter-num');
        const keypadBtns = document.querySelectorAll('.analog-keypad .key-btn');
        const btnClear = document.getElementById('btn-key-clear');
        const btnBack = document.getElementById('btn-key-back');

        // Gõ phím số trên bàn phím analog
        keypadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const key = btn.getAttribute('data-key');
                if (key) {
                    if (window.birthdaySound) window.birthdaySound.playMechanicalClick();
                    if (passInput.value.length < 8) {
                        passInput.value += key;
                        if (tapeCounter) tapeCounter.textContent = passInput.value.padEnd(3, '0').slice(-3);
                    }
                }
            });
        });

        if (btnClear) {
            btnClear.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playMechanicalClick();
                passInput.value = '';
                if (tapeCounter) tapeCounter.textContent = '0 0 0';
            });
        }

        if (btnBack) {
            btnBack.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playMechanicalClick();
                passInput.value = passInput.value.slice(0, -1);
                if (tapeCounter) tapeCounter.textContent = passInput.value.padEnd(3, '0').slice(-3);
            });
        }

        const checkUnlock = () => {
            const val = passInput.value.trim().replace(/[\s\-\/\.]/g, '');
            if (!val) {
                this.shakeElement(document.getElementById('lock-card'));
                return;
            }

            const isCorrect = CONFIG.passwords.some(p => p.replace(/[\s\-\/\.]/g, '') === val);

            if (isCorrect) {
                if (window.birthdaySound) window.birthdaySound.playMagicChime();
                this.fireworks.burstConfetti();
                this.fireworks.celebrateSequence(2000);
                this.startMusic();

                setTimeout(() => {
                    this.showScreen('screen-slideshow');
                    this.renderSlide(0);
                }, 900);
            } else {
                if (window.birthdaySound) window.birthdaySound.playRadioStatic(0.2);
                this.shakeElement(document.getElementById('lock-card'));
                passInput.value = '';
                if (tapeCounter) tapeCounter.textContent = 'ERR';
                setTimeout(() => {
                    if (tapeCounter) tapeCounter.textContent = '0 0 0';
                }, 1200);
            }
        };

        if (unlockBtn) unlockBtn.addEventListener('click', checkUnlock);
        if (passInput) {
            passInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') checkUnlock();
            });
        }
    }

    shakeElement(el) {
        if (!el) return;
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = 'shakeAnim 0.4s ease';
        setTimeout(() => el.style.animation = '', 400);
    }

    // =============================================================
    // MÀN 2: CUỘN PHIM 35MM SLIDESHOW
    // =============================================================
    initFilmSlideshow() {
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        const dotsContainer = document.getElementById('slide-dots');
        const toGamesBtn = document.getElementById('btn-to-games');

        // Tạo các dots điều hướng
        if (dotsContainer && CONFIG.gallery) {
            dotsContainer.innerHTML = '';
            CONFIG.gallery.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.className = `film-dot ${idx === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    if (window.birthdaySound) window.birthdaySound.playCameraShutter();
                    this.renderSlide(idx);
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playCameraShutter();
                const newIdx = (this.currentSlide - 1 + CONFIG.gallery.length) % CONFIG.gallery.length;
                this.renderSlide(newIdx);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playCameraShutter();
                const newIdx = (this.currentSlide + 1) % CONFIG.gallery.length;
                this.renderSlide(newIdx);
            });
        }

        if (toGamesBtn) {
            toGamesBtn.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playMechanicalClick();
                this.showScreen('screen-games');
            });
        }

        // Hỗ trợ phím mũi tên trái/phải
        document.addEventListener('keydown', (e) => {
            const screen = document.getElementById('screen-slideshow');
            if (screen && screen.classList.contains('active')) {
                if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
                if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
            }
        });
    }

    renderSlide(idx) {
        if (!CONFIG.gallery || !CONFIG.gallery[idx]) return;
        this.currentSlide = idx;
        const item = CONFIG.gallery[idx];

        const imgEl = document.getElementById('polaroid-img');
        const captionEl = document.getElementById('polaroid-caption');
        const frameNumEl = document.getElementById('film-frame-number');
        const frameDateEl = document.getElementById('film-frame-date');
        const filmCodeEl = document.getElementById('film-code-text');
        const locationEl = document.getElementById('film-location');

        if (imgEl) {
            imgEl.style.opacity = '0.3';
            imgEl.onerror = () => {
                const currentSrc = imgEl.getAttribute('src') || item.src;
                if (currentSrc.endsWith('.jpg')) {
                    imgEl.src = currentSrc.replace('.jpg', '.png');
                } else if (currentSrc.endsWith('.png')) {
                    imgEl.src = currentSrc.replace('.png', '.jpeg');
                } else if (currentSrc.endsWith('.jpeg')) {
                    imgEl.src = currentSrc.replace('.jpeg', '.webp');
                }
            };
            setTimeout(() => {
                imgEl.src = item.src;
                imgEl.style.opacity = '1';
            }, 120);
        }

        if (captionEl) captionEl.textContent = item.caption || '';
        if (frameNumEl) frameNumEl.textContent = `FRAME 0${idx + 1}`;
        if (frameDateEl) frameDateEl.textContent = item.date || '10.09.2006';
        if (filmCodeEl) filmCodeEl.textContent = item.code || `KODAK-400 • EXP 0${idx + 1}`;
        if (locationEl) {
            if (item.location) {
                locationEl.textContent = `📍 ${item.location}`;
                locationEl.style.display = 'block';
            } else {
                locationEl.style.display = 'none';
            }
        }

        // Cập nhật dots
        const dots = document.querySelectorAll('.film-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    // =============================================================
    // MÀN 4: BỨC THƯ MÁY ĐÁNH CHỮ & CON DẤU SÁP
    // =============================================================
    typewriterLetter() {
        if (this.isTypewriting) return;
        this.isTypewriting = true;

        const bodyEl = document.getElementById('letter-body');
        const greetingEl = document.getElementById('letter-greeting');
        const signatureEl = document.getElementById('letter-signature');

        if (greetingEl && CONFIG.secretLetter) {
            greetingEl.textContent = CONFIG.secretLetter.greeting || 'Gửi Bìm,';
        }
        if (signatureEl && CONFIG.secretLetter) {
            signatureEl.textContent = CONFIG.secretLetter.signature || 'Thế Đại';
        }

        if (!bodyEl || !CONFIG.secretLetter || !CONFIG.secretLetter.paragraphs) return;
        bodyEl.innerHTML = '';

        const paragraphs = CONFIG.secretLetter.paragraphs;
        let pIndex = 0;
        let charIndex = 0;

        const pTag = document.createElement('p');
        bodyEl.appendChild(pTag);

        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        bodyEl.appendChild(cursor);

        const typeNextChar = () => {
            if (pIndex >= paragraphs.length) {
                cursor.remove();
                this.isTypewriting = false;
                return;
            }

            const currentText = paragraphs[pIndex];

            if (charIndex < currentText.length) {
                pTag.textContent += currentText.charAt(charIndex);
                charIndex++;

                if (window.birthdaySound && charIndex % 2 === 0) {
                    window.birthdaySound.playTypewriterKey();
                }

                setTimeout(typeNextChar, 32 + Math.random() * 20);
            } else {
                pIndex++;
                charIndex = 0;
                if (pIndex < paragraphs.length) {
                    const nextP = document.createElement('p');
                    bodyEl.insertBefore(nextP, cursor);
                    setTimeout(typeNextChar, 300);
                } else {
                    cursor.remove();
                    this.isTypewriting = false;
                }
            }
        };

        typeNextChar();
    }

    initWaxSeal() {
        const stampBtn = document.getElementById('btn-wax-stamp');
        const stampCounter = document.getElementById('stamp-counter');
        const stampCountNum = document.getElementById('stamp-count-num');

        if (stampBtn) {
            stampBtn.addEventListener('click', (e) => {
                this.stampCount++;
                if (window.birthdaySound) window.birthdaySound.playWaxStamp();

                // Tạo vết đóng dấu sáp ấn tượng
                this.fireworks.burstConfetti(e.clientX, e.clientY, 30);

                if (stampCounter && stampCountNum) {
                    stampCounter.style.display = 'block';
                    stampCountNum.textContent = this.stampCount;
                }
            });
        }
    }

    // =============================================================
    // NGÔI SAO BÍ MẬT GÓC DƯỚI BÊN TRÁI MÀN HÌNH
    // =============================================================
    initSecretStar() {
        const starBtn = document.getElementById('secret-star-btn');
        if (starBtn) {
            starBtn.addEventListener('click', (e) => {
                if (window.birthdaySound) window.birthdaySound.playMagicChime();
                if (this.fireworks) this.fireworks.burstConfetti(e.clientX, e.clientY, 35);
                this.showScreen('screen-games');
            });
        }
    }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    window.mainController = new MainController();
});