// alarmBell.js

class CodedBell {
  constructor() {
    // Initialize the AudioContext (browsers require a user interaction first)
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  play() {
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const t = this.audioCtx.currentTime;

    // 1. The Fundamental Tone (The main pitch)
    this.createOscillator(500, t, 2.0); // 500Hz, 2 seconds long

    // 2. The Overtones (These add the "metallic" quality)
    // Bells have inharmonic overtones. We add higher frequencies that fade faster.
    this.createOscillator(1000, t, 1.5); // 2x freq
    this.createOscillator(1500, t, 1.0); // 3x freq
    this.createOscillator(2100, t, 0.8); // 4.2x freq (slightly dissonant for realism)
  }

  createOscillator(freq, startTime, duration) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.frequency.value = freq;
    osc.type = "sine"; // Sine waves are best for bells

    // Connect oscillator to gain (volume) -> destination (speakers)
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    // Envelope: "Ding" sound needs immediate attack and exponential decay
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.5, startTime + 0.01); // Fast attack (hit)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Long tail

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

// Export for use
export const alarm = new CodedBell();
