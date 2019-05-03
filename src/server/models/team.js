const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const model = mongoose.model('Team', {
    name: String,
    users: [{ type: ObjectId, ref: 'User' }],
    license: String,
    owner: { type: ObjectId, ref: 'User' },
    slots: [{ type: ObjectId, ref: 'GameInstance' }]
})

module.exports = model
