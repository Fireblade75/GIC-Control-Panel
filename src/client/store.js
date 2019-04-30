import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        page: '/',
        username: '',
        authToken: '',
        team: ''
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
        }
    }
})

export default store