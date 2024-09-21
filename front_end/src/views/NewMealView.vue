<script setup>
import MealFlow from '@/components/cookbook/MealFlow.vue';
import IngredientOverview from '@/components/cookbook/IngredientOverview.vue';
import { useMealStore } from '@/stores/useMealStore.js';
import { useIngredientStore } from '@/stores/useIngredientStore.js';
import { useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import Storage from '@/utils/storageUtils.js';

const router = useRouter();
const mealStore = useMealStore();
const ingredientStore = useIngredientStore();

const formStorage = new Storage('localStorage');

onMounted(async () => {
    // Load inventory from database
    await ingredientStore.query();
    ingred_id.value = (ingredientStore.getIngredients[0] ?? { id: ingred_id.value }).id;
});

const getCache = () => {
    if (formStorage.hasItem('newMealForm')) {
        let cached = formStorage.getItem('newMealForm');
        return {
            name: cached.name,
            time: cached.time,
            difficulty: cached.difficulty,
            instructions: cached.instructions,
            ingredients: cached.ingredients,
            notes: cached.notes,
            rating: cached.rating,
        };
    } else {
        return {
            name: '',
            time: 0,
            difficulty: 'easy',
            instructions: [
                {command: "Gather ingredients", timer: null, next: [1]}, // step 0
                {command: "Gather utensils", timer: null, next: [2, 5]}, // step 1
                {command: "Boil the kettle", timer: null, next: [3]}, // step 2
                {command: "Add noodles and water to the pot", timer: null, next: [4]}, // step 3
                {command: "Boil the noodles for 8 mins", timer: 8, next: [7]}, // step 4
                {command: "Chop up the vegetables", timer: null, next: [6]}, // step 5
                {command: "Fry the oil and veg for 5 minutes", timer: 5, next: [7]}, // step 6
                {command: "Add the noodles, fry for 3 minutes", timer: 3, next: [8]}, // step 7
                {command: "Serve", timer: null, next: []}, // step 8
            ],
            ingredients: [],
            notes: '',
            rating: null,
        };
    }
};

const name = ref(getCache().name);
const time = ref(getCache().time);
const difficulty = ref(getCache().difficulty);
var instructions = ref(getCache().instructions);
var ingredients = reactive(getCache().ingredients);
const notes = ref(getCache().notes);
const rating = ref(getCache().rating);

var ingred_id = ref((ingredientStore.getIngredients[0] ?? { id: -1 }).id);
const ingred_amount = ref(0);

const new_ingredient_name = ref('');
const new_ingredient_unit = ref('unit');

var instructions_json = ref('');
instructions.value.forEach((i, idx) => {
    instructions_json.value += `${idx}: ${i.command}(${i.timer}) -> ${i.next}\n`;
});

const createMeal = async () => {
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
        clearInterval(cacher);
        const add_response = await axios.post('/api/meal', body);
        // Clear the cache if confirmed to have saved in the database
        if (add_response.status == 200) {
            formStorage.removeItem('newMealForm');
            if (formStorage.hasItem('newMealForm')) {
                console.log("WHY NOT DELETING!!!");
            }
        }
        // Return the user to the list of meals
        router.push('/cookbook');
    } catch (error) {
        console.error('Failed to create new meal');
    }
};

const sleep = async (ms) => new Promise((callback) => setTimeout(callback, ms));

const mealFlowChange = async () => {
    await sleep(20);
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

const addIngredientToMeal = async () => {
    // Add ingredient if necessary
    if (ingred_id.value == -1) {
        // Gather form data
        const body = {
            name: new_ingredient_name.value,
            quantity: 0,
            unit: new_ingredient_unit.value,
        };
        // Update database
        let add_response = null;
        try {
            add_response = await axios.post('/api/ingredient', body);
        } catch (error) {
            console.error('Failed to create new ingredient');
        }
        // Refresh the ingredient listing and update the selection box
        await ingredientStore.query();
        ingred_id.value = add_response.data.id;
    }
    // Add ingredient to the meal
    const info = ingredientStore.getIngredients.find(i => i.id == ingred_id.value);
    ingredients.push({ id: ingred_id.value, name: info.name, amount: ingred_amount.value, unit: info.unit });
};

const removeIngredientFromMeal = (id) => {
    const idx = ingredients.findIndex(i => i.id == id);
    ingredients.splice(idx, 1);
};

const cacheFormData = () => {
    console.log("I hope you like pain");
    let data = {
        name: name.value,
        time: time.value,
        difficulty: difficulty.value,
        instructions: instructions.value,
        ingredients: ingredients,
        notes: notes.value,
        rating: rating.value,
    };
    formStorage.setItem('newMealForm', data);
};

const cacher = setInterval(cacheFormData, 5000);

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
                <br>
                <select id="ingred" name="ingred" v-model="ingred_id">
                    <option :value="-1">New Ingredient</option>
                    <option v-for="ingredient in ingredientStore.getIngredients" :value="ingredient.id">{{ ingredient.name }} ({{ ingredient.unit }})</option>
                </select>
                <div v-if="ingred_id == -1">
                    <label for="nin">Name of new ingredient: </label>
                    <input type="text" id="nin" name="nin" v-model="new_ingredient_name">
                    <br>
                    <label for="niu">Unit of new ingredient: </label>
                    <select id="niu" name="niu" v-model="new_ingredient_unit">
                        <option value="ml">millilitres</option>
                        <option value="l">litres</option>
                        <option value="pt">pints</option>
                        <option value="oz">ounces</option>
                        <option value="g">grams</option>
                        <option value="kg">kilograms</option>
                        <option value="unit">items</option>
                        <option value="tsp">teaspoons</option>
                        <option value="tbsp">tablespoons</option>
                        <option value="pinch">pinches</option>
                    </select>
                </div>
                <br v-else>
                <label for="amount">Amount used: </label>
                <input type="number" id="amount" name="amount" v-model="ingred_amount">
                <br>
                <input type="submit" value="Add Ingredient">
            </form>
            <label for="notes">Notes: </label>
            <br>
            <textarea rows="5" cols="48" id="notes" name="notes" v-model="notes"></textarea>
            <br>
            <br>
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
            <input type="submit" value="Create New Meal">
        </form>
    </div>
</template>
