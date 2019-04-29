const mongoose = require('mongoose')

const model = mongoose.model('Server', {
    name: String,
    ip: String,
    serverId: Number
})

module.exports = model
