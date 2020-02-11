'use strict';
module.exports = (sequelize, DataTypes) => {
  const dokumen_siswa = sequelize.define('dokumen_siswa', {
    studentId: DataTypes.INTEGER,
    dokumenPath: DataTypes.STRING,
    keterangan: DataTypes.STRING
  }, {});
  dokumen_siswa.associate = function(models) {
    // associations can be defined here
  };
  return dokumen_siswa;
};