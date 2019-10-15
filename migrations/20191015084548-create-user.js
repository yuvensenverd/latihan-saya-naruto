'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isGoogle: {
        type: Sequelize.INTEGER,
        defaultValue : 0,
        allowNull: false
      },
      isFacebook: {
        type: Sequelize.INTEGER,
        defaultValue : 0,
        allowNull: false
      },
      userImage: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      verified: {
        type: Sequelize.INTEGER,
        defaultValue : 0,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subscriptionStatus: {
        type: Sequelize.INTEGER,
        defaultValue : 0,
        allowNull: false
      },
      subscriptionNominal: {
        type: Sequelize.INTEGER,
        defaultValue : 0
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
    return queryInterface.dropTable('Users');
  }
};