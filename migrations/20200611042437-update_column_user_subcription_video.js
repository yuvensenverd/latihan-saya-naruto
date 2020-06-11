'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('userVideoSubscriptions', 'videoId', {
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('userVideoSubscriptions', 'videoId', {
      type: Sequelize.INTEGER,
    });
  }
};
