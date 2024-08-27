<script setup>
import { useMealPlanStore } from '@/stores/useMealPlanStore.js';
import MealPlanViewer from '@/components/mealplans/MealPlanViewer.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
    id: String,
});

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

const applyEdit = async () => {
    const body = {
        name: name.value,
        notes: notes.value,
        content: content.value,
    };
    // Update database
    try {
        const response = axios.put(`/api/plan/${props.id}`, body);
        // Return the user to the list of meals
        await mealPlanStore.query();
        router.push('/mealplans');
    } catch (error) {
        console.error('Failed to edit meal plan');
        console.error(error);
    }
};

onMounted(async () => {
    const response = await axios.get(`/api/plan/${props.id}`);
    name.value = response.data.name;
    notes.value = response.data.notes;
    content.value = response.data.content;
});
</script>

<template>
    <h4>Edit Meal Plan</h4>
    <form @submit.prevent="applyEdit">
        <label for="name">Meal Plan Name: </label>
        <input type="text" id="name" name="name" v-model="name">
        <br>
        <label for="name">Meal Plan notes: </label>
        <br>
        <textarea rows="5" cols="48" id="notes" name="notes" v-model="notes"></textarea>
        <br>
        <MealPlanViewer :content="content"/>
        <br>
        <input type="submit" value="Apply Edits">
    </form>
</template>
