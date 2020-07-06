"use strict";
module.exports = (sequelize, DataTypes) => {
  const quiz = sequelize.define(
    "quiz",
    {
      title: DataTypes.STRING,
      titleQuiz: DataTypes.STRING,
      topicId: DataTypes.INTEGER,
      code: DataTypes.STRING,
    },
    {}
  );
  quiz.associate = function (models) {
    // associations can be defined here
    quiz.hasMany(models.question, { foreignKey: "quizId" });
  };
  return quiz;
};
