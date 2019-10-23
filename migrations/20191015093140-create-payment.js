'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      paymentType: {
        type: Sequelize.STRING,
        allowNull : false
      },
      nominal: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      statusPayment: {
        type: Sequelize.STRING,
        allowNull : false
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'Projects',
          key : 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'Users',
          key : 'id'
        }
      },
      isRefund: {
        type: Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 0
      },
      refundDate: {
        type: Sequelize.DATE,
        defaultValue : null
      },
      isDeleted: {
        type: Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 0
      },
      order_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      komentar: {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true
      },
      isAnonim: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Payments');
  }
};