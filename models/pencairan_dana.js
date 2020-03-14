'use strict';
module.exports = (sequelize, DataTypes) => {
  const pencairan_dana = sequelize.define('pencairan_dana', {
    kode_transaksi: DataTypes.STRING,
    status: DataTypes.STRING,
    nominal: DataTypes.INTEGER,
    bukti_transaksi: DataTypes.STRING,
    tgl_pengajuan: DataTypes.DATE,
    tgl_mutasi: DataTypes.DATE
  }, {});
  pencairan_dana.associate = function(models) {
    // associations can be defined here
  };
  return pencairan_dana;
};