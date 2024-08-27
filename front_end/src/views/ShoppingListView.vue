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

const showList = ref(false);
const subtractInventory = ref(true);

let startDate = dateUtils.getTodayDate();
let endDate = startDate;

onMounted(async () => {
    await ingredientStore.query();
    await mealStore.query();
    await mealPlanStore.query();
});

const days = ref(7);
const list = ref([
    { amount: "200g", name: "Butter" },
    { amount: "2 units", name: "Red Pepper" },
]);

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
        const response = await axios.get(`/api/meal/${meal.id}`);
        const ingredients = response.data.ingredients;
        for (const ingredient of ingredients) {
            if (ingredient.id in allIngredients) {
                allIngredients[ingredient.id].MealIngredients.amount += ingredient.MealIngredients.amount;
            } else {
                allIngredients[ingredient.id] = ingredient;
            }
        }
    }

    allIngredients = Object.values(allIngredients)
        .map(i => { 
            return { 
                id: i.id,
                unit: i.unit,
                name: i.name, 
                amount: subtractInventory.value ? i.MealIngredients.amount - i.quantity : i.MealIngredients.amount,
            }
        })
        .filter(i => i.amount > 0);
    list.value = allIngredients;

    // Evaluate the start and end date
    startDate = dateUtils.getTodayDate();
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days.value);
    endDate = endDate.toISOString().split('T')[0];
    startDate = dateUtils.formatDate(startDate);
    endDate = dateUtils.formatDate(endDate);

    showList.value = true;
};

const printMe = () => {
    // Get the content to print
    const content = document.getElementById('printable-list').innerHTML;

    // Create a hidden iframe
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';

    // Append the iframe to the body
    document.body.appendChild(printFrame);

    printFrame.onload = () => {
        // Access the iframe document
        const doc = printFrame.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <link href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400..700;1,400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                }
                p { 
                    font-size: 17px;
                    font-weight: 300;
                    font-family: "Inter", sans-serif;
                    margin-left: 10px !important;
                }
                .bunch {
                    display: flex;
                    margin-bottom: 5px;
                    margin-left: 30px;
                }
            </style>
            ${content}
            </html>
        `);
        doc.close();

        // Wait for the content to be fully loaded before printing
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
    };

    // Remove the iframe after printing
    setTimeout(() => document.body.removeChild(printFrame), 1000);
};
</script>

<template>
    <h4>Shopping List</h4>
    <p>
        Here you can generate a printable shopping list for you to take shopping.
        <br>
        <br>
        1. <b>Select the number of days from today that you want to shop for <br>(e.g. 7 if you shop on the same day every week)</b>
        <br>
        <br>
        2. <b>Decide if you want to subtract your existing inventory, or ignore the inventory</b>
        <br>
        <br>
        3. <b>Press "generate" to generate the shopping list</b>
        <br>
        <br>
        4. <b>Press "print" to access print dialog</b>
        <br>
        <br>
    </p>
    <form @submit.prevent="generateList">
        <div class="bunch">
            <input type="checkbox" v-model="subtractInventory" />
            <p>Subtract existing inventory</p>
        </div>

        <input type="number" v-model="days">
        <br>
        <input type="submit" value="Generate">
    </form>
    <div id="printable-list" v-if="showList">
        <p><b>Shopping List from {{ startDate }} to {{ endDate }}</b></p>
        <br>
        <div class="bunch" v-for="item in list">
            <input type="checkbox"><p>{{ item.name }} ({{ item.amount }}{{ item.unit }})</p>
        </div>
    </div>
    <button @click="printMe">Print</button>
</template>
