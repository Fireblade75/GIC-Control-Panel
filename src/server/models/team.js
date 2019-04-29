const mongoose = require('mongoose')

const model = mongoose.model('Team', {
    name: String,
    teamId: Number,
    users: [Number],
    licence: String,
    ownerId: Number
})

module.exports = model
