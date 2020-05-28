'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('coursesvideos', 'thumbnail_video', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.addColumn('coursesvideos', 'slug', {
        type: Sequelize.STRING,
        allowNull: true
      }),
    ];
 
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('coursesvideos', 'thumbnail_video', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.removeColumn('coursesvideos', 'slug', {
        type: Sequelize.STRING,
        allowNull: true
      }),
    ];
  }
};
