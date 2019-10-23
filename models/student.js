'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    name: DataTypes.STRING,
    pendidikanTerakhir: DataTypes.STRING,
    gender: DataTypes.STRING,
    status: DataTypes.STRING,
    alamat: DataTypes.STRING,
    tanggalLahir: DataTypes.DATE,
    studentImage: DataTypes.STRING,
    isDeleted: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    story: DataTypes.STRING,
    schoolId: DataTypes.INTEGER
  }, {});
  Student.associate = function(models) {
    // associations can be defined here
    Student.belongsTo(models.School, { foreignKey: 'schoolId'})
    Student.hasMany(models.StudentDetail, {foreignKey : 'schoolId'})
    Student.belongsTo(models.User, {foreignKey : 'userId'})

  };
  return Student;
};