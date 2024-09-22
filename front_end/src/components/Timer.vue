<script setup>
import Storage from '@/utils/storageUtils.js';
import dateUtils from '@/utils/dateUtils.js';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import alarmSound from '/assets/alarm.mp3';

const props = defineProps({
    id: Number,
    value: Number,
});

const timerStorage = new Storage('localStorage');

const tick = 50;
let countdown;
let count = ref(0);
var state = ref("idle");

onMounted(() => {
    // Timers always start in idle
    state.value = "idle";
    // TODO: set the timer to the local value
    initTimer();
});

onBeforeUnmount(() => {
    clearInterval(countdown);
    timerStorage.removeItem('timer-' + props.id);
});

const initTimer = () => {
    timerStorage.setItem('timer-' + props.id, props.value * 60);
    count.value = props.value * 60;
};

// state transition function
const transition = (action) => {
    switch (state.value) {
        case "idle":
            if (action == "start") {
                state.value = "running";
                countdown = setInterval(decrement, tick);
            }
            break;
        case "running":
            switch (action) {
                case "pause":
                    state.value = "paused";
                    clearInterval(countdown);
                    break;
                case "reset":
                    state.value = "idle";
                    clearInterval(countdown);
                    initTimer();
                    break;
            }
            break;
        case "paused":
            switch (action) {
                case "start":
                    state.value = "running";
                    countdown = setInterval(decrement, tick);
                    break;
                case "reset":
                    state.value = "idle";
                    clearInterval(countdown);
                    initTimer();
                    break;
            }
            break;
        case "ring":
            if (action == "dismiss") {
                state.value = "idle";
                clearInterval(countdown);
                document.getElementById(`timer-${props.id}`).classList.remove("fade-in-out");
                initTimer();
            }
            break;
    }

    if (action == "plusOne") {
        let name = 'timer-' + props.id;
        let value = timerStorage.getItem(name) + 60;
        timerStorage.setItem(name, value);
        count.value = value;
    }
};

const decrement = () => {
    let name = 'timer-' + props.id;
    let value = timerStorage.getItem(name) - 1;
    // Decrement the timer
    timerStorage.setItem(name, value);
    count.value = value;
    // Check if time is up yet
    if (value == 0) {
        // Time is up! Move state!
        state.value = "ring";
        clearInterval(countdown);
        document.getElementById(`timer-${props.id}`).classList.add("fade-in-out");
    }

};


</script>

<template>
    <div style="width: 180px; padding: 8px; margin: 15px;" class="border border-rnd">
        <h2 :id="'timer-' + props.id.toString()" style="text-align: center;">
            {{ dateUtils.formatTime(count) }}
        </h2>
        <div style="display: flex; flex-direction: row; gap: 10px; justify-content: space-around;">
            <button v-if="['idle', 'paused'].includes(state)" @click="transition('start')" class="timer-btn green-bg">&#9658;</button>
            <button v-if="['running'].includes(state)" @click="transition('pause')" class="timer-btn orange-bg"><b>&#124; &#124;</b></button>
            <button v-if="['running', 'paused'].includes(state)" @click="transition('plusOne')" class="timer-btn"><b>+1</b></button>
            <button v-if="['running', 'paused'].includes(state)" @click="transition('reset')" class="timer-btn red-bg">&#9632;</button>
            <button v-if="['ring'].includes(state)" @click="transition('dismiss')" class="timer-btn red-bg"><b>Dismiss</b></button>
        </div>
    </div>
</template>
