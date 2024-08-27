<script setup>
import MealPlanList from '@/components/mealplans/MealPlanList.vue';
import { onMounted, ref, reactive } from 'vue';
import { useMealPlanStore } from '@/stores/useMealPlanStore';
import axios from 'axios';

const mealPlanStore = useMealPlanStore();

onMounted(async () => {
    // Load meal list from database
    mealPlanStore.query();
});
</script>

<template>
    <MealPlanList :plans="mealPlanStore.getMealPlans"/>
</template>
