'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Community extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Community.init(
    {
      id: DataTypes.INTEGER,
      course: DataTypes.INTEGER,
      name: DataTypes.STRING(50),
      description: DataTypes.STRING,
      picture: DataTypes.STRING,
      type: DataTypes.ENUM(['local', 'global']),
    },
    {
      sequelize,
      modelName: 'Community',
    }
  );
  return Community;
};
