const { Router } = require('express')
const Server = require('../models/server')

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
            res.json(result)
        } else {
            res.status(204).end()
        }
    })
})

router.get('/get-regions', (req, res) => {
    Server.aggregate([{"$group" : {_id: '$region', count:{ $sum: 1 } } }], (err, regions) => {
        if(err) throw err
        res.json(regions.map(region => {
            return {
                regionName: region._id,
                serverCount: region.count
            }
        }))
    })
})

module.exports = router
