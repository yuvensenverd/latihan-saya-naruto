'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('coursesvideos', 'quizLocation', {
      type: Sequelize.TEXT,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('coursesvideos', 'quizLocation', {
      type: Sequelize.TEXT,
    });
  }
};
