'use strict';
module.exports = (sequelize, DataTypes) => {
  const coursesvideo = sequelize.define('coursesvideo', {
    title: DataTypes.STRING,
    locationPath: DataTypes.TEXT,
    module_no: DataTypes.STRING,
    module_name: DataTypes.STRING,
    session_name: DataTypes.STRING,
    topic_name: DataTypes.STRING,
    thumbnail_video: DataTypes.STRING,
    slug: DataTypes.STRING,
    video_description: DataTypes.TEXT
  }, {});
  coursesvideo.associate = function(models) {
    // associations can be defined here
  };
  return coursesvideo;
};