"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn("coursesvideos", "videoSproutId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.addColumn("coursesvideos", "securityTokenSprout", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn("coursesvideos", "videoSproutId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.addColumn("coursesvideos", "securityTokenSprout", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ];
  },
};
