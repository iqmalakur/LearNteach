"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Communities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      course: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Courses",
          key: "id",
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM(["local", "global"]),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Communities");
  },
};
