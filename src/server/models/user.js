const mongoose = require('mongoose')

const model = mongoose.model('Team', {
    name: String,
    userId: Number,
    email: String,
    hash: String
})

module.exports = model
