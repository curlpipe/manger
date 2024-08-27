<script setup>
const props = defineProps({
    ingredients: Array,
});
</script>

<template>
    <div>
        <h5>Ingredients: </h5>
        <p v-if="ingredients.length == 0" style="color: grey;">You have added no ingredients yet<br>Feel free to add some below</p>
        <ul>
            <li v-for="ingredient in ingredients">
                <span>
                    {{ ingredient.name }}: {{ ingredient.amount }}{{ ingredient.unit }}
                </span>
                <a @click="$emit('deleteIngredient', ingredient.id)" style="margin-left: 10px;" class="red-fg">X</a>
            </li>
        </ul>
    </div>
</template>
