import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Home from './views/HomeView.vue'
import Login from './views/LoginView.vue'
import Signup from './views/SignupView.vue'
import CreatePost from './views/CreatePostView.vue'
import ColumnDetail from './views/ColumnDetailView.vue'
import store from './store'

const router = createRouter({
    // history: createWebHashHistory(),
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
            // component: Login
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { redirectAlreadyLogin: true }
        },
        {
            path: '/signup',
            name: 'signup',
            component: Signup
            // meta: { redirectAlreadyLogin: true }
        },
        {
            path: '/column/:id',
            name: 'column',
            component: ColumnDetail
        },
        {
            path: '/createpost',
            name: 'createpost',
            component: CreatePost,
            meta: { requiredLogin: true }
        }
    ]
})
router.beforeEach((to, from, next) => {
    if (to.meta.requiredLogin && !store.state.user.isLogin) {
        next({ name: 'login' })
    } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
        next({ name: 'home' })
    } else {
        next()
    }
})

export default router
