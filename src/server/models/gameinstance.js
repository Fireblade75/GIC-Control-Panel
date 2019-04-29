const mongoose = require('mongoose')

const model = mongoose.model('GameInstance', {
    gameId: Number,
    serverId: Number,
    path: String
})

module.exports = model
