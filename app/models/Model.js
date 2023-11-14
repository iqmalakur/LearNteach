const Connection = require("./Connection");
const { QueryTypes } = require("sequelize");

/**
 * Class representing a Model.
 *
 * @class Model.
 */
class Model {
  static conn = Connection.getConnection();

  /**
   * Create a Model.
   *
   * @param {Object} data Object with all the properties required by Model child class.
   */
  constructor(data, table, condition) {
    for (const property in data) {
      this[property] = data[property];
    }

    this.table = table;
    this.condition = Model.getCondition(condition);
  }

  /**
   * Check if there is data with child of Model condition in the database.
   *
   * @return {Promise<Boolean>}
   */
  async isExist() {
    return (await Model.get(this.table, this.condition)).length > 0;
  }

  /**
   * Get String of where clause.
   *
   * @param {String | Object} condition The condition of where clause.
   * @return {String}
   */
  static getCondition(condition) {
    let result = "";

    if (typeof condition === "string") result = condition;
    else {
      for (const key in condition) result += `${key}='${condition[key]}' AND `;
      result = result.substring(0, result.length - 5);
    }

    return result;
  }

  /**
   * Get data from database.
   *
   * @param {String} table Table name.
   * @param {String | Object} condition The condition of where clause.
   * @return {Promise<Array>}
   */
  static async get(table, condition) {
    let result = null;

    if (condition) {
      result = await Model.conn.query(
        `SELECT * FROM ${table} WHERE ${Model.getCondition(condition)}`,
        {
          type: QueryTypes.SELECT,
        }
      );
    } else {
      result = await Model.conn.query(`SELECT * FROM ${table}`, {
        type: QueryTypes.SELECT,
      });
    }

    return result;
  }

  /**
   * Get data from database with join.
   *
   * @param {String} table Table name.
   * @param {String} columns Columns to be selected (separated by ,).
   * @param {String} join Table name to be joined.
   * @param {String} joinCondition The condition of table join
   * @param {String | Object} whereCondition The condition of where clause.
   * @return {Promise<Array>}
   */
  static async getJoin(table, columns, join, joinCondition, whereCondition) {
    let result = null;

    if (whereCondition) {
      result = await Model.conn.query(
        `SELECT ${columns}
        FROM ${table}
        INNER JOIN ${join}
        ON ${joinCondition}
        WHERE ${Model.getCondition(whereCondition)}`,
        {
          type: QueryTypes.SELECT,
        }
      );
    } else {
      result = await Model.conn.query(
        `SELECT ${columns}
        FROM ${table}
        INNER JOIN ${join}
        ON ${joinCondition}`,
        {
          type: QueryTypes.SELECT,
        }
      );
    }

    return result;
  }

  /**
   * Insert a new data into database.
   *
   * @param {String} table Table name.
   * @param {Object} data Object with all the properties required by Model child class.
   * @return {Promise<Boolean>}
   */
  static async insert(table, data) {
    let columns = Object.keys(data);
    let values = [];

    for (let i = 0; i < columns.length; i++)
      values.push(`'${data[columns[i]]}'`);

    const [_, metadata] = await Model.conn.query(
      `INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${values.join(", ")})`
    );

    return metadata > 0;
  }

  /**
   * Update data in the database.
   *
   * @param {Object} data Object with all the properties required by Model child class.
   * @return {Promise<Boolean>}
   */
  async update(data) {
    let updates = [];
    let columns = Object.keys(data);

    for (let i = 0; i < columns.length; i++)
      updates.push(`${columns[i]}='${data[columns[i]]}'`);

    const [_, metadata] = await Model.conn.query(
      `UPDATE ${this.table} SET ${updates.join(", ")} WHERE ${this.condition}`
    );

    return metadata > 0;
  }

  /**
   * Delete data in the database.
   *
   * @return {Promise<Boolean>}
   */
  async delete() {
    const [_, metadata] = await Model.conn.query(
      `DELETE FROM ${this.table} WHERE ${this.condition}`
    );

    return metadata > 0;
  }
}

module.exports = Model;
