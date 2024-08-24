<script setup>
import { useIngredientStore } from '@/stores/useIngredientStore';
import axios from 'axios';

defineProps({
    ingredient: Object,
});

const ingredientStore = useIngredientStore();

const deleteIngredient = (id) => {
    try {
        const response = axios.delete(`/api/ingredient/${id}`)
            .then(() => ingredientStore.deleteIngredient(id))
            .catch(error => console.error(error));
    } catch (error) {
        console.error('Failed to delete ingredient');
        console.error(error);
    }
};

</script>

<template>
    <div class="list-item border border-rnd">
        <div class="bunch">
            <h5 class="list-title" style="font-weight: bold;">{{ ingredient.name }}</h5>
            <h5>{{ ingredient.quantity }}{{ ingredient.unit }}</h5>
        </div>
        <div class="bunch">
            <RouterLink :to='`/pantry/edit/${ingredient.id}`'>
                <button class="blue-bg" style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px;">&#9998;</button>
            </RouterLink>
            <RouterLink to=''>
                <button class="red-bg" style="font-weight: bold; height: 38px; padding-left: 15px; padding-right: 15px;" @click="deleteIngredient(ingredient.id)">X</button>
            </RouterLink>
        </div>
    </div>
</template>
