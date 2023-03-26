// {
//     User,
//     ColumnProps[],
//     PostProps[],
// }
import { createStore, Commit } from 'vuex'
import axios from 'axios'
// import { testData, testPosts } from './testData'

export interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: number;
    columnId?: string;
}
interface ImageProps {
    _id?: string;
    url?: string;
    createdAt?: string;
}
// 这儿嵌套了接口
export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
    // posts: PostProps[];
}
export interface PostProps {
    _id: number;
    title: string;
    content: string;
    image?: string;
    createdAt: string;
    columnId: string;
}

export interface GlobalErrorProps {
    status: boolean;
    message?: string;
}
export interface GlobalDataProps {
    error: GlobalErrorProps;
    token: string;
    loading: boolean;
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps;
}

const getAndCommit = async (url:string, mutationName:string, commit:Commit) => {
    // commit('setLoading', true)
    const { data } = await axios.get(url)
    // 模拟延时
    // await new Promise(resolve => setTimeout(resolve, 2000))
    commit(mutationName, data)
    // commit('setLoading', false)
}
const postAndCommit = async (url:string, mutationName:string, commit:Commit, payload:any) => {
    const { data } = await axios.post(url, payload)
    commit(mutationName, data)
    return data
}

const store = createStore<GlobalDataProps>({
    state: {
        error: { status: false },
        token: localStorage.getItem('token') || '',
        loading: false,
        // columns: testData,
        // posts: testPosts,
        columns: [],
        posts: [],
        // user: { isLogin: false }
        user: { isLogin: false, name: 'doudou', columnId: '' }
    },
    mutations: {
        // login (state) {
        //     state.user = { ...state.user, isLogin: true, name: 'doudou' }
        // },
        // 带参数的mutation
        createPost (state, newPost) {
            state.posts.push(newPost)
        },
        fetchColumns (state, rawData) {
            state.columns = rawData.data.list
        },
        fetchColumn (state, rawData) {
            state.columns = [rawData.data]
        },
        fetchPosts (state, rawData) {
            state.posts = rawData.data.list
        },
        setLoading (state, status) {
            state.loading = status
        },
        setError (state, e: GlobalErrorProps) {
            // console.log('vuex setError', e)
            state.error = e
        },
        login (state, rawData) {
            // state.token = rawData.data.token
            const { token } = rawData.data
            state.token = token
            localStorage.setItem('token', token)
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
        },
        fetchCurrentUser (state, rawData) {
            state.user = { isLogin: true, ...rawData.data }
        }
    },
    actions: {
        // 获取专栏列表
        // store.dispatch('fetchColumns') 方式触发
        // fetchColumns (context) {
        //     axios.get('/columns').then(resp => {
        //         // console.log(resp.data)
        //         context.commit('fetchColumns', resp.data)
        //     })
        // },
        // fetchColumn ({ commit }, cid) {
        //     axios.get(`/columns/${cid}`).then(resp => {
        //         // console.log('fetchColumn', resp.data)
        //         commit('fetchColumn', resp.data)
        //     })
        // },
        // fetchPosts ({ commit }, cid) {
        //     axios.get(`/columns/${cid}/posts`).then(resp => {
        //         // console.log('fetchPosts', resp.data)
        //         commit('fetchPosts', resp.data)
        //     })
        // },
        // async/await改造
        fetchColumns ({ commit }) {
            // const { data } = await axios.get('/columns')
            // commit('fetchColumns', data)
            getAndCommit('/columns', 'fetchColumns', commit)
        },
        fetchColumn ({ commit }, cid) {
            // const { data } = await axios.get(`/columns/${cid}`)
            // commit('fetchColumn', data)
            getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
        },
        fetchPosts ({ commit }, cid) {
            // const { data } = await axios.get(`/columns/${cid}/posts`)
            // commit('fetchPosts', data)
            getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
        },
        login ({ commit }, payload) {
            return postAndCommit('/user/login', 'login', commit, payload)
        },
        fetchCurrnetUser ({ commit }) {
            getAndCommit('/user/current', 'fetchCurrentUser', commit)
        },
        // 组合Action
        loginAndFetch ({ dispatch }, loginData) {
            return dispatch('login', loginData).then(() => {
                return dispatch('fetchCurrnetUser')
            })
        }
    },
    getters: {
        biggerColumnsLen (state) {
            return state.columns.filter((c, index) => { return index > 2 }).length
        },
        getColumnById: (state) => {
            return (_id:string) => {
                return state.columns.find(c => c._id === _id)
            }
        },
        getPostsByCid: (state) => {
            return (cid:string) => {
                // console.log(cid, state.posts)
                return state.posts.filter(post => post.columnId === cid)
            }
        }
    }

})

export default store
