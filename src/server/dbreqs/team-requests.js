const Team = require('../models/team')

module.exports = {
    findTeamByName(teamName, userId = null) {
        return new Promise((resolve, reject) => {
            const searchObj = {name: teamName}
            searchObj.users = userId

            Team.findOne(searchObj).populate('slots').exec((err, team) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(team)
                }
            })
        })
    }
}

