<script setup>
import MealItem from '@/components/cookbook/MealItem.vue';

defineProps({
    meals: Array,
});
</script>

<template>
    <RouterLink to="/cookbook/add">
    <button 
        class="green-bg full-width"
        style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px;"
        >+</button>
    </RouterLink>
    <br>
    <br>
    <MealItem v-for="item in meals" :key="item" :meal="item" />
</template>
