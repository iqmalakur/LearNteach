"use strict";
const { Model } = require("sequelize");
const uuid = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Content.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      course: DataTypes.INTEGER,
      label: DataTypes.STRING,
      approved: DataTypes.ENUM("yes", "no"),
      video: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Content",
      hooks: {
        beforeCreate(content) {
          content.id = uuid.v4();
        },
      },
    }
  );
  return Content;
};
