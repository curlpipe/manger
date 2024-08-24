<script setup>
import { useIngredientStore } from '@/stores/useIngredientStore.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const router = useRouter();
const ingredientStore = useIngredientStore();

const props = defineProps({
    id: String,
});

if (ingredientStore.getIngredients.length == 0) {
    console.warn('Warning! no ingredients');
}

const data = ingredientStore.getIngredients.find(item => item.id == props.id);

const name = ref(data.name);
const quantity = ref(data.quantity);
const unit = ref(data.unit);

const applyEdit = () => {
    // Gather form data
    const body = {
        name: name.value,
        quantity: quantity.value,
        unit: unit.value,
    };
    // Update database
    try {
        const add_response = axios.put(`/api/ingredient/${props.id}`, body);
        const ingredients = ingredientStore.getIngredients;
        const item = ingredients.findIndex(item => item.id == props.id);

        ingredients[item].name = name.value;
        ingredients[item].quantity = quantity.value;
        ingredients[item].unit = unit.value;

        ingredientStore.load(ingredients);
        // Return the user to the list of ingredients
        router.push('/pantry');
    } catch (error) {
        console.error('Failed to create new ingredient');
    }
};

</script>

<template>
    <h4>Edit Ingredient</h4>
    <form @submit.prevent="applyEdit">
        <label for="name">Ingredient Name: </label>
        <input type="text" id="name" name="name" v-model="name">
        <br>
        <label for="quantity">Amount: </label>
        <input type="number" id="quantity" name="quantity" v-model="quantity">
        <br>
        <label for="unit">Units: </label>
        <select id="unit" name="unit" v-model="unit">
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
        <br>
        <input type="submit" value="Apply Edits">
    </form>
</template>
