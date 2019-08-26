const router = require('express').Router();
const db = require('../models');



router.get('/', (req,res) => {
    res.render('songs/index')
})

router.get('/new', (req,res) => {
    res.render('songs/new')
})

router.get('/:id', (req,res) => {
    res.render('songs/show')
})



module.exports = router;