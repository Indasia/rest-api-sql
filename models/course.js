"use strict";
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: { type: DataTypes.INTEGER },
      title: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      estimatedTime: { type: DataTypes.STRING },
      materialsNeeded: { type: DataTypes.STRING }
    },
    {}
  );
  Course.associate = models => {
    // associations can be defined here
  };
  return Course;
};
