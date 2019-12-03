'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('scholarships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      judul: {
        type: Sequelize.STRING,
        allowNull: false
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model : 'Students',
          key : 'id'
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model : 'Users',
          key : 'id'
        },
      },
      biayaSekolah : {
        type : Sequelize.INTEGER,
        allowNull : false,
      },
      totalPayout : {
        type : Sequelize.INTEGER,
        allowNull : false
      },
      currentValue : {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      isOngoing: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('scholarships');
  }
};