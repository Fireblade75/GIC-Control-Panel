const fetch = require('node-fetch')
const { findGameByName } = require('./game-requests')

function apiPath(path) {
    return '/api/files/' + path
}

module.exports = {
    addGameToServer: async function(serverIp, gameName) {
        const game = await findGameByName(gameName)
        const gameUrl = apiPath(game.path)

        if(process.env.INFORM_GAME_SERVERS) {
            await fetch('http://' + serverIp + ':3000/games/add', {
                method: 'POST',
                body:    JSON.stringify({
                    path: gameUrl,
                    gameName: gameName
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    },

    removeGameFromServer: async function(serverIp, gameName) {
        const game = await findGameByName(gameName)
        const zipName = game.path.substr(0, game.path.length - 4)

        if(process.env.INFORM_GAME_SERVERS) {
            await fetch('http://' + serverIp + ':3000/games/delete', {
                method: 'POST',
                body:    JSON.stringify({
                    gameName: zipName
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }
}