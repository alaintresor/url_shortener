"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "john_doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "jane_doe",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};