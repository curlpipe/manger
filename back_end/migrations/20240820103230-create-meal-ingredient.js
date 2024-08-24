'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('MealIngredients', {
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
            ingredient_id: {
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Ingredients',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                type: Sequelize.INTEGER
            },
            amount: {
                allowNull: false,
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
        await queryInterface.dropTable('MealIngredients');
    }
};
