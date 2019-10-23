'use strict';
module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    name: DataTypes.STRING,
    alamat: DataTypes.STRING,
    virtualAccount: DataTypes.INTEGER,
    telepon: DataTypes.STRING
  }, {});
  School.associate = function(models) {
    // associations can be defined here
    School.hasMany(models.Student, {foreignKey : 'schoolId'})
    School.hasMany(models.StudentRevision, {foreignKey : 'schoolId'})
  };
  return School;
};