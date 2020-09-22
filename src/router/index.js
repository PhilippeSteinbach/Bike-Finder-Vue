import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home/HomePage';
import News from '@/pages/News/NewsPage';
import Bike from '@/pages/Bikes/BikePage';
import History from '@/pages/History/HistoryPage';

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/news',
        name: 'news',
        component: News
    },
    {
        path: '/map',
        name: 'map',
        component: Bike
    },
    {
        path: '/history',
        name: 'history',
        component: History
    },
    {
        path: '*',
        name: 'fallback',
        redirect: {
            name: 'home'
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router