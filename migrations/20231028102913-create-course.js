"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Courses", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      instructor: {
        allowNull: false,
        type: Sequelize.STRING(50),
        references: {
          model: "Instructors",
          key: "username",
        },
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(80),
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      rating: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      members: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      preview: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      price: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      meet_link: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      meet_time: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      meet_day: {
        allowNull: false,
        type: Sequelize.ENUM(
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Courses");
  },
};
