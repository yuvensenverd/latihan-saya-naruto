'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pencairan_danas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode_transaksi: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      nominal: {
        type: Sequelize.INTEGER
      },
      bukti_transaksi: {
        type: Sequelize.STRING
      },
      tgl_pengajuan: {
        type: Sequelize.DATE
      },
      tgl_mutasi: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('pencairan_danas');
  }
};