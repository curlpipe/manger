'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {}
    
    Schedule.init(
        {
            meal_id: DataTypes.INTEGER,
            date: DataTypes.DATEONLY,
            kind: DataTypes.ENUM('breakfast', 'lunch', 'brunch', 'dinner', 'snack')
        },
        {
            sequelize,
            modelName: 'Schedule',
        }
    );

    return Schedule;
};
