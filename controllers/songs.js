const router = require('express').Router();



router.get('/', (req,res) => {
    res.send('STUB - songs home page')
})


router.get('/:id', (req,res) => {
    res.send('STUB - show one song')
})



module.exports = router;