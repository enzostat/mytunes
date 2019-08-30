const router = require('express').Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const axios = require('axios')



router.get('/', isLoggedIn, (req,res) => {
    db.user.findOne({
        where: { id: req.user.id }, 
        include: [db.artist, {
            model: db.song,
            include: [db.artist]
        }]
    })
    .then(function(user) {
        res.render('songs/index', {songs: user.songs})
    })
    .catch(err => {
        console.log(err)
        res.redirect('/*')
    })
    
})



router.post('/', (req,res) => {
    let userId = req.user.id;
    // let artistId = req.body.artistId;

    db.song.findOrCreate({
        where: {name: req.body.name},
        defaults: req.body
    }).spread((song, created) => {
        if (userId > 0) {
            db.user.findByPk(userId)
            .then(user => {
                song.addUser(user)
            })
            .catch(err => {
                console.log(err)
                res.redirect('/*')
            })
        }
        res.redirect('/songs')
    })
})

router.get('/new', (req,res) => {
    res.render('songs/new')
})

router.get('/:id', (req,res) => {
    db.song.findOne({
        where: {id: req.params.id},
        include: [db.artist]
    })
    .then(song => {
        var url = "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" +process.env.api_key +"&artist="+ song.artist.name+"&track="+ song.name+"&format=json";
        console.log(url)
        axios.get(url)
        .then(response => {
            var results = response.data
            res.render('songs/show', {results, song})
        })
        .catch(err => {
            console.log(err)
            res.redirect('/*')
        })

    })
    
})

router.get('/*', (req,res) => {
    res.render('404')
})



module.exports = router;