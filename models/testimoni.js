'use strict';
module.exports = (sequelize, DataTypes) => {
  const testimoni = sequelize.define('testimoni', {
    studentId: DataTypes.INTEGER,
    testimoni: DataTypes.TEXT
  }, {});
  testimoni.associate = function(models) {
    // associations can be defined here
    testimoni.belongsTo(models.Student, { foreignKey : 'studentId'})
  };
  return testimoni;
};