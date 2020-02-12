'use strict';
module.exports = (sequelize, DataTypes) => {
  const create_school_migration = sequelize.define('create_school_migration', {
    nama: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    telepon: DataTypes.STRING,
    namaPemilikRekening: DataTypes.STRING,
    nomorRekening: DataTypes.STRING,
    bank: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  create_school_migration.associate = function(models) {
    // associations can be defined here
  };
  return create_school_migration;
};