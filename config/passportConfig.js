//Require passport and any passport strategies we want to use
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//we will need access to the data base
const db = require('../models');

//Provide serialization and deserialization functions for passport to use 
//this allows passport to store user by the id alone (serialize) and look 
//up a user's full information from the id (deserialize)
passport.serializeUser((user, cb) => {
	//callback : first arg is an error, second arg is data that is passed on
	cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
	db.user.findByPk(id)
	.then(user => {
		cb(null,user);
	})
	.catch(cb)
})

//implement strategies
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, (typedInEmail, typedInPassword, cb) => {
	//try looking up user by email
	db.user.findOne({
		where: { email: typedInEmail }
	})
	.then(foundUser => {
		console.log('got a user');
		
		//if i did not find a user with that email -OR-
		//if i did find a user but they don't have the correct password
		if (!foundUser || !foundUser.validPassword(typedInPassword)) {
			//BAD USER: return null
			cb(null,null);
		} else {
			//GOOD USER: Return the user's data
			cb(null, foundUser);
		}
	})
	.catch(cb); //end of user findOne call
}));

//make sure we can export the file to be imported on another page
module.exports = passport;