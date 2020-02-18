'use strict';
module.exports = (sequelize, DataTypes) => {
  const school = sequelize.define('school', {
    nama: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    telepon: DataTypes.STRING,
    namaPemilikRekening: DataTypes.STRING,
    nomorRekening: DataTypes.STRING,
    bank: DataTypes.STRING,
    email: DataTypes.STRING,
    isDeleted: DataTypes.INTEGER,
    isVerified: DataTypes.INTEGER,
    provinsi: DataTypes.STRING
  }, {});
  school.associate = function(models) {
    // associations can be defined here
    school.hasMany(models.Student, { foreignKey: 'schoolId'})
    school.hasMany(models.school_pictures, { foreignKey: 'schoolId'})

  };
  return school;
};