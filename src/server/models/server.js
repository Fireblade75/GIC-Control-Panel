const mongoose = require('mongoose')

const model = mongoose.model('Server', {
    name: String,
    ip: String
})

module.exports = model
