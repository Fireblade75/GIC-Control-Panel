const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const model = mongoose.model('GameInstance', {
    gameId: { type: ObjectId, ref: 'Game' },
    serverId: { type: ObjectId, ref: 'Server' },
    path: String
})

module.exports = model
