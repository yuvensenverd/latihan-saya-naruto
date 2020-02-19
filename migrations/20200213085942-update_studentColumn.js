'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('Students', 'nomorRekening'),
      await queryInterface.removeColumn('Students', 'pemilikRekening'),
      await queryInterface.removeColumn('Students', 'alamatSekolah'),
      await queryInterface.removeColumn('Students', 'bank'),
      await queryInterface.removeColumn('Students', 'cabangBank'),
      await queryInterface.removeColumn('Students', 'namaSekolah'),
      await queryInterface.removeColumn('Students', 'teleponSekolah'),
      await queryInterface.removeColumn('Students', 'raportTerakhir'),
      await queryInterface.removeColumn('Students', 'dataPenghasilan'),
    ];
 
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('Students', 'nomorRekening'),
      await queryInterface.removeColumn('Students', 'pemilikRekening'),
      await queryInterface.removeColumn('Students', 'alamatSekolah'),
      await queryInterface.removeColumn('Students', 'bank'),
      await queryInterface.removeColumn('Students', 'cabangBank'),
      await queryInterface.removeColumn('Students', 'namaSekolah'),
      await queryInterface.removeColumn('Students', 'teleponSekolah'),
      await queryInterface.removeColumn('Students', 'raportTerakhir'),
      await queryInterface.removeColumn('Students', 'dataPenghasilan'),
    ];
  }
};
