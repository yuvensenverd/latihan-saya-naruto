'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   return [
    await queryInterface.removeColumn('Students', 'kartuSiswa'),
    await queryInterface.removeColumn('Students', 'kartuKeluarga')
   ]
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('Students', 'kartuSiswa'),
      await queryInterface.removeColumn('Students', 'kartuKeluarga')
     ]
  }
};
