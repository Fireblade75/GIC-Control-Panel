const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const model = mongoose.model('GameInstance', {
    game: { type: ObjectId, ref: 'Game' },
    server: { type: ObjectId, ref: 'Server' },
    path: String
})

module.exports = model
