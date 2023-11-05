'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: DataTypes.STRING(50),
      password: DataTypes.STRING(50),
      email: DataTypes.STRING(320),
      name: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
