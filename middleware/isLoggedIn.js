module.exports = (req,res,next) => {
	//if user is logged in
	if (req.user) {
		//cool. this is expected. they are logged in. allow them to proceed
		next();
	} else {
	//otherwise, user is not logged in
	//not cool. don't let them in. make them log in first
	req.flash('error', 'You must be logged in to view this page');
	res.redirect('/auth/login');
	}
}