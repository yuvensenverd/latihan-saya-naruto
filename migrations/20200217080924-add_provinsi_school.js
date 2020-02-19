'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('schools', 'provinsi', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('schools', 'provinsi', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  }
};

