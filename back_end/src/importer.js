const { Ingredient, Meal, MealIngredient, MealPlan, MealPlanInfo, Schedule } = require('../models/index.js');

module.exports.importData = async (request, response) => {
    // Obtain data
    const { data } = request.body;
    // Clear the databases
    await Ingredient.destroy({ where: {}, truncate: false });
    await Meal.destroy({ where: {}, truncate: false });
    await MealIngredient.destroy({ where: {}, truncate: false });
    await MealPlan.destroy({ where: {}, truncate: false });
    await MealPlanInfo.destroy({ where: {}, truncate: false });
    await Schedule.destroy({ where: {}, truncate: false });
    // Upload ingredients
    data.ingredients.forEach(async i => {
        await Ingredient.create({ id: i.id, name: i.name, quantity: i.quantity, unit: i.unit });
    });
    // Upload meals
    data.meals.forEach(async m => {
        let { id, name, time, difficulty, ingredients, instructions, notes, rating } = m;
        // Attach ingredients to meals
        await Meal.create({ id, name, time, difficulty, instructions, notes, rating })
            .then(async result => {
                // Reapply ingredients
                for (const { id: ingredient_id, amount } of ingredients) {
                    await MealIngredient.create({ meal_id: result.id, ingredient_id, amount });
                }
            });
    });
    // Upload meal plan info
    data.plans.forEach(async p => {
        let { id, name, notes, content } = p;
        await MealPlanInfo.create({ id, name, notes })
            .then(async result => {
                // Upload meal plan content
                for (let i = 0; i < content.length; i++) {
                    let planned_meal = content[i];
                    planned_meal.id = result.id;
                    planned_meal.day = i;
                    await MealPlan.create(planned_meal);
                }
            });
        });
    // Upload schedule
    Object.keys(data.schedule).forEach(async date => {
        data.schedule[date].forEach(async m => {
            let { id, meal_id, kind } = m;
            await Schedule.create({ id, date, kind, meal_id });
        });
    });
};
