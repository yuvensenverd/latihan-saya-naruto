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
      },
      userId: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Users',
          key : 'id'
        }
      },
      isCancelled: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      cancelledDate: {
        type: Sequelize.DATE,
        defaultValue:null
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