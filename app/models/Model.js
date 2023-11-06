const Connection = require("./Connection");
const { QueryTypes } = require("sequelize");

class Model {
  static conn = Connection.getConnection();

  constructor(data) {
    for (const property in data) {
      this[property] = data[property];
    }
  }

  static getCondition(condition) {
    let result = "";

    if (typeof condition === "string") result = condition;
    else {
      for (const key in condition) result += `${key}='${condition[key]}' AND `;
      result = result.substring(0, result.length - 5);
    }

    return result;
  }

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

  static async update(table, data, condition) {
    let updates = [];
    let columns = Object.keys(data);

    for (let i = 0; i < columns.length; i++)
      updates.push(`${columns[i]}='${data[columns[i]]}'`);

    const [_, metadata] = await Model.conn.query(
      `UPDATE ${table} SET ${updates.join(", ")} WHERE ${Model.getCondition(
        condition
      )}`
    );

    return metadata > 0;
  }

  static async delete(table, condition) {
    const [_, metadata] = await Model.conn.query(
      `DELETE FROM ${table} WHERE ${condition}`
    );

    return metadata > 0;
  }
}

module.exports = Model;
