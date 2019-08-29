const router = require('express').Router;
const db = require('../models');
require('dotenv').config();
const axios = require('axios');
const isLoggedIn = require('../middleware/isLoggedIn');


router.get('/', isLoggedIn,(req,res) => {
    db.user.findByPk(req.user.id, {include: [db.artist,db.song]})
    .then(user => {
        res.render('profile', {user})
    })
    .catch(err => {
        console.log(err);
        res.send('something went wrong')
    })
})

router.put('/firstname', (req,res) => {
    let newName = req.body.firstname
    db.user.save({firstname: newName}, {where: {id: req.user.id}})
    .then(() => {
        res.redirect('/profile')
    })
    .catch(err => {
        console.log(err)
        res.redirect('/*')
    })
})

router.put('/lastname', (req,res) => {
    let newName = req.body.lastname
    db.user.save({lastname: newName}, {where: {id: req.user.id}})
    .then(() => {
        res.redirect('/profile')
    })
    .catch(err => {
        console.log(err)
        res.redirect('/*')
    })
})






module.exports = router;