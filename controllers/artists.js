const router = require('express').Router();



router.get('/', (req,res) => {
    res.send('STUB - artists home page')
})


router.get('/:id', (req,res) => {
    res.send('STUB - show one artist')
})




module.exports = router;