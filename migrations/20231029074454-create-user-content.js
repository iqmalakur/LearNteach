'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserContents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      learning: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Learnings',
          key: 'id',
        },
      },
      user: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      completed: {
        allowNull: false,
        type: Sequelize.ENUM(['yes', 'no']),
      },
      quiz_grade: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM(['video', 'article', 'quiz']),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserContents');
  },
};
