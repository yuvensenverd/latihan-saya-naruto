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
    provinsi : DataTypes.STRING,
    isDeleted: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    // share description di scholarship atau di student
    story: DataTypes.STRING,
    shareDescription : DataTypes.STRING,
    schoolId: DataTypes.INTEGER,
    kartuSiswa : DataTypes.STRING,
    raportTerakhir : DataTypes.STRING,
    kartuKeluarga : DataTypes.STRING,
    jumlahSaudara : DataTypes.INTEGER,
    biayaSekolah : DataTypes.INTEGER,
    kelas : DataTypes.INTEGER,
    dataPenghasilan : DataTypes.STRING,
    dataStatus: DataTypes.STRING,
    statusNote: DataTypes.STRING

    // kartusiswa, kartukeluarga, dataPenghasilan, jumlahsaudara, shareDescription, 
  }, {});
  Student.associate = function(models) {
    // associations can be defined here
    // Student.hasMany(models.StudentDetail, {foreignKey : 'studentId'})
    Student.belongsTo(models.User, {foreignKey : 'userId'})
    Student.hasOne(models.scholarship, {foreignKey : 'studentId'})
    Student.hasMany(models.StudentRevision, {foreignKey : 'studentId'})
    Student.hasMany(models.dokumen_siswa, { foreignKey: 'studentId'})
    Student.belongsTo(models.school, { foreignKey: 'schoolId'})

    // Student.hasMany(models.StudentDetailRevision, {foreignKey : 'studentId'})
  };
  return Student;
};