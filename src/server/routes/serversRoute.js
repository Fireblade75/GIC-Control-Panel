const { Router } = require('express')
const Server = require('../models/servers')

const router = Router()

router.get('/', (req, res) => {
    Server.find({}, (err, servers) => {
        if(err) throw err
        if(servers && servers.length) {
            const result = servers.map(s => {
                return {
                    server_name: s.name,
                    server_region: s.region
                }
            })
        } else {
            res.status(204).end()
        }
    })
})

module.exports = router