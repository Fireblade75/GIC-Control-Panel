const { Router } = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const router = Router()
const saltRounds = 10

router.post('/login', (req, res) => {
    const { username, password } = req.body
    if(!username || !password) {
        res.status(400)
    } else {
        User.findOne({username}, (err, user) => {
            if(err) throw err
            if(!user) {
                res.status(401).json({error: 'invalid_credentials'})
            } else {
                bcrypt.compare(password, user.hash, (err, same) => {
                    if(err) throw err
                    if(!same) {
                        res.status(401).json({error: 'invalid_credentials'})
                    } else {
                        const token = jwt.sign(
                            { username: user.username },
                            process.env.JWT_KEY,
                            { expiresIn: '24h' })
                        res.status(200).json({
                            username: username,
                            token: token
                        })
                    }
                })
            }
        })
    }
})

router.post('/register', (req, res) => {
    const { username, password, fullName } = req.body
    if(!username || !password || !fullName) {
        res.status(400)
    } else {
        User.findOne({username}, (err, user) => {
            if(err) throw err
            if(user) {
                res.status(400).json({error: 'username_taken'})
            } else {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if(err) throw err
                    new User({
                        username,
                        fullName,
                        hash
                    }).save()
                    res.status(201).end()
                })
            }
        })
    }
})

module.exports = router