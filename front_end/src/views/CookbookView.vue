<script setup>
import MealList from '@/components/cookbook/MealList.vue';
import { onMounted, ref, reactive } from 'vue';
import { useMealStore } from '@/stores/useMealStore';
import axios from 'axios';

const mealStore = useMealStore();

onMounted(async () => {
    // Load meal list from database
    mealStore.query();
});
</script>

<template>
    <MealList :meals="mealStore.getMeals"/>
</template>
