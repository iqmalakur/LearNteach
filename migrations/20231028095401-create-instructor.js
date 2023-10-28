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
      approved: {
        allowNull: false,
        type: Sequelize.ENUM(['yes', 'no']),
      },
      bio: {
        allowNull: false,
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
