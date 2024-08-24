'use strict';

const faker = require('@faker-js/faker').faker;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        const [meals] = await queryInterface.sequelize.query(`SELECT id FROM "Meals";`);
        const [ingredients] = await queryInterface.sequelize.query(`SELECT id FROM "Ingredients";`);

        const mealIngredients = [];

        meals.forEach((meal) => {
            // Randomly assign 3-5 ingredients to each meal
            const randomIngredients = faker.helpers.arrayElements(ingredients, faker.number.int({ min: 3, max: 5 }));

            randomIngredients.forEach((ingredient) => {
                mealIngredients.push({
                    meal_id: meal.id,
                    ingredient_id: ingredient.id,
                    amount: faker.number.int({ min: 1, max: 100 }),
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            });
        });

        await queryInterface.bulkInsert('MealIngredients', mealIngredients, {});
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('MealIngredients', null, {});
    }
};
