"use strict";

import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const basename = _basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config.js")[env];

const db = {};

// Create the Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Read all files in the current directory and import the models
readdirSync(__dirname)
  .filter((file) => {
    const isTrue =
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
    return isTrue;
  })
  .forEach((file) => {
    const model = require(join(__dirname, file))(sequelize, Sequelize.DataTypes);  // Updated for Sequelize 6
    db[model.name] = model;
  });

// Call associate method for each model, if it exists
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the Sequelize instance and models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
