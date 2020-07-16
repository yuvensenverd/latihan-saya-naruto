"use strict";
module.exports = (sequelize, DataTypes) => {
  const donation = sequelize.define(
    "donation",
    {
      paymentType: DataTypes.STRING,
      paymentSource: DataTypes.STRING,
      nominal: DataTypes.INTEGER,
      statusPayment: DataTypes.STRING,
      projectId: DataTypes.INTEGER,
      scholarshipId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      isRefund: DataTypes.INTEGER,
      refundDate: DataTypes.INTEGER,
      isDeleted: DataTypes.INTEGER,
      order_id: DataTypes.STRING,
      komentar: DataTypes.STRING,
      isAnonim: DataTypes.INTEGER,
      noPembayaran: DataTypes.STRING,
    },
    {}
  );
  donation.associate = function (models) {
    donation.belongsTo(models.User, { foreignKey: "userId" });
    donation.belongsTo(models.Project, { foreignKey: "projectId" });
    donation.belongsTo(models.scholarship, { foreignKey: "scholarshipId" });
  };
  return donation;
};
