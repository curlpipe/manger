<script setup>
import MealOverview from '@/components/cookbook/MealOverview.vue';
import { ref, onMounted } from 'vue';

defineProps({
    meals: Array,
    plans: Array,
    type: String,
});

onMounted(() => {
    document.querySelector('.popup').style.height = document.querySelector('#app').offsetHeight + 'px';
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
            <a href="#mealplanactivate">If you are looking to activate a meal plan, please click here</a>
            <br>
            <br>
            <p>Choose what meal of the day you want to add to, and then select your meal from the list below</p>
            <p>When you are happy, press the select button to add the meal to the schedule</p>
            <br>
            <p v-if="meals.find(m => m.id == meal) != null">Selected: {{ meals.find(m => m.id == meal).name }}</p>
            <label for="kind">For: </label>
            <select id="kind" name="kind" v-model="kind">
                <option v-for="at in ['breakfast', 'lunch', 'brunch', 'dinner', 'snack']" :value="at">{{ at }}</option>
            </select>
            <br>
            <input type="submit" value="Select">
        </form>
        <div style="max-width: 90%;">
            <br>
            <br>
            <MealOverview v-if="type == 'schedule'" :meals="meals" @select-meal="selectMeal" />
            <MealOverview v-if="type == 'plan'" :meals="meals" @select-meal="id => $emit('selectMeal', id, kind)" />
        </div>
        <div v-if="type == 'schedule'" id="mealplanactivate">
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
