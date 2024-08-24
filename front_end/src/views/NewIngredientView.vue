<script setup>
import { useIngredientStore } from '@/stores/useIngredientStore.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const router = useRouter();
const ingredientStore = useIngredientStore();

const name = ref('');
const quantity = ref(0);
const unit = ref('unit');

const createIngredient = () => {
    // Gather form data
    const body = {
        name: name.value,
        quantity: quantity.value,
        unit: unit.value,
    };
    // Update database
    try {
        const add_response = axios.post('/api/ingredient', body);
        // Return the user to the list of ingredients
        router.push('/pantry');
    } catch (error) {
        console.error('Failed to create new ingredient');
    }
};

</script>

<template>
    <h4>Create New Ingredient</h4>
    <form @submit.prevent="createIngredient">
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
        <input type="submit" value="Create New Ingredient">
    </form>
</template>
