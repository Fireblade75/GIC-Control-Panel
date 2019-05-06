const Game = require('../models/game')
const GameInstance = require('../models/gameinstance')

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
    findGameByName(gameName, options = {}) {
        const fetchTeam = options.fetchTeam || false
        return new Promise((resolve, reject) => {
            const query = Game.findOne({name: gameName})
            
            if(fetchTeam) {
                query.populate('team')
            }

            query.exec((err, game) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(game)
                }
            })
        })
    },
    findGameInstancesByGame(gameName) {
        return new Promise((resolve, reject) => {
            GameInstance.find({gameName}).populate('server').exec((err, instances) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(instances)
                }
            })
        })
    }
}