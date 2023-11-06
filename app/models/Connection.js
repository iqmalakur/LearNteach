const { Sequelize } = require("sequelize");

class Connection {
  static conn = null;

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
