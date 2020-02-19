'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Students', 'nisn', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Students', 'nisn', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  }
};
