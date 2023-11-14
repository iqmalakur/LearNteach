"use strict";
const { Model } = require("sequelize");
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
      id: { primaryKey: true, type: DataTypes.INTEGER },
      instructor: DataTypes.STRING(50),
      title: DataTypes.STRING(80),
      description: DataTypes.STRING,
      rating: DataTypes.INTEGER,
      members: DataTypes.INTEGER,
      tags: DataTypes.STRING,
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
    }
  );
  return Course;
};
