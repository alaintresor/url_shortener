"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Urls", [
      {
        user_id: 1,
        short_code: "abc123",
        long_url: "https://example.com/long-url-1",
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        short_code: "xyz789",
        long_url: "https://example.com/long-url-2",
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Urls", null, {});
  },
};
