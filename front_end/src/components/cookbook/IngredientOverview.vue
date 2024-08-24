<script setup>
const props = defineProps({
    ingredients: Array,
});
</script>

<template>
    <h5>Ingredients: </h5>
    <ul>
        <li v-for="ingredient in ingredients">
            {{ ingredient.name }}: {{ ingredient.amount }}{{ ingredient.unit }}
        </li>
    </ul>
</template>
