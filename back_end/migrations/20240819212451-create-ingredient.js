'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Ingredients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            quantity: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            unit: {
                allowNull: false,
                type: Sequelize.ENUM('ml', 'l', 'pt', 'oz', 'g', 'kg', 'unit', 'tsp', 'tbsp', 'pinch')
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
        await queryInterface.dropTable('Ingredients');
    }
};
