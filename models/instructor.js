'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instructor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Instructor.init(
    {
      username: DataTypes.STRING(50),
      document: DataTypes.STRING,
      approved: DataTypes.ENUM(['yes', 'no']),
      bio: DataTypes.STRING,
      rating: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Instructor',
    }
  );
  return Instructor;
};
