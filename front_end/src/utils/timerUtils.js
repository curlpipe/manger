import Storage from '@/utils/storageUtils.js';
import dateUtils from '@/utils/dateUtils.js';

const tick = 10;

class Timer {
    constructor(id, init) {
        this.key = 'timer-' + id.toString();
        this.storage = new Storage('localStorage');
        this.id = id;
        this.init = init * 60;
        this.state = 'idle';
        this.countdown = null;
        this.beeper = null;
        this.forceRefresh = 0;
        this.initTimer();
    }

    // Initialise timer
    initTimer() {
        this.set(this.init);
    }

    // Transition function
    transition(action) {
        switch (this.state) {
            case "idle":
                if (action == "start") {
                    this.state = "running";
                    this.countdown = setInterval(() => this.decrement(this), tick);
                }
                break;
            case "running":
                switch (action) {
                    case "pause":
                        this.state = "paused";
                        clearInterval(this.countdown);
                        break;
                    case "reset":
                        this.state = "idle";
                        clearInterval(this.countdown);
                        this.initTimer();
                        break;
                }
                break;
            case "paused":
                switch (action) {
                    case "start":
                        this.state = "running";
                        this.countdown = setInterval(() => this.decrement(this), tick);
                        break;
                    case "reset":
                        this.state = "idle";
                        clearInterval(this.countdown);
                        this.initTimer();
                        break;
                }
                break;
            case "ring":
                if (action == "dismiss") {
                    this.state = "idle";
                    clearInterval(this.countdown);
                    clearInterval(this.beeper);
                    document.getElementById(this.key).classList.remove("fade-in-out");
                    this.initTimer();
                }
                break;
        }

        if (action == "plusOne") {
            this.set(this.get() + 60);
        }
        this.rerender();
    }

    // Decrement function
    decrement(t) {
        let value = t.get() - 1;
        // Decrement the timer
        t.set(value);
        // Check if the time is up
        if (value == 0) {
            // Time is up! Move state!
            t.state = "ring";
            clearInterval(this.countdown);
            this.beep();
            document.getElementById(this.key).classList.add("fade-in-out");
        }
        t.rerender();
    }

    // Play a beep sound
    beep() {
        let sound = new Audio('/assets/alarm.mp3');
        this.beeper = setInterval(() => sound.play(), 700);
    }

    // Set value
    set(val) {
        this.storage.setItem(this.key, val);
    }

    // Get value
    get() {
        return this.storage.getItem(this.key);
    }

    // Clean up any remaining mess
    clean() {
        document.getElementById(this.key).classList.add("fade-in-out");
        clearInterval(this.countdown);
        clearInterval(this.beeper);
    }

    // Force a re-render
    rerender() {
        this.forceRefresh += 1;
    }
}

export default Timer;
