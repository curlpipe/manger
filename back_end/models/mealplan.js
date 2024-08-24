'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MealPlan extends Model {}

    MealPlan.init(
        {
            day: DataTypes.INTEGER,
            breakfast: DataTypes.INTEGER,
            lunch: DataTypes.INTEGER,
            brunch: DataTypes.INTEGER,
            dinner: DataTypes.INTEGER,
            snack: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'MealPlan',
        }
    );

    return MealPlan;
};
