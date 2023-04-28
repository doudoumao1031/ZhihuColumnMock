<template>
    <div>
        <section class="py-5 text-center container">
            <div class="row py-lg-5">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <img src="../assets/callout.svg" alt="callout" class="w-50"/>
                    <h2 class="font-weight-light">随心写作，自由表达</h2>
                    <p>
                        <!-- <a href="#" class="btn btn-primary my-2">开始写文章</a> -->
                        <router-link class="btn btn-primary my-2" :to="{name: 'createpost'}">开始写文章</router-link>
                        <!-- {{biggerColumnsLen}} -->
                    </p>
                </div>
            </div>
        </section>
        <h4 class="font-weight-bold text-center">发现精彩</h4>
        <Uploader action="/file/upload" :beforeUpload="beforeUpload" @file-uploaded="onFileUploaded">
            <!-- <h2>点击上传</h2> -->
            <!-- <template #loading>
                <div class="spinner-border" role="status">
                </div>
            </template> -->
        </Uploader>
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
import { GlobalDataProps, ResponseType, ImageProps } from '../store'
// import ColumnList from '../components/ColumnList.vue'
import ColumnList from '../components/ColumnList.vue'
import Uploader from '../components/Uploader.vue'
import createMessage from '@/components/createMessage'

export default defineComponent({
    components: {
        ColumnList,
        Uploader
    },

    setup () {
        const route = useRoute()
        const store = useStore<GlobalDataProps>()
        onMounted(() => {
            store.dispatch('fetchColumns')
        })
        const list = computed(() => { return store.state.columns })
        const biggerColumnsLen = computed(() => { return store.getters.biggerColumnsLen })
        const beforeUpload = (file: File) => {
            const isJPG = file.type === 'image/jpeg'
            if (!isJPG) {
                createMessage('上传图片只能是JPG格式', 'error')
            }
            return isJPG
        }
        const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
            createMessage(`上传图片ID ${rawData.data._id}`, 'success')
        }
        return {
            route,
            list: list,
            biggerColumnsLen,
            beforeUpload,
            onFileUploaded
        }
    }
})
</script>
