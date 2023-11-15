'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user: {
        allowNull: false,
        type: Sequelize.STRING(50),
        references: {
          model: 'Users',
          key: 'username',
        },
      },
      community: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Communities',
          key: 'id',
        },
      },
      chat: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
      chat_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chats');
  },
};
