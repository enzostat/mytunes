'use strict';

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (pendingUser) => {
        if(pendingUser && pendingUser.password) {
          //hash password with BCrypt
          let hash = bcrypt.hashSync(pendingUser.password, 12);

          //reassign user's password to the has version
          pendingUser.password = hash;
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
    models.user.belongsToMany(models.song, {through: "usersSongs"})
    models.user.belongsToMany(models.artist, {through: "usersArtists"})
  };

//custom function: validPassword
//this will check an instance of the model (a specific user) against a type in password
//use bcrypt to compare hashes
user.prototype.validPassword = function(typedInPassword) {
  return bcrypt.compareSync(typedInPassword, this.password);
}


  return user;
};

