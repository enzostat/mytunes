const router = require('express').Router();
const db = require('../models');
require('dotenv').config();
const axios = require('axios');



router.get('/', (req,res) => {
    
    db.user.findByPk(req.user.id, {include: [db.artist]})
    .then(function(user) {
        res.render('artists/index', {user})
    })
    .catch(err => {
        console.log(err)
    })
    
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

router.post('/new/results', (req,res) => {
    let userId = req.user.id;
    
    db.artist.findOrCreate({
        where: {name: req.body.name}
        // defaults: req.body
    }).spread((artist, created) => {
        if (userId > 0) {
            db.user.findByPk(userId)
            .then(user => {
                artist.addUser(user)
            })
            .catch(err => {
                console.log(err)
            })
        }
        res.redirect('/artists')
    })
})

router.get('/:id', (req,res) => {
    db.artist.findOne({where: {id: req.params.id} })
    .then()
    res.render('artists/show')
})



module.exports = router;