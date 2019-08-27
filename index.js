//require in modules
const express = require('express');
const layouts = require('express-ejs-layouts');
require('dotenv').config();
const flash = require('connect-flash');
const session = require('express-session');
const db = require('./models');
const axios = require('axios');
// const passport = require('./config/passportConfig');

//instantiate the express app
const app = express();

//set up middleware or settings
app.set('view engine', 'ejs');
app.use(layouts);
app.use('/', express.static('static'));
app.use(express.urlencoded({ extended: false }));
// app.use(session({
// 	secret: process.env.SESSION_SECRET,
// 	resave: false,
// 	saveUninitialized: true

// }));
app.use(flash()); //after session
// app.use(passport.initialize());
// app.use(passport.session());

//routes
app.use('/auth', require('./controllers/auth'));
app.use('/artists', require('./controllers/artists'))
app.use('/songs', require('./controllers/songs'))


app.get('/', (req,res) => {
    res.render('index')
})

app.get('/*', (req,res) => {
    res.render('404')
})



app.listen(3000, () => {
    console.log('listening on port 3000')
})