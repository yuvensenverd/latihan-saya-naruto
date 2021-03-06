'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nama: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber : DataTypes.STRING,
    isGoogle: DataTypes.INTEGER,
    isFacebook: DataTypes.INTEGER,
    userImage: DataTypes.STRING,
    lastLogin: DataTypes.DATE,
    verified: DataTypes.INTEGER,
    role: DataTypes.STRING,
    subscriptionStatus: DataTypes.INTEGER,
    subscriptionNominal: DataTypes.INTEGER,
    reminderDate : DataTypes.DATE
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Student, {foreignKey : 'userId'})
    User.hasMany(models.Payment, {foreignKey : 'userId'})
    User.hasMany(models.Project, {foreignKey : 'userId'})
  };
  return User;
};