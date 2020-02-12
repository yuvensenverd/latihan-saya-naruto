'use strict';
module.exports = (sequelize, DataTypes) => {
  const school_migration = sequelize.define('school_migration', {
    nama: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    telepon: DataTypes.STRING,
    namaPemilikRekening: DataTypes.STRING,
    nomorRekening: DataTypes.STRING,
    bank: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  school_migration.associate = function(models) {
    // associations can be defined here
  };
  return school_migration;
};