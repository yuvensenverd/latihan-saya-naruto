"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn("coursesvideos", "videoSproutId", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.changeColumn(
        "coursesvideos",
        "securityTokenSprout",
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn("coursesvideos", "videoSproutId", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.changeColumn(
        "coursesvideos",
        "securityTokenSprout",
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
    ];
  },
};
