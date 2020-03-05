'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('Students', 'name', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'pendidikanTerakhir', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'gender', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'status', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'alamat', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'tanggalLahir', {
        type: Sequelize.DATE,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'studentImage', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'provinsi', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'story', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'shareDescription', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'jumlahSaudara', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'biayaSekolah', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'kelas', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'nisn', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'kegiatanSosial', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
    ];
 
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('Students', 'name', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'pendidikanTerakhir', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'gender', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'status', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'alamat', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'tanggalLahir', {
        type: Sequelize.DATE,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'studentImage', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'provinsi', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'story', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'shareDescription', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'jumlahSaudara', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'biayaSekolah', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'kelas', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'nisn', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      await queryInterface.changeColumn('Students', 'kegiatanSosial', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
    ];
  }
};
