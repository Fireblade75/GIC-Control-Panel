const { Router } = require('express')
const Game = require('../models/game')
const User = require('../models/user')
const Team = require('../models/team')
const GameInstance = require('../models/gameinstance')
const licenseList = require('../models/licenses')
const { findUserByName } = require('../dbreqs/user-requests')
const { findTeamDetail } = require('../dbreqs/team-requests')
const { findGameByName, findGamesByTeam } = require('../dbreqs/game-requests')

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
                            license: t.license 
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
                Team.find({users: user._id}).populate('slots').exec((err, teams)  => {
                    if(err) throw err
                    const gamePromises = teams.map(team => {
                        return new Promise((resolve, reject) => {
                            Game.find({team: team._id}, (err, games) => {
                                if(err) throw err
                                resolve({ 
                                    id: team._id,
                                    name: team.name, 
                                    license: team.license,
                                    games: games.map(g => g.name),
                                    slots: team.slots.map(s => { return {
                                        id: s.slot,
                                        game: s.gameName
                                    }})
                                })
                            })
                        })
                    })
                    //const slotPromises = GameInstance.find
                    Promise.all(gamePromises).then(result => {
                        res.json(result)
                    })
                })
        })
    } else {
        res.status(401).end()
    }
})

router.get('/licenses', (req, res) => {
    res.json(licenseList)
})


router.post('/create', (req, res) => {
    const username = req.username
    if(!username) {
        res.status(403).end()
        return
    }

    let {teamName, license} = req.body
    if(!teamName || !license) {
        res.status(400).end()
    } else {
        license = license.toLowerCase()
        if(!licenseList[license]) {
            res.status(400).json({
                error: 'unknown_license_level'
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
                        license: license,
                        users: [user._id],
                        owner: user._id
                    }).save()
                    res.status(201).json({teamName})
                }
            }) 
        })
    }
})

router.get('/detail', async (req, res) => {
    const username = req.username
    const { teamName } = req.query
    if(!username) {
        res.status(403).end()
    } else if(!teamName) {
        res.status(400).end()
    } else {
        const user = await findUserByName(username)
        const team = await findTeamDetail(teamName, user._id)
        if(!team) {
            res.status(404).json({error: team_not_found})
        } else {
            const games = await findGamesByTeam(team._id)
            const result = {
                id: team._id,
                name: team.name, 
                license: team.license,
                games: games.map(g => g.name),
                slots: team.slots.map(s => { return {
                    id: s.slot,
                    game: s.gameName
                }}),
                members: team.users.map(usr => {
                    const isOwner = usr._id.equals(team.owner._id)
                    return {
                        fullName: usr.fullName,
                        email: usr.username,
                        type: isOwner ? 'Owner' : 'Member'
                    }
                }),
                isOwner: user._id.equals(team.owner._id)
            }
            res.json(result)
        }
    }
})

router.post('/add-member', async (req, res) => {
    const username = req.username
    let { teamName, memberEmail } = req.body
    if(!username) {
        res.status(403).end()
    } else if(!teamName || !memberEmail) {
        res.status(400).end()
    } else {
        memberEmail = memberEmail.toLowerCase()
        const user = await findUserByName(username)
        const team = await findTeamDetail(teamName, user._id)
        if(!team) {
            res.status(404).json({error: 'team_not_found'})
        } else {
            if(!team.owner._id.equals(user._id)) {
                res.status(404).json({error: 'user_not_owner'})
            } else {
                const member = await findUserByName(memberEmail)
                if(!member) {
                    res.status(404).json({error: 'member_not_found'})
                } else {
                    const index = team.users.findIndex(usr => usr.username === memberEmail)
                    if(index !== -1) {
                        res.status(404).json({error: 'already_team_member'})
                    } else {
                        const maxTeamSize = licenseList[team.license].teamSize
                        if(team.users >= maxTeamSize) {
                            res.status(400).json({error: 'member_limit_reached'})
                        } else {
                            team.users.push(member._id)
                            await team.save()
                            res.status(200).end()
                        }
                    }
                }
            }
        }
    }
})

module.exports = router