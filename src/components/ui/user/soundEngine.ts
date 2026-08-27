// soundEngine.ts
class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. Score Beep Sound
  playScoreSound() {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5 note
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1); // A5 note

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // 2. Car Crash Sound (White Noise + Low Frequency Frequency Pitch)
  playCrashSound() {
    this.init();
    if (!this.ctx) return;

    // Create Noise Buffer for Explosion Feel
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // 3. Continuous Engine Sound Synthesizer
  createEngineSound() {
    this.init();
    if (!this.ctx) return null;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, this.ctx.currentTime); // Low engine pitch

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime); // Soft volume

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    return {
      start: () => osc.start(),
      stop: () => osc.stop(),
      setPitch: (speed: number) => {
        if (this.ctx) {
          osc.frequency.setTargetAtTime(50 + speed * 12, this.ctx.currentTime, 0.1);
        }
      },
    };
  }
}

export const sound = new SoundEngine();