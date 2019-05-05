const { Router } = require('express')
const User = require('../models/user')
const Game = require('../models/game')
const Team = require('../models/team')
const GameInstance = require('../models/gameinstance')
const { findUserByName } = require('../dbreqs/user-requests')
const { findTeamByName, findTeamsByUser } = require('../dbreqs/team-requests')
const { findGameByName, findGamesByTeam } = require('../dbreqs/game-requests')
const licenseList = require('../models/licenses')
const upload = require('multer')

const router = Router()

router.post('/create', async (req, res) => {
    const username = req.username
    if(!username) {
        res.status(403).end()
        return
    }

    const {teamName, gameName} = req.body
    if(!teamName || !gameName) {
        res.status(400).end()
        return
    }
    const user = await findUserByName(username)
    const team = await findTeamByName(teamName, user._id)
    if(!team) {
        res.status(400).json({error: 'team_not_found'})
    } else {
        const oldGame = await findGameByName(gameName)
        if(oldGame) {
            res.status(400).json({error: 'game_name_taken'})
        } else {
            const license = licenseList[team.license]
            const maxGames = license.games
            const gameCount = (await findGamesByTeam(team._id)).length

            if(gameCount < maxGames) {
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
            } else {
                res.status(400).json({error: 'game_limit_reached'})
            }
        }
    }
})

router.post('/setslot', async (req, res) => {
    const { teamName, gameName } = req.body
    const slotId = Number(req.body.slotId)
    if(!teamName || !gameName || Number.isNaN(slotId)) {
        res.status(400).end()
    }

    const username = req.username
    if(!username) {
        res.status(403).end()
        return
    }

    const user = await findUserByName(username)
    const team = await findTeamByName(teamName, user._id)
    if(team) {
        const license = licenseList[team.license]
        if(license) {
            const maxInstances = license.instances
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
            res.status(500).json({error: 'unknown_license', license: String(team.license)})
        }
    } else {
        res.status(404).json({error: 'team_not_found'})
    }
})

router.post('/set-sources', (req, res) => {
    res.status(200).end()
})

router.get('/gamelist', async (req, res) => {
    const username = req.username
    if(!username) {
        res.status(403).end()
    } else {
        const user = await findUserByName(username)
        const teams = await findTeamsByUser(user._id)
        
        const promises = teams.map(team => {
            return findGamesByTeam(team._id)
        })
        let gameList = await Promise.all(promises)
        gameList = [].concat.apply([], gameList)

        const result = gameList.map(game => game.name)
        res.json(result)
    }
})

module.exports = router