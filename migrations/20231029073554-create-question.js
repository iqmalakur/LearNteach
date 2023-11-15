'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      quiz: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Quizzes',
          key: 'id',
        },
      },
      question_text: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      answer: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('choises', 'essay'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Questions');
  },
};
