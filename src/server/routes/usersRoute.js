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
                        username: username.toLowerCase(),
                        fullName,
                        hash
                    }).save()
                    res.status(201).end()
                })
            }
        })
    }
})

// router.post('/remove-member', async (req, res) => {
//     const username = req.username
//     let { teamName, memberEmail } = req.body
//     if(!username) {
//         res.status(403).end()
//     } else if(!teamName || !memberEmail) {
//         res.status(400).end()
//     } else {
//         memberEmail = memberEmail.toLowerCase()
//         const user = await findUserByName(username)
//         const team = await findTeamDetail(teamName, user._id)
//         if(!team) {
//             res.status(404).json({error: 'team_not_found'})
//         } else {
//             if(!team.owner._id.equals(user._id)) {
//                 res.status(404).json({error: 'user_not_owner'})
//             } else {
//                 const member = await findUserByName(memberEmail)
//                 if(!member) {
//                     res.status(404).json({error: 'member_not_found'})
//                 } else {
//                     if(member._id.equals(team.owner._id)) {
//                         res.status(400).json({error: 'cannot_remove_owner'})
//                     } else {
//                         member.delete().exec()
//                         res.status(200).end()
//                     }
//                 }
//             }
//         }
//     }
// })

module.exports = router