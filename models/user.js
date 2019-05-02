"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      emailemailAddress: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {}
  );
  User.associate = models => {
    User.hasMany(models.Course);
  };
  return User;
};
