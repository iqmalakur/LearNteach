"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PromotionCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PromotionCode.init(
    {
      id: { primaryKey: true, type: DataTypes.INTEGER },
      course: DataTypes.UUID,
      code: DataTypes.STRING(10),
      discount: DataTypes.INTEGER,
      expired: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "PromotionCode",
    }
  );
  return PromotionCode;
};
