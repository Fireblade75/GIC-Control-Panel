import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        page: '/',
        username: '',
        authToken: '',
        team: '',
        teamList: []
    },
    getters: {
        getPage: (state) => {
            return state.page
        },
        getUsername: (state) => {
            return state.username
        },
        getToken: (state) => {
            return state.authToken
        },
        getTeam: (state) => {
            return state.team
        },
        getTeamList: (state) => {
            return state.teamList
        }
    },
    mutations: {
        setPage: (state, page) => {
            state.page = page
        },
        setUser: (state, user) => {
            state.username = user.username
            state.authToken = user.token
        },
        setUsername: (state, username) => {
            state.username = username
        },
        setTeam: (state, team) => {
            state.team = team
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
                fetch('/api/teams/teamlist', {
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
    }
})

export default store