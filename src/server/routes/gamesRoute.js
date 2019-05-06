const { Router } = require('express')
const User = require('../models/user')
const Game = require('../models/game')
const Team = require('../models/team')
const Server = require('../models/server')
const GameInstance = require('../models/gameinstance')
const { findUserByName } = require('../dbreqs/user-requests')
const { findTeamByName, findTeamsByUser } = require('../dbreqs/team-requests')
const { findGameByName, findGamesByTeam, findGameInstancesByGame } = require('../dbreqs/game-requests')
const { findServersByRegion } = require('../dbreqs/server-requests')
const { addGameToServer, removeGameFromServer} = require('../dbreqs/gameserver-requests')
const licenseList = require('../models/licenses')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = Router()
const upload = multer({ dest: path.join(__dirname, '../../../tmp') })
const zipMimeTypes = ['application/zip', 'application/octet-stream', 'application/x-zip-compressed', 'multipart/x-zip']

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
                const filename = gameName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')  + '.zip'
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
    const { teamName, gameName, region } = req.body
    const slotId = Number(req.body.slotId)
    if(!teamName || !gameName || !region || Number.isNaN(slotId)) {
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
                const server = await Server.findById(slot.server)
                removeGameFromServer(server.ip, slot.gameName)
                if(gameName !== '---') {
                    addGameToServer(server.ip, gameName)
                    slot.gameName = gameName
                    await slot.save()
                } else {
                    let removePromises = [
                        new Promise((resolve, reject) => {
                            Team.findOneAndUpdate({_id: team._id}, {$pull: {slots: slot._id}}, (err) => {
                                if(err) reject(err)
                                else resolve()
                            })
                        }),
                        new Promise((resolve, reject) => {
                            GameInstance.findOneAndDelete({_id: slot._id}, (err) => {
                                if(err) reject(err)
                                else resolve()
                            })
                        })]
                    await Promise.all(removePromises)
                }
                res.status(200).end()
            } else {
                if(gameName === '---') {
                    res.status(400).json({error: 'missing_game_name'})
                } else {
                    if(team.slots.length < maxInstances) {
                        const existingInstances = await findGameInstancesByGame(gameName)
                        const availableServers = await findServersByRegion(region)
                        const server = availableServers.find(s => {
                            let used = false
                            for(let i = 0; i < existingInstances.length; i++) {
                                if(s._id.equals(existingInstances[i].server._id)) {
                                    used = true
                                    break
                                }
                            }
                            return !used
                        })

                        if(server) {
                            addGameToServer(server.ip, gameName)
                            const gameInstance = await new GameInstance({
                                slot: slotId,
                                gameName,
                                team: team._id,
                                server: server._id,
                                path: ''
                            }).save()
                            team.slots.push(gameInstance._id)
                            await team.save()
                            res.status(201).end()
                        } else {
                            res.status(400).json({error: 'no_available_server'})
                        }
                    } else {
                        res.status(400).json({error: 'to_few_slots'})
                    }
                }
            }
        } else {
            res.status(500).json({error: 'unknown_license', license: String(team.license)})
        }
    } else {
        res.status(404).json({error: 'team_not_found'})
    }
})

router.post('/set-sources', upload.single('gameFile'), async (req, res) => {
    const username = req.username
    const { gameName } = req.body
    
    if(!username) {
        res.status(403).end()
    } else if(!gameName || !req.file) {
        res.status(400).end()
    } else {
        const user = await findUserByName(username)
        const game = await findGameByName(gameName, { fetchTeam: true })
        if(!game) {
            res.status(400).json({error: 'game_not_found'})
        } else {
            const access = game.team.users.find(usr => usr._id.equals(user._id))
            if(!access) {
                res.status(400).json({error: 'user_not_in_team'})
            } else {
                const mimeType = zipMimeTypes.find(type => type === req.file.mimetype)
                if(!mimeType) {
                    fs.unlink(path.join(req.file.destination, req.file.filename), (err) => {
                        if(err) throw err
                        res.status(400).json({error: 'wrong_mime_type'})
                    })
                } else {
                const newPath = path.join(__dirname, '../../../games/', game.path)
                    await new Promise((resolve, reject) => {
                        fs.access(newPath, (err) => {
                            if(!err) {
                                fs.unlink(newPath, (err) => {
                                    if(err) reject(err)
                                    resolve()
                                })
                            } else {
                                resolve()
                            }
                        })
                    })

                    fs.rename(path.join(req.file.destination, req.file.filename), newPath, (err) => {
                        if(err) throw err
                        res.status(200).end()
                    })
                }
            }
        }
    }
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