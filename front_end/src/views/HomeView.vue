<script setup>
import { ref, onMounted } from 'vue';
import { useIngredientStore } from '@/stores/useIngredientStore.js';
import { useMealStore } from '@/stores/useMealStore.js';
import { useMealPlanStore } from '@/stores/useMealPlanStore.js';
import axios from 'axios';

const ingredientStore = useIngredientStore();
const mealStore = useMealStore();
const mealPlanStore = useMealPlanStore();

const backup = ref('');

onMounted(async () => {
    await ingredientStore.query();
    await mealStore.query();
    await mealPlanStore.query();
    await exportData();
});

const importData = async () => {
    const data = JSON.parse(backup.value);
    console.log(data);
    // Clear the databases
    // Upload ingredients
    // Upload meals
    // Attach ingredients to meals
    // Upload meal plans
    // Upload schedule
};

const exportData = async () => {
    let result = {};
    result.ingredients = ingredientStore.getIngredients;
    result.ingredients.forEach(i => { 
        delete i['createdAt']; 
        delete i['updatedAt'];
    });
    result.meals = mealStore.getMeals;
    result.meals.forEach(m => {
        delete m['createdAt'];
        delete m['updatedAt'];
        delete m['explanation'];
        delete m['score'];
        m.ingredients.forEach(i => {
            delete i['createdAt']; 
            delete i['updatedAt'];
            delete i['name'];
            delete i['quantity'];
            delete i['unit'];
            i['amount'] = i['MealIngredients'].amount;
            delete i['MealIngredients'];
        });
    });
    result.plans = mealPlanStore.getMealPlans;
    result.plans.forEach(p => {
        delete p['createdAt'];
        delete p['updatedAt'];
    });
    result.schedule = await axios.get('/api/schedule');
    result.schedule = result.schedule.data;
    Object.keys(result.schedule).forEach(s => {
        result.schedule[s].forEach(m => {
            delete m.createdAt;
            delete m.updatedAt;
            delete m.date;
        });
    });
    backup.value = JSON.stringify(result);
};

</script>

<template>
    <h4>Welcome to Manger</h4>
    <p>To get started, click on one of the links below</p>
    <br>
    <RouterLink to="/pantry"><h5 class="blue-fg">Pantry</h5></RouterLink>
    <p style="width: 400px">The pantry is where you can record the ingredients that you already have, which can be used to suggest meals and generate accurate shopping lists</p>
    <br>
    <RouterLink to="/cookbook"><h5 class="blue-fg">Cookbook</h5></RouterLink>
    <p style="width: 400px">The cookbook is where you can record a list of recipes that you can add to meal plans and the schedule</p>
    <br>
    <RouterLink to="/mealplans"><h5 class="blue-fg">Meal Plans</h5></RouterLink>
    <p style="width: 400px">Meal plans are where you can build reusable meal plans that you can activate in the schedule</p>
    <br>
    <RouterLink to="/getcooking"><h5 class="blue-fg">Get Cooking</h5></RouterLink>
    <p style="width: 400px">Get cooking is where you can find the schedule of meals to eat and access the recipe instructions to help guide you as you cook</p>
    <br>
    <h5>Backup Data</h5>
    <form style="display: flex; flex-direction: column; gap: 10px;" @submit.prevent="import">
        <button @click="importData" style="width: 100px;">Import</button>
        <textarea id="backup" name="backup" v-model="backup" cols="30" rows="30"></textarea>
    </form>
</template>
