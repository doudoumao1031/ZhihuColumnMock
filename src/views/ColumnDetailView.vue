<template>
    <div class="column-detail-page w-75 mx-auto">
        <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
            <div class="col-3 text-center">
                <img :src="column.avatar.url" :alt="column.title" class="rounded-circle border w-100">
            </div>
            <div class="col-9">
                <h4>{{column.title}}</h4>
                <p class="text-muted">{{column.description}}</p>
            </div>
        </div>
        <post-list :list="list"></post-list>
    </div>
</template>
<script lang="ts">
// import store from '@/store'
import { GlobalDataProps, ColumnProps } from '../store'
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
// import { testData, testPosts } from '../testData'
import PostList from '../components/PostList.vue'

export default defineComponent({
    components: {
        PostList
    },
    setup (props, context) {
        const route = useRoute()
        const currentId = (route.params.id)
        const store = useStore<GlobalDataProps>()
        onMounted(() => {
            store.dispatch('fetchColumn', currentId)
            store.dispatch('fetchPosts', currentId)
        })
        // const column = computed(() => store.state.columns.find(c => c.id === currentId))
        // const list = computed(() => store.state.posts.find(post => post.columnId === currentId))
        const column = computed(() => store.getters.getColumnById(currentId))
        // if (!column.avatar) {
        //     column.avatar = {
        //         url: require('@/assets/column.jpg')
        //     }
        // }
        // const list = computed(() => store.getters.getPostsByCid(currentId))
        // const list = store.getters.getPostsByCid('5f3e86d62c56ee13bb83096c') // 这是非响应式的？刷不出来
        const list = computed(() => store.getters.getPostsByCid(currentId))
        // console.log(store.state.posts)
        // console.log('column', column, 'list', list)
        return {
            column,
            list
        }
    }

})
</script>
