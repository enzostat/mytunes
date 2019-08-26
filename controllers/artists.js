const router = require('express').Router();
const db = require('../models');
require('dotenv').config();



router.get('/', (req,res) => {
    res.render('artists/index')
})

router.get('/new', (req,res) => {
    var url = ""
    res.render('artists/new')
})

router.get('/:id', (req,res) => {
    res.render('artists/show')
})



module.exports = router;