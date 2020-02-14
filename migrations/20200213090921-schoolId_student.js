'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Students', 'schoolId', {
      type: Sequelize.INTEGER,
      references : {
        model : 'schools',
        key : 'id'
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Students', 'schoolId', {
      type: Sequelize.INTEGER,
      references : {
        model : 'schools',
        key : 'id'
      },
    });
  }
};
