<script setup>
import MealOverview from '@/components/cookbook/MealOverview.vue';
import { ref } from 'vue';

defineProps({
    meals: Array,
    plans: Array,
    type: String,
});

const meal = ref(1);
const kind = ref('breakfast');
const plan = ref(1);

const selectMeal = (id) => {
    meal.value = id;
};

</script>

<template>
    <div class="popup">
        <button style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px; width: 40px; height: 38px" class="red-bg" @click="$emit('closePopup')">X</button>
        <h4>Select your meal</h4>
        <form v-if="type == 'schedule'" @submit.prevent="$emit('selectMeal', meal, kind)">
            <br>
            <label for="kind">For: </label>
            <select id="kind" name="kind" v-model="kind">
                <option v-for="at in ['breakfast', 'lunch', 'brunch', 'dinner', 'snack']" :value="at">{{ at }}</option>
            </select>
            <br>
            <input type="submit" value="Select">
        </form>
        <div style="max-width: 90%;">
            <br>
            <MealOverview v-if="type == 'schedule'" :meals="meals" @select-meal="selectMeal" />
            <MealOverview v-if="type == 'plan'" :meals="meals" @select-meal="id => $emit('selectMeal', id, kind)" />
        </div>
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
