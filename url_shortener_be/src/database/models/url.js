"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Url extends Model {
    static associate(models) {
      // define association here
      Url.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  Url.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      short_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      long_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Url",
      indexes: [
        {
          unique: true,
          fields: ['short_code']
        },
        {
          fields: ['user_id']
        }
      ]
    }
  );
  return Url;
};
