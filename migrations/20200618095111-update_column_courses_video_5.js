"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('coursesvideos', 'video_description', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      await queryInterface.addColumn('coursesvideos', 'isDeleted', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
    ];
 
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('coursesvideos', 'video_description', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      await queryInterface.removeColumn('coursesvideos', 'isDeleted', {
        type: Sequelize.STRING,
        allowNull: true
      }),
    ];
  }
};
