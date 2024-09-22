<script setup>
import MealFlow from '@/components/cookbook/MealFlow.vue';
import MealFlowEdit from '@/components/cookbook/MealFlowEdit.vue';
import IngredientOverview from '@/components/cookbook/IngredientOverview.vue';
import { useMealStore } from '@/stores/useMealStore.js';
import { useIngredientStore } from '@/stores/useIngredientStore.js';
import { useRouter } from 'vue-router';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import Storage from '@/utils/storageUtils.js';

const router = useRouter();
const mealStore = useMealStore();
const ingredientStore = useIngredientStore();

const formStorage = new Storage('localStorage');

var cacher = null;

onMounted(async () => {
    // Load inventory from database
    await ingredientStore.query();
    ingred_id.value = (ingredientStore.getIngredients[0] ?? { id: ingred_id.value }).id;
    name.value = getCache().name;
    time.value = getCache().time;
    difficulty.value = getCache().difficulty;
    instructions.value = getCache().instructions;
    ingredients.value = getCache().ingredients;
    notes.value = getCache().notes;
    rating.value = getCache().rating;
    cacher = setInterval(cacheFormData, 5000);
});

onBeforeUnmount(() => clearInterval(cacher));

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

var name = ref('');
var time = ref(0);
var difficulty = ref('easy');
var instructions = ref([]);
var ingredients = ref([]);
var notes = ref('');
var rating = ref('neutral');

var ingred_id = ref((ingredientStore.getIngredients[0] ?? { id: -1 }).id);
const ingred_amount = ref(0);

const new_ingredient_name = ref('');
const new_ingredient_unit = ref('unit');

const createMeal = async () => {
    // Gather form data
    const body = {
        name: name.value,
        time: time.value,
        difficulty: difficulty.value,
        instructions: instructions.value,
        ingredients: ingredients.value,
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
        }
        // Return the user to the list of meals
        router.push('/cookbook');
    } catch (error) {
        console.error('Failed to create new meal');
    }
};

const sleep = async (ms) => new Promise((callback) => setTimeout(callback, ms));

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
    ingredients.value.push({ id: ingred_id.value, name: info.name, amount: ingred_amount.value, unit: info.unit });
};

const removeIngredientFromMeal = (id) => {
    const idx = ingredients.value.findIndex(i => i.id == id);
    ingredients.value.splice(idx, 1);
};

const cacheFormData = () => {
    let data = {
        name: name.value,
        time: time.value,
        difficulty: difficulty.value,
        instructions: instructions.value,
        ingredients: ingredients.value,
        notes: notes.value,
        rating: rating.value,
    };
    formStorage.setItem('newMealForm', data);
};

const copyInstructions = () => {
    return JSON.parse(JSON.stringify(instructions.value));
};

const updateFlow = (update) => {
    instructions.value = update;
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
            <div class="meal-edit">
                <MealFlowEdit :instructions="copyInstructions()" @update-flow="updateFlow" />
                <MealFlow :instructions="instructions"/>
            </div>
            <br>
            <input type="submit" value="Create New Meal">
        </form>
    </div>
</template>
