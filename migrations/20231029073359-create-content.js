"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Contents", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      course: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Courses",
          key: "id",
        },
      },
      label: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      approved: {
        allowNull: false,
        type: Sequelize.ENUM("yes", "no"),
      },
      video: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Contents");
  },
};
