'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Meals', {
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
            time: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            difficulty: {
                allowNull: false,
                type: Sequelize.ENUM('easy', 'medium', 'hard')
            },
            instructions: {
                allowNull: false,
                defaultValue: [],
                type: Sequelize.JSON
            },
            notes: {
                allowNull: true,
                type: Sequelize.STRING
            },
            rating: {
                allowNull: true,
                type: Sequelize.BOOLEAN
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
        await queryInterface.dropTable('Meals');
    }
};
