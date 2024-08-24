'use strict';

const faker = require('@faker-js/faker').faker;
const Meal = require('../models/index.js').Meal;

function getRandomMealName() {
  const adjectives = ['Spicy', 'Savory', 'Delicious', 'Zesty', 'Creamy'];
  const mainIngredients = ['Chicken', 'Beef', 'Pasta', 'Tofu', 'Salad', 'Soup'];
  const dishes = ['Stir-Fry', 'Curry', 'Bowl', 'Tacos', 'Sandwich', 'Wrap'];

  // Combine random choices from the arrays to create a meal name
  const mealName = `${faker.helpers.arrayElement(adjectives)} ${faker.helpers.arrayElement(mainIngredients)} ${faker.helpers.arrayElement(dishes)}`;
  
  return mealName;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        const meals = [];
        for (let i = 0; i < 5; i++) {
            meals.push({
                name: getRandomMealName(),
                time: faker.number.int({ min: 20, max: 120 }),
                difficulty: faker.helpers.arrayElement(['easy', 'medium', 'hard']),
                notes: faker.helpers.arrayElement([null, 'really nice food', 'not so nice', 'super quick to make']),
                rating: faker.helpers.arrayElement([null, true, false]),
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await queryInterface.bulkInsert('Meals', meals, {});
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Meals', null, {});
    }
};
