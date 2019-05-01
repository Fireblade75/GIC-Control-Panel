const { Router } = require('express')
const Game = require('../models/game')
const User = require('../models/user')
const Team = require('../models/team')
const licences = require('../models/licences')

const router = Router()

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
                        return { 
                            id: t._id,
                            name: t.name, 
                            licence: t.licence 
                        }
                    })
                    
                    res.json(result)
                })
        })
    } else {
        res.status(401).end()
    }
})

router.get('/teamlist/games', (req, res) => {
    if(req.username) {
        User.findOne({username: req.username}, (err, user) => {
                if(err) throw err
                if(!user) {
                    res.status(401).json({error: 'user_no_longer_exists'})
                }
                Team.find({users: user._id}, (err, teams) => {
                    if(err) throw err
                    const promises = teams.map(team => {
                        return new Promise((resolve, reject) => {
                            Game.find({team: team._id}, (err, games) => {
                                if(err) throw err
                                resolve({ 
                                    id: team._id,
                                    name: team.name, 
                                    licence: team.licence,
                                    games: games.map(g => g.name) 
                                })
                            })
                        })
                    })
                    Promise.all(promises).then(result => {
                        res.json(result)
                    })
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
        res.status(400).end()
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