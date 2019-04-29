const mongoose = require('mongoose')

const model = mongoose.model('Game', {
    name: String,
    path: String,
    team: Number,
    servers: [Number]
})

module.exports = model
