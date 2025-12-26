// alarmBell.js

class CodedBell {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.activeOscillators = []; // Track sounds to stop them later
  }

  // 1. The Single Ding (Old one)
  playDing() {
    this.resumeCtx();
    const t = this.audioCtx.currentTime;
    this.createTone(500, t, 2.0, "sine", 0.5); // Fundamental
    this.createTone(1000, t, 1.5, "sine", 0.3); // Overtone
    this.createTone(1500, t, 1.0, "sine", 0.1); // High overtone
  }

  // 2. The Kitchen Alarm (New! The "Brrrr-ring")
  playKitchenRing() {
    this.resumeCtx();
    const t = this.audioCtx.currentTime;
    
    // Create the "Hammer" (LFO) - This turns volume on/off rapidly
    const hammer = this.audioCtx.createOscillator();
    hammer.type = "square"; // Hard on/off switching
    hammer.frequency.value = 14; // Speed of the ringing (14 hits per second)

    // Create the Master Gain for this sound
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.value = 0; // Start silent

    // Connect Hammer to Gain (The hammer controls the volume)
    // We use a separate gain node to scale the hammer effect
    const hammerGain = this.audioCtx.createGain();
    hammerGain.gain.value = 0.5; // Depth of the ringing
    hammer.connect(hammerGain);
    hammerGain.connect(masterGain.gain);

    masterGain.connect(this.audioCtx.destination);

    // Create the "Metal Shell" sound (The actual tone)
    // Kitchen timers are usually dual-tone and dissonant
    this.createSustainedTone(800, "triangle", masterGain); // Main body
    this.createSustainedTone(840, "triangle", masterGain); // Dissonance (metal clash)
    this.createSustainedTone(2400, "sine", masterGain);    // High metallic ping

    // Start the hammer
    hammer.start(t);
    this.activeOscillators.push(hammer);

    // Stop automatically after 2 seconds (or remove this to make it infinite)
    this.stop(2.5);
  }

  // Helper: Creates a single decaying note (for the Ding)
  createTone(freq, startTime, duration, type, vol) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Helper: Creates a continuous tone (for the Ring)
  createSustainedTone(freq, type, destinationNode) {
    const osc = this.audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(destinationNode);
    osc.start();
    this.activeOscillators.push(osc);
  }

  // Helper: Ensures AudioContext is running
  resumeCtx() {
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Stop all sounds immediately
  stop(delay = 0) {
    const stopTime = this.audioCtx.currentTime + delay;
    this.activeOscillators.forEach(osc => {
      osc.stop(stopTime);
    });
    this.activeOscillators = [];
  }
}

export const alarm = new CodedBell();
