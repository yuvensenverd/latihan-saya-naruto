'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Students', 'kegiatanSosial', {
      type: Sequelize.TEXT,
      defaultValue: null
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Students', 'kegiatanSosial', {
      type: Sequelize.TEXT,
      defaultValue: null
    });
  }
};
