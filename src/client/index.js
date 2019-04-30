import Vue from 'vue'
import VueRouter from 'vue-router'

import './style/main.scss'
import App from './comps/core/app.vue'
import store from './store'
import router from './router'

Vue.use(VueRouter)

const app = new Vue({
    el: '#app',
    render: h => h(App),
    store,
    router
})
