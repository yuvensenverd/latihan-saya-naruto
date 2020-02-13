'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('schools', 'isVerified', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('schools', 'isVerified', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  }
};
