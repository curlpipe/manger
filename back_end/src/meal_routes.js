const { Meal, MealIngredient, Ingredient } = require('../models/index.js');

module.exports.getAll = async (request, response) => {
    // Get all models
    const meals = await Meal.findAll();

    // Send the response
    response.status(200).json(meals)
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
    model.name = name || model.name;
    model.time = time || model.time;
    model.difficulty = difficulty || model.difficulty;
    model.instructions = instructions || model.instructions;
    model.notes = notes || model.notes;
    model.rating = rating || model.rating;

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
