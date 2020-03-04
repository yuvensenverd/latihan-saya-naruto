'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dokumen_siswas', 'orders', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dokumen_siswas', 'orders', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });
  }
};
