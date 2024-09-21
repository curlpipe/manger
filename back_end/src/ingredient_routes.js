const { Ingredient } = require('../models/index.js');

module.exports.getAll = async (request, response) => {
    // Get all models
    const ingredients = await Ingredient.findAll({ order: [['name', 'ASC']] });

    // Send the response
    response.status(200).json(ingredients)
};

module.exports.get = async (request, response) => {
    // Break down request
    const id = request.params.id;
    
    // Attempt to find the model
    const ingredient = await Ingredient.findOne({ where: { id } });
    if (!ingredient) { return response.status(404).json({ message: 'Ingredient not found' }) }

    // Send the response
    response.status(200).json(ingredient)
};

module.exports.post = async (request, response) => {
    // Break down request
    const { name, quantity, unit } = request.body;

    // Return error if values aren't present
    if (name == null || quantity == null || unit == null) {
        return response.status(400).json({ message: 'An ingredient must include a name, quantity and unit' });
    }

    // Attempt to add to the database, and send the appropriate response
    await Ingredient.create({ name, quantity, unit })
        .then(result => response.status(200).json({ message: 'Success' }))
        .catch(error => response.status(500).json({ message: 'Failed to add to database, please check your values' }))
};

module.exports.put = async (request, response) => {
    // Break down request
    const id = request.params.id;
    const { name, quantity, unit } = request.body;

    // Attempt to find the model
    const model = await Ingredient.findByPk(id);

    // Check the model can be found
    if (!model) { return response.status(404).json({ message: 'Ingredient not found' }) }

    // Update the model with new data
    model.name = name ?? model.name;
    model.quantity = quantity ?? model.quantity;
    model.unit = unit ?? model.unit;

    // Save the model and send the appropriate response
    await model.save()
        .then(result => response.status(200).json({ message: 'Success' }))
        .catch(error => response.status(500).json({ message: 'Failed to update ingredient, please check your values' }))
};

module.exports.delete = async (request, response) => {
    // Break down the request
    const id = request.params.id;

    // Attempt to destroy the model and send the appropriate response
    await Ingredient.destroy({ where: { id } })
        .then(result => response.status(200).json({ message: 'Success' }))
        .catch(error => response.status(500).json({ message: `Failed to delete ingredient: ${error}` }))
};
