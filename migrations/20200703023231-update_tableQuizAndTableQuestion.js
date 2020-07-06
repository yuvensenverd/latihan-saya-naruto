"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn("quizzes", "titleQuiz", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.addColumn("quizzes", "topicId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.addColumn("quizzes", "code", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.addColumn("questions", "order", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.addColumn("questions", "sentence", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      await queryInterface.addColumn("questions", "options", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      await queryInterface.addColumn("questions", "answer", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn("quizzes", "titleQuiz", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.removeColumn("quizzes", "topicId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      await queryInterface.removeColumn("quizzes", "code", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.removeColumn("questions", "order", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      await queryInterface.removeColumn("questions", "sentence", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      await queryInterface.removeColumn("questions", "options", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      await queryInterface.removeColumn("questions", "answer", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ];
  },
};
