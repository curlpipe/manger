<script setup>
import { useMealStore } from '@/stores/useMealStore.js';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Storage from '@/utils/storageUtils.js';

const emit = defineEmits(['updateFlow']);

const props = defineProps({
    instructions: Object,
});

const addNext = (step) => {
    props.instructions[step].next.push(0);
    apply();
};

const removeNext = (step) => {
    props.instructions[step].next.pop();
    apply();
};

const addStep = (at) => {
    // Increment all steps greater than or equal to at
    props.instructions = props.instructions.forEach((i, ic) => {
        i.next.forEach((n, nc) => {
            if (n > at + 1) {
                props.instructions[ic].next[nc] += 1;
            }
        });
    });
    // Add instruction in
    props.instructions.splice(at + 1, 0, { command: "Do something", timer: null, next: [] });
    apply();
};

const removeStep = (at) => {
    props.instructions.splice(at, 1);
    // Decrement all steps greater than step
    props.instructions = props.instructions.forEach((i, ic) => {
        i.next.forEach((n, nc) => {
            if (n > at + 1) {
                props.instructions[ic].next[nc] -= 1;
            }
        });
    });
    apply();
};

const moveStepUp = (id) => {
    if (id - 1 >= 0) {
        [props.instructions[id], props.instructions[id - 1]] = 
            [props.instructions[id - 1], props.instructions[id]];
        [props.instructions[id].next, props.instructions[id - 1].next] = 
            [props.instructions[id - 1].next, props.instructions[id].next];
        apply();
    }
};

const moveStepDown = (id) => {
    if (id + 1 < props.instructions.length) {
        [props.instructions[id], props.instructions[id + 1]] = 
            [props.instructions[id + 1], props.instructions[id]];
        [props.instructions[id].next, props.instructions[id + 1].next] = 
            [props.instructions[id + 1].next, props.instructions[id].next];
        apply();
    }
};

const apply = () => {
    // Change all empty timers to null
    props.instructions.forEach(i => i.timer = i.timer == '' ? null : i.timer);
    emit('updateFlow', props.instructions);
};

</script>

<template>
    <div>
        <table>
            <thead><th>Step</th><th>Instruction</th><th>Timer</th><th>Next Step(s)</th></thead>
            <tr style="align-items: center; padding: 10px;" v-for="(instruction, c) in instructions">
                <td>
                    <p style="text-align: center;">{{ c }}</p>
                    <div class="display: flex; flex-direction: column;">
                        <a style="font-size: 25px; margin-right: 15px;" class="green-fg" @click="addStep(c)">+</a>
                        <a style="font-size: 25px;" class="red-fg" @click="removeStep(c)">&times;</a>
                        <div style="height: 10px;"></div>
                        <a style="font-size: 20px; margin-right: 10px;" class="orange-fg" @click="moveStepUp(c)">&uarr;</a>
                        <a style="font-size: 20px;" class="orange-fg" @click="moveStepDown(c)">&darr;</a>
                    </div>
                </td>
                <td><textarea type="text" cols="40" rows="2" v-model="instruction.command" @blur="apply"></textarea></td>
                <td><input type="number" v-model="instruction.timer" @blur="apply" style="width: 50px;"></td>
                <td>
                    <div class="bunch" style="align-items: center;">
                        <input v-for="(next, idx) in instruction.next" type="number" v-model="instruction.next[idx]" style="width: 50px; margin-right: 15px;" @blur="apply">
                        <form @submit.prevent="addNext(c)" style="margin: 0 !important;">
                            <button style="font-size: 17px;">+</button>
                        </form>
                        <form @submit.prevent="removeNext(c)">
                            <button style="font-size: 17px;" class="red-bg">&times;</button>
                        </form>
                    </div>
                </td>
            </tr>
        </table>
        <form @submit.prevent="apply">
            <button>Update Meal Flow</button>
        </form>
    </div>
</template>
