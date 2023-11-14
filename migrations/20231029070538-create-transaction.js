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
        allowNull: true,
        type: Sequelize.STRING(10),
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
      course_price: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      price: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      discount_percentage: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      discount: {
        allowNull: false,
        defaultValue: 0,
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
