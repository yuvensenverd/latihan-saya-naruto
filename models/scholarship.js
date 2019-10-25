'use strict';
module.exports = (sequelize, DataTypes) => {
  const scholarship = sequelize.define('scholarship', {
    judul: DataTypes.STRING,
    studentId: DataTypes.INTEGER,
    schoolId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    nominal: DataTypes.INTEGER,
    durasi: DataTypes.INTEGER,
    description: DataTypes.STRING,
    shareDescription: DataTypes.STRING,
    scholarshipStart: DataTypes.DATE,
    scholarshipEnded: DataTypes.DATE,
    isVerified: DataTypes.INTEGER,
    isOngoing: DataTypes.INTEGER
  }, {});
  scholarship.associate = function(models) {
    // associations can be defined here
    scholarship.belongsTo(models.School, { foreignKey : 'schoolId'})
    scholarship.belongsTo(models.User, { foreignKey : 'userId'})
    scholarship.hasOne(models.Student, { foreignKey : 'id'})
  };
  return scholarship;
};