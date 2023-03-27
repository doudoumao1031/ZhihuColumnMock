<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <h1>{{ error.message }}-{{ error.status }}</h1>
    <!-- <message v-if="error.status" type="error" :message="error.message"></message> -->
    <!-- <h1 v-if="isLoading">正在读取 😄</h1> -->
    <loader v-if="isLoading" text="拼命加载中" background="rgba(0,0,0,.2)"></loader>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
        <small>
            <ul class="list-inline mb-0">
                <li class="list-inline-item">© 2020 豆豆</li>
                <li class="list-inline-item">课程</li>
                <li class="list-inline-item">文档</li>
                <li class="list-inline-item">联系</li>
                <li class="list-inline-item">更多</li>
            </ul>
        </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps, ColumnProps } from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList from './components/ColumnList.vue'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
import Message from './components/Message.vue' // 改用函数式
import createMessage from './components/createMessage'
import axios from 'axios'
export default defineComponent({
    name: 'App',
    components: {
        GlobalHeader,
        Loader
        // Message
    },
    // created () {
    //     console.log(this.$refs.inputRef)
    // },
    // methods: {
    //     contextShow: function () {
    //         console.log(this.$refs.inputRef)
    //     }
    // },
    setup (props, context) {
        const inputRef = ref<any>()
        const store = useStore<GlobalDataProps>()
        const currentUser = computed(() => store.state.user)
        const isLoading = computed(() => store.state.loading)
        const token = computed(() => store.state.token)
        const error = computed(() => store.state.error)
        onMounted(() => {
            if (!currentUser.value.isLogin && token.value) {
                axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
                store.dispatch('fetchCurrentUser')
            }
        })
        watch(() => error.value.status, () => {
            const { status, message } = error.value
            if (status && message) {
                createMessage(message, 'error')
            }
        })
        return {
            currentUser: currentUser,
            inputRef,
            isLoading,
            error
        }
    }
})
</script>
