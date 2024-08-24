'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Ingredient extends Model {
        static associate(models) {
            Ingredient.belongsToMany(models.Meal, { through: 'MealIngredients', foreignKey: "ingredient_id", otherKey: "meal_id" });
        }
    }

    Ingredient.init(
        {
            name: DataTypes.STRING,
            quantity: DataTypes.INTEGER,
            unit: DataTypes.ENUM('ml', 'l', 'pt', 'oz', 'g', 'kg', 'unit', 'tsp', 'tbsp', 'pinch')
        },
        {
            sequelize,
            modelName: 'Ingredient',
        }
    );

    return Ingredient;
};
