<script setup>
import ChooseMeal from '@/components/ChooseMeal.vue';
import dateUtils from '@/utils/dateUtils.js';
import { useMealStore } from '@/stores/useMealStore.js';
import { useMealPlanStore } from '@/stores/useMealPlanStore.js';
import axios from 'axios';
import { ref, onMounted } from 'vue';

const mealStore = useMealStore();
const mealPlanStore = useMealPlanStore();

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
    await mealPlanStore.query();
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
    await getSchedule();
};

const deferMeal = async (id, m, d, k) => {
    d = dateUtils.incrementDate(d);
    // Delete old position
    await axios.delete(`/api/schedule/${id}`);
    // Put into new position
    const body = {
        meal_id: m,
        kind: k,
        date: d,
    };
    console.log(body);
    await axios.post('/api/schedule', body);
    // Refresh the schedule
    await getSchedule();
};

const removeMeal = async (id) => {
    await axios.delete(`/api/schedule/${id}`);
    // Refresh the schedule
    await getSchedule();
};

const activatePlan = async (id) => {
    closePopup();
    // Add meals from the plan to the schedule one by one
    const response = await axios.get(`/api/plan/${id}`);
    const meals = response.data.content;
    let at = addingTo;
    for (const day of meals) {
        for (const meal of ['breakfast', 'lunch', 'brunch', 'dinner', 'snack']) {
            if (day[meal] != null) {
                // Add to the database
                const body = {
                    meal_id: day[meal],
                    kind: meal,
                    date: at,
                };
                await axios.post('/api/schedule', body);
            }
        }
        at = dateUtils.incrementDate(at);
    }
    // Refresh the schedule
    await getSchedule();
};
</script>

<template>
    <!-- Meal adding pop up -->
    <ChooseMeal 
        v-if="shown" 
        type="schedule"
        :meals="mealStore.getMeals" 
        :plans="mealPlanStore.getMealPlans"
        @select-meal="selectMeal" 
        @close-popup="closePopup"
        @activate-plan="activatePlan"
    />
    <!-- Schedule list -->
    <h4>Schedule</h4>
    <p>Click a meal to start cooking</p>
    <p>Alternatively, select an option below for useful print-outs</p>
    <div style="display: flex;">
        <RouterLink to="/getcooking/shoppinglist"><button>Shopping List Print-Outs</button></RouterLink>
        <div style="width: 10px;"></div>
        <RouterLink to="/getcooking/print"><button>Schedule Print-Outs</button></RouterLink>
    </div>
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
                <a @click="deferMeal(meal.id, meal.meal_id, date, meal.kind)" style="margin-left: 10px;" class="orange-fg">&#8595;</a>
            </div>
            <br>
            <form @submit.prevent="addTo(date)">
                <button style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px; width: 40px; height: 38px">+</button>
            </form>
        </div>
    </div>
</template>
