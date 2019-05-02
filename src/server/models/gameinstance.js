const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const model = mongoose.model('GameInstance', {
    slot: Number,
    gameName: String,
    team: { type: ObjectId, ref: 'Team' },
    server: { type: ObjectId, ref: 'Server' },
    path: String
})

module.exports = model
