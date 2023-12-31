'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Instructors', {
      username: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50),
      },
      document: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      balance: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      approved: {
        allowNull: false,
        type: Sequelize.ENUM(['yes', 'no']),
      },
      bio: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      rating: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Instructors');
  },
};
