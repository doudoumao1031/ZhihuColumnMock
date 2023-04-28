import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import axios from 'axios'
import Home from './views/HomeView.vue'
import Login from './views/LoginView.vue'
import Signup from './views/SignupView.vue'
import CreatePost from './views/CreatePostView.vue'
import ColumnDetail from './views/ColumnDetailView.vue'
import PostDetailView from './views/PostDetailView.vue'
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
        },
        {
            path: '/posts/:id',
            name: 'post',
            component: PostDetailView
        }
    ]
})
router.beforeEach((to, from, next) => {
    const { user, token } = store.state
    const { requiredLogin, redirectAlreadyLogin } = to.meta
    if (!user.isLogin) {
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
            store.dispatch('fetchCurrentUser').then(() => {
                if (redirectAlreadyLogin) {
                    next('/')
                } else {
                    next()
                }
            }, (e) => {
                console.error(e)
                // localStorage.removeItem('token') // state里面没清
                store.commit('logout')
                if (requiredLogin) {
                    next('login')
                } else {
                    next()
                }
            })
        } else {
            if (requiredLogin) {
                next('login')
            } else {
                next()
            }
        }
    } else {
        if (redirectAlreadyLogin) {
            next('/')
        } else {
            next()
        }
    }
})

export default router
