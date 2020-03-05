'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('schools', 'npsn', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('schools', 'npsn', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  }
};
