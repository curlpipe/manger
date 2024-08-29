<script setup>
import PantryList from '@/components/pantry/PantryList.vue';
import { useIngredientStore } from '@/stores/useIngredientStore';
import { onMounted, ref } from 'vue';
import axios from 'axios';

const ingredientStore = useIngredientStore();

onMounted(async () => {
    // Load inventory from database
    await ingredientStore.query();
});
</script>

<template>
    <PantryList :ingredients="ingredientStore.getIngredients" />
</template>
