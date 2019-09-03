const router = require('express').Router();
const db = require('../models');
require('dotenv').config();
const axios = require('axios');
const isLoggedIn = require('../middleware/isLoggedIn');

//shows an user's profile
router.get('/', isLoggedIn, (req,res) => {
    
    db.user.findByPk(req.user.id, {include: [db.artist,db.song]})
    .then(user => {
        res.render('profile', {user})
    })
    .catch(err => {
        console.log(err);
        res.redirect('/*')
    })
})

//change first name form
router.get('/firstname', (req,res) => {
    res.render('profile/firstname')
})

//change last name form
router.get('/lastname', (req,res) => {
    res.render('profile/lastname')
})

//route to change name
router.put('/firstname', (req,res) => {
    let newName = req.body.firstname
    db.user.update({firstname: newName}, {where: {id: req.user.id}})
    .then(() => {
        res.redirect('/profile')
    })
    .catch(err => {
        console.log(err)
        res.redirect('/*')
    })
})

//route to change last name
router.put('/lastname', (req,res) => {
    let newName = req.body.lastname
    db.user.update({lastname: newName}, {where: {id: req.user.id}})
    .then(() => {
        res.redirect('/profile')
    })
    .catch(err => {
        console.log(err)
        res.redirect('/*')
    })
})






module.exports = router;