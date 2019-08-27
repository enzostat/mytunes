'use strict';
module.exports = (sequelize, DataTypes) => {
  const usersSongs = sequelize.define('usersSongs', {
    userId: DataTypes.INTEGER,
    songId: DataTypes.INTEGER
  }, {});
  usersSongs.associate = function(models) {
    // associations can be defined here
  };
  return usersSongs;
};