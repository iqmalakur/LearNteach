const { Sequelize, DataTypes, Model } = require("sequelize");
const wishlist = require("../models/wishlist");
const cart = require("../models/cart");

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

wishlist(Connection.getConnection(), DataTypes);
cart(Connection.getConnection(), DataTypes);

module.exports = {
  Connection,
  wishlist: Connection.getModel("Wishlist"),
  cart: Connection.getModel("Cart"),
};
