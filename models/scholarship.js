'use strict';
module.exports = (sequelize, DataTypes) => {
  const scholarship = sequelize.define('scholarship', {
    judul: DataTypes.STRING,
    studentId: DataTypes.INTEGER,
    // schoolId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    biayaSekolah : DataTypes.INTEGER,
    totalPayout : DataTypes.INTEGER,
    currentValue : DataTypes.INTEGER,
    isVerified: DataTypes.STRING,
    isOngoing: DataTypes.STRING,
  }, {});
  scholarship.associate = function(models) {
    // associations can be defined here
    scholarship.belongsTo(models.User, { foreignKey : 'userId'})
    scholarship.belongsTo(models.Student, { foreignKey : 'studentId'})
    scholarship.hasMany(models.Subscription, {foreignKey : 'scholarshipId'})
    scholarship.hasMany(models.Payment, {foreignKey : 'scholarshipId'})
    scholarship.hasMany(models.Payout, {foreignKey : 'scholarshipId'})
    scholarship.hasMany(models.pencairan_dana, {foreignKey : 'scholarshipId'})
  };
  return scholarship;
}; 