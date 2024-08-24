const { Meal, MealPlan, MealPlanInfo } = require('../models/index.js');

module.exports.getAll = async (request, response) => {
    // Get all models
    var plans = await MealPlanInfo.findAll();

    // Send the response
    response.status(200).json(plans)
};

module.exports.get = async (request, response) => {
    // Break down request
    const id = request.params.id;
    
    // Attempt to find the model
    const plan = await MealPlanInfo.findOne({ where: { id } });
    if (!plan) { return response.status(404).json({ message: 'Meal plan not found' }) }
    const result = plan.toJSON();

    // Attach content of meal plan
    const links = await MealPlan.findAll({ where: { id } });
    const part = plan.toJSON();
    part.content = [];
    links.forEach(link => {
        link = link.toJSON();
        delete link.id;
        delete link.day;
        delete link.createdAt;
        delete link.updatedAt;
        part.content.push(link);
    });
    
    response.status(200).json(part)
};

module.exports.post = async (request, response) => {
    // Break down request
    const { name, notes, content } = request.body;

    // Return error if values aren't present
    if (name == null) {
        return response.status(400).json({ message: 'A plan must include a name' });
    }

    // Attempt to add to the database, and send the appropriate response
    await MealPlanInfo.create({ name, notes })
        .then(async result => {
            // Attach meals to the plan
            for (let i = 0; i < content.length; i++) {
                let planned_meal = content[i];
                planned_meal.id = result.id;
                planned_meal.day = i;
                await MealPlan.create(planned_meal);
            }

            response.status(200).json({ message: 'Success' })
        });
};

module.exports.put = async (request, response) => {
    // Break down request
    const id = request.params.id;
    const { name, notes, content } = request.body;

    // Attempt to find the model
    const model = await MealPlanInfo.findByPk(id);

    // Check the model can be found
    if (!model) { return response.status(404).json({ message: 'Meal not found' }) }

    // Update the model with new data
    model.name = name || model.name;
    model.notes = notes || model.notes;

    // Remove all attached meals (if applicable)
    if (content != null) { await MealPlan.destroy({ where: { id } }) }

    // Reapply new attached meals
    const meals_to_attach = content == null ? [] : content;
    for (let i = 0; i < content.length; i++) {
        var planned_meal = content[i];
        planned_meal.id = id;
        planned_meal.day = i;
        await MealPlan.create(planned_meal);
    }

    // Save the model and send the appropriate response
    await model.save()
        .then(result => response.status(200).json({ message: 'Success' }))
        .catch(error => response.status(500).json({ message: 'Failed to update meal plan, please check your values' }))
};

module.exports.delete = async (request, response) => {
    // Break down the request
    const id = request.params.id;

    // Destroy attached meals
    await MealPlan.destroy({ where: { id } })

    // Attempt to destroy the model and send the appropriate response
    await MealPlanInfo.destroy({ where: { id } })
        .then(result => response.status(200).json({ message: 'Success' }))
        .catch(error => response.status(500).json({ message: 'Failed to delete meal plan' }))
};
