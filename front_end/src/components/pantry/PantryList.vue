<script setup>
import PantryItem from '@/components/pantry/PantryItem.vue';

defineProps({
    ingredients: Array,
});
</script>

<template>
    <RouterLink to="/pantry/add">
        <button 
            class="green-bg full-width" 
            style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px;"
        >+</button>
    </RouterLink>
    <br>
    <br>
    <PantryItem v-for="item in ingredients" :key="item" :ingredient="item" />
</template>
