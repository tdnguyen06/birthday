// =================================================================
// 🎞️ VINTAGE QUEST CONTROLLER & SECRET GAME CONTROLLER
// Stage 1: Piano Tiles (Bấm nốt nhạc piano rơi, hụt quá 5 lần thì thua)
// Stage 2: Memory Synth (Nhớ nốt: V1: 6 nốt, V2: 8 nốt, V3: 10 nốt, sai 3 lần loại)
// Stage 3: Flappy Melody (Chơi như Flappy Bird, bay qua 10 cột chướng ngại vật)
// Stage 4: Thổi nến sinh nhật & Mở khóa thư
// Secret Game: Bông hoa đẹp nhất (Kích hoạt khi ấn ngôi sao dưới góc trái)
// =================================================================

class VintageQuestController {
    constructor() {
        this.currentStage = 1;

        // Stage 1: Piano Tiles vars
        this.pianoScore = 0;
        this.pianoTarget = (CONFIG.pianoGame && CONFIG.pianoGame.targetScore) || 20;
        this.pianoMaxMisses = (CONFIG.pianoGame && CONFIG.pianoGame.maxMisses) || 5;
        this.pianoMisses = 0;
        this.pianoTiles = [];
        this.isPianoRunning = false;
        this.pianoAnimId = null;
        this.pianoSpawnTimer = 0;

        // Stage 2: Music Memory vars
        this.memoryRounds = (CONFIG.memoryGame && CONFIG.memoryGame.rounds) || [6, 8, 10];
        this.memoryCurrentRoundIdx = 0;
        this.memoryMaxErrors = (CONFIG.memoryGame && CONFIG.memoryGame.maxErrors) || 3;
        this.memoryErrors = 0;
        this.memorySequence = [];
        this.userSequence = [];
        this.isMachinePlaying = false;
        this.isMemoryAcceptingInput = false;
        this.memoryPlayTimeout = null;

        // Stage 3: Flappy Bird vars
        this.flappyCanvas = null;
        this.flappyCtx = null;
        this.flappyAnimId = null;
        this.isFlappyRunning = false;
        this.flappyScore = 0;
        this.flappyTarget = (CONFIG.flappyGame && CONFIG.flappyGame.targetScore) || 10;
        this.bird = { x: 80, y: 150, vy: 0, gravity: 0.38, jump: -6.5, radius: 16 };
        this.pipes = [];
        this.pipeSpawnTimer = 0;

        // Stage 4: Candle vars
        this.isCandleBlown = false;

        this.init();
    }

    init() {
        this.initPianoGame();
        this.initMemoryGame();
        this.initFlappyGame();
        this.initCandleBlow();
        this.initSecretFlowerModal();
    }

