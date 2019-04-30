const { Router } = require('express')
const Server = require('../models/servers')
const User = require('../models/user')
const Team = require('../models/team')

const router = Router()

router.get('/my_teams', (req, res) => {
    if(req.username) {
        User.findOne({username: req.username})
            .populate('users')
            .populate('owner')
            .exec((err, user) => {
                if(err) throw err
                if(!user) {
                    res.status(401).end()
                }
                Team.find({users: user._id}, (err, teams) => {
                    if(err) throw err
                    const result = teams.map(t => {
                        return {
                            name: t.name,
                            users: (t.users.map(u => u.username)),
                            licence: t.licence,
                            owner: t.owner.username
                        }
                    })
                    if(result) {
                        res.json(result)
                    } else {
                        res.status(204).end()
                    }
                })
        })
    } else {
        res.status(401).end()
    }
})

module.exports = router