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
    sekolah: DataTypes.STRING
  }, {});
  Student.associate = function(models) {
    // associations can be defined here
    Student.hasMany(models.StudentDetail, {foreignKey : 'studentId'})

    Student.belongsTo(models.User, {foreignKey : 'userId'})

  };
  return Student;
};