
<script setup>
import dateUtils from '@/utils/dateUtils.js';
import { ref, onMounted } from 'vue';
import { useIngredientStore } from '@/stores/useIngredientStore.js';
import { useMealStore } from '@/stores/useMealStore.js';
import { useMealPlanStore } from '@/stores/useMealPlanStore.js';
import axios from 'axios';

const ingredientStore = useIngredientStore();
const mealStore = useMealStore();
const mealPlanStore = useMealPlanStore();

let startDate = dateUtils.getTodayDate();
let endDate = startDate;

onMounted(async () => {
    await ingredientStore.query();
    await mealStore.query();
    await mealPlanStore.query();
});

const days = ref(7);
const list = ref([]);
const idx = ref(0);
const quant = ref(0);
const end = ref(false);

const generateList = async () => {
    // 1. Get list of all the meals to be cooked in this period
    const response = await axios.get('/api/schedule');
    // Attach meal data
    Object.keys(response.data).forEach(key => {
        const value = response.data[key];
        value.forEach(meal => {
            meal.meal = mealStore.getMeals.find(m => m.id == meal.meal_id);
        });
    });
    // Get a range of dates in the period we want
    const today = dateUtils.getTodayDate();
    const range = dateUtils.getDateRange(today, days.value);
    // Add in the data from the schedule
    const allMeals = [];
    range.forEach(day => {
        const data = response.data[day];
        if (data != null) {
            data.forEach(meal => {
                allMeals.push(meal.meal);
            });
        }
    });

    let allIngredients = {};
    for (const meal of allMeals) {
        const ingredients = mealStore.getMeals.find(m => m.id == meal.id).ingredients;
        for (const ingredient of ingredients) {
            if (ingredient.id in allIngredients) {
                allIngredients[ingredient.id] += ingredient.MealIngredients.amount;
            } else {
                allIngredients[ingredient.id] = ingredient.MealIngredients.amount;
            }
        }
    }

    allIngredients = Object.keys(allIngredients)
        .map(i => { 
            const ingredient = ingredientStore.getIngredients.find(ing => ing.id == i)
            return { 
                id: ingredient.id,
                unit: ingredient.unit,
                name: ingredient.name, 
                amount: ingredient.quantity,
            }
        });
    list.value = allIngredients;

    // Evaluate the start and end date
    startDate = dateUtils.getTodayDate();
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days.value);
    endDate = endDate.toISOString().split('T')[0];
    startDate = dateUtils.formatDate(startDate);
    endDate = dateUtils.formatDate(endDate);
};

const begin = async () => {
    await generateList();
    quant.value = list.value[0].amount;
};

const nextIngredient = async () => {
    // Work out if any change has occured
    if (quant.value != list.value[idx.value].amount) {
        // Apply update
        let body = { quantity: quant.value };
        let id = list.value[idx.value].id;
        await axios.put(`/api/ingredient/${id}`, body);
    }
    // Move to the next ingredient
    if (idx.value + 1 != list.value.length) {
        idx.value += 1 
        quant.value = list.value[idx.value].amount;
    } else {
        end.value = true;
    }
};
</script>

<template>
    <h4>Quick Inventory Audit</h4>
    <p>
        Here you can quickly look over all the ingredients you will need for the next few days and check what you already have
    </p>
    <form @submit.prevent="begin">
        <label style="padding-right: 10px;" for="days">Days to audit: </label>
        <input name="days" type="number" v-model="days">
        <br>
        <input type="submit" value="Audit">
    </form>
    <hr>
    <div v-if="list.length > 0 && !end">
        <h5>
            {{ list[idx].name }}: what quantity do you have ({{ list[idx].unit }})?
        </h5>
        <input type="number" v-model="quant">
        <div class="bunch-no-pad" style="gap: 10px;">
            <button class="blue-bg" @click="nextIngredient">Next</button>
        </div>
    </div>
    <p v-if="end" style="color: grey;">&#10003; Audit Complete</p>
</template>
