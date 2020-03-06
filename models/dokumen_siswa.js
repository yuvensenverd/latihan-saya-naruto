'use strict';
module.exports = (sequelize, DataTypes) => {
  const dokumen_siswa = sequelize.define('dokumen_siswa', {
    studentId: DataTypes.INTEGER,
    dokumenPath: DataTypes.STRING,
    keterangan: DataTypes.STRING,
    deskripsi: DataTypes.STRING,
    orders: DataTypes.INTEGER
  }, {});
  dokumen_siswa.associate = function(models) {
    // associations can be defined here
    dokumen_siswa.belongsTo(models.Student, { foreignKey : 'studentId'})
  };
  return dokumen_siswa;
};