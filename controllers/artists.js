const router = require('express').Router();
const db = require('../models');
require('dotenv').config();
const axios = require('axios');



router.get('/', (req,res) => {
    res.render('artists/index')
})

router.get('/new', (req,res) => {
    var url = ""
    res.render('artists/new')
})

router.get('/new/results', (req,res) => {
    var query = req.query;
    var url = "https://ws.audioscrobbler.com/2.0/?method=artist.search&artist="+query.name+"&api_key="+process.env.api_key+"&format=json"
   console.log(url)
    axios.get(url)
    .then(response => {
        var results = response.data.results;
        res.render('artists/results', {results})
    })
    .catch(err => {
        console.log(err)
        res.redirect('../../*')
    })
})

router.get('/:id', (req,res) => {
    res.render('artists/show')
})



module.exports = router;