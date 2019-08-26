const router = require('express').Router();
const db = require('../models');



router.get('/', (req,res) => {
    res.render('songs/index')
})


router.get('/:id', (req,res) => {
    res.render('songs/show')
})

router.get('/new', (req,res) => {
    res.render('songs/new')
})

module.exports = router;