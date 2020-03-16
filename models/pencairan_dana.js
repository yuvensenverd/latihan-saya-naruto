'use strict';
module.exports = (sequelize, DataTypes) => {
  const pencairan_dana = sequelize.define('pencairan_dana', {
    kode_transaksi: DataTypes.STRING,
    status: DataTypes.STRING,
    nominal: DataTypes.INTEGER,
    bukti_transaksi: DataTypes.STRING,
    tgl_pengajuan: DataTypes.DATE,
    tgl_mutasi: DataTypes.DATE,
    scholarshipId: DataTypes.INTEGER,
    norek: DataTypes.STRING,
    bank: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    note:DataTypes.STRING
  }, {});
  pencairan_dana.associate = function(models) {
    // associations can be defined here
    pencairan_dana.belongsTo(models.scholarship, { foreignKey: 'scholarshipId'})
  };
  return pencairan_dana;
};