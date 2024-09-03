const { Schedule } = require('../models/index.js');
const { fn, col, literal } = require('sequelize');

module.exports.getAll = async (request, response) => {
    // Get all models
    const schedule = await Schedule.findAll({
        order: [['date', 'ASC'], ['kind', 'ASC']],
    });

    var result = {};

    schedule.forEach(record => {
        if (record.date in result) {
            result[record.date].push(record);
        } else {
            result[record.date] = [record];
        }
    });

    // Send the response
    response.status(200).json(result)
};

module.exports.post = async (request, response) => {
    // Break down request
    const { date, kind, meal_id } = request.body;

    // Return error if values aren't present
    if (date == null || kind == null || meal_id == null) {
        return response.status(400).json({ message: 'A schedule item must include a date, kind and meal_id' });
    }

    // Attempt to add to the database, and send the appropriate response
    await Schedule.create({ date, kind, meal_id })
        .then(result => response.status(200).json({ message: 'Success' }))
        .catch(error => response.status(500).json({ message: 'Failed to add to database, please check your values' }))
};

module.exports.put = async (request, response) => {
    // Break down request
    const id = request.params.id;
    const { date, kind, meal_id } = request.body;

    // Attempt to find the model
    const model = await Schedule.findByPk(id);

    // Check the model can be found
    if (!model) { return response.status(404).json({ message: 'Schedule item not found' }) }

    // Update the model with new data
    model.date = date ?? model.date;
    model.kind = kind ?? model.kind;
    model.meal_id = meal_id ?? model.meal_id;

    // Save the model and send the appropriate response
    await model.save()
        .then(result => response.status(200).json({ message: 'Success' }))
        .catch(error => response.status(500).json({ message: 'Failed to update schedule item, please check your values' }))
};

module.exports.delete = async (request, response) => {
    // Break down the request
    const id = request.params.id;

    // Attempt to destroy the model and send the appropriate response
    await Schedule.destroy({ where: { id } })
        .then(result => response.status(200).json({ message: 'Success' }))
        .catch(error => response.status(500).json({ message: 'Failed to delete schedule item' }))
};
