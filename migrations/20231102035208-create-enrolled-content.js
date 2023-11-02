'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EnrolledContents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      enrolled_course: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'EnrolledCourses',
          key: 'id',
        },
      },
      content: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Contents',
          key: 'id',
        },
      },
      completed: {
        allowNull: false,
        type: Sequelize.ENUM(['yes', 'no']),
      },
      quiz_grade: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM(['video', 'article', 'quiz']),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EnrolledContents');
  },
};
