"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Url extends Model {
    static associate(models) {
      // define association here
    }
  }
  Url.init(
    {
      user_id: DataTypes.INTEGER,
      short_code: DataTypes.STRING,
      long_url: DataTypes.STRING,
      clicks: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Url",
    }
  );
  return Url;
};
