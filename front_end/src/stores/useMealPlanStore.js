import { defineStore } from 'pinia';
import axios from 'axios';

export const useMealPlanStore = defineStore('mealplan', {
    state: () => ({ mealplans: [] }),
    getters: { 
        getMealPlans: (state) => state.mealplans,
    },
    actions: { 
        load(mealplans) {
            this.mealplans = mealplans;
        },
        async query() {
            try {
                const response = await axios.get('/api/plans');
                this.load(response.data);
            } catch (error) {
                console.error('Failed to fetch inventory');
                console.error(error);
            }
        },
        deleteMealPlan(id) {
            this.mealplans = this.mealplans.filter(i => i.id != id);
        }
    }
})
