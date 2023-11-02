'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EnrolledContent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EnrolledContent.init(
    {
      id: DataTypes.INTEGER,
      enrolled_course: DataTypes.INTEGER,
      content: DataTypes.INTEGER,
      completed: DataTypes.ENUM(['yes', 'no']),
      quiz_grade: DataTypes.INTEGER,
      type: DataTypes.ENUM(['video', 'article', 'quiz']),
    },
    {
      sequelize,
      modelName: 'EnrolledContent',
    }
  );
  return EnrolledContent;
};
