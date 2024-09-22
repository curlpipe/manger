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

const props = defineProps({
    id: String,
});

var data = {};

const getCache = () => {
    if (formStorage.hasItem('editMealForm' + props.id)) {
        let cached = formStorage.getItem('editMealForm' + props.id);
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
            name: data.name,
            time: data.time,
            difficulty: data.difficulty,
            instructions: data.instructions,
            ingredients: data.ingredients,
            rating: data.rating,
            notes: data.notes,
        };
    }
};

var name = ref('');
var time = ref(0);
var difficulty = ref('easy');
var instructions = ref([]);
var ingredients = ref([]);
var rating = ref('neutral');
var notes = ref('');

var ingred_id = ref((ingredientStore.getIngredients[0] ?? { id: -1 }).id);
const ingred_amount = ref(0);

const new_ingredient_name = ref('');
const new_ingredient_unit = ref('unit');

var instructions_json = ref('');

var cacher = null;

onMounted(async () => {
    try {
        await ingredientStore.query();
        await mealStore.query();
        data = mealStore.getMeals.find(meal => meal.id == props.id);
        data.ingredients.map(i => i.amount = i.MealIngredients.amount);
        name.value = getCache().name;
        time.value = getCache().time;
        difficulty.value = getCache().difficulty;
        instructions.value = getCache().instructions;
        ingredients.value = getCache().ingredients;
        rating.value = getCache().rating;
        notes.value = getCache().notes;
        instructions_json.value = '';
        instructions.value.forEach((i, idx) => {
            instructions_json.value += `${idx}: ${i.command}(${i.timer}) -> ${i.next}\n`;
        });
        ingred_id.value = (ingredientStore.getIngredients[0] ?? { id: -1 }).id;
        cacher = setInterval(cacheFormData, 5000);
    } catch (error) {
        console.error(error);
    }
});

onBeforeUnmount(() => clearInterval(cacher));

const applyEdit = async () => {
    // Gather form data
    const body = {
        name: name.value,
        time: time.value,
        difficulty: difficulty.value,
        instructions: instructions.value,
        ingredients: ingredients.value,
        rating: rating.value,
        notes: notes.value,
    };
    // Update database
    try {
        clearInterval(cacher);
        const add_response = await axios.put(`/api/meal/${props.id}`, body);
        // Clear the cache if confirmed to have saved in the database
        if (add_response.status == 200) {
            formStorage.removeItem('editMealForm' + props.id);
        }
        // Return the user to the list of meals
        await mealStore.query();
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
    formStorage.setItem('editMealForm' + props.id, data);
};

const copyInstructions = () => {
    return JSON.parse(JSON.stringify(instructions.value));
};

const updateFlow = (update) => {
    instructions.value = update;
};

</script>

<template>
    <h4>Edit Meal</h4>
    <div class="bunch">
        <form @submit.prevent="applyEdit">
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
            <form @submit.prevent="addIngredientToMeal">
                <br>
                <IngredientOverview :ingredients="ingredients" @delete-ingredient="removeIngredientFromMeal"/>
                <br>
                <label for="ingred">Ingredient to add: </label>
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
            <input type="submit" value="Apply Edits">
        </form>
    </div>
</template>
