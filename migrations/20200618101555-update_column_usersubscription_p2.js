'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('userVideoSubscriptions', 'programName', {
      type: Sequelize.STRING,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('userVideoSubscriptions', 'programName', {
      type: Sequelize.STRING,
    });
  }
};
