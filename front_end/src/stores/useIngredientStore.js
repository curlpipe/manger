import { defineStore } from 'pinia';
import axios from 'axios';

export const useIngredientStore = defineStore('ingredient', {
    state: () => ({ ingredients: [] }),
    getters: { 
        getIngredients: (state) => state.ingredients,
    },
    actions: { 
        load(ingredients) {
            this.ingredients = ingredients;
        },
        async query() {
            try {
                const response = await axios.get('/api/ingredients');
                this.load(response.data);
            } catch (error) {
                console.error('Failed to fetch inventory');
                console.error(error);
            }
        },
        deleteIngredient(id) {
            this.ingredients = this.ingredients.filter(i => i.id != id);
        }
    }
})
