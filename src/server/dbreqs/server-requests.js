const Server = require('../models/server')

module.exports = {
    findServersByRegion(region) {
        return new Promise((resolve, reject) => {
            Server.find({region}, (err, regions) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(regions)
                }
            })
        })
    }
}