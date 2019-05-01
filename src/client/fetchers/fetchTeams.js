
function fetchTeams(context, url) {
    if(!context.state.authToken) {
        context.commit('setTeamList', [])
    } else {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': context.state.authToken
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                console.error(res.error)
            } else {
                context.commit('setTeamList', res)
            }
        })
    }
}