    // =============================================================
    // 0. CẬP NHẬT TRẠNG THÁI TIẾN TRÌNH / PHONG ẤN
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
            const labels = ['1: Piano Xong', '2: Nhớ Nốt Xong', '3: Flappy Xong'];
            seal.innerHTML = `<span class="seal-icon">🔓</span> ${labels[sealIndex - 1]}`;
        }
    }

    // =============================================================
    // 1. GAME 1: PIANO TILES (BẤM NỐT RƠI)
    // =============================================================
    initPianoGame() {
        const board = document.getElementById('piano-board');
        const restartBtn = document.getElementById('btn-restart-piano');
        if (!board) return;

        // Click / Touch trên các lane
        const lanes = board.querySelectorAll('.piano-lane');
        lanes.forEach((lane) => {
            const laneIdx = parseInt(lane.getAttribute('data-lane'), 10);

            const handleLaneAction = (e) => {
                e.preventDefault();
                if (!this.isPianoRunning) return;
                this.handlePianoInput(laneIdx);
            };

            lane.addEventListener('mousedown', handleLaneAction);
            lane.addEventListener('touchstart', handleLaneAction, { passive: false });
        });

        // Bàn phím máy tính: D, F, J, K hoặc 1, 2, 3, 4
        window.addEventListener('keydown', (e) => {
            const stage = document.getElementById('stage-piano');
            if (!this.isPianoRunning || !stage || stage.style.display === 'none') return;

            const keyMap = {
                'd': 0, 'D': 0, '1': 0,
                'f': 1, 'F': 1, '2': 1,
                'j': 2, 'J': 2, '3': 2,
                'k': 3, 'K': 3, '4': 3
            };

            if (keyMap[e.key] !== undefined) {
                e.preventDefault();
                this.handlePianoInput(keyMap[e.key]);
            }
        });

        if (restartBtn) {
            restartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.birthdaySound) window.birthdaySound.playMechanicalClick();
                this.startPianoGame();
            });
        }
    }

    startPianoGame() {
        this.currentStage = 1;
        const stage1 = document.getElementById('stage-piano');
        const stage2 = document.getElementById('stage-memory');
        const stage3 = document.getElementById('stage-flappy');
        const stageCandle = document.getElementById('stage-candle');
        const overlay = document.getElementById('piano-overlay');

        if (stage1) stage1.style.display = 'flex';
        if (stage2) stage2.style.display = 'none';
        if (stage3) stage3.style.display = 'none';
        if (stageCandle) stageCandle.style.display = 'none';
        if (overlay) overlay.style.display = 'none';

        // Clear tiles cũ
        this.clearAllPianoTileElements();
        this.pianoTiles = [];
        this.pianoScore = 0;
        this.pianoMisses = 0;
        this.pianoSpawnTimer = 0;
        this.isPianoRunning = true;

        this.updatePianoUI();
        this.updateSealStatus(1, 'active');

        if (this.pianoAnimId) cancelAnimationFrame(this.pianoAnimId);
        this.runPianoLoop();
    }

    clearAllPianoTileElements() {
        const board = document.getElementById('piano-board');
        if (!board) return;
        board.querySelectorAll('.falling-piano-tile').forEach(t => t.remove());
    }

    updatePianoUI() {
        const scoreEl = document.getElementById('piano-score-num');
        const livesEl = document.getElementById('piano-lives-display');

        if (scoreEl) {
            scoreEl.textContent = `${this.pianoScore} / ${this.pianoTarget}`;
        }

        if (livesEl) {
            const remaining = Math.max(0, this.pianoMaxMisses - this.pianoMisses);
            let hearts = '';
            for (let i = 0; i < remaining; i++) hearts += '❤️';
            for (let i = remaining; i < this.pianoMaxMisses; i++) hearts += '🖤';
            livesEl.textContent = hearts;
        }
    }

    handlePianoInput(laneIdx) {
        if (!this.isPianoRunning) return;

        // Visual flash trên lane
        const laneEl = document.querySelector(`.piano-lane[data-lane="${laneIdx}"]`);
        if (laneEl) {
            laneEl.classList.add('lane-hit-active');
            setTimeout(() => laneEl.classList.remove('lane-hit-active'), 160);
        }

        // Tìm nốt nằm trong vùng nhấn (hit zone)
        const hitCandidateIdx = this.pianoTiles.findIndex(t => t.lane === laneIdx && t.topPct >= 52 && t.topPct <= 98 && !t.hit);

        if (hitCandidateIdx !== -1) {
            // Đánh trúng nốt
            const tile = this.pianoTiles[hitCandidateIdx];
            tile.hit = true;
            if (tile.el) {
                tile.el.classList.add('tile-popped');
                setTimeout(() => { if (tile.el) tile.el.remove(); }, 200);
            }
            this.pianoTiles.splice(hitCandidateIdx, 1);

            this.pianoScore++;
            this.updatePianoUI();

            // Phát âm thanh piano tương ứng lane
            const noteIndexMap = [0, 2, 4, 7]; // C4, E4, G4, C5
            if (window.birthdaySound && typeof window.birthdaySound.playPianoNote === 'function') {
                window.birthdaySound.playPianoNote(noteIndexMap[laneIdx] || 0);
            }

            // Hiệu ứng pháo hoa nhỏ
            if (window.fireworks && typeof window.fireworks.burstConfetti === 'function') {
                if (laneEl) {
                    const rect = laneEl.getBoundingClientRect();
                    window.fireworks.burstConfetti(rect.left + rect.width / 2, rect.bottom - 40, 8);
                }
            }

            // Kiểm tra chiến thắng Game 1
            if (this.pianoScore >= this.pianoTarget) {
                this.isPianoRunning = false;
                cancelAnimationFrame(this.pianoAnimId);
                this.updateSealStatus(1, 'unlocked');

                if (window.birthdaySound) window.birthdaySound.playMagicChime();
                if (window.fireworks) {
                    window.fireworks.burstConfetti();
                    window.fireworks.celebrateSequence(2200);
                }

                setTimeout(() => {
                    this.advanceToStage2();
                }, 1100);
            }
        } else {
            // Bấm hụt / Bấm trượt vào làn trống
            this.handlePianoMiss("misclick");
        }
    }

    handlePianoMiss(reason = "miss") {
        if (!this.isPianoRunning) return;

        this.pianoMisses++;
        this.updatePianoUI();

        if (window.birthdaySound && typeof window.birthdaySound.playWrongBuzz === 'function') {
            window.birthdaySound.playWrongBuzz();
        }

        const board = document.getElementById('piano-board');
        if (board) {
            board.classList.add('board-shake-error');
            setTimeout(() => board.classList.remove('board-shake-error'), 350);
        }

        // Nếu quá số lần cho phép -> Thua
        if (this.pianoMisses >= this.pianoMaxMisses) {
            this.isPianoRunning = false;
            cancelAnimationFrame(this.pianoAnimId);

            const overlay = document.getElementById('piano-overlay');
            const overlayTitle = document.getElementById('piano-overlay-title');
            const overlaySub = document.getElementById('piano-overlay-sub');

            if (overlayTitle) overlayTitle.textContent = "HẾT MẠNG RỒI!";
            if (overlaySub) overlaySub.textContent = `Bạn đã bấm hụt hoặc để rơi ${this.pianoMaxMisses} nốt. Hãy thử lại nhé!`;
            if (overlay) overlay.style.display = 'flex';
        }
    }

    runPianoLoop() {
        if (!this.isPianoRunning) return;

        const board = document.getElementById('piano-board');
        if (!board) return;

        this.pianoSpawnTimer++;

        // Tạo nốt rơi đều đặn (mỗi 38 frames)
        if (this.pianoSpawnTimer % 38 === 0 && this.pianoScore < this.pianoTarget) {
            const lane = Math.floor(Math.random() * 4);
            const laneEl = document.querySelector(`.piano-lane[data-lane="${lane}"]`);

            if (laneEl) {
                const tileEl = document.createElement('div');
                tileEl.className = `falling-piano-tile tile-lane-${lane}`;
                tileEl.innerHTML = `<span>♪</span>`;
                tileEl.style.top = `-18%`;
                laneEl.appendChild(tileEl);

                this.pianoTiles.push({
                    lane: lane,
                    topPct: -18,
                    speed: 1.15 + (this.pianoScore / this.pianoTarget) * 0.45,
                    el: tileEl,
                    hit: false
                });
            }
        }

        // Cập nhật vị trí nốt
        for (let i = this.pianoTiles.length - 1; i >= 0; i--) {
            const tile = this.pianoTiles[i];
            tile.topPct += tile.speed;

            if (tile.el) {
                tile.el.style.top = `${tile.topPct}%`;
            }

            // Nốt rơi vượt qua đáy màn hình (để rơi nốt)
            if (tile.topPct > 98 && !tile.hit) {
                tile.hit = true;
                if (tile.el) tile.el.remove();
                this.pianoTiles.splice(i, 1);
                this.handlePianoMiss("dropped");
            }
        }

        if (this.isPianoRunning) {
            this.pianoAnimId = requestAnimationFrame(() => this.runPianoLoop());
        }
    }

    advanceToStage2() {
        const stage1 = document.getElementById('stage-piano');
        const stage2 = document.getElementById('stage-memory');

        if (stage1) stage1.style.display = 'none';
        if (stage2) {
            stage2.style.display = 'flex';
            stage2.scrollIntoView({ behavior: 'smooth' });
        }
        this.startMemoryGame();
    }

    // =============================================================
    // 2. GAME 2: GHI NHỚ NỐT NHẠC (SIMON MEMORY PIANO)
    // =============================================================
    initMemoryGame() {
        const padsGrid = document.getElementById('memory-pads-grid');
        const restartBtn = document.getElementById('btn-restart-memory');
        if (!padsGrid) return;

        const pads = padsGrid.querySelectorAll('.synth-note-btn');
        pads.forEach((pad) => {
            const noteIdx = parseInt(pad.getAttribute('data-note'), 10);

            pad.addEventListener('click', () => {
                if (!this.isMemoryAcceptingInput || this.isMachinePlaying) return;
                this.handleUserMemoryInput(noteIdx, pad);
            });
        });

        if (restartBtn) {
            restartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.birthdaySound) window.birthdaySound.playMechanicalClick();
                this.startMemoryGame();
            });
        }
    }

    clearMemoryTimeouts() {
        if (this.memoryPlayTimeout) {
            clearTimeout(this.memoryPlayTimeout);
            this.memoryPlayTimeout = null;
        }
    }

    startMemoryGame() {
        this.currentStage = 2;
        this.memoryCurrentRoundIdx = 0;
        this.memoryErrors = 0;
        this.clearMemoryTimeouts();
        this.updateSealStatus(2, 'active');

        const overlay = document.getElementById('memory-overlay');
        if (overlay) overlay.style.display = 'none';

        this.updateMemoryUI();
        this.startMemoryRound();
    }

    updateMemoryUI() {
        const roundEl = document.getElementById('memory-round-num');
        const livesEl = document.getElementById('memory-lives-display');

        const requiredNotes = this.memoryRounds[this.memoryCurrentRoundIdx] || 6;
        if (roundEl) {
            roundEl.textContent = `VÒNG ${this.memoryCurrentRoundIdx + 1} / 3 (${requiredNotes} NỐT)`;
        }

        if (livesEl) {
            const remaining = Math.max(0, this.memoryMaxErrors - this.memoryErrors);
            let hearts = '';
            for (let i = 0; i < remaining; i++) hearts += '❤️';
            for (let i = remaining; i < this.memoryMaxErrors; i++) hearts += '🖤';
            livesEl.textContent = hearts;
        }
    }

    setMemoryBanner(text, isAlert = false) {
        const banner = document.getElementById('memory-status-banner');
        if (!banner) return;
        banner.textContent = text;
        banner.classList.toggle('banner-alert', isAlert);
    }

    startMemoryRound() {
        this.clearMemoryTimeouts();
        const requiredNotes = this.memoryRounds[this.memoryCurrentRoundIdx] || 6;
        this.updateMemoryUI();
        this.isMemoryAcceptingInput = false;
        this.isMachinePlaying = true;
        this.userSequence = [];

        // Sinh chuỗi nốt ngẫu nhiên cho vòng hiện tại
        this.memorySequence = [];
        for (let i = 0; i < requiredNotes; i++) {
            this.memorySequence.push(Math.floor(Math.random() * 6));
        }

        this.setMemoryBanner(`🎧 Hãy lắng nghe chuỗi ${requiredNotes} nốt nhạc...`);

        this.memoryPlayTimeout = setTimeout(() => {
            this.playMemorySequence(0);
        }, 1000);
    }

    playMemorySequence(stepIndex) {
        if (stepIndex >= this.memorySequence.length) {
            // Máy phát xong -> Chuyển lượt cho người chơi
            this.isMachinePlaying = false;
            this.isMemoryAcceptingInput = true;
            this.setMemoryBanner(`👉 Đến lượt bạn! Hãy bấm lại đúng ${this.memorySequence.length} nốt nhé.`);
            return;
        }

        const note = this.memorySequence[stepIndex];
        this.highlightMemoryPad(note, 420);

        if (window.birthdaySound && typeof window.birthdaySound.playPianoNote === 'function') {
            window.birthdaySound.playPianoNote(note, 0.5);
        }

        this.memoryPlayTimeout = setTimeout(() => {
            this.playMemorySequence(stepIndex + 1);
        }, 620);
    }

    highlightMemoryPad(noteIdx, duration = 350) {
        const pad = document.querySelector(`.synth-note-btn[data-note="${noteIdx}"]`);
        if (!pad) return;

        pad.classList.add('pad-active');
        setTimeout(() => pad.classList.remove('pad-active'), duration);
    }

    handleUserMemoryInput(noteIdx, padEl) {
        if (!this.isMemoryAcceptingInput) return;

        this.highlightMemoryPad(noteIdx, 250);
        if (window.birthdaySound && typeof window.birthdaySound.playPianoNote === 'function') {
            window.birthdaySound.playPianoNote(noteIdx, 0.5);
        }

        const expectedNote = this.memorySequence[this.userSequence.length];

        if (noteIdx === expectedNote) {
            // Đúng nốt tiếp theo
            this.userSequence.push(noteIdx);
            this.setMemoryBanner(`✨ Đúng rồi! (${this.userSequence.length} / ${this.memorySequence.length} nốt)`);

            // Nếu bấm đủ toàn bộ chuỗi nốt
            if (this.userSequence.length === this.memorySequence.length) {
                this.isMemoryAcceptingInput = false;

                if (window.birthdaySound) window.birthdaySound.playSuccessChord();
                if (window.fireworks) window.fireworks.burstConfetti();

                this.memoryCurrentRoundIdx++;

                if (this.memoryCurrentRoundIdx >= this.memoryRounds.length) {
                    // Hoàn thành cả 3 vòng -> Chiến thắng Game 2
                    this.updateSealStatus(2, 'unlocked');
                    this.setMemoryBanner(`🎉 XUẤT SẮC! BẠN ĐÃ VƯỢT QUA CẢ 3 VÒNG!`);

                    if (window.birthdaySound) window.birthdaySound.playMagicChime();
                    if (window.fireworks) window.fireworks.celebrateSequence(2500);

                    setTimeout(() => {
                        this.advanceToStage3();
                    }, 1300);
                } else {
                    // Chuyển sang vòng tiếp theo
                    const nextNotes = this.memoryRounds[this.memoryCurrentRoundIdx];
                    this.setMemoryBanner(`⭐ Vòng ${this.memoryCurrentRoundIdx} hoàn thành! Chuẩn bị Vòng ${this.memoryCurrentRoundIdx + 1} (${nextNotes} nốt)...`);
                    setTimeout(() => {
                        this.startMemoryRound();
                    }, 1400);
                }
            }
        } else {
            // Bấm sai nốt
            this.handleMemoryMistake();
        }
    }

    handleMemoryMistake() {
        this.isMemoryAcceptingInput = false;
        this.clearMemoryTimeouts();
        this.memoryErrors++;
        this.updateMemoryUI();

        if (window.birthdaySound && typeof window.birthdaySound.playWrongBuzz === 'function') {
            window.birthdaySound.playWrongBuzz();
        }

        const deck = document.querySelector('.memory-synth-deck');
        if (deck) {
            deck.classList.add('board-shake-error');
            setTimeout(() => deck.classList.remove('board-shake-error'), 400);
        }

        if (this.memoryErrors >= this.memoryMaxErrors) {
            // Quá 3 lần sai -> Game Over
            const overlay = document.getElementById('memory-overlay');
            const overlayTitle = document.getElementById('memory-overlay-title');
            const overlaySub = document.getElementById('memory-overlay-sub');

            if (overlayTitle) overlayTitle.textContent = "BẠN ĐÃ NHỚ SAI 3 LẦN!";
            if (overlaySub) overlaySub.textContent = "Hãy tập trung lắng nghe giai điệu và thử lại từ đầu nhé!";
            if (overlay) overlay.style.display = 'flex';
        } else {
            // Cho nghe lại chuỗi nốt của vòng hiện tại
            this.setMemoryBanner(`❌ Sai rồi! Bạn còn ${this.memoryMaxErrors - this.memoryErrors} mạng. Hãy nghe lại nhé...`, true);
            this.memoryPlayTimeout = setTimeout(() => {
                this.startMemoryRound();
            }, 1500);
        }
    }

    advanceToStage3() {
        const stage2 = document.getElementById('stage-memory');
        const stage3 = document.getElementById('stage-flappy');

        if (stage2) stage2.style.display = 'none';
        if (stage3) {
            stage3.style.display = 'flex';
            stage3.scrollIntoView({ behavior: 'smooth' });
        }
        this.startFlappyGame();
    }

    // =============================================================
    // 3. GAME 3: FLAPPY MELODY (CHƠI NHƯ FLAPPY BIRDS)
    // =============================================================
    initFlappyGame() {
        this.flappyCanvas = document.getElementById('flappy-canvas');
        const restartBtn = document.getElementById('btn-restart-flappy');
        if (!this.flappyCanvas) return;

        this.flappyCtx = this.flappyCanvas.getContext('2d');
        const canvas = this.flappyCanvas;

        const handleFlap = (e) => {
            if (e) e.preventDefault();
            if (!this.isFlappyRunning) return;
            this.bird.vy = this.bird.jump;

            if (window.birthdaySound && typeof window.birthdaySound.playFlap === 'function') {
                window.birthdaySound.playFlap();
            }
        };

        canvas.addEventListener('mousedown', handleFlap);
        canvas.addEventListener('touchstart', handleFlap, { passive: false });

        window.addEventListener('keydown', (e) => {
            const stage = document.getElementById('stage-flappy');
            if (!this.isFlappyRunning || !stage || stage.style.display === 'none') return;
            if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
                e.preventDefault();
                handleFlap();
            }
        });

        if (restartBtn) {
            restartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.birthdaySound) window.birthdaySound.playMechanicalClick();
                this.startFlappyGame();
            });
        }
    }

    startFlappyGame() {
        this.currentStage = 3;
        this.flappyScore = 0;
        this.pipes = [];
        this.pipeSpawnTimer = 0;
        this.bird.y = 150;
        this.bird.vy = 0;
        this.isFlappyRunning = true;

        const overlay = document.getElementById('flappy-overlay');
        if (overlay) overlay.style.display = 'none';

        this.updateFlappyUI();
        this.updateSealStatus(3, 'active');

        if (this.flappyAnimId) cancelAnimationFrame(this.flappyAnimId);
        this.runFlappyLoop();
    }

    updateFlappyUI() {
        const scoreEl = document.getElementById('flappy-score-num');
        if (scoreEl) {
            scoreEl.textContent = `${this.flappyScore} / ${this.flappyTarget}`;
        }
    }

    runFlappyLoop() {
        if (!this.isFlappyRunning || !this.flappyCtx) return;
        const ctx = this.flappyCtx;
        const canvas = this.flappyCanvas;

        // Xóa canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Vẽ nền Canvas hoài niệm
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#1c1510');
        grad.addColorStop(1, '#0e0b09');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Đường gạch hoài niệm
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
        ctx.lineWidth = 1;
        for (let y = 30; y < canvas.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // 2. Cập nhật vị trí chim / nốt nhạc
        this.bird.vy += this.bird.gravity;
        this.bird.y += this.bird.vy;

        // Vẽ chim / Nốt nhạc phát sáng
        ctx.save();
        ctx.translate(this.bird.x, this.bird.y);
        const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.bird.vy * 0.06));
        ctx.rotate(angle);

        // Ánh sáng xung quanh
        const radial = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
        radial.addColorStop(0, 'rgba(232, 170, 66, 0.8)');
        radial.addColorStop(1, 'rgba(232, 170, 66, 0)');
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();

        // Icon chim bồ câu / nốt nhạc
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🕊️', 0, 0);
        ctx.restore();

        // 3. Sinh cột chướng ngại vật
        this.pipeSpawnTimer++;
        if (this.pipeSpawnTimer % 95 === 0 && this.flappyScore < this.flappyTarget) {
            const gapHeight = 110;
            const minPipeH = 40;
            const maxPipeH = canvas.height - gapHeight - minPipeH;
            const topH = Math.floor(Math.random() * (maxPipeH - minPipeH)) + minPipeH;

            this.pipes.push({
                x: canvas.width,
                width: 44,
                topH: topH,
                bottomY: topH + gapHeight,
                passed: false
            });
        }

        // 4. Vẽ & kiểm tra va chạm với các cột
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= 2.2;

            // Cột trên
            ctx.fillStyle = '#3a2d23';
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 2;
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.topH);
            ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topH);

            // Đầu cột trên
            ctx.fillStyle = '#4a3a2d';
            ctx.fillRect(pipe.x - 3, pipe.topH - 12, pipe.width + 6, 12);
            ctx.strokeRect(pipe.x - 3, pipe.topH - 12, pipe.width + 6, 12);

            // Cột dưới
            const bottomH = canvas.height - pipe.bottomY;
            ctx.fillStyle = '#3a2d23';
            ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, bottomH);
            ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, bottomH);

            // Đầu cột dưới
            ctx.fillStyle = '#4a3a2d';
            ctx.fillRect(pipe.x - 3, pipe.bottomY, pipe.width + 6, 12);
            ctx.strokeRect(pipe.x - 3, pipe.bottomY, pipe.width + 6, 12);

            // Kiểm tra va chạm (Box vs Circle)
            const birdRight = this.bird.x + this.bird.radius;
            const birdLeft = this.bird.x - this.bird.radius;
            const birdTop = this.bird.y - this.bird.radius;
            const birdBottom = this.bird.y + this.bird.radius;

            if (birdRight > pipe.x && birdLeft < pipe.x + pipe.width) {
                if (birdTop < pipe.topH || birdBottom > pipe.bottomY) {
                    this.handleFlappyCollision();
                    return;
                }
            }

            // Ghi điểm khi bay qua cột
            if (!pipe.passed && pipe.x + pipe.width < this.bird.x) {
                pipe.passed = true;
                this.flappyScore++;
                this.updateFlappyUI();

                if (window.birthdaySound && typeof window.birthdaySound.playPoint === 'function') {
                    window.birthdaySound.playPoint();
                }

                if (window.fireworks && typeof window.fireworks.burstConfetti === 'function') {
                    window.fireworks.burstConfetti(this.bird.x, this.bird.y, 6);
                }

                // Đạt 10 cột -> Chiến thắng Game 3
                if (this.flappyScore >= this.flappyTarget) {
                    this.isFlappyRunning = false;
                    cancelAnimationFrame(this.flappyAnimId);
                    this.updateSealStatus(3, 'unlocked');

                    if (window.birthdaySound) window.birthdaySound.playMagicChime();
                    if (window.fireworks) {
                        window.fireworks.burstConfetti();
                        window.fireworks.celebrateSequence(3000);
                    }

                    setTimeout(() => {
                        this.advanceToCandleStage();
                    }, 1200);
                    return;
                }
            }

            // Xóa cột đã trôi ra ngoài
            if (pipe.x + pipe.width < -20) {
                this.pipes.splice(i, 1);
            }
        }

        // Kiểm tra rơi xuống sàn hoặc chạm trần
        if (this.bird.y + this.bird.radius >= canvas.height || this.bird.y - this.bird.radius <= 0) {
            this.handleFlappyCollision();
            return;
        }

        if (this.isFlappyRunning) {
            this.flappyAnimId = requestAnimationFrame(() => this.runFlappyLoop());
        }
    }

    handleFlappyCollision() {
        this.isFlappyRunning = false;
        cancelAnimationFrame(this.flappyAnimId);

        if (window.birthdaySound && typeof window.birthdaySound.playHit === 'function') {
            window.birthdaySound.playHit();
        }

        const overlay = document.getElementById('flappy-overlay');
        const overlayTitle = document.getElementById('flappy-overlay-title');
        const overlaySub = document.getElementById('flappy-overlay-sub');

        if (overlayTitle) overlayTitle.textContent = "CHẠM CỘT RỒI!";
        if (overlaySub) overlaySub.textContent = `Bạn đã vượt qua ${this.flappyScore} / ${this.flappyTarget} cột. Chạm để bay lại nhé!`;
        if (overlay) overlay.style.display = 'flex';
    }

    advanceToCandleStage() {
        const stage3 = document.getElementById('stage-flappy');
        const stageCandle = document.getElementById('stage-candle');

        if (stage3) stage3.style.display = 'none';
        if (stageCandle) {
            stageCandle.style.display = 'flex';
            stageCandle.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // =============================================================
    // 4. MÀN BÁNH KEM & THỔI NẾN ƯỚC NGUYỆN
    // =============================================================
    initCandleBlow() {
        const candleWrapper = document.getElementById('vintage-candle-wrapper');
        const flame = document.getElementById('vintage-candle-flame');
        const cakeCfg = CONFIG.cakeGame;

        if (candleWrapper) {
            candleWrapper.addEventListener('click', () => {
                if (this.isCandleBlown) return;
                this.isCandleBlown = true;

                if (flame) flame.classList.add('extinguished');

                // Tạo hiệu ứng khói nến
                const smoke = document.createElement('div');
                smoke.className = 'candle-smoke-fx';
                candleWrapper.appendChild(smoke);

                if (window.birthdaySound) window.birthdaySound.playMagicChime();
                if (window.fireworks) {
                    window.fireworks.burstConfetti();
                    window.fireworks.celebrateSequence(3200);
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
    // 5. TRÒ CHƠI BÍ MẬT (MODAL): ĐOÁN BÔNG HOA ĐẸP NHẤT
    // =============================================================
    initSecretFlowerModal() {
        const modal = document.getElementById('secret-flower-modal');
        const starBtn = document.getElementById('secret-star-btn');
        const closeBtn = document.getElementById('btn-close-secret-modal');
        const dismissBtn = document.getElementById('btn-dismiss-secret-modal');

        this.secretFlowerAttempts = 0;
        this.secretPhotoIdx = 0;
        this.secretFlowerRevealed = false;

        if (starBtn) {
            starBtn.addEventListener('click', (e) => {
                if (window.birthdaySound) window.birthdaySound.playMagicChime();
                if (window.fireworks) window.fireworks.burstConfetti(e.clientX, e.clientY, 25);
                this.openSecretFlowerModal();
            });
        }

        if (closeBtn) closeBtn.addEventListener('click', () => this.closeSecretFlowerModal());
        if (dismissBtn) dismissBtn.addEventListener('click', () => this.closeSecretFlowerModal());

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeSecretFlowerModal();
            });
        }

        this.renderSecretFlowerCards();
        this.initSecretGalleryControls();
    }

    openSecretFlowerModal() {
        const modal = document.getElementById('secret-flower-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeSecretFlowerModal() {
        const modal = document.getElementById('secret-flower-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    renderSecretFlowerCards() {
        const grid = document.getElementById('secret-flower-grid');
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
                <div class="flower-select-tag">${CONFIG.flowerGame.selectTag || 'CHỌN BÔNG NÀY'}</div>
            `;

            card.addEventListener('click', (e) => this.handleSecretFlowerClick(card, flower, e));
            grid.appendChild(card);
        });
    }

    handleSecretFlowerClick(card, flower, event) {
        if (this.secretFlowerRevealed) return;

        this.secretFlowerAttempts++;
        if (window.birthdaySound) window.birthdaySound.playMechanicalClick();

        card.classList.add('picked-shake');
        setTimeout(() => card.classList.remove('picked-shake'), 450);

        this.spawnFlowerBurst(event ? event.clientX : null, event ? event.clientY : null);

        const attemptsNum = document.getElementById('secret-flower-attempts-num');
        if (attemptsNum) {
            attemptsNum.textContent = `${Math.min(3, this.secretFlowerAttempts)} / 3`;
        }

        const feedbackBox = document.getElementById('secret-flower-feedback');
        const failMsgs = (CONFIG.flowerGame && CONFIG.flowerGame.failMessages) || [
            "Hoa này rất đẹp, nhưng vẫn chưa phải đáp án chính xác đâu nha. Thử chọn lại xem sao!",
            "Vẫn chưa chính xác nè. Bông hoa đẹp nhất không nằm trong số này đâu. Bạn chọn tiếp thử đi!",
            "Vẫn chưa đúng rồi. Thật ra không có loài hoa tự nhiên nào ở đây là đẹp nhất cả..."
        ];

        const currentMsg = failMsgs[Math.min(this.secretFlowerAttempts - 1, failMsgs.length - 1)];
        if (feedbackBox) {
            feedbackBox.textContent = currentMsg;
            feedbackBox.style.display = 'block';
            feedbackBox.classList.remove('feedback-anim');
            void feedbackBox.offsetWidth;
            feedbackBox.classList.add('feedback-anim');
        }

        // Sau 3 lần chọn -> Mở bật mí bí mật
        if (this.secretFlowerAttempts >= 3) {
            this.secretFlowerRevealed = true;
            setTimeout(() => {
                this.revealSecretFlowerConclusion();
            }, 1100);
        }
    }

    revealSecretFlowerConclusion() {
        const grid = document.getElementById('secret-flower-grid');
        const feedbackBox = document.getElementById('secret-flower-feedback');
        const conclusionCard = document.getElementById('secret-flower-conclusion');
        const attemptsNum = document.getElementById('secret-flower-attempts-num');

        if (grid) grid.style.display = 'none';
        if (feedbackBox) feedbackBox.style.display = 'none';
        if (attemptsNum) attemptsNum.textContent = "3 / 3";

        if (conclusionCard) {
            conclusionCard.style.display = 'flex';
            conclusionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (window.birthdaySound) window.birthdaySound.playMagicChime();
        if (window.fireworks) {
            window.fireworks.burstConfetti();
            window.fireworks.celebrateSequence(3200);
        }

        this.renderSecretPhoto(0);
    }

    initSecretGalleryControls() {
        const prevBtn = document.getElementById('btn-secret-prev');
        const nextBtn = document.getElementById('btn-secret-next');
        const dotsContainer = document.getElementById('secret-photo-dots');
        const thumbsContainer = document.getElementById('secret-thumbnails');

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
                    this.renderSecretPhoto(idx);
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
                    }
                };
                thumb.addEventListener('click', () => {
                    if (window.birthdaySound) window.birthdaySound.playCameraShutter();
                    this.renderSecretPhoto(idx);
                });
                thumbsContainer.appendChild(thumb);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playCameraShutter();
                const newIdx = (this.secretPhotoIdx - 1 + images.length) % images.length;
                this.renderSecretPhoto(newIdx);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (window.birthdaySound) window.birthdaySound.playCameraShutter();
                const newIdx = (this.secretPhotoIdx + 1) % images.length;
                this.renderSecretPhoto(newIdx);
            });
        }
    }

    renderSecretPhoto(idx) {
        const images = (CONFIG.flowerGame && CONFIG.flowerGame.conclusion && CONFIG.flowerGame.conclusion.images) || [];
        if (!images[idx]) return;

        this.secretPhotoIdx = idx;
        const imgEl = document.getElementById('secret-current-img');
        const counterEl = document.getElementById('secret-gallery-idx');
        const dots = document.querySelectorAll('#secret-photo-dots .film-dot');
        const thumbs = document.querySelectorAll('#secret-thumbnails .flower-thumb-item');

        if (counterEl) counterEl.textContent = `BỨC ẢNH 0${idx + 1}`;

        if (imgEl) {
            imgEl.style.opacity = '0.3';
            imgEl.onerror = () => {
                const src = imgEl.getAttribute('src');
                if (src && src.endsWith('.png')) imgEl.src = src.replace('.png', '.jpg');
            };
            setTimeout(() => {
                imgEl.src = images[idx];
                imgEl.style.opacity = '1';
            }, 100);
        }

        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
    }

    spawnFlowerBurst(x, y) {
        const icons = ['🌸', '✨', '💖', '⭐', '🌷'];
        const originX = x || window.innerWidth / 2;
        const originY = y || window.innerHeight / 2;

        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            p.className = 'floating-flower-particle';
            p.textContent = icons[Math.floor(Math.random() * icons.length)];
            p.style.left = `${originX}px`;
            p.style.top = `${originY}px`;

            const angle = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 80;
            p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1200);
        }
    }
}

window.VintageQuestController = VintageQuestController;
