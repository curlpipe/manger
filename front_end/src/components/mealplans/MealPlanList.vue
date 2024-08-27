<script setup>
import MealPlanItem from '@/components/mealplans/MealPlanItem.vue';

defineProps({
    plans: Array,
});
</script>

<template>
    <RouterLink to="/mealplans/add">
        <button 
            class="green-bg full-width" 
            style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px;"
        >+</button>
    </RouterLink>
    <br>
    <br>
    <MealPlanItem v-for="plan in plans" :key="plan.id" :plan="plan" />
</template>
