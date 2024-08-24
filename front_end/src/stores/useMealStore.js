import { defineStore } from 'pinia';
import axios from 'axios';

export const useMealStore = defineStore('meal', {
    state: () => ({ meals: [] }),
    getters: { 
        getMeals: (state) => state.meals,
    },
    actions: { 
        load(meals) {
            this.meals = meals;
        },
        async query() {
            try {
                const response = await axios.get('/api/meals');
                this.load(response.data);
            } catch (error) {
                console.error('Failed to fetch meals');
                console.error(error);
            }
        },
        deleteMeal(id) {
            this.meals = this.meals.filter(i => i.id != id);
        }
    }
})
