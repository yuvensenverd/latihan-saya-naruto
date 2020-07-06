"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("questions", "scorePoints", {
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("questions", "scorePoints", {
      type: Sequelize.INTEGER,
    });
  },
};
