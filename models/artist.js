'use strict';
module.exports = (sequelize, DataTypes) => {
  const artist = sequelize.define('artist', {
    name: DataTypes.STRING
  }, {});
  artist.associate = function(models) {
    // associations can be defined here
    models.artist.hasMany(models.song)
    models.artist.belongsToMany(models.user, {through: "usersArtists"})
  };
  return artist;
};