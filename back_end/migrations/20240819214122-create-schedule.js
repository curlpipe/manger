'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Schedules', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: false,
                type: Sequelize.INTEGER
            },
            meal_id: {
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Meals',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                type: Sequelize.INTEGER
            },
            kind: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.ENUM('breakfast', 'lunch', 'brunch', 'dinner', 'snack')
            },
            date: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.DATEONLY
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Schedules');
    }
};
