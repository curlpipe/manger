<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    meals: Array,
    plans: Array,
    type: String,
});

onMounted(() => {
    document.querySelector('.popup').style.height = document.querySelector('#app').offsetHeight + 'px';
    console.log(props.meals);
});

const meal = ref(0);
const kind = ref('breakfast');
const plan = ref(1);

const prevMeal = () => {
    if (meal.value != 0) meal.value -= 1;
};

const nextMeal = () => {
    if (meal.value + 1 != props.meals.length) meal.value += 1;
};

</script>

<template>
    <div class="popup">
        <button 
            style="font-weight: bold; font-size: 20px; padding-left: 12px; padding-right: 12px; width: 40px; height: 38px" 
            class="red-bg" 
            @click="$emit('closePopup')"
        >X</button>
        <h4>Select your meal</h4>
        <form v-if="type == 'schedule'" @submit.prevent="$emit('selectMeal', meals[meal].id, kind)">
            <label for="kind">For: </label>
            <select id="kind" name="kind" v-model="kind">
                <option v-for="at in ['breakfast', 'lunch', 'brunch', 'dinner', 'snack']" :value="at">{{ at }}</option>
            </select>
            <br>
            <br>
            <form @submit.prevent="">
                <div style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;">
                    <button style="width: 49%;" @click="prevMeal">&#8592;</button>
                    <button style="width: 49%;" @click="nextMeal">&#8594;</button>
                </div>
            </form>
            <div class="carousel border border-rnd">
                <div style="width: 100%;">
                    <div class="bunch-no-pad">
                        <h5 class="list-title" style="font-weight: bold;">{{ meals[meal].name }}</h5>
                        <h5>{{ meals[meal].time }} mins</h5>

                        <h5 class="green-fg" v-if="meals[meal].difficulty == 'easy'"><b>{{ meals[meal].difficulty }}</b></h5>
                        <h5 class="yellow-fg" v-if="meals[meal].difficulty == 'medium'"><b>{{ meals[meal].difficulty }}</b></h5>
                        <h5 class="red-fg" v-if="meals[meal].difficulty == 'hard'"><b>{{ meals[meal].difficulty }}</b></h5>

                        <h5 class="green-fg" v-if="meals[meal].rating == true">&#128077;</h5>
                        <h5 class="red-fg" v-if="meals[meal].rating == false">&#128078;</h5>
                    </div>
                    <p>
                        <span v-if="meals[meal].score > 0.66" class="green-fg">{{ meals[meal].score * 100 }}%</span>
                        <span v-else-if="meals[meal].score < 0.4" class="red-fg">{{ meals[meal].score * 100 }}%</span>
                        <span v-else class="orange-fg">{{ meals[meal].score * 100 }}%</span>
                        recommended
                    </p>
                    <ul>
                        <li v-for="reason in meals[meal].explanation.good">&#10003; {{ reason }}</li>
                        <li v-for="reason in meals[meal].explanation.bad">&#9888;{{ reason }}</li>
                    </ul>
                </div>
            </div>
            <br>
            <input type="submit" value="Select">
        </form>
        <div v-if="type == 'schedule'" id="mealplanactivate">
            <hr>
            <h4>Activate a meal plan</h4>
            <form @submit.prevent="$emit('activatePlan', plan)">
                <label for="meal">Plan: </label>
                <select id="plan" name="plan" v-model="plan">
                    <option v-for="plan in plans" :value="plan.id">{{ plan.name }}</option>
                </select>
                <br>
                <input type="submit" value="Activate">
            </form>
        </div>
    </div>
</template>
