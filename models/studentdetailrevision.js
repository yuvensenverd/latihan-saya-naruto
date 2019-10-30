'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentDetailRevision = sequelize.define('StudentDetailRevision', {
    pictureReport: DataTypes.STRING,
    deskripsi: DataTypes.STRING,
    kelas: DataTypes.STRING,
    studentId: DataTypes.INTEGER,
    detailId: DataTypes.INTEGER,
    isDeleted: DataTypes.INTEGER
  }, {});
  StudentDetailRevision.associate = function(models) {
    // associations can be defined here
    StudentDetailRevision.belongsTo(models.StudentRevision, {foreignKey : 'studentId'})
  };
  return StudentDetailRevision;
};