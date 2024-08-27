<script setup>
import ChooseMeal from '@/components/ChooseMeal.vue';
import dateUtils from '@/utils/dateUtils.js';
import { useMealStore } from '@/stores/useMealStore.js';
import axios from 'axios';
import { ref, onMounted } from 'vue';

const mealStore = useMealStore();

var schedule = ref({});
const shown = ref(false);

const getSchedule = async () => {
    // Get the schedule and update any required data
    const response = await axios.get('/api/schedule');
    // Attach meal data
    Object.keys(response.data).forEach(key => {
        const value = response.data[key];
        value.forEach(meal => {
            meal.meal = mealStore.getMeals.find(m => m.id == meal.meal_id);
        });
    });
    // Get a list of all dates from today for the next 14 days
    const today = dateUtils.getTodayDate();
    const days = dateUtils.getDateRange(today, 14);
    // Add in the data from the schedule
    const result = {};
    days.forEach(day => {
        const data = response.data[day];
        result[day] = data == null ? [] : data;
    });
    schedule.value = result;
};

onMounted(async () => {
    await mealStore.query();
    await getSchedule();
});

var addingTo = null;

const addTo = (day) => {
    shown.value = true;
    addingTo = day;
};

const closePopup = () => {
    shown.value = false;
};

const selectMeal = async (id, kind) => {
    closePopup();
    // Add to the database
    const body = {
        meal_id: id,
        kind,
        date: addingTo,
    };
    await axios.post('/api/schedule', body);
    // Refresh the schedule
    getSchedule();
};

const removeMeal = async (id) => {
    await axios.delete(`/api/schedule/${id}`);
    // Refresh the schedule
    getSchedule();
};
</script>

<template>
    <!-- Meal adding pop up -->
    <ChooseMeal 
        v-if="shown" 
        type="schedule"
        :meals="mealStore.getMeals" 
        @select-meal="selectMeal" 
        @close-popup="closePopup"
    />
    <!-- Schedule list -->
    <h4>Schedule</h4>
    <p>Click a meal to start cooking</p>
    <br>
    <div>
        <div v-for="(data, date) in schedule" style="margin-bottom: 40px;">
            <h5>{{ dateUtils.formatDate(date) }}</h5>
            <p v-if="data.length == 0" style="color: grey;">
                You have added no meals yet 
                <br>
                Click the '+' button below to 
                <br>
                add meals or activate meal plans
            </p>
            <div v-for="meal in data">
                <h6><b>{{ meal.kind }}</b></h6>
                <RouterLink :to="`/getcooking/${meal.meal_id}`" style="text-decoration: none;">
                    <a href="" style="text-decoration: none;">{{ meal.meal.name }}</a>
                </RouterLink>
                <a @click="removeMeal(meal.id)" style="margin-left: 10px;" class="red-fg">X</a>
            </div>
            <br>
            <form @submit.prevent="addTo(date)">
                <button style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px; width: 40px; height: 38px">+</button>
            </form>
        </div>
    </div>
</template>
