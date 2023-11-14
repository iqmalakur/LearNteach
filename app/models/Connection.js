const { Sequelize, DataTypes, Model } = require("sequelize");

/**
 * Class representing a Connection.
 *
 * @class Connection
 */
class Connection {
  static conn = null;

  /**
   * Get the Sequelize object.
   *
   * @return {Sequelize}
   */
  static getConnection() {
    if (Connection.conn == null) {
      Connection.conn = new Sequelize("LearNteach", "root", "root", {
        host: "localhost",
        dialect: "mysql",
        define: {
          timestamps: false,
        },
      });
    }

    return Connection.conn;
  }

  /**
   * Get sequelize Model
   *
   * @param {String} name Model name
   * @return {Model}
   */
  static getModel(name) {
    return Connection.getConnection().model(name);
  }
}

module.exports = { Connection };

// Export all models
const models = [
  "Wishlist",
  "Cart",
  "Instructor",
  "Course",
  "Content",
  "Article",
  "Video",
];

models.forEach((m) => {
  const model = require("../models/" + m.toLowerCase());
  model(Connection.getConnection(), DataTypes);
  module.exports[m] = Connection.getModel(m);
});
