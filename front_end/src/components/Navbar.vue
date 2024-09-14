<script setup>

</script>

<template>
    <nav class="blue-bg" id="navbar">
        <RouterLink to="/"><h4 class="white-fg">Manger</h4></RouterLink>
        <div class="bunch">
            <RouterLink class="white-fg" to="/pantry">Pantry</RouterLink>
            <RouterLink class="white-fg" to="/cookbook">Cookbook</RouterLink>
            <RouterLink class="white-fg" to="/mealplans">Meal Plans</RouterLink>
            <RouterLink class="white-fg" to="/getcooking">Get Cooking</RouterLink>
        </div>
    </nav>
</template>
