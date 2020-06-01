'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('coursesvideos', 'locationPath', {
      type: Sequelize.TEXT,
    });
  },

  down: (queryInterface, Sequelize) => {
    /*changeColumn
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface.changeColumn('coursesvideos', 'locationPath', {
    type: Sequelize.TEXT,
  });
  }
};
