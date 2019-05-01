const { Router } = require('express')
const Server = require('../models/servers')
const User = require('../models/user')
const Team = require('../models/team')
const licences = require('../models/licences')

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

router.get('/teamlist', (req, res) => {
    if(req.username) {
        User.findOne({username: req.username}, (err, user) => {
                if(err) throw err
                if(!user) {
                    res.status(401).json({error: 'user_no_longer_exists'})
                }
                Team.find({users: user._id}, (err, teams) => {
                    if(err) throw err
                    const result = teams.map(t => {
                        return { name: t.name, licence: t.licence }
                    })
                    res.json(result)
                })
        })
    } else {
        res.status(401).end()
    }
})

router.get('/licences', (req, res) => {
    res.json(licences)
})


router.post('/create', (req, res) => {
    const username = req.username
    if(!username) {
        res.status(403).end()
        return
    }

    let {teamName, licence} = req.body
    if(!teamName || !licence) {
        res.status(400)
    } else {
        licence = licence.toLowerCase()
        if(!licences[licence]) {
            res.status(400).json({
                error: 'unknown_licence_level'
            })
            return
        }

        User.findOne({username}, (err, user) => {
            if(err) throw err
            Team.findOne({name: teamName}, (err, oldTeam)  => {
                if(err) throw err
                if(oldTeam) {
                    res.status(400).json({error: 'name_taken'})
                } else {
                    new Team({
                        name: teamName,
                        licence: licence,
                        users: [user._id],
                        owner: user._id
                    }).save()
                    res.status(201).json({teamName})
                }
            }) 
        })
    }
})

module.exports = router