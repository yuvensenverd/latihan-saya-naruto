"use strict";
module.exports = (sequelize, DataTypes) => {
  const question = sequelize.define(
    "question",
    {
      quizId: DataTypes.INTEGER,
      order: DataTypes.STRING,
      sentence: DataTypes.TEXT,
      options: DataTypes.TEXT,
      answer: DataTypes.STRING,
      scorePoints: DataTypes.INTEGER,
    },
    {}
  );
  question.associate = function (models) {
    question.belongsTo(models.quiz, { foreignKey: "quizId" });
  };
  return question;
};
