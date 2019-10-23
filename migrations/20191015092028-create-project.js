'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      description: {
        type: Sequelize.STRING,
        allowNull:false
      },
      projectCreated: {
        type: Sequelize.DATE,
        allowNull:false
      },
      projectEnded: {
        type: Sequelize.DATE,
        allowNull:false
      },
      totalTarget: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      projectImage: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shareDescription: {
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue: ''
      },
      userId: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Users',
          key : 'id'
        },
        allowNull: false
      },
      isCancelled: {
        type: Sequelize.INTEGER,
        defaultValue : 0,
        allowNull: false
      },
      cancelledDate: {
        type: Sequelize.DATE,
        defaultValue:null
      },
      isDeleted : {
        type : Sequelize.INTEGER,
        defaultValue : 0,
        allowNull: false
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
    return queryInterface.dropTable('Projects');
  }
};