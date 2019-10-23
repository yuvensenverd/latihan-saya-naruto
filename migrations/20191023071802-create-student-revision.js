'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StudentRevisions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      pendidikanTerakhir: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      tanggalLahir: {
        type: Sequelize.DATE
      },
      studentImage: {
        type: Sequelize.STRING
      },
      isDeleted: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'Users',
          key : 'id'
        }
      },
      story: {
        type: Sequelize.STRING
      },
      schoolId: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'Schools',
          key : 'id'
        }
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
    return queryInterface.dropTable('StudentRevisions');
  }
};