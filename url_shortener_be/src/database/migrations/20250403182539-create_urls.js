"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Urls", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      short_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      long_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clicks: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes for performance optimization
    await queryInterface.addIndex("Urls", ["short_code"], {
      unique: true,
      name: "urls_short_code_index"
    });
    
    await queryInterface.addIndex("Urls", ["user_id"], {
      name: "urls_user_id_index"
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes before dropping table
    await queryInterface.removeIndex("Urls", "urls_short_code_index");
    await queryInterface.removeIndex("Urls", "urls_user_id_index");
    await queryInterface.dropTable("Urls");
  },
};
