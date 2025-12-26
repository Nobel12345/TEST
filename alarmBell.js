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
    
    // LAYER 1: The Deep Hum (The body of the sound)
    // Extended to 8.0 seconds
    this.createLayer(300, "sine", t, 8.0, 0.5); 

    // LAYER 2: The Harmony (Perfect Fifth)
    // Extended to 7.0 seconds (fades slightly before the deep hum)
    this.createLayer(450, "sine", t, 7.0, 0.3);

    // LAYER 3: The Octave (Clarity)
    // Extended to 6.0 seconds
    this.createLayer(600, "sine", t, 6.0, 0.3);

    // LAYER 4: The Metallic Strike (High pitch)
    // These fade out faster (2-3 seconds) to simulate the initial hit
    this.createLayer(1200, "triangle", t, 2.0, 0.1);
    this.createLayer(1500, "sine", t, 2.5, 0.1);
  }

  createLayer(freq, type, startTime, duration, maxVol) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    // The Volume Envelope
    gain.gain.setValueAtTime(0, startTime);
    
    // Attack: Fast rise to max volume (0.05s)
    gain.gain.linearRampToValueAtTime(maxVol, startTime + 0.05);
    
    // Decay: Slow fade to silence over the full 'duration'
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

export const alarm = new CodedBell();
