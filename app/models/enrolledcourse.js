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
      course: DataTypes.INTEGER,
      community: DataTypes.INTEGER,
      completed_contents: DataTypes.STRING,
      quiz_grades: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "EnrolledCourse",
    }
  );
  return EnrolledCourse;
};
