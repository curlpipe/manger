'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('MealPlans', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            day: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            breakfast: {
                allowNull: true,
                references: {
                    model: 'Meals',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                type: Sequelize.INTEGER
            },
            lunch: {
                allowNull: true,
                references: {
                    model: 'Meals',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                type: Sequelize.INTEGER
            },
            brunch: {
                allowNull: true,
                references: {
                    model: 'Meals',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                type: Sequelize.INTEGER
            },
            dinner: {
                allowNull: true,
                references: {
                    model: 'Meals',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                type: Sequelize.INTEGER
            },
            snack: {
                allowNull: true,
                references: {
                    model: 'Meals',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('MealPlans');
    }
};
