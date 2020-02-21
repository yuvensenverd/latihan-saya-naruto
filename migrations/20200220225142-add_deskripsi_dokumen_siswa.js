'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dokumen_siswas', 'deskripsi', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dokumen_siswas', 'deskripsi', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  }
};
