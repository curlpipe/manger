import { createRouter, createWebHistory } from 'vue-router';
import PantryView from '@/views/PantryView.vue';
import NewIngredientView from '@/views/NewIngredientView.vue';
import EditIngredientView from '@/views/EditIngredientView.vue';
import CookbookView from '@/views/CookbookView.vue';
import NewMealView from '@/views/NewMealView.vue';
import EditMealView from '@/views/EditMealView.vue';
import MealPlanView from '@/views/MealPlanView.vue';
import NewMealPlanView from '@/views/NewMealPlanView.vue';
import EditMealPlanView from '@/views/EditMealPlanView.vue';
import GetCookingView from '@/views/GetCookingView.vue';

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
        {
            path: '/cookbook/edit/:id',
            name: 'edit_meal',
            component: EditMealView,
            props: true,
        },
        {
            path: '/mealplans',
            name: 'meal_plans',
            component: MealPlanView,
        },
        {
            path: '/mealplans/add',
            name: 'new_meal_plan',
            component: NewMealPlanView,
        },
        {
            path: '/mealplans/edit/:id',
            name: 'edit_meal_plan',
            component: EditMealPlanView,
            props: true,
        },
        {
            path: '/getcooking',
            name: 'get_cooking',
            component: GetCookingView,
        },
    ]
});

export default router;
