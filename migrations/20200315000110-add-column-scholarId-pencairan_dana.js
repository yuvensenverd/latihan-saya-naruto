'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('pencairan_danas', 'scholarshipId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'scholarships',
        key: 'id',
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('pencairan_danas', 'scholarshipId');
  },
};
