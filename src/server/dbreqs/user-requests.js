const User = require('../models/user')

module.exports = {
    findUserByName(username) {
        return new Promise((resolve, reject) => {
            User.findOne({username}, (err, user) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }
}