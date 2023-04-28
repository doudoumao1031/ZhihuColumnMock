// {
//     User,
//     ColumnProps[],
//     PostProps[],
// }
import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
// import { testData, testPosts } from './testData'

export interface ResponseType<p = unknown> {
    code: number;
    msg: string;
    data: p;
}
export interface Avator {
    _id?: string;
    url?: string;
}
export interface UserProps {
    isLogin: boolean;
    name?: string;
    _id?: string;
    columnId?: string;
    avatar?: Avator;
    description?: string;
}
export interface ImageProps {
    _id?: string;
    url?: string;
    createdAt?: string;
    fitUrl?: string;
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
    excerpt?: string;
    content?: string;
    image?: ImageProps | string;
    createdAt?: string;
    columnId: string;
    author?: UserProps | string;
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
    // console.log(mutationName, data)
    // 模拟延时
    // await new Promise(resolve => setTimeout(resolve, 2000))
    commit(mutationName, data)
    // commit('setLoading', false)
    return data
}
const postAndCommit = async (url:string, mutationName:string, commit:Commit, payload:any) => {
    const { data } = await axios.post(url, payload)
    commit(mutationName, data)
    return data
}
const asyncAndCommit = async (url:string, mutationName:string, commit:Commit, config:AxiosRequestConfig = { method: 'get' }) => {
    const { data, msg } = await axios(url, config)
    console.log('axios async', url, config, data, msg)
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
            // console.log('fetchPosts', rawData)
            state.posts = rawData.data
        },
        updatePost (state, { data }) {
            state.posts = state.posts.map(post => {
                if (post._id === data._id) {
                    return data
                } else {
                    return post
                }
            })
        },
        deletePost (state, { data }) {
            // console.log('fetchPosts', rawData)
            state.posts = state.posts.filter(post => post._id !== data._id)
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
        logout (state, rawData) {
            state.token = ''
            localStorage.remove('token')
            delete axios.defaults.headers.common.Authorization
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
            return getAndCommit('/columns', 'fetchColumns', commit)
        },
        fetchColumn ({ commit }, cid) {
            // const { data } = await axios.get(`/columns/${cid}`)
            // commit('fetchColumn', data)
            return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
        },
        fetchPosts ({ commit }, cid) {
            // const { data } = await axios.get(`/columns/${cid}/posts`)
            // console.log('fetchPosts', cid)
            // const { data } = await axios.get(`/posts/${cid}`)
            // commit('fetchPosts', data)
            return getAndCommit(`/posts/${cid}`, 'fetchPosts', commit)
        },
        login ({ commit }, payload) {
            return postAndCommit('/user/login', 'login', commit, payload)
        },
        fetchCurrentUser ({ commit }) {
            return getAndCommit('/user/current', 'fetchCurrentUser', commit)
        },
        createPost ({ commit }, payload) {
            return postAndCommit('/posts', 'createPost', commit, payload)
        },
        updatePost ({ commit }, { id, payload }) {
            asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
                method: 'patch',
                data: payload
            })
        },
        deletePost ({ commit }, id) {
            asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {
                method: 'delete'
            })
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
        },
        getPostByPid: (state) => {
            return (pid:string) => {
                // console.log(pid, state.posts)
                return state.posts.filter(post => String(post._id) === pid)[0]
            }
        },
        getCurrentPost: (state) => {
            return (cid:string) => {
                // console.log(cid, state.posts)
                return state.posts.filter((post) => {
                    // console.log(post._id, cid, (String(post._id) === cid))
                    return String(post._id) === cid
                })[0]
                // for (let i = 0; i < state.posts.length; i++) {
                //     const post = state.posts[i]
                //     console.log(post)
                //     if (String(post._id) === cid) {
                //         return post
                //     }
                // }
            }
        }
    }

})

export default store
