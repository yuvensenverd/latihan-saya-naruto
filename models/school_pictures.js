'use strict';
module.exports = (sequelize, DataTypes) => {
  const school_pictures = sequelize.define('school_pictures', {
    schoolId: DataTypes.INTEGER,
    imagePath: DataTypes.STRING
  }, {});
  school_pictures.associate = function(models) {
    // associations can be defined here
  };
  return school_pictures;
};