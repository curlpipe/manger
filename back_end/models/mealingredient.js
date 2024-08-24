'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MealIngredient extends Model {}

    MealIngredient.init(
        {
            meal_id: DataTypes.INTEGER,
            ingredient_id: DataTypes.INTEGER,
            amount: DataTypes.INTEGER
        }, 
        {
            sequelize,
            modelName: 'MealIngredient',
        }
    );

    return MealIngredient;
};
