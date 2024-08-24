// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const ingredients = require('./ingredient_routes.js');
const meals = require('./meal_routes.js');
const mealplans = require('./meal_plan_routes.js');
const schedule = require('./schedule_routes.js');

// Set up express server
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get('/ingredients', ingredients.getAll);
app.get('/ingredient/:id', ingredients.get);
app.post('/ingredient', ingredients.post);
app.put('/ingredient/:id', ingredients.put);
app.delete('/ingredient/:id', ingredients.delete);

app.get('/meals', meals.getAll);
app.get('/meal/:id', meals.get);
app.post('/meal', meals.post);
app.put('/meal/:id', meals.put);
app.delete('/meal/:id', meals.delete);

app.get('/plans', mealplans.getAll);
app.get('/plan/:id', mealplans.get);
app.post('/plan', mealplans.post);
app.put('/plan/:id', mealplans.put);
app.delete('/plan/:id', mealplans.delete);

app.get('/schedule', schedule.getAll);
app.post('/schedule', schedule.post);
app.put('/schedule/:id', schedule.put);
app.delete('/schedule/:id', schedule.delete);

// Run the application
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
