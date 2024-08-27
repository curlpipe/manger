<script setup>
import { ref } from 'vue';

defineProps({
    meals: Array,
    plans: Array,
    type: String,
});

const meal = ref(1);
const kind = ref('breakfast');
const plan = ref(1);
</script>

<template>
    <div class="popup">
        <button style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px; width: 40px; height: 38px" class="red-bg" @click="$emit('closePopup')">X</button>
        <h4>Select your meal</h4>
        <form @submit.prevent="$emit('selectMeal', meal, kind)">
            <label for="meal">Meal: </label>
            <select id="meal" name="meal" v-model="meal">
                <option v-for="meal in meals" :value="meal.id">{{ meal.name }}</option>
            </select>
            <br>
            <div v-if="type == 'schedule'">
                <label for="kind">For: </label>
                <select id="kind" name="kind" v-model="kind">
                    <option v-for="at in ['breakfast', 'lunch', 'brunch', 'dinner', 'snack']" :value="at">{{ at }}</option>
                </select>
                <br>
            </div>
            <input type="submit" value="Select">
        </form>
        <div v-if="type == 'schedule'">
            <hr>
            <h4>Activate a meal plan</h4>
            <form @submit.prevent="$emit('activatePlan', plan)">
                <label for="meal">Plan: </label>
                <select id="plan" name="plan" v-model="plan">
                    <option v-for="plan in plans" :value="plan.id">{{ plan.name }}</option>
                </select>
                <br>
                <input type="submit" value="Activate">
            </form>
        </div>
    </div>
</template>
