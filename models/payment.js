'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    paymentType: DataTypes.STRING,
    nominal: DataTypes.INTEGER,
    statusPayment: DataTypes.STRING,
    projectId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    isRefund: DataTypes.INTEGER,
    refundDate: DataTypes.DATE,
    isDeleted: DataTypes.INTEGER
  }, {});
  Payment.associate = function(models) {
    // associations can be defined here
    Payment.belongsTo(models.User, { foreignKey: 'userId'})
    Payment.belongsTo(models.Project, { foreignKey: 'projectId'})
  };
  return Payment;
};