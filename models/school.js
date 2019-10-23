'use strict';
module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    nama: DataTypes.STRING,
    alamat: DataTypes.STRING,
    telepon: DataTypes.STRING,
    virtualAccount: DataTypes.STRING
  }, {});
  School.associate = function(models) {
    // associations can be defined here
    School.hasMany(models.Student, {foreignKey : 'schoolId'})
    School.hasMany(models.StudentRevision, {foreignKey : 'schoolId'})

  };
  return School;
};