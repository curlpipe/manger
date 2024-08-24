<script setup>
import { useMealStore } from '@/stores/useMealStore';
import axios from 'axios';

defineProps({
    meal: Object,
});

const mealStore = useMealStore();

const deleteMeal = (id) => {
    try {
        const response = axios.delete(`/api/meal/${id}`)
            .then(() => mealStore.deleteMeal(id))
            .catch(error => console.error(error));
    } catch (error) {
        console.error('Failed to delete meal');
        console.error(error);
    }
};

</script>

<template>
    <div class="list-item border border-rnd">
        <div class="bunch">
            <h5 class="list-title" style="font-weight: bold;">{{ meal.name }}</h5>
            <h5>{{ meal.time }} mins</h5>

            <h5 class="green-fg" v-if="meal.difficulty == 'easy'"><b>{{ meal.difficulty }}</b></h5>
            <h5 class="yellow-fg" v-if="meal.difficulty == 'medium'"><b>{{ meal.difficulty }}</b></h5>
            <h5 class="red-fg" v-if="meal.difficulty == 'hard'"><b>{{ meal.difficulty }}</b></h5>

            <h5 class="green-fg" v-if="meal.rating == true">&#128077;</h5>
            <h5 class="red-fg" v-if="meal.rating == false">&#128078;</h5>
        </div>
        <div class="bunch">
            <RouterLink :to='`/cookbook/edit/${meal.id}`'>
                <button class="blue-bg" style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px;">&#9998;</button>
            </RouterLink>
            <RouterLink to=''>
                <button class="red-bg" style="font-weight: bold; height: 38px; padding-left: 15px; padding-right: 15px;" @click="deleteMeal(meal.id)">X</button>
            </RouterLink>
        </div>
    </div>
</template>
