'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StudentDetailRevisions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pictureReport: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      deskripsi: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      class : {
        type: Sequelize.STRING,
        allowNull: false
      },
      studentId: {
        type: Sequelize.INTEGER,
        references : {
          model : 'StudentRevisions',
          key : 'id'
        },
      },
      detaildId : {
        type: Sequelize.INTEGER,
        references : {
          model : 'StudentDetails',
          key : 'id'
        },
      },
      isDeleted: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('StudentDetailRevisions');
  }
};