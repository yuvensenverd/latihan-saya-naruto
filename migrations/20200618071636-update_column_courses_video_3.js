"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('coursesvideos', 'module_name', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.addColumn('coursesvideos', 'session_name', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.addColumn('coursesvideos', 'topic_name', {
        type: Sequelize.STRING,
        allowNull: true
      }),
    ];
 
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('coursesvideos', 'module_name', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.removeColumn('coursesvideos', 'session_name', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.removeColumn('coursesvideos', 'topic_name', {
        type: Sequelize.STRING,
        allowNull: true
      }),
    ];
  }
};
