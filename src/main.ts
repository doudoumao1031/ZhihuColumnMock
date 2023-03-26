import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000/'
axios.interceptors.request.use((config) => {
    config.params = { ...config.params, icode: 'ABCLkHJJKH' } // 统一加了个验证参数
    store.commit('setLoading', true) // 加载变量控制
    store.commit('setError', { status: false, message: '' })
    // console.log('interceptors.request')
    return config
})
axios.interceptors.response.use((response) => {
    setTimeout(() => {
        store.commit('setLoading', false) // 加载变量控制
    }, 2000)
    // store.commit('setLoading', false) // 加载变量控制
    // console.log('interceptors.response')
    return response
}, (e) => {
    // console.log(e.response)
    const { error } = e.response.data
    // console.log('axios', e.response, e.response.data, e.response.statusText)
    store.commit('setError', { status: true, message: e.response.statusText })
    store.commit('setLoading', false)
    return Promise.reject(error)
})
// axios.get('/column?currentPage=1&pageSize=4').then(resp => {
// axios.get('/column', { params: { currentPage: 1, pageSize: 4 } }).then(resp => {
//     console.log(resp.data)
// }).catch((err) => {
//     console.log('axios err:', err)
// })
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
