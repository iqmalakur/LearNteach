'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chat.init(
    {
      id: DataTypes.INTEGER,
      user: DataTypes.STRING(50),
      community: DataTypes.INTEGER,
      chat: DataTypes.STRING(1000),
      chat_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Chat',
    }
  );
  return Chat;
};
