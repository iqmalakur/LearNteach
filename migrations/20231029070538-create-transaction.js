'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
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
      course: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Courses',
          key: 'id',
        },
      },
      promotion_code: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'PromotionCodes',
          key: 'id',
        },
      },
      course_title: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      user_name: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      instructor_name: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      price: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      discount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      tax: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      total: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      transaction_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  },
};
