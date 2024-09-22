<script setup>
import Timer from '@/components/Timer.vue';
import MealFlow from '@/components/cookbook/MealFlow.vue';
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Storage from '@/utils/storageUtils.js';

const props = defineProps({
    id: String,
});

const router = useRouter();

const flowStorage = new Storage('localStorage');

const deducted = ref(false);
const active = ref(false);
const meal = ref({});
var flowHistory = flowStorage.hasItem('flowHistory') ? flowStorage.getItem('flowHistory') : [];
var completed = [];
var current = ref(flowStorage.hasItem('flowCurrent') ? flowStorage.getItem('flowCurrent') : [0]);

onMounted(async () => {
    const response = await axios.get(`/api/meal/${props.id}`);
    meal.value = response.data;
    meal.value.instructions.forEach((i, idx) => {
        i.id = idx;
    });
    // Find the initial values (check if we're already following a meal flow)
    completed = flowStorage.hasItem('flowCompleted') ? flowStorage.getItem('flowCompleted') : [] ;
    if (flowStorage.hasItem('flowCompleted') && flowStorage.hasItem('flowCurrent')) {
        active.value = true;
    }
    // Hide navbar
    document.getElementById('navbar').style.display = 'none';
});

const done = (idx) => {
    flowHistory.push({ current: [...current.value], completed: [...completed] });
    const replaceIdx = current.value.findIndex(id => idx == id);
    
    // Find the next state
    const next = meal.value.instructions[idx].next;

    // For each next move, get the parents and check if the parents aren't still yet to be completed
    const parentsCompleted = next.map(step => {
        const parents = meal.value.instructions.filter(i => i.next.includes(step) && i.id != idx);
        return parents.every(i => completed.includes(i.id))
    }).every(i => i);


    if (parentsCompleted) {
        // We are all clear with parents
        // Remove the done step, and push on the subsequent step(s)
        let toAdd = [];
        next.forEach(step => {
            if (!(current.value.includes(step) || toAdd.includes(step))) {
                toAdd.push(step);
            }
        });
        toAdd.forEach(step => {
            current.value.push(step);
        });
        current.value[replaceIdx] = null;
    } else {
        // Still waiting on other parents, remove and come back later
        current.value[replaceIdx] = null;
    }

    // Update completed log
    completed.push(idx);

    // Cache the state of the meal flow
    flowStorage.setItem('flowCurrent', current.value);
    flowStorage.setItem('flowCompleted', completed);
    flowStorage.setItem('flowHistory', flowHistory);
};

const deduct = async () => {
    meal.value.ingredients.forEach(async i => {
        const existing = i.quantity;
        const deduct_this = i.MealIngredients.amount;
        const deduct_from = i.id;
        const new_amount = Math.max(0, existing - deduct_this);
        await axios.put(`/api/ingredient/${i.id}`, { quantity: new_amount });
    });
    deducted.value = true;
};

const leave = () => {
    flowStorage.removeItem('flowCurrent');
    flowStorage.removeItem('flowCompleted');
    flowStorage.removeItem('flowHistory');
    document.getElementById('navbar').style.display = 'flex';
    router.push('/getcooking');
};

const back = () => {
    let newState = flowHistory.pop();
    if (newState != null) {
        current.value = newState.current;
        completed = newState.completed;
        flowStorage.setItem('flowCurrent', current.value);
        flowStorage.setItem('flowCompleted', completed);
    }
};

const begin = () => {
    active.value = true;
    flowHistory.push({ current: [...current.value], completed: [...completed] });

    // Cache the state of the meal flow
    flowStorage.setItem('flowCurrent', current.value);
    flowStorage.setItem('flowCompleted', completed);
    flowStorage.setItem('flowHistory', flowHistory);
};
</script>

<template>
    <div class="bunch">
        <h4 v-if="active">Recipe - {{ meal.name }}</h4>
        <button class="red-bg" @click="leave">Exit</button>
        <button v-if="active" class="blue-bg" @click="back">Back</button>
    </div>
    <div v-if="active" class="bunch" style="width: 100%; height: calc(100% - 90px); margin-top: 20px; justify-content: center; align-items: center;">
        <div v-if="current.filter(i => i != null).length == 0" style="display: flex; flex-direction: column; align-items: center;">
            <p style="text-align: center; color: gray;">Congratulations!<br>You have completed this recipe</p>
            <button v-if="!deducted" @click="deduct">Deduct used ingredients from inventory</button>
            <p v-else style="color: grey;">&#10003; Ingredients deducted from inventory</p>
            <button @click="leave">Return to schedule</button>
        </div>
        <div class="bunch steps" style="margin: 0 !important;" v-for="step in current.sort()">
            <div v-if="step != null" style="width: 300px; display: flex; flex-direction: column; align-items: center;">
                <h5 style="text-align: center;">{{ meal.instructions[step].command }}</h5>
                <p v-if="meal.instructions[step].timer != null">(for {{ meal.instructions[step].timer }} mins)</p>
                <button class="green-bg" @click="done(step)">Done</button>
                <Timer v-if="meal.instructions[step].timer != null" :id="step" :value="meal.instructions[step].timer"/>
            </div>
        </div>
    </div>
    <div v-if="!active">
        <h4>Recipe for {{ meal.name }}</h4>
        <div style="height: 5px;"></div>
        <p>Difficulty: {{ meal.difficulty }}</p>
        <div style="height: 5px;"></div>
        <p>Estimated Time: {{ meal.time }} minutes</p>
        <div style="height: 5px;"></div>
        <p>Notes:<br>{{ meal.notes }}</p>
        <div style="height: 5px;"></div>
        <p>Ingredients:</p>
        <ul>
            <li v-for="ingredient in meal.ingredients">{{ ingredient.name }} {{ ingredient.MealIngredients.amount }}{{ ingredient.unit }}</li>
        </ul>
        <p>Instructions:</p>
        <MealFlow v-if="meal.instructions != null" :instructions="meal.instructions" />
        <button @click="begin">Start</button>
    </div>
</template>
