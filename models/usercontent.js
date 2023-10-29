'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserContent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserContent.init(
    {
      id: DataTypes.INTEGER,
      learning: DataTypes.INTEGER,
      user: DataTypes.STRING,
      completed: DataTypes.ENUM(['yes', 'no']),
      quiz_grade: DataTypes.INTEGER,
      type: DataTypes.ENUM(['video', 'article', 'quiz']),
    },
    {
      sequelize,
      modelName: 'UserContent',
    }
  );
  return UserContent;
};
