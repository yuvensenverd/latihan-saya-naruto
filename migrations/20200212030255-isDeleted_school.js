'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('schools', 'isDeleted', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('schools', 'isDeleted', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  }
};
