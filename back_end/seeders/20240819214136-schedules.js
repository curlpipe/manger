'use strict';

const faker = require('@faker-js/faker').faker;
const Schedule = require('../models/index.js').Schedule;
const Meal = require('../models/index.js').Meal;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        const schedule = [];
        const meal_count = await Meal.count();
        for (let i = 0; i < 100; i++) {
            const row = [{
                meal_id: faker.number.int({ min: 1, max: meal_count }),
                date: faker.date.between({ from: new Date(2024, 7, 20), to: new Date(2024, 8, 20) }),
                kind: faker.helpers.arrayElement(['breakfast', 'lunch', 'brunch', 'dinner', 'snack']),
                createdAt: new Date(),
                updatedAt: new Date()
            }];
            try {
                await queryInterface.bulkInsert('Schedules', row, {});
            } catch {
                
            }
        }
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Schedules', null, {});
    }
};
