<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import alarmSound from '/assets/alarm.mp3';

const props = defineProps({
    id: Number,
    value: Number,
});

onBeforeUnmount(() => {
    clearInterval(countdown);
});

var minute = ref(props.value);
var seconds = ref(0);

const decrement = () => {
    try {
        document.getElementById(`timer-${props.id}`).classList.remove("fade-in-out");
    } catch (error) {
        clearInterval(countdown);
    }
    if (seconds.value == 0 && minute.value == 0) {
        clearInterval(countdown);
        document.getElementById(`timer-${props.id}`).classList.add("fade-in-out");
        let audio = new Audio(alarmSound);
        audio.play();
    } else if (seconds.value == 0) {
        seconds.value = 59;
        minute.value -= 1;
    } else {
        seconds.value -= 1;
    }
};

const reset = () => {
    document.getElementById(`timer-${props.id}`).classList.remove("fade-in-out");
    seconds.value = 0;
    minute.value = props.value;
};

const plusOne = () => {
    document.getElementById(`timer-${props.id}`).classList.remove("fade-in-out");
    minute.value += 1;
};

const stop = () => {
    minute.value = 0;
    seconds.value = 0;
};

let countdown;

const go = () => {
    countdown = setInterval(decrement, 1000);
};
</script>

<template>
    <div style="width: 180px; padding: 8px; margin: 15px;" class="border border-rnd">
        <h2 :id="'timer-' + props.id.toString()" style="text-align: center;">{{ minute }}:{{ seconds.toString().padStart(2, '0') }}</h2>
        <div style="display: flex;">
            <button @click="go" class="timer-btn green-bg">Start</button>
            <div style="width: 10px;"></div>
            <button @click="plusOne" class="timer-btn">+1</button>
            <div style="width: 10px;"></div>
            <button @click="reset" class="timer-btn orange-bg">Reset</button>
            <div style="width: 10px;"></div>
            <button @click="stop" class="timer-btn red-bg">Stop</button>
        </div>
    </div>
</template>
