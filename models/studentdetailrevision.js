'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentDetailRevision = sequelize.define('StudentDetailRevision', {
    pictureReport: DataTypes.STRING,
    deskripsi: DataTypes.STRING,
    studentId: DataTypes.INTEGER
  }, {});
  StudentDetailRevision.associate = function(models) {
    // associations can be defined here
    StudentDetailRevision.belongsTo(models.StudentRevision, {foreignKey : 'studentId'})
  };
  return StudentDetailRevision;
};