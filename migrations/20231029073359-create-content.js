'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      course: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Courses',
          key: 'id',
        },
      },
      label: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      approved: {
        allowNull: false,
        type: Sequelize.ENUM('yes', 'no'),
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('video', 'article', 'quiz'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Contents');
  },
};
