'use strict';

const faker = require('@faker-js/faker').faker;
const Ingredient = require('../models/index.js').Ingredient;

function getRandomIngredient() {
    const ingredients = [
      'Tomato',
      'Garlic',
      'Onion',
      'Basil',
      'Chicken',
      'Cheese',
      'Olive Oil',
      'Bell Pepper',
      'Mushroom',
      'Pasta',
      'Beef',
      'Lettuce',
      'Carrot',
      'Salt',
      'Pepper',
      'Vinegar',
      'Honey',
      'Cucumber',
      'Lemon',
      'Yogurt',
      'Spinach',
      'Potato',
      'Rice',
      'Eggplant',
      'Zucchini',
      'Broccoli',
      'Cauliflower',
      'Garlic Powder',
      'Cinnamon',
      'Chili Powder',
      'Soy Sauce',
      'Sesame Oil',
      'Ginger',
      'Rosemary',
      'Thyme',
      'Oregano',
      'Parsley',
      'Paprika',
      'Turmeric',
      'Mustard',
      'Worcestershire Sauce',
      'Coconut Milk',
      'Cream',
      'Almonds',
      'Walnuts',
      'Pine Nuts',
      'Peanuts',
      'Sunflower Seeds',
      'Chia Seeds',
      'Flax Seeds',
      'Quinoa',
      'Barley',
      'Oats',
      'Brown Sugar',
      'Maple Syrup',
      'Agave Syrup',
      'Molasses',
      'Sriracha',
      'Tabasco Sauce',
      'Ketchup',
      'Mayonnaise',
      'Mustard',
      'Pickles',
      'Capers',
      'Olives',
      'Tomato Paste',
      'Tortillas',
      'Noodles',
      'Cabbage',
      'Kale',
      'Arugula',
      'Endive',
      'Radish',
      'Beets',
      'Turnips',
      'Squash',
      'Pumpkin',
      'Sweet Potato',
      'Avocado',
      'Lime',
      'Mint',
      'Cilantro',
      'Chives',
      'Dill',
      'Sage',
      'Cardamom',
      'Cloves',
      'Nutmeg',
      'Allspice',
      'Bay Leaves',
      'Star Anise',
      'Coriander',
      'Fennel',
      'Garam Masala',
      'Tamarind',
      'Coconut Flakes',
      'Cacao Powder',
      'Vanilla Extract'
    ];

  return faker.helpers.arrayElement(ingredients);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        const ingredients = [];
        for (let i = 0; i < 60; i++) {
            ingredients.push({
                name: getRandomIngredient(),
                quantity: faker.number.int({ min: 1, max: 100 }),
                unit: faker.helpers.arrayElement(['ml', 'l', 'pt', 'oz', 'g', 'kg', 'unit', 'tsp', 'tbsp', 'pinch']),
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await queryInterface.bulkInsert('Ingredients', ingredients, {});
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Ingredients', null, {});
    }
};
