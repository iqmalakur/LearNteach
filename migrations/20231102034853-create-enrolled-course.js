"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EnrolledCourses", {
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
          model: "Users",
          key: "username",
        },
      },
      course: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Courses",
          key: "id",
        },
      },
      completed_contents: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      quiz_grades: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EnrolledCourses");
  },
};
