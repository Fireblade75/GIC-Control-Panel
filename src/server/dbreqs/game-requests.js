const Game = require('../models/game')

module.exports = {
    findGamesByTeam(teamId) {
        return new Promise((resolve, reject) => {
            Game.find({team: teamId}, (err, games) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(games)
                }
            })
        })
    },
    findGameByName(gameName) {
        return new Promise((resolve, reject) => {
            Game.findOne({name: gameName}, (err, game) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(game)
                }
            })
        })
    }
}