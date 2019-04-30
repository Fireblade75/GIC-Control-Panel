const { Router } = require('express')
const Server = require('../models/servers')

const router = Router()

router.get('/my_team', (req, res) => {
    if(req.username) {
        
    }
})

module.exports = router