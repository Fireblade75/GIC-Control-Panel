const { Router } = require('express')
const User = require('../models/user')
const Game = require('../models/game')
const Team = require('../models/team')

const router = Router()

router.post('/create', (req, res) => {
    const username = req.username
    console.error('create')
    if(!username) {
        res.status(403).end()
        return
    }

    let {teamName, gameName} = req.body
    if(!teamName || !gameName) {
        res.status(400).end()
    } else {
        User.findOne({username}, (err, user) => {
            if(err) throw err
            Team.findOne({name: teamName, users: user._id}, (err, team)  => {
                if(err) throw err
                if(!team) {
                    res.status(400).json({error: 'team_not_found'})
                } else {
                    Game.findOne({name: gameName}, (err, oldGame) => {
                        if(err) throw err
                        if(oldGame) {
                            res.status(400).json({error: 'game_name_taken'})
                        } else {
                            const filename = '/files/' + gameName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')  + '.zip'
                            new Game({
                                name: gameName,
                                team: team._id,
                                servers: [],
                                path: filename
                            }).save()
                            res.status(201).json({
                                name: gameName,
                                path: filename
                            })
                        }
                    })
                }
            }) 
        })
    }
})

module.exports = router