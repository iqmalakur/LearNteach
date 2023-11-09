const { Sequelize } = require("sequelize");

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
      });
    }

    return Connection.conn;
  }
}

module.exports = Connection;
