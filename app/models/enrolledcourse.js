"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EnrolledCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EnrolledCourse.init(
    {
      id: { primaryKey: true, type: DataTypes.INTEGER },
      user: DataTypes.STRING(50),
      course: DataTypes.UUID,
      completed_contents: DataTypes.STRING,
      rating: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "EnrolledCourse",
    }
  );
  return EnrolledCourse;
};
