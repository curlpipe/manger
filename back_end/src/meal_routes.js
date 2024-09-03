const { Meal, MealIngredient, Ingredient } = require('../models/index.js');

module.exports.getAll = async (request, response) => {
    // Get all models
    const meals = await Meal.findAll({
        include: [{
            model: Ingredient,
            through: { attributes: ['amount'] }
        }]
    });

    // Rename ingredient fields
    const result = meals.map(meal => {
        meal = meal.toJSON();
        meal.ingredients = meal['Ingredients'];
        delete meal['Ingredients'];
        return meal;
    });

    // Calculate meal score
    result.forEach(meal => {
        let the_good = [];
        let the_bad = [];
        let need_to_buy = meal.ingredients
            .filter(i => (i.quantity - i.MealIngredients.amount) <= 0)
            .length;
        let rating = meal.rating == null ? 0.5 : (meal.rating ? 1 : 0);
        let difficulty = meal.difficulty == 'hard' ? 0 : (meal.difficulty == 'easy' ? 1 : 0.5);
        let time = 1 - Math.min(meal.time, 220) / 220;
        if (need_to_buy <= 3) {
            the_good.push("It makes good use of ingredients you already have");
        } else if (need_to_buy > 7) {
            the_bad.push("It will require the purchasing of quite a few new ingredients");
        }
        need_to_buy = 1 - (Math.min(need_to_buy, 20) / 20);
        if (rating == 1) {
            the_good.push("This recipe is rated highly in terms of preference");
        } else {
            the_bad.push("This recipe is not rated highly in terms of preference");
        }
        if (difficulty == 0) {
            the_bad.push("This recipe is difficult to make");
        } else if (difficulty == 1) {
            the_good.push("This recipe is easy to make");
        }
        if (time > 0.7) {
            the_good.push("This recipe is quick to make");
        } else if (time < 0.5) {
            the_bad.push("This recipe takes a while to make");
        }
        let score = need_to_buy * 0.25 + rating * 0.35 + difficulty * 0.15 + time * 0.25;
        meal.score = parseFloat(score.toFixed(2));
        meal.explanation = {
            good: the_good,
            bad: the_bad,
        };
    });

    result.sort((a, b) => b.score - a.score);

    // Send the response
    response.status(200).json(result)
};

module.exports.get = async (request, response) => {
    // Break down request
    const id = request.params.id;
    
    // Attempt to find the model
    const meal = await Meal.findOne({ 
        where: { id },
        include: [{
            model: Ingredient,
            through: { attributes: ['amount'] }
        }]
    });
    if (!meal) { return response.status(404).json({ message: 'Meal not found' }) }
    const result = meal.toJSON();

    // Rename key on the result object
    result['ingredients'] = result['Ingredients'];
    delete result['Ingredients'];

    // Send the response
    response.status(200).json(result)
};

module.exports.post = async (request, response) => {
    // Break down request
    const { name, time, difficulty, instructions, notes, rating, ingredients } = request.body;

    // Return error if values aren't present
    if (name == null || time == null || difficulty == null) {
        return response.status(400).json({ message: 'A meal must include a name, time, difficulty' });
    }

    // Attempt to add to the database, and send the appropriate response
    await Meal.create({ name, time, difficulty, instructions, notes, rating })
        .then(async result => {
            // Reapply ingredients
            for (const { id: ingredient_id, amount } of ingredients) {
                await MealIngredient.create({ meal_id: result.id, ingredient_id, amount });
            }

            response.status(200).json({ message: 'Success' })
        })
        .catch(error => response.status(500).json({ message: 'Failed to add to database, please check your values: ' + error }))
};

module.exports.put = async (request, response) => {
    // Break down request
    const id = request.params.id;
    const { name, time, difficulty, instructions, notes, rating, ingredients } = request.body;

    // Attempt to find the model
    const model = await Meal.findByPk(id);

    // Check the model can be found
    if (!model) { return response.status(404).json({ message: 'Meal not found' }) }

    // Update the model with new data
    model.name = name ?? model.name;
    model.time = time ?? model.time;
    model.difficulty = difficulty ?? model.difficulty;
    model.instructions = instructions ?? model.instructions;
    model.notes = notes ?? model.notes;
    model.rating = rating ?? model.rating;

    // Remove all ingredients (if applicable)
    if (ingredients != null) { await MealIngredient.destroy({ where: { meal_id: id } }) }

    // Reapply ingredients
    const ingredients_to_attach = ingredients == null ? [] : ingredients;
    for (const { id: ingredient_id, amount } of ingredients_to_attach) {
        await MealIngredient.create({ meal_id: id, ingredient_id, amount });
    }

    // Save the model and send the appropriate response
    await model.save()
        .then(result => response.status(200).json({ message: 'Success' }))
        .catch(error => response.status(500).json({ message: 'Failed to update meal, please check your values' }))
};

module.exports.delete = async (request, response) => {
    // Break down the request
    const id = request.params.id;

    // Attempt to destroy the model and send the appropriate response
    await Meal.destroy({ where: { id } })
        .then(result => response.status(200).json({ message: 'Success' }))
        .catch(error => response.status(500).json({ message: 'Failed to delete meal' }))
};
