'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Meal extends Model {
        static associate(models) {
            Meal.belongsToMany(models.Ingredient, { through: 'MealIngredients', foreignKey: "meal_id", otherKey: "ingredient_id" });
        }
    }

    Meal.init(
        {
            name: DataTypes.STRING,
            time: DataTypes.INTEGER,
            difficulty: DataTypes.ENUM('easy', 'medium', 'hard'),
            instructions: DataTypes.JSON,
            notes: DataTypes.STRING,
            rating: DataTypes.BOOLEAN
        }, 
        {
            sequelize,
            modelName: 'Meal',
        }
    );

    return Meal;
};
