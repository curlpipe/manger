<script setup>

</script>

<template>
    <h4>Welcome to Manger</h4>
    <p>To get started, click on one of the links below</p>
    <br>
    <RouterLink to="/pantry"><h5 class="blue-fg">Pantry</h5></RouterLink>
    <p style="width: 400px">The pantry is where you can record the ingredients that you already have, which can be used to suggest meals and generate accurate shopping lists</p>
    <br>
    <RouterLink to="/cookbook"><h5 class="blue-fg">Cookbook</h5></RouterLink>
    <p style="width: 400px">The cookbook is where you can record a list of recipes that you can add to meal plans and the schedule</p>
    <br>
    <RouterLink to="/mealplans"><h5 class="blue-fg">Meal Plans</h5></RouterLink>
    <p style="width: 400px">Meal plans are where you can build reusable meal plans that you can activate in the schedule</p>
    <br>
    <RouterLink to="/getcooking"><h5 class="blue-fg">Get Cooking</h5></RouterLink>
    <p style="width: 400px">Get cooking is where you can find the schedule of meals to eat and access the recipe instructions to help guide you as you cook</p>
    <br>
</template>
