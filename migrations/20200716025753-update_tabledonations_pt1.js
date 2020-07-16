"use strict";
/*

paymentSource : DataTypes.STRING,
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

    noPembayaran: DataTypes.STRING

*/
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn("donations", "paymentSource", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.addColumn("donations", "nominal", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.addColumn("donations", "statusPayment", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.addColumn("donations", "projectId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),

      await queryInterface.addColumn("donations", "scholarshipId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.addColumn("donations", "userId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.addColumn("donations", "isRefund", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.addColumn("donations", "refundDate", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),

      await queryInterface.addColumn("donations", "isDeleted", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.addColumn("donations", "order_id", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.addColumn("donations", "komentar", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.addColumn("donations", "isAnonim", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),

      await queryInterface.addColumn("donations", "noPembayaran", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn("donations", "paymentSource", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.removeColumn("donations", "nominal", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.removeColumn("donations", "statusPayment", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.removeColumn("donations", "projectId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),

      await queryInterface.removeColumn("donations", "scholarshipId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.removeColumn("donations", "userId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.removeColumn("donations", "isRefund", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.removeColumn("donations", "refundDate", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),

      await queryInterface.removeColumn("donations", "isDeleted", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.removeColumn("donations", "order_id", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.removeColumn("donations", "komentar", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.removeColumn("donations", "isAnonim", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),

      await queryInterface.removeColumn("donations", "noPembayaran", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ];
  },
};
