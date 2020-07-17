"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Payments", "donationToYayasan", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Payments", "donationToYayasan", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
