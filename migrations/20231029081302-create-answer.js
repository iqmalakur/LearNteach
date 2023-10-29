'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Questions',
          key: 'id',
        },
      },
      user_content: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'UserContents',
          key: 'id',
        },
      },
      answer_text: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      correct: {
        allowNull: false,
        type: Sequelize.ENUM(['true', 'false']),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Answers');
  },
};
