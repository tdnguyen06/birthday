// =================================================================
// 🎵 ANALOG AUDIO & RETRO SYNTHESIZER ENGINE (Web Audio API)
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

    // Nốt nhạc ấm áp kiểu đàn Acoustic / Music Box
    playTone(freq, duration, type = 'sine', gainVal = 0.2) {
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // Âm thanh đàn Piano ấm áp, chân thực
    playPianoNote(noteIndex = 0, duration = 0.8) {
        this.init();
        if (!this.ctx) return;
        const freqs = [
            261.63, // 0: C4 (Đô)
            293.66, // 1: D4 (Rê)
            329.63, // 2: E4 (Mi)
            349.23, // 3: F4 (Fa)
            392.00, // 4: G4 (Sol)
            440.00, // 5: A4 (La)
            493.88, // 6: B4 (Si)
            523.25, // 7: C5 (Đô cao)
            587.33, // 8: D5 (Rê cao)
            659.25  // 9: E5 (Mi cao)
        ];
        const freq = typeof noteIndex === 'number' ? (freqs[noteIndex % freqs.length] || 261.63) : noteIndex;
        const now = this.ctx.currentTime;

        // Âm cơ bản (fundamental)
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now);
        gain1.gain.setValueAtTime(0.28, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + duration);

        // Họa âm 2 (2nd harmonic)
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, now);
        gain2.gain.setValueAtTime(0.12, now);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now);
        osc2.stop(now + duration * 0.6);
    }

    // Tiếng vỗ cánh Flappy Bird (Flap Sound)
    playFlap() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Tiếng ăn điểm Flappy Bird (Point Chime)
    playPoint() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(784, now); // G5
        osc.frequency.setValueAtTime(1046.5, now + 0.07); // C6

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    // Tiếng va chạm Flappy Bird (Hit Thud)
    playHit() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Âm thanh bong bóng / bắt quà pop nhẹ (Bubble Pop / Item Catch)
    playPop() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Âm thanh nút bấm cơ học Vintage (Cassette Button / Mechanical Switch Click)
    playMechanicalClick() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    // Âm thanh màn trập máy ảnh cơ 35mm (Camera Shutter Snap)
    playCameraShutter() {
        this.init();
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1800;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();

        setTimeout(() => {
            if (!this.ctx) return;
            const windOsc = this.ctx.createOscillator();
            const windGain = this.ctx.createGain();
            windOsc.type = 'sawtooth';
            windOsc.frequency.setValueAtTime(260, this.ctx.currentTime);
            windOsc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.12);
            windGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            windGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
            windOsc.connect(windGain);
            windGain.connect(this.ctx.destination);
            windOsc.start();
            windOsc.stop(this.ctx.currentTime + 0.12);
        }, 60);
    }

    // Âm thanh nhúng khay hóa chất phòng tối (Chemical Splash)
    playLiquidDip() {
        this.init();
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.12;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }

    // Tiếng tích tắc đồng hồ phòng tối (Darkroom Timer Tick)
    playTimerTick() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.02);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.02);
    }

    // Tiếng còi buzzer khi tráng ảnh hoàn thành hoặc trả lời đúng (Success Chime)
    playSuccessChord() {
        this.init();
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 0.4, 'triangle', 0.15);
            }, idx * 70);
        });
    }

    // Tiếng còi khi trả lời sai (Wrong Buzz)
    playWrongBuzz() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.setValueAtTime(120, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    // Tiếng máy chiếu phim 8mm đang quay (8mm Projector Motor Hum)
    playProjectorStart() {
        this.init();
        if (!this.ctx) return;
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(80 + i * 5, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.08);
            }, i * 90);
        }
    }

    // Tiếng máy đánh chữ Vintage (Typewriter Key Clack)
    playTypewriterKey() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700 + Math.random() * 200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.035);
    }

    // Tiếng nhiễu sóng Radio (Radio Static Static Burst khi dò đài)
    playRadioStatic(intensity = 0.1) {
        this.init();
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * intensity;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 800;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }

    // Hiệu ứng âm thanh khi mở khóa thành công (Magic Warm Chime)
    playMagicChime() {
        this.init();
        const chimes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        chimes.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 1.2, 'triangle', 0.2);
            }, index * 100);
        });
    }

    // Tiếng đóng dấu sáp đỏ (Wax Seal Thud)
    playWaxStamp() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.18);
    }

    // Âm thanh Trống Bass / Kick (Punchy 808 Electronic Kick)
    playKick() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.09);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    // Âm thanh Snare / Vỗ tay (Snappy Dance Snare)
    playSnare() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Tiếng ồn trắng (Noise burst)
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 900;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);

        // Body tone cho snare
        const osc = this.ctx.createOscillator();
        const toneGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);
        toneGain.gain.setValueAtTime(0.18, now);
        toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(toneGain);
        toneGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }

    // Âm thanh Hi-Hat (Disco / Retro Hi-Hat)
    playHiHat(isOpen = false) {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const dur = isOpen ? 0.09 : 0.035;

        const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 8500;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(isOpen ? 0.12 : 0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
    }

    // Âm Bass Synth dồn dập & nảy (Funky Synth Bass)
    playSynthBass(freq, dur = 0.16) {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(160, now + dur);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + dur);
    }

    // Giai điệu Synth Lead vui tươi & rộn ràng
    playLeadSynth(freq, dur = 0.18, gainVal = 0.15) {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'square';
        osc1.frequency.setValueAtTime(freq, now);

        // Chút detune tạo hiệu ứng dày và sôi động
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(freq * 1.004, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(gainVal, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + dur);
        osc2.stop(now + dur);
    }

    // Bật nhạc nền dồn dập, rộn ràng 130 BPM (Upbeat Retro Dance Groove)
    startBirthdayMelody() {
        this.init();
        this.isPlaying = true;
        this.step = 0;

        // 130 BPM -> 16th note step = ~115ms (dồn dập, sôi động)
        const stepTime = 115;

        // Vòng 32 bước (4 nhịp 4/4 sôi động kết hợp trống, bass & giai điệu)
        const sequence = [
            // BAR 1: F Major Groove
            { kick: true,  bass: 87.31,  lead: 523.25 }, // Do cao
            { hat: true },
            { hatOpen: true, bass: 87.31, lead: 523.25 },
            { hat: true,  bass: 174.61 },
            { kick: true,  snare: true,  bass: 87.31, lead: 587.33 }, // Re
            { hat: true },
            { hatOpen: true, bass: 174.61, lead: 523.25 },            // Do
            { hat: true,  bass: 130.81 },

            // BAR 2: C Major Groove
            { kick: true,  bass: 130.81, lead: 698.46 }, // Fa
            { hat: true },
            { hatOpen: true, bass: 130.81, lead: 659.25 }, // Mi
            { hat: true,  bass: 261.63 },
            { kick: true,  snare: true,  bass: 130.81, lead: 659.25 },
            { hat: true },
            { hatOpen: true, bass: 196.00 },
            { hat: true,  bass: 174.61 },

            // BAR 3: F / Bb Major Groove
            { kick: true,  bass: 87.31,  lead: 523.25 }, // Do cao
            { hat: true },
            { hatOpen: true, bass: 87.31, lead: 523.25 },
            { hat: true,  bass: 174.61 },
            { kick: true,  snare: true,  bass: 116.54, lead: 587.33 }, // Re
            { hat: true },
            { hatOpen: true, bass: 116.54, lead: 523.25 },            // Do
            { hat: true,  bass: 174.61 },

            // BAR 4: Upbeat Climax Turnaround
            { kick: true,  bass: 130.81, lead: 783.99 }, // Sol
            { hat: true,  lead: 783.99 },
            { hatOpen: true, bass: 196.00, lead: 698.46 }, // Fa
            { hat: true,  bass: 261.63 },
            { kick: true,  snare: true,  bass: 87.31,  lead: 698.46 },
            { hat: true,  snare: true },
            { hatOpen: true, bass: 174.61, lead: 880.00 }, // La
            { hat: true,  snare: true, bass: 130.81, lead: 698.46 }
        ];

        const tick = () => {
            if (!this.isPlaying) return;

            const current = sequence[this.step % sequence.length];

            // 1. Trống
            if (current.kick) this.playKick();
            if (current.snare) this.playSnare();
            if (current.hat) this.playHiHat(false);
            if (current.hatOpen) this.playHiHat(true);

            // 2. Bassline
            if (current.bass) this.playSynthBass(current.bass, 0.14);

            // 3. Lead synth
            if (current.lead) this.playLeadSynth(current.lead, 0.15, 0.14);

            this.step++;
            this.currentTimeout = setTimeout(tick, stepTime);
        };

        tick();
    }

    stopBirthdayMelody() {
        this.isPlaying = false;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
    }
}

window.birthdaySound = new BirthdaySoundEngine();
