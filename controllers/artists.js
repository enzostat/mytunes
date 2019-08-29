const router = require('express').Router();
const db = require('../models');
require('dotenv').config();
const axios = require('axios');
const isLoggedIn = require('../middleware/isLoggedIn');



router.get('/',isLoggedIn, (req,res) => {
    
    db.user.findByPk(req.user.id, {include: [db.artist]})
    .then(function(user) {
        res.render('artists/index', {user})
    })
    .catch(err => {
        console.log(err)
    })
    
})


router.get('/new', isLoggedIn, (req,res) => {
    var url = ""
    res.render('artists/new')
})

router.get('/new/results', (req,res) => {
    var query = req.query;
    var url = "https://ws.audioscrobbler.com/2.0/?method=artist.search&artist="+query.name+"&limit=10&api_key="+process.env.api_key+"&format=json"
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

router.delete('/:id', (req,res) => {
    var aId = req.body.artistId;
    // var userId = req.user.id;

    db.usersArtists.destroy({
        where: {userId: req.user.id, artistId: aId}
    })
    .then(() => {
        res.redirect('/artists')
    })
    .catch(err => {
        res.send('something went wrong')
    })

})

router.get('/:id', isLoggedIn, (req,res) => {
    db.artist.findOne({where: {id: req.params.id} })
    .then(artist => {
        var url = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artist.name+"&api_key="+process.env.api_key+"&format=json"
        console.log(url)
        axios.get(url)
        .then(response => {
            var results = response.data;
            res.render('artists/show', {results, artist})
        })
        .catch(err => {
            console.log(err)
            res.send('whoops bro')
        })
        
    })
    
})



router.get('/:id/toptracks', (req,res) => {
    db.artist.findOne({where: {id: req.params.id}})
    .then(artist => {
        var url = "https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist="+artist.name+"&limit=15&api_key="+process.env.api_key+"&format=json"
        axios.get(url)
        .then(response => {
            var results = response.data;
            res.render('artists/toptracks', {results, artist})
        })

    })

})

router.get('/:id/songsearch', (req,res) => {
    var query = req.query;
    db.artist.findOne({where: {id: req.params.id}})
    .then(artist => {
        var url = "https://ws.audioscrobbler.com/2.0/?method=track.search&track="+query.name+"&artist="+ artist.name +"&limit=10&api_key="+process.env.api_key+"&format=json";
        axios.get(url)
        .then(response => {
            var results = response.data.results;
            // res.json(results)
            res.render('artists/songsearch', {results, artist})
        })
    })
})

router.get('/*', (req,res) => {
    res.render('404')
})



module.exports = router;