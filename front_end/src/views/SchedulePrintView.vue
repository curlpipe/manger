<script setup>
import dateUtils from '@/utils/dateUtils.js';
import { ref, onMounted } from 'vue';
import { useMealStore } from '@/stores/useMealStore.js';
import axios from 'axios';

const mealStore = useMealStore();

const showSchedule = ref(false);

var schedule = ref({});
const days = ref(7);

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
    const range = dateUtils.getDateRange(today, days.value);
    // Add in the data from the schedule
    const result = {};
    range.forEach(day => {
        const data = response.data[day];
        result[day] = data == null ? [] : data;
    });
    schedule.value = result;
};

const generateSchedule = async () => {
    showSchedule.value = true;
    await mealStore.query();
    await getSchedule();
};

const printMe = () => {
    // Get the content to print
    const content = document.getElementById('printable-schedule').innerHTML;

    // Create a hidden iframe
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';

    // Append the iframe to the body
    document.body.appendChild(printFrame);

    printFrame.onload = () => {
        // Access the iframe document
        const doc = printFrame.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <link href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400..700;1,400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0 !important;
                    padding: 2px !important;
                }
                h5 {
                    font-size: 20px;
                    font-weight: 300;
                }
                h6 {
                    font-size: 13px;
                    font-weight: 300;
                }
                p, a { 
                    font-size: 15px;
                    font-weight: 300;
                }
                p, h6, h5, a {
                    font-family: "Inter", sans-serif;
                    margin-left: 10px !important;
                }
            </style>
            ${content}
            </html>
        `);
        doc.close();

        // Wait for the content to be fully loaded before printing
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
    };

    // Remove the iframe after printing
    setTimeout(() => document.body.removeChild(printFrame), 1000);
};
</script>

<template>
    <h4>Schedule Print-Outs</h4>
    <p>
        Here you can generate a printable schedule for your reference
        <br>
        <br>
        1. <b>Select the number of days from today that you want to see on the schedule <br>(e.g. 7 if you want the schedule for the week)</b>
        <br>
        <br>
        2. <b>Press "generate" to generate the schedule view</b>
        <br>
        <br>
        3. <b>Press "print" to access print dialog</b>
        <br>
        <br>
    </p>
    <form @submit.prevent="generateSchedule">
        <input type="number" v-model="days">
        <br>
        <input type="submit" value="Generate">
    </form>
    <button v-if="showSchedule" @click="printMe">Print</button>
    <div v-if="showSchedule" id="printable-schedule">
        <div v-for="(data, date) in schedule" style="margin-bottom: 40px; max-width: 900px;">
            <br>
            <h5 style="text-align: center;">{{ dateUtils.formatDate(date) }}</h5>
            <br>
            <p v-if="data.length == 0" style="color: lightgrey; text-align: center;">
                No Meals on This Day
            </p>
            <div style="display: flex; flex-direction: row; justify-content: space-around;">
                <div v-for="meal in data">
                    <h6><b>{{ meal.kind }}</b></h6>
                    <a href="" style="color: #1B76FF; text-decoration: none;">{{ meal.meal.name }}</a>
                </div>
            </div>
        </div>
    </div>
</template>
