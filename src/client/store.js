import Vue from 'vue'
import Vuex from 'vuex'

import fetchTeams from './fetchers/fetchTeams'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        username: '',
        authToken: '',
        teamList: [],
        licenses: []
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
        fetchlicenses: (context) => {
            if(!context.state.licenses.length) {
                fetch('/api/teams/licenses')
                .then(res => res.json())
                .then(res => {
                    context.state.licenses = res
                })
            }
        }
    }
})

export default store