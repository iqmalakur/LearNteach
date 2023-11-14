"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Articles", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      body: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Articles");
  },
};
