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
        res.redirect('/*')
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
        res.redirect('/*')
    })
})

router.post('/new/results', (req,res) => {
    let userId = req.user.id;
    //either find an artist in the DB or create one
    db.artist.findOrCreate({
        where: {name: req.body.name}
        
    }).spread((artist, created) => {
        if (userId > 0) {
            //once artist is either found or created, the current user is found
            //and an entry in the join table is created
            db.user.findByPk(userId)
            .then(user => {
                artist.addUser(user)
            })
            .catch(err => {
                console.log(err)
                res.redirect('/*')
            })
        }
        res.redirect('/artists')
    })
})

router.delete('/:id', (req,res) => {
    var aId = req.body.artistId;

    //find where user and artist are joined and delete that entry
    //does not delete either user or artist
    db.usersArtists.destroy({
        where: {userId: req.user.id, artistId: aId}
    })
    .then(() => {
        res.redirect('/artists')
    })
    .catch(err => {
        res.redirect('/*')
    })

})

router.get('/:id', isLoggedIn, (req,res) => {
    db.artist.findOne({where: {id: req.params.id} })
    .then(artist => {
        //start of api process
        //api is called used artist name and the info is then displayed on the show page
        var url = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artist.name+"&api_key="+process.env.api_key+"&format=json"
        console.log(url)
        axios.get(url)
        .then(response => {
            var results = response.data;
            //every artist has an mbid
            //the mbid string will be used to find artist in songkick's api
            let mbid = results.artist.mbid;
            let onTour = results.artist.ontour;

            //if an artist is on tour, the last.fm api list their "ontour" status as 1
            //using that, if an artist is on tour, we do a second api call to songkick
            if (onTour == 1) {
                let songkickURL = `https://api.songkick.com/api/3.0/artists/mbid:${mbid}/calendar.json?apikey=${process.env.songkick_api}&page=1&per_page=5 `;
                console.log(songkickURL);

                axios.get(songkickURL)
                .then(response => {
                    let skResults = response.data;
                    // res.json(skResults);
                    res.render('artists/show', {results, skResults, artist})
                })
            //if an artist is not on tour, there is no need to make the songkick call
            } else {
                res.render('artists/show', {results, artist})
            }
        
        })
        .catch(err => {
            console.log(err)
            res.send('whoops bro')
        })
        
    })
    
})


//find the top tracks of an artist, a quick add method (if you will)
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

//search for a specific song by an artist
router.get('/:id/songsearch', (req,res) => {
    var query = req.query;
    db.artist.findOne({where: {id: req.params.id}})
    .then(artist => {
        var url = "https://ws.audioscrobbler.com/2.0/?method=track.search&track="+query.name+"&artist="+ artist.name +"&limit=10&api_key="+process.env.api_key+"&format=json";
        axios.get(url)
        .then(response => {
            var results = response.data.results;
            res.render('artists/songsearch', {results, artist})
        })
    })
})

router.get('/*', (req,res) => {
    res.render('404')
})



module.exports = router;