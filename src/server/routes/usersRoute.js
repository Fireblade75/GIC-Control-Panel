const { Router } = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const router = Router()

router.post('login', (req, res) => {
    const { username, password } = req.body
    if(!username || !password) {
        res.status(400)
    } else {
        User.findOne({username}, (err, user) => {
            if(err) throw err
            if(!user) {
                res.status(401)
            } else {
                bcrypt.compare(password, user.hash, (err, same) => {
                    if(err) throw err
                    if(!same) {
                        res.status(401)
                    } else {
                        jwt.sign(
                            { username: user.username },
                            process.env.JWT_KEY,
                            { expiresIn: '24h' })
                    }
                })
            }
        })
    }

    res.status(200).end()
})


module.exports = router