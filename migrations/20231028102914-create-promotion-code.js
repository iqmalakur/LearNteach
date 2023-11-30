"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PromotionCodes", {
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
      code: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },
      discount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      expired: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PromotionCodes");
  },
};
