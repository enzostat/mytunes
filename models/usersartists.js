'use strict';
module.exports = (sequelize, DataTypes) => {
  const usersArtists = sequelize.define('usersArtists', {
    userId: DataTypes.INTEGER,
    artistId: DataTypes.INTEGER
  }, {});
  usersArtists.associate = function(models) {
    // associations can be defined here
  };
  return usersArtists;
};