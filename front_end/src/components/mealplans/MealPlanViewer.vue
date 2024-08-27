<script setup>
import { onMounted } from 'vue';
import { useMealStore } from '@/stores/useMealStore.js';

const mealStore = useMealStore();

const props = defineProps({
    content: Array,
});

onMounted(() => {
    mealStore.query();
});

const addDay = () => {
    console.log(props.content);
    props.content.push({ 'breakfast': null, 'lunch': null, 'brunch': null, 'dinner': null, 'snack': null });
};

const deleteDay = () => {
    props.content.pop();
};
</script>

<template>
    <div class="bunch">
        <div style="text-align: left;">
            <div style="height: 35px;"></div>
            <p>Breakfast</p>
            <div style="height: 9px;"></div>
            <p>Lunch</p>
            <div style="height: 9px;"></div>
            <p>Brunch</p>
            <div style="height: 9px;"></div>
            <p>Dinner</p>
            <div style="height: 9px;"></div>
            <p>Snack</p>
        </div>
        <div v-for="(day, idx) in content" style="display: flex; flex-direction: column;">
            <p>Day {{ idx + 1 }}</p>
            <!--
            <button 
                v-for="time in ['breakfast', 'lunch', 'brunch', 'dinner', 'snack']" 
                style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px; width: 50px;"
            >
                +
            </button>
            -->
            <select v-for="time in ['breakfast', 'lunch', 'brunch', 'dinner', 'snack']" :id="idx + '-' + time" :name="idx + '-' + time" v-model="content[idx][time]">
                <option :value="null">X</option>
                <option v-for="meal in mealStore.getMeals" :value="meal.id">{{ meal.name }}</option>
            </select>
        </div>
        <div style="display-flex: flex; flex-direction: column; align-content: center;">
            <form @submit.prevent="addDay">
                <button style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px; width: 40px; height: 38px">+</button>
            </form>
            <br>
            <form @submit.prevent="deleteDay">
                <button style="font-weight: bold; font-size: 13px; padding-left: 12px; padding-right: 12px; width: 40px; height: 38px;" class="red-bg">X</button>
            </form>
        </div>
    </div>
</template>
