'use strict';

const faker = require('@faker-js/faker').faker;

function getRandomMealPlanName() {
    const mealPlanNames = [
        "Balanced Bites",
        "Fit & Fresh Meals",
        "Nutritious Nosh",
        "Wholesome Wonders",
        "Gourmet Greens",
        "Deliciously Diverse",
        "Epicurean Essentials",
        "Vibrant Veggie Feast",
        "Healthy Harvest",
        "Savor & Sustain",
        "Daily Delight",
        "Tasty Traditions",
        "Satisfying Suppers",
        "Flavor Fusion",
        "Energetic Eats",
        "Farm-to-Table Favorites",
        "Mindful Meals",
        "Nourishing Nourishments",
        "Chef’s Choice",
        "Ultimate Uplift",
        "Happy & Healthy",
        "Plenty of Protein",
        "Simple & Scrumptious",
        "Delightful Dishes",
        "Nutritious Nom Nom",
        "Feast of Flavors",
        "Quick & Clean",
        "Savory Solutions",
        "Balanced Brilliance",
        "Gourmet Goodness",
        "Energizing Eats",
        "Vitality Meals",
        "Savor the Day",
        "Healthful Haven",
        "Vibrant Plate",
        "Nourish & Flourish",
        "Fresh & Flavorful",
        "Wholesome Wonders",
        "Fit Feast",
        "Elegant Eats",
        "Health Boost Menu",
        "Family Feast",
        "Easy & Elegant",
        "Quick Fix Feast",
        "Seasonal Sensations",
        "Purely Plant-Based",
        "Tasteful Table",
        "Yummy & Balanced",
        "Guilt-Free Gourmet",
        "Nutrient-Rich Nourishment",
        "Sustainable Supper",
        "Flavorful Fusion",
        "Daily Nourishment",
        "Clean Plate Club",
        "Elegant Eats",
        "Tasty & Tender",
        "Smart & Savory",
        "Chef's Special",
        "Perfect Plate",
        "Nourishing Nights",
        "Tasty Triumph",
        "Fresh & Fabulous",
        "Energize Eats",
        "Holistic Harmony",
        "Flavor Feast",
        "Wholesome Wonders",
        "Comfort & Nutrition",
        "Quick & Tasty",
        "Balanced Plate",
        "Delicious Daily",
        "Vibrant Cuisine",
        "Hearty & Healthy",
        "Satisfying Spoons",
        "Seasonal Splendor",
        "Perfect Portions",
        "Daily Delights",
        "Nourish Now",
        "Vitality Menu",
        "Healthful Harmony",
        "Flavorful Feast",
        "Simple & Delicious",
        "Gourmet Grub",
        "Nutritious Nibble",
        "Satisfy & Sustain",
        "Chef’s Creations",
        "Pure Plate",
        "Healthy Harvest",
        "Energizing Eats",
        "Balanced Bites",
        "Tasty Trio",
        "Fresh & Flavorful",
        "Whole Foods Wonders",
        "Flavorful Fusion",
        "Healthy Choice",
        "Savor & Shine",
        "Daily Nourishment",
        "Seasonal Selections",
        "Guilt-Free Goodies",
        "Ultimate Eats",
        "Flavor Feast"
    ];
    
    return faker.helpers.arrayElement(mealPlanNames);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        const schedule = [];
        for (let id = 0; id < 3; id++) {
            const name = getRandomMealPlanName();
            const notes = faker.helpers.arrayElement([null, 'generally well liked', 'not so popular with some people']);
            schedule.push({
                name,
                notes,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await queryInterface.bulkInsert('MealPlanInfos', schedule, {});
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('MealPlanInfos', null, {});
    }
};
