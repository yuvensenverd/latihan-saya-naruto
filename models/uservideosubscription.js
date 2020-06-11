'use strict';
module.exports = (sequelize, DataTypes) => {
  const userVideoSubscription = sequelize.define('userVideoSubscription', {
    userId: DataTypes.INTEGER,
    videoId: DataTypes.INTEGER
  }, {});
  userVideoSubscription.associate = function(models) {
    // associations can be defined here
  };
  return userVideoSubscription;
};