"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init(
    {
      id: { primaryKey: true, type: DataTypes.INTEGER },
      user: DataTypes.STRING(50),
      course: DataTypes.INTEGER,
      promotion_code: DataTypes.STRING(10),
      course_title: DataTypes.STRING(50),
      user_name: DataTypes.STRING(50),
      instructor_name: DataTypes.STRING(50),
      course_price: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      discount_percentage: DataTypes.INTEGER,
      discount: DataTypes.INTEGER,
      tax: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      transaction_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
