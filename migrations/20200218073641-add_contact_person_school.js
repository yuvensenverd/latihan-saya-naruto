'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('schools', 'contact_person', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('schools', 'contact_person', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  }
};
