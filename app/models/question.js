"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Question.init(
    {
      id: { primaryKey: true, type: DataTypes.INTEGER },
      quiz: DataTypes.INTEGER,
      question_text: DataTypes.STRING,
      answer: DataTypes.STRING,
      type: DataTypes.ENUM("choises", "essay"),
    },
    {
      sequelize,
      modelName: "Question",
    }
  );
  return Question;
};
