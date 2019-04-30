const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const model = mongoose.model('Game', {
    name: String,
    path: String,
    team: { type: ObjectId, ref: 'Team' },
    servers: [{ type: ObjectId, ref: 'Server' }]
})

module.exports = model
