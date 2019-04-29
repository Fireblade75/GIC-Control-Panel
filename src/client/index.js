import Vue from 'vue'
import './style/main.scss'
import App from './comps/core/app.vue'
import store from './store'

const app = new Vue({
    el: '#app',
    render: h => h(App),
    store
})
