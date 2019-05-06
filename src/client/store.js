import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        username: '',
        authToken: '',
        teamList: [],
        licenses: [],
        servers: []
    },
    getters: {
        getUsername: (state) => {
            return state.username
        },
        getToken: (state) => {
            return state.authToken
        },
        getTeamNames: (state) => {
            return state.teamList.map(t => t.name)
        },
        getTeams: (state) => {
            return state.teamList
        },
        getLicenses: (state) => {
            return state.licenses
        },
        getServers: (state) => {
            return state.servers
        }
    },
    mutations: {
        setUser: (state, user) => {
            state.username = user.username
            state.authToken = user.token
        },
        setUsername: (state, username) => {
            state.username = username
        },
        setTeamList: (state, teams) => {
            state.teamList = teams
        },
        setLicenses: (state, licenses) => {
            state.licenses = licenses
        },
        setServers: (state, servers) => {
            state.servers = servers
        }
    },
    actions: {
        fetchTeams: (context) => {
            if(!context.state.authToken) {
                context.commit('setTeamList', [])
            } else {
                fetch('/api/teams/teamlist/games', {
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
        },
        fetchLicenses: (context) => {
            if(!context.state.licenses.length) {
                fetch('/api/teams/licenses')
                .then(res => res.json())
                .then(res => {
                    context.commit('setLicenses', res)
                })
            }
        },
        fetchServers: (context) => {
            if(!context.state.servers.length) {
                fetch('/api/servers/get-regions')
                .then(res => res.json())
                .then(res => {
                    context.commit('setServers', res)
                })
            }
        }
    }
})

export default store