'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MealPlanInfo extends Model {}

    MealPlanInfo.init(
        {
            name: DataTypes.STRING,
            notes: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'MealPlanInfo',
        }
    );

    return MealPlanInfo;
};
