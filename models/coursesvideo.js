'use strict';
module.exports = (sequelize, DataTypes) => {
  const coursesvideo = sequelize.define('coursesvideo', {
    title: DataTypes.STRING,
    locationPath: DataTypes.STRING,
    thumbnail_video: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {});
  coursesvideo.associate = function(models) {
    // associations can be defined here
  };
  return coursesvideo;
};