const router = require('express').Router();
const db = require('../models');



router.get('/', (req,res) => {
    res.render('songs/index')
})

router.post('/', (req,res) => {
    let userId = req.user.id;
    let artistId = req.body.artistId;

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
                res.send('something went wrong')
            })
        }
        res.redirect('/songs')
    })
})

router.get('/new', (req,res) => {
    res.render('songs/new')
})

router.get('/:id', (req,res) => {
    res.render('songs/show')
})



module.exports = router;