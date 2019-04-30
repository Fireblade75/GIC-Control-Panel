import VueRouter from 'vue-router'
import Login from './comps/pages/login'
import Register from './comps/pages/register'

const routes = [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    { path: '/register', component: Register }
]

const router = new VueRouter({ routes })

export default router