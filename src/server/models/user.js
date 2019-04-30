const mongoose = require('mongoose')

const model = mongoose.model('User', {
    fullName: String,
    username: String,
    hash: String
})

module.exports = model
