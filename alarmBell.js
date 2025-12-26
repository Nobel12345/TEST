// 1. Define your sound sources
const alarms = {
    bell: new Audio('path/to/alarm-bell.mp3'),
    kitchen: new Audio('path/to/alarm-kitchen.mp3')
};

// 2. Configure settings (Optional)
// Set to true if you want the alarm to ring continuously until stopped
alarms.bell.loop = true; 
alarms.kitchen.loop = true;

/**
 * Plays a specific alarm sound.
 * @param {string} type - 'bell' or 'kitchen'
 */
function playAlarm(type) {
    const sound = alarms[type];
    
    // Check if sound exists
    if (!sound) {
        console.error("Sound not found:", type);
        return;
    }

    // Reset time to 0 to restart sound if it's already playing
    sound.currentTime = 0; 
    
    // Play the sound (Browser requires user interaction first!)
    sound.play().catch(error => {
        console.warn("Autoplay blocked. User must interact with page first.", error);
    });
}

/**
 * Stops a specific alarm sound.
 * @param {string} type - 'bell' or 'kitchen'
 */
function stopAlarm(type) {
    const sound = alarms[type];
    
    if (sound) {
        sound.pause();
        sound.currentTime = 0; // Reset to start
    }
}

/**
 * Stop ALL sounds (useful for a general 'Stop' button)
 */
function stopAllAlarms() {
    Object.values(alarms).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}
