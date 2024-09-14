<script setup>
import ChooseMeal from '@/components/ChooseMeal.vue';
import { ref, onMounted } from 'vue';
import { useMealStore } from '@/stores/useMealStore.js';

const mealStore = useMealStore();

const selects = ref([]);

const props = defineProps({
    content: Array,
});

onMounted(async () => {
    await mealStore.query();
    props.content.forEach((day, idx) => {
        selects.value[idx] = { breakfast: false, lunch: false, brunch: false, dinner: false, snack: false };
    });
});

const addDay = () => {
    props.content.push({ 'breakfast': null, 'lunch': null, 'brunch': null, 'dinner': null, 'snack': null });
    selects.value.push({ breakfast: false, lunch: false, brunch: false, dinner: false, snack: false });
};

const deleteDay = () => {
    props.content.pop();
};

const openSelection = (idx, time) => {
    if (props.content[idx][time] != null) {
        props.content[idx][time] = null;
    } else {
        selects.value[idx][time] = true;
    }
};

const closeSelection = (idx, time) => {
    selects.value[idx][time] = false;
};

const setMeal = (idx, time, meal) => {
    closeSelection(idx, time);
    props.content[idx][time] = meal;
};
</script>

<template>
    <div class="bunch">
        <div style="text-align: left;">
            <div style="height: 39px;"></div>
            <p>Breakfast</p>
            <div style="height: 18px;"></div>
            <p>Lunch</p>
            <div style="height: 18px;"></div>
            <p>Brunch</p>
            <div style="height: 18px;"></div>
            <p>Dinner</p>
            <div style="height: 18px;"></div>
            <p>Snack</p>
        </div>
        <div v-for="(day, idx) in content" style="display: flex; flex-direction: column;">
            <p>Day {{ idx + 1 }}</p>
            <div v-for="time in ['breakfast', 'lunch', 'brunch', 'dinner', 'snack']">
                <form @submit.prevent="">
                    <ChooseMeal
                        v-if="selects[idx] != null && selects[idx][time]" 
                        type="plan"
                        :meals="mealStore.getMeals"
                        @select-meal="meal => setMeal(idx, time, meal)"
                        @close-popup="closeSelection(idx, time)"
                    />
                </form>
                <form @submit.prevent="openSelection(idx, time)">
                    <button v-if="content[idx][time] != null" style="width: 100%; font-size: 15px; padding-left: 12px; padding-right: 12px; padding-top: 10px; padding-bottom: 10px;">
                        {{ mealStore.getMeals.find(meal => meal.id == content[idx][time]).name }}
                    </button>
                    <button v-if="content[idx][time] == null" style="width: 100%; font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px;">
                        +
                    </button>
                </form>
            </div>
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
