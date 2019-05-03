const Team = require('../models/team')

function findTeamByNamSearch(teamName, userId) {
        const searchObj = {name: teamName}
        if(userId !== null) {
            searchObj.users = userId
        }
        return Team.findOne(searchObj)
}

module.exports = {
    findTeamByName(teamName, userId = null) {
        return new Promise((resolve, reject) => {
            findTeamByNamSearch(teamName, userId)
                .populate('slots')
                .exec((err, team) => {
                    if(err) {
                        reject(err)
                    } else {
                        resolve(team)
                    }
                })
        })
    },

    findTeamDetail(teamName, userId = null) {
        return new Promise((resolve, reject) => {
            findTeamByNamSearch(teamName, userId)
                .populate('slots')
                .populate('owner')
                .populate('users')
                .exec((err, team) => {
                    if(err) {
                        reject(err)
                    } else {
                        resolve(team)
                    }
                })
        })
    }
}

