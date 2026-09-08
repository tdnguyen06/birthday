// =================================================================
// 🎵 NATIVE WEB AUDIO API SYNTHESIZER (100% Không Cần Mạng - Chạy Luôn)
// =================================================================

class BirthdaySoundEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.currentTimeout = null;
        this.step = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Nốt nhạc dạng Music Box (Hộp nhạc chuông pha lê)
    playTone(freq, duration, type = 'sine', gainVal = 0.25) {
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Hiệu ứng ngân vang như tiếng chuông hộp nhạc
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // Hiệu ứng âm thanh khi mở khóa thành công (Magic Chime)
    playMagicChime() {
        this.init();
        const chimes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        chimes.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 1.2, 'triangle', 0.2);
            }, index * 120);
        });
    }

    // Hiệu ứng âm thanh khi bắt tim (Pop Sound)
    playPop() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    // Giai điệu bài hát Happy Birthday lãng mạn lặp vô tận (Music Box Melody)
    startBirthdayMelody() {
        this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.step = 0;

        // Tần số các nốt: C4, D4, E4, F4, G4, A4, Bb4, B4, C5, D5, E5, F5
        const N = {
            C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
            A4: 440.00, Bb4: 466.16, B4: 493.88, C5: 523.25, D5: 587.33,
            E5: 659.25, F5: 698.46, REST: 0
        };

        const melody = [
            // Happy birthday to you
            { f: N.C4, d: 0.35 }, { f: N.C4, d: 0.35 }, { f: N.D4, d: 0.7 }, { f: N.C4, d: 0.7 },
            { f: N.F4, d: 0.7 }, { f: N.E4, d: 1.2 }, { f: N.REST, d: 0.3 },

            // Happy birthday to you
            { f: N.C4, d: 0.35 }, { f: N.C4, d: 0.35 }, { f: N.D4, d: 0.7 }, { f: N.C4, d: 0.7 },
            { f: N.G4, d: 0.7 }, { f: N.F4, d: 1.2 }, { f: N.REST, d: 0.3 },

            // Happy birthday dear princess
            { f: N.C4, d: 0.35 }, { f: N.C4, d: 0.35 }, { f: N.C5, d: 0.7 }, { f: N.A4, d: 0.7 },
            { f: N.F4, d: 0.7 }, { f: N.E4, d: 0.7 }, { f: N.D4, d: 1.0 }, { f: N.REST, d: 0.3 },

            // Happy birthday to you
            { f: N.Bb4, d: 0.35 }, { f: N.Bb4, d: 0.35 }, { f: N.A4, d: 0.7 }, { f: N.F4, d: 0.7 },
            { f: N.G4, d: 0.7 }, { f: N.F4, d: 1.5 }, { f: N.REST, d: 0.6 }
        ];

        const playNextNote = () => {
            if (!this.isPlaying) return;

            const note = melody[this.step];
            if (note.f > 0) {
                // Đánh nốt chính (chuông Music Box ngọt ngào)
                this.playTone(note.f, note.d * 1.5, 'sine', 0.22);
                // Hòa âm nhẹ
                this.playTone(note.f * 0.5, note.d * 1.8, 'triangle', 0.1);
            }

            this.step = (this.step + 1) % melody.length;
            this.currentTimeout = setTimeout(playNextNote, note.d * 750);
        };

        playNextNote();
    }

    stopBirthdayMelody() {
        this.isPlaying = false;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.stopBirthdayMelody();
            return false;
        } else {
            this.startBirthdayMelody();
            return true;
        }
    }
}

// Khởi tạo đối tượng toàn cục
window.birthdaySound = new BirthdaySoundEngine();
