const { Sequelize, DataTypes, Model } = require("sequelize");

/**
 * Class representing a Connection.
 *
 * @class Connection
 */
class Database {
  static conn = null;

  /**
   * Get the Sequelize object.
   *
   * @return {Sequelize}
   */
  static getConnection() {
    if (Database.conn == null) {
      Database.conn = new Sequelize("LearNteach", "root", "root", {
        host: "localhost",
        dialect: "mysql",
        define: {
          timestamps: false,
        },
      });
    }

    return Database.conn;
  }

  /**
   * Get sequelize Model
   *
   * @param {String} name Model name
   * @return {Model}
   */
  static getModel(name) {
    return Database.getConnection().model(name);
  }
}

module.exports = { Connection: Database };

// Export all models
const models = [
  "Article",
  "Cart",
  "Chat",
  "Community",
  "Content",
  "Course",
  "EnrolledCourse",
  "Instructor",
  "MultipleChoise",
  "PromotionCode",
  "Question",
  "Quiz",
  "Transaction",
  "User",
  "Video",
  "Wishlist",
];

models.forEach((m) => {
  const model = require("../models/" + m.toLowerCase());
  model(Database.getConnection(), DataTypes);
  module.exports[m] = Database.getModel(m);
});
