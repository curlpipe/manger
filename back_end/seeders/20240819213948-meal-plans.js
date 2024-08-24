'use strict';

const faker = require('@faker-js/faker').faker;
const MealPlan = require('../models/index.js').MealPlan;
const Meal = require('../models/index.js').Meal;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        const meal_plans = [];
        const [result] = await queryInterface.sequelize.query('SELECT COUNT(*) FROM "MealPlanInfos";');
        const meal_plan_count = result[0].count;
        const meal_count = await Meal.count();
        for (let id = 0; id < meal_plan_count; id++) {
            for (let day = 0; day < faker.number.int({ min: 2, max: 8 }); day++) {
                meal_plans.push({
                    id: id,
                    day: day,
                    breakfast: faker.helpers.arrayElement([null, faker.number.int({ min: 1, max: meal_count })]),
                    lunch: faker.helpers.arrayElement([null, null, faker.number.int({ min: 1, max: meal_count })]),
                    brunch: faker.helpers.arrayElement([null, null, null, faker.number.int({ min: 1, max: meal_count })]),
                    dinner: faker.helpers.arrayElement([null, faker.number.int({ min: 1, max: meal_count })]),
                    snack: faker.helpers.arrayElement([null, faker.number.int({ min: 1, max: meal_count })]),
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        }
        await queryInterface.bulkInsert('MealPlans', meal_plans, {});
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('MealPlans', null, {});
    }
};
