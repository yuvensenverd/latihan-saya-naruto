'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('coursesvideos', 'module_no', {
      type: Sequelize.STRING,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('coursesvideos', 'module_no', {
      type: Sequelize.STRING,
    });
  }
};
