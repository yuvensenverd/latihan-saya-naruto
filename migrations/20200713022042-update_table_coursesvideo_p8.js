"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("coursesvideos", "durationVideo", {
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("coursesvideos", "durationVideo", {
      type: Sequelize.INTEGER,
    });
  },
};
