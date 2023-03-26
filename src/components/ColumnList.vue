<template>
    <div class="row">
        <div class="col-4 mb-4" v-for="column in columnlist" :key="column._id">
            <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                    <img class="rounded-circle border border-light my-3" :src="column.avatar?.url" alt="column.title">
                    <h5 class="card-title">{{column.title}}</h5>
                    <p class="card-text text-start">{{column.description}}</p>
                    <router-link :to="{name: 'column', params: {id: column._id}}">进入专栏</router-link>
                    <!-- <router-link :to="`/column/${column._id}`">进入专栏</router-link> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType, computed } from 'vue'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import colunmAvatar from '../assets/column.jpg'
import { ColumnProps } from '../store'

// export interface ColumnProps {
//     id: number;
//     title: string;
//     avatar?: any;
//     description: string;
// }
export default defineComponent({
    name: 'ColumnList',
    props: {
        // props中的divst可以直接用
        list: {
            type: Array as PropType<ColumnProps[]>,
            required: true
        }
    },
    setup (props) {
        const columnlist = computed(() => {
            return props.list.map((column) => {
                if (!column.avatar) {
                    column.avatar = {
                        url: require('@/assets/column.jpg')
                        // url: colunmAvatar // ES6 module 也是可以的
                    }
                    // console.log('头像图片 404', column.avatar)

                    // column.avatar = colunmAvatar
                    // console.log(colunmAvatar)
                } else {
                    // 阿里云oss 图片后缀处理
                }
                return column
            })
        })
        // 直接 columndivst = props.divst 说是要丢失响应性
        return {
            columnlist
        }
    }
})
</script>

<style scoped>
.card-body img {
    width: 100px;
    height: 100px;
}
</style>
