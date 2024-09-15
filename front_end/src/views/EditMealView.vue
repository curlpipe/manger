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

const props = defineProps({
    id: String,
});

var data = {};

var name = ref(data.name);
var time = ref(data.time);
var difficulty = ref(data.difficulty);
var instructions = ref([]);
var ingredients = ref([]);
var rating = ref(data.rating);
var notes = ref(data.notes);

const ingred_id = ref(1);
const ingred_amount = ref(0);

var instructions_json = ref('');

onMounted(async () => {
    try {
        await ingredientStore.query();
        await mealStore.query();
        data = mealStore.getMeals.find(meal => meal.id == props.id);
        name.value = data.name;
        time.value = data.time;
        difficulty.value = data.difficulty;
        instructions.value = data.instructions;
        data.ingredients.map(i => i.amount = i.MealIngredients.amount);
        ingredients.value = data.ingredients;
        rating.value = data.rating;
        notes.value = data.notes;
        instructions_json.value = '';
        instructions.value.forEach((i, idx) => {
            instructions_json.value += `${idx}: ${i.command}(${i.timer}) -> ${i.next}\n`;
        });
        mealFlowChange();

    } catch (error) {
        console.error(error);
    }
});

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
        const add_response = axios.put(`/api/meal/${props.id}`, body);
        // Return the user to the list of meals
        await mealStore.query();
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
    const info = ingredientStore.getIngredients.find(i => i.id == ingred_id.value);
    ingredients.value.push({ id: ingred_id.value, name: info.name, amount: ingred_amount.value, unit: info.unit });
};

const removeIngredientFromMeal = (id) => {
    const idx = ingredients.value.findIndex(i => i.id == id);
    ingredients.value.splice(idx, 1);
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
            <input type="submit" value="Apply Edits">
        </form>
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
