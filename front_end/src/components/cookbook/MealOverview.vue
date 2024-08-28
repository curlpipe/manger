<script setup>
defineProps({
    meals: Array,
});


</script>

<template>
    <div>
        <div v-for="meal in meals" class="border border-rnd" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
                <div class="bunch" style="padding: 15px;">
                    <h5 class="list-title" style="font-weight: bold;">{{ meal.name }}</h5>
                    <h5>{{ meal.time }} mins</h5>

                    <h5 class="green-fg" v-if="meal.difficulty == 'easy'"><b>{{ meal.difficulty }}</b></h5>
                    <h5 class="yellow-fg" v-if="meal.difficulty == 'medium'"><b>{{ meal.difficulty }}</b></h5>
                    <h5 class="red-fg" v-if="meal.difficulty == 'hard'"><b>{{ meal.difficulty }}</b></h5>

                    <h5 class="green-fg" v-if="meal.rating == true">&#128077;</h5>
                    <h5 class="red-fg" v-if="meal.rating == false">&#128078;</h5>
                </div>
                <form @submit.prevent="$emit('selectMeal', meal.id)">
                    <button class="blue-bg" style="font-weight: bold; font-size: 20px; margin: 15px;">&#10003;</button>
                </form>
            </div>
            <div style="padding-left: 25px; padding-bottom: 10px;">
                <p>
                    <span v-if="meal.score > 0.66" class="green-fg">{{ meal.score * 100 }}%</span>
                    <span v-else-if="meal.score < 0.4" class="red-fg">{{ meal.score * 100 }}%</span>
                    <span v-else class="orange-fg">{{ meal.score * 100 }}%</span>
                    recommended
                </p>
                <ul>
                    <li v-for="reason in meal.explanation.good">&#10003; {{ reason }}</li>
                    <li v-for="reason in meal.explanation.bad">&#9888;{{ reason }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
