'use strict';
module.exports = (sequelize, DataTypes) => {
  const school = sequelize.define('school', {
    nama: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    telepon: DataTypes.STRING,
    namaPemilikRekening: DataTypes.STRING,
    nomorRekening: DataTypes.STRING,
    bank: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  school.associate = function(models) {
    // associations can be defined here
  };
  return school;
};