const { Router } = require('express')
const User = require('../models/user')
const Game = require('../models/game')
const Team = require('../models/team')
const GameInstance = require('../models/gameinstance')
const { findUserByName } = require('../dbreqs/user-requests')
const { findTeamByName } = require('../dbreqs/team-requests')
const licenceList = require('../models/licences')

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

router.post('/setslot', async (req, res) => {
    const { teamName, gameName } = req.body
    const slotId = Number(req.body.slotId)
    if(!teamName || !gameName || Number.isNaN(slotId)) {
        res.status(400).end()
    }

    const user = await findUserByName(req.username)
    if(user) {
        const team = await findTeamByName(teamName, user._id)
        if(team) {
            const licence = licenceList[team.licence]
            if(licence) {
                const maxInstances = licence.instances
                const slot = team.slots.find(s => s.slot === slotId)
                if(slot) {
                    slot.gameName = gameName
                    await slot.save()
                    res.status(200).end()
                } else {
                    if(team.slots.length < maxInstances) {
                        const gameInstance = await new GameInstance({
                            slot: slotId,
                            gameName,
                            team: team._id,
                            server: null,
                            path: ''
                        }).save()
                        team.slots.push(gameInstance._id)
                        await team.save()
                        res.status(201).end()
                    } else {
                        res.status(400).json({error: 'to_few_slots'})
                    }
                }
            } else {
                res.status(500).json({error: 'unknown_licence', licence: String(team.licence)})
            }
        } else {
            res.status(404).json({error: 'team_not_found'})
        }
    } else {
        res.status(401).end()
    }
})

module.exports = router