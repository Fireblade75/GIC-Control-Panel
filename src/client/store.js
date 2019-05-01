import Vue from 'vue'
import Vuex from 'vuex'

import fetchTeams from './fetchers/fetchTeams'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        username: '',
        authToken: '',
        teamList: [],
        licences: []
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
        getLicences: (state) => {
            return state.licences
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
        fetchLicences: (context) => {
            if(!context.state.licences.length) {
                fetch('/api/teams/licences')
                .then(res => res.json())
                .then(res => {
                    context.state.licences = res
                })
            }
        }
    }
})

export default store