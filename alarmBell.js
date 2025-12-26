// alarmBell.js

class CodedBell {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  play() {
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const t = this.audioCtx.currentTime;
    
    // We create multiple layers to simulate a real physical object
    // Base frequency (warmth)
    this.createLayer(300, "sine", t, 4.0, 0.4); 

    // The Octave (clarity)
    this.createLayer(600, "sine", t, 3.0, 0.3);

    // The Fifth (richness)
    this.createLayer(450, "sine", t, 3.5, 0.2);

    // The Metallic "Ting" (high pitch, fades fast)
    this.createLayer(1200, "triangle", t, 0.8, 0.05);
    this.createLayer(1500, "sine", t, 0.6, 0.05);
  }

  createLayer(freq, type, startTime, duration, maxVol) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    // The "Envelope" (How the sound moves)
    gain.gain.setValueAtTime(0, startTime);
    
    // Fast attack (hit the bell)
    gain.gain.linearRampToValueAtTime(maxVol, startTime + 0.02);
    
    // Long exponential decay (the pleasant humming tail)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

// Export the single instance
export const alarm = new CodedBell();
