<template>
    <div>
        <section class="py-5 text-center container">
            <div class="row py-lg-5">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <img src="../assets/callout.svg" alt="callout" class="w-50"/>
                    <h2 class="font-weight-light">随心写作，自由表达</h2>
                    <p>
                        <a href="#" class="btn btn-primary my-2">开始写文章</a>
                        <!-- {{biggerColumnsLen}} -->
                    </p>
                </div>
            </div>
        </section>
        <h4 class="font-weight-bold text-center">发现精彩</h4>
        <column-list :list="list"></column-list>
        <!-- <ColumnList :list="list"></ColumnList> -->
        <!-- <button
            class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
            @click="loadMorePage" v-if="!isLastPage"
        >
            加载更多
        </button> -->
        <!-- <pre>{{route}}</pre> -->
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, ColumnProps } from '../store'
// import ColumnList from '../components/ColumnList.vue'
import ColumnList from '../components/ColumnList.vue'

export default defineComponent({
    components: {
        ColumnList
    },

    setup () {
        const route = useRoute()
        const store = useStore<GlobalDataProps>()
        onMounted(() => {
            store.dispatch('fetchColumns')
        })
        const list = computed(() => { return store.state.columns })
        const biggerColumnsLen = computed(() => { return store.getters.biggerColumnsLen })
        // const list = ref<ColumnProps[]>([
        //     {
        //         id: 1,
        //         title: 'PPT实验小学',
        //         avatar: 'https://pica.zhimg.com/v2-3c98b959c2582947850cd69f144d3f03_l.jpg?source=d16d100b',
        //         description: '各种稀奇古怪的装逼技能，或许你可以试试~'
        //     }
        // ])
        return {
            route,
            list: list,
            biggerColumnsLen
        }
    }
})
</script>
