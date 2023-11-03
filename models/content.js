'use strict';
const { Model } = require('sequelize');
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
      id: DataTypes.INTEGER,
      course: DataTypes.INTEGER,
      label: DataTypes.STRING,
      approved: DataTypes.ENUM('yes', 'no'),
      type: DataTypes.ENUM('video', 'article', 'quiz'),
    },
    {
      sequelize,
      modelName: 'Content',
    }
  );
  return Content;
};
