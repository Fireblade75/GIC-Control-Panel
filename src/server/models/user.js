const mongoose = require('mongoose')

const model = mongoose.model('User', {
    name: String,
    email: String,
    hash: String
})

module.exports = model
