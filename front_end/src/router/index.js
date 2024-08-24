import { createRouter, createWebHistory } from 'vue-router';
import PantryView from '@/views/PantryView.vue';
import NewIngredientView from '@/views/NewIngredientView.vue';
import EditIngredientView from '@/views/EditIngredientView.vue';
import CookbookView from '@/views/CookbookView.vue';
import NewMealView from '@/views/NewMealView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/pantry',
            name: 'pantry',
            component: PantryView,
        },
        {
            path: '/pantry/add',
            name: 'new_ingredient',
            component: NewIngredientView,
        },
        {
            path: '/pantry/edit/:id',
            name: 'edit_ingredient',
            component: EditIngredientView,
            props: true,
        },
        {
            path: '/cookbook',
            name: 'cookbook',
            component: CookbookView,
        },
        {
            path: '/cookbook/add',
            name: 'new_meal',
            component: NewMealView,
        },
    ]
});

export default router;
