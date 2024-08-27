<script setup>
import { useMealPlanStore } from '@/stores/useMealPlanStore.js';
import axios from 'axios';

defineProps({
    plan: Object,
});

const mealPlanStore = useMealPlanStore();

const deletePlan = (id) => {
    try {
        const response = axios.delete(`/api/plan/${id}`)
            .then(() => mealPlanStore.deleteMealPlan(id))
            .catch(error => console.error(error));
    } catch (error) {
        console.error('Failed to delete meal plan');
        console.error(error);
    }
};
</script>

<template>
    <div class="list-item border border-rnd">
        <div class="bunch">
            <h5 class="list-title" style="font-weight: bold;">{{ plan.name }}</h5>
            <h5>{{ plan.notes }}</h5>
        </div>
        <div class="bunch">
            <RouterLink :to='`/mealplans/edit/${plan.id}`'>
                <button class="blue-bg" style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px;">&#9998;</button>
            </RouterLink>
            <RouterLink to=''>
                <button class="red-bg" style="font-weight: bold; height: 38px; padding-left: 15px; padding-right: 15px;" @click="deletePlan(plan.id)">X</button>
            </RouterLink>
        </div>
    </div>
</template>
