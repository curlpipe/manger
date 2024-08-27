<script setup>
import { useMealPlanStore } from '@/stores/useMealPlanStore.js';
import MealPlanViewer from '@/components/mealplans/MealPlanViewer.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const router = useRouter();
const mealPlanStore = useMealPlanStore();

const name = ref('');
const notes = ref('');
const content = ref([
    { 'breakfast': null, 'lunch': null, 'brunch': null, 'dinner': null, 'snack': null },
    { 'breakfast': null, 'lunch': null, 'brunch': null, 'dinner': null, 'snack': null },
    { 'breakfast': null, 'lunch': null, 'brunch': null, 'dinner': null, 'snack': null },
    { 'breakfast': null, 'lunch': null, 'brunch': null, 'dinner': null, 'snack': null },
    { 'breakfast': null, 'lunch': null, 'brunch': null, 'dinner': null, 'snack': null },
    { 'breakfast': null, 'lunch': null, 'brunch': null, 'dinner': null, 'snack': null },
    { 'breakfast': null, 'lunch': null, 'brunch': null, 'dinner': null, 'snack': null },
]);

const createMealPlan = async () => {
    // Gather form data
    const body = {
        name: name.value,
        notes: notes.value,
        content: content.value,
    };
    // Update database
    try {
        const add_response = axios.post('/api/plan', body);
        // Return the user to the list of meal plans
        await mealPlanStore.query();
        router.push('/mealplans');
    } catch (error) {
        console.error('Failed to create new meal plan');
    }
};

</script>

<template>
    <h4>Create New Meal Plan</h4>
    <form @submit.prevent="createMealPlan">
        <label for="name">Meal Plan Name: </label>
        <input type="text" id="name" name="name" v-model="name">
        <br>
        <label for="name">Meal Plan notes: </label>
        <br>
        <textarea rows="5" cols="48" id="notes" name="notes" v-model="notes"></textarea>
        <br>
        <MealPlanViewer :content="content"/>
        <br>
        <input type="submit" value="Create New Meal Plan">
    </form>
</template>
