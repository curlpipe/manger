<script setup>
import MealFlow from '@/components/cookbook/MealFlow.vue';
import IngredientOverview from '@/components/cookbook/IngredientOverview.vue';
import { useMealStore } from '@/stores/useMealStore.js';
import { useIngredientStore } from '@/stores/useIngredientStore.js';
import { useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const router = useRouter();
const mealStore = useMealStore();
const ingredientStore = useIngredientStore();

onMounted(async () => {
    // Load inventory from database
    ingredientStore.query();
});

const name = ref('');
const time = ref(0);
const difficulty = ref('easy');
var instructions = ref([
    {command: "Gather ingredients", timer: null, next: [1]}, // step 0
    {command: "Gather utensils", timer: null, next: [2, 5]}, // step 1
    {command: "Boil the kettle", timer: null, next: [3]}, // step 2
    {command: "Add noodles and water to the pot", timer: null, next: [4]}, // step 3
    {command: "Boil the noodles for 8 mins", timer: 8, next: [7]}, // step 4
    {command: "Chop up the vegetables", timer: null, next: [6]}, // step 5
    {command: "Fry the oil and veg for 5 minutes", timer: 5, next: [7]}, // step 6
    {command: "Add the noodles, fry for 3 minutes", timer: 3, next: [8]}, // step 7
    {command: "Serve", timer: null, next: []}, // step 8
]);
var ingredients = reactive([]);
const notes = ref('');
const rating = ref(null);

const ingred_id = ref(1);
const ingred_amount = ref(0);

var instructions_json = ref('');
instructions.value.forEach((i, idx) => {
    instructions_json.value += `${idx}: ${i.command}(${i.timer}) -> ${i.next}\n`;
});

const createMeal = () => {
    // Gather form data
    const body = {
        name: name.value,
        time: time.value,
        difficulty: difficulty.value,
        instructions: instructions.value,
        ingredients: ingredients,
        notes: notes.value,
        rating: rating.value,
    };
    // Update database
    try {
        const add_response = axios.post('/api/meal', body);
        // Return the user to the list of meals
        router.push('/cookbook');
    } catch (error) {
        console.error('Failed to create new meal');
    }
};

const mealFlowChange = () => {
    instructions.value = [];
    instructions_json.value.split('\n').forEach(line => {
        if (line.length > 0) {
            line = line.split(': ')[1];
            let [command_part, next] = line.split(' -> ');
            let [command, timer] = command_part.split('(');
            timer = timer.slice(0, -1);
            next = next.split(',').filter(i => i != '').map(i => parseInt(i));
            timer = timer == 'null' ? null : parseInt(timer);
            instructions.value.push({ command, timer, next });
        }
    });
};

const addIngredientToMeal = () => {
    // Add ingredient to the meal
    const info = ingredientStore.getIngredients.find(i => i.id == ingred_id.value);
    ingredients.push({ id: ingred_id.value, name: info.name, amount: ingred_amount.value, unit: info.unit });
};

const removeIngredientFromMeal = (id) => {
    const idx = ingredients.findIndex(i => i.id == id);
    ingredients.splice(idx, 1);
};

</script>

<template>
    <h4>Create New Meal</h4>
    <div class="bunch">
        <!-- Main form for meal details -->
        <form @submit.prevent="createMeal">
            <label for="name">Meal Name: </label>
            <input type="text" id="name" name="name" v-model="name">
            <br>
            <label for="time">Time to cook: </label>
            <input type="number" id="time" name="time" v-model="time">
            <br>
            <label for="difficulty">Difficulty: </label>
            <select id="difficulty" name="difficulty" v-model="difficulty">
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
            </select>
            <br>
            <label for="rating">Rating: </label>
            <select id="rating" name="rating" v-model="rating">
                <option :value="true">like</option>
                <option :value="null">neutral</option>
                <option :value="false">dislike</option>
            </select>
            <br>
            <!-- Sub-form to attach ingredients to the meal -->
            <form @submit.prevent="addIngredientToMeal">
                <br>
                <IngredientOverview :ingredients="ingredients" @delete-ingredient="removeIngredientFromMeal"/>
                <br>
                <label for="ingred">Ingredient to add: </label>
                <select id="ingred" name="ingred" v-model="ingred_id">
                    <option v-for="ingredient in ingredientStore.getIngredients" :value="ingredient.id">{{ ingredient.name }} ({{ ingredient.unit }})</option>
                </select>
                <br>
                <label for="amount">Amount used: </label>
                <input type="number" id="amount" name="amount" v-model="ingred_amount">
                <br>
                <input type="submit" value="Add Ingredient">
            </form>
            <label for="notes">Notes: </label>
            <br>
            <textarea rows="5" cols="48" id="notes" name="notes" v-model="notes"></textarea>
            <br>
            <input type="submit" value="Create New Meal">
        </form>
        <!-- Form  to modify and change the flow of the meal -->
        <form @submit.prevent="mealFlowChange">
            <div id="instructions"></div>
            <MealFlow :instructions="instructions" />
            <br>
            <textarea v-model="instructions_json" cols="48" rows="10"></textarea>
            <br>
            <input type="submit" value="Update Meal Flow"></input>
            <br>
        </form>
    </div>
</template>
