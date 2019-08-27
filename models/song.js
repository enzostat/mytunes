'use strict';
module.exports = (sequelize, DataTypes) => {
  const song = sequelize.define('song', {
    name: DataTypes.STRING,
    artistId: DataTypes.INTEGER
  }, {});
  song.associate = function(models) {
    // associations can be defined here
  };
  return song;
};