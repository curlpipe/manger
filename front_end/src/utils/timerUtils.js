import Storage from '@/utils/storageUtils.js';
import dateUtils from '@/utils/dateUtils.js';

const tick = 1000;

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
        if (!this.storage.hasItem(this.key)) {
            this.initTimer();
        }
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
            this.set(this.get().value + 60);
        }

        this.set(this.get().value);
        this.rerender();
    }

    // Decrement function
    decrement(t) {
        let value = t.get().value - 1;
        // Decrement the timer
        // Check if the time is up
        if (value == 0) {
            clearInterval(t.countdown);
            // Time is up! Move state!
            t.state = "ring";
            let sound = new Audio('/assets/alarm.mp3');
            t.beeper = setInterval(() => sound.play(), 700);
            document.getElementById(t.key).classList.add("fade-in-out");
        }
        t.set(value);
        t.rerender();
    }

    // Set value
    set(val) {
        this.storage.setItem(this.key, { state: this.state, value: val });
    }

    // Get value
    get() {
        return this.storage.getItem(this.key);
    }

    // Restore timer to a cached state
    restore() {
        let cached = this.get();
        this.state = cached.state;
        switch (cached.state) {
            case 'idle':
                // No fade-in-out animation
                try { document.getElementById(this.key).classList.remove("fade-in-out"); } catch {}
                // No beeping
                clearInterval(this.beeper);
                // No decrementing
                clearInterval(this.countdown);
                // Value = init
                this.initTimer();
                break;
            case 'running':
                // No fade-in-out animation
                try { document.getElementById(this.key).classList.remove("fade-in-out"); } catch {}
                // No beeping
                clearInterval(this.beeper);
                // YES decrementing
                this.countdown = setInterval(() => this.decrement(this), tick);
                // value = value from cache (done as standard)
                break;
            case 'paused':
                // No fade-in-out animation
                try { document.getElementById(this.key).classList.remove("fade-in-out"); } catch {}
                // No beeping
                clearInterval(this.beeper);
                // No decrementing
                clearInterval(this.countdown);
                // value = value from cache (done as standard)
                break;
            case 'ring':
                // YES fade-in-out animation
                try { document.getElementById(this.key).classList.add("fade-in-out"); } catch {}
                // YES beeping
                let sound = new Audio('/assets/alarm.mp3');
                this.beeper = setInterval(() => sound.play(), 700);
                // No decrementing
                clearInterval(this.countdown);
                // value = 0
                this.set(0);
                break;
        }
        this.rerender();
    }

    // Clean up any remaining mess
    clean() {
        try {
            document.getElementById(this.key).classList.remove("fade-in-out");
        } catch {}
        clearInterval(this.countdown);
        clearInterval(this.beeper);
        this.storage.removeItem(this.key);
    }

    // Force a re-render
    rerender() {
        this.forceRefresh += 1;
    }
}

export default Timer;
