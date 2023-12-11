"use strict";
const { Model } = require("sequelize");
const uuid = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Course.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      instructor: DataTypes.STRING(50),
      title: DataTypes.STRING(80),
      description: DataTypes.TEXT,
      rating: DataTypes.INTEGER,
      members: DataTypes.INTEGER,
      preview: DataTypes.STRING,
      price: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      meet_link: DataTypes.STRING,
      meet_time: DataTypes.TIME,
      meet_day: DataTypes.ENUM(
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ),
    },
    {
      sequelize,
      modelName: "Course",
      hooks: {
        beforeCreate(content) {
          content.id = uuid.v4();
        },
      },
    }
  );
  return Course;
};
