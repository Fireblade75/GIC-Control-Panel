import Vue from 'vue'
import VueRouter from 'vue-router'

import './style/main.scss'
import App from './comps/core/app.vue'
import store from './store'
import router from './router'

Vue.use(VueRouter)

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if(store.getters.getToken) {
            next()
        } else {
            next({ name: 'login' })
        }
    } if(to.matched.some(record => record.meta.toTeams)) {
        if(store.getters.getToken) {
            next({ name: 'teams' })
        } else {
            next()
        }
    } else {
        next() 
    }
})

const app = new Vue({
    el: '#app',
    render: h => h(App),
    store,
    router
})
