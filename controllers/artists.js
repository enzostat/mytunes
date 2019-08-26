const router = require('express').Router();
const db = require('../models')



router.get('/', (req,res) => {
    res.render('artists/index')
})

router.get('/new', (req,res) => {
    res.render('artists/new')
})


router.get('/:id', (req,res) => {
    res.render('artists/show')
})



module.exports = router;