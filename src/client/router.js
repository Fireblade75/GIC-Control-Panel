import VueRouter from 'vue-router'
import Login from './comps/pages/login'
import Register from './comps/pages/register'
import Welcome from './comps/pages/welcome'
import Teams from './comps/pages/teams'
import Games from './comps/pages/games'
import GameServers from './comps/pages/gameservers'
import TeamDetail from './comps/pages/team-detail'

const routes = [
    { path: '/', component: Login, meta: { toTeams: true} },
    { name: 'login', path: '/login', component: Login},
    { name: 'register', path: '/register', component: Register },
    { name: 'welcome', path: '/welcome', component: Welcome },
    { name: 'teams', path: '/teams', component: Teams, meta: { requiresAuth: true} },
    { name: 'games', path: '/games', component: Games, meta: { requiresAuth: true} },
    { name: 'gameservers', path: '/game-servers', component: GameServers, meta: { requiresAuth: true} },
    { name: 'teamdetail', path: '/team-detail', component: TeamDetail, meta: { requiresAuth: true} }
]

const router = new VueRouter({ routes })

export default router