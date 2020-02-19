'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('schools', 'cabangBank', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('schools', 'cabangBank', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  }
};
