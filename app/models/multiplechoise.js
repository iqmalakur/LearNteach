"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MultipleChoise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MultipleChoise.init(
    {
      id: { primaryKey: true, type: DataTypes.INTEGER },
      choises: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "MultipleChoise",
    }
  );
  return MultipleChoise;
};
