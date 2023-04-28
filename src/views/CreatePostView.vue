<template>
    <div class="create-post-page">
      <h4>{{isEditMode ? '更新文章' : '发表文章'}}</h4>
      <Uploader
        action="/file/upload"
        :beforeUpload="uploadCheck"
        @file-upload="handleFileUploaded"
        :uploaded="uploadedData"
        class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      >
        <h2>点击上传图片, 支持JPG或者PNG格式</h2>
        <template #loading>
          <div class="d-flex">
            <div class="spinner-border text-secondary" role="status"></div>
          </div>
          <h2> 正在上传</h2>
        </template>
        <template #uploaded="dataProps">
          <!-- <img :src="dataProps.uploadedData.data.url" alt=""> -->
          <img :src="dataProps.uploadedData.data" alt="">
        </template>
      </Uploader>
      <h4>{{isEditMode ? '更新文章' : '发表文章'}}</h4>
      <validate-form @form-submit="onFormSubmit">
        <div class="mb-3">
          <label class="form-label">文章标题：</label>
          <validate-input
            :rules="titleRules"
            v-model="titleVal"
            placeholder="请输入文章标题"
            type="text"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">文章详情：</label>
          <validate-input
            rows="10"
            tag="textarea"
            placeholder="请输入文章详情"
            :rules="contentRules"
            v-model="contentVal"
          />
        </div>
        <template #submit>
            <button class="btn btn-primary btn-large">{{isEditMode ? '更新文章' : '发表文章'}}
            </button>
        </template>
      </validate-form>
    </div>
  </template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '../components/Uploader.vue'
import createMessage from '@/components/createMessage'
import { beforeUploadCheck } from '@/help'
export default defineComponent({
    // name: 'Login',
    components: {
        ValidateInput,
        ValidateForm,
        Uploader
    },
    setup () {
        const uploadedData = ref()
        const titleVal = ref('')
        const router = useRouter()
        const route = useRoute()
        const isEditMode = !!route.query.id
        const store = useStore<GlobalDataProps>()
        let imageId = ''
        const titleRules: RulesProp = [
            { type: 'required', message: '文章标题不能为空' }
        ]
        const contentVal = ref('')
        const contentRules: RulesProp = [
            { type: 'required', message: '文章详情不能为空' }
        ]
        onMounted(() => {
            // console.log(route.query.id, isEditMode)
            if (isEditMode) {
            // store.dispatch('fetchPost', route.query.id)
                const currentPost = store.getters.getPostByPid(route.query.id)
                // console.log(currentPost)
                // 映射到外面的响应对象去（这儿只匹配头图）
                if (currentPost.image) {
                    uploadedData.value = { data: currentPost.image }
                }
                titleVal.value = currentPost.title
                contentVal.value = currentPost.content || ''
            }
        })
        const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
            if (rawData.data._id) {
                imageId = rawData.data._id
            }
        }
        const onFormSubmit = (result: boolean) => {
            // console.log(result)
            if (result) {
                const { columnId } = store.state.user
                if (columnId) {
                    const newPost: PostProps = {
                        _id: new Date().getTime(),
                        title: titleVal.value,
                        content: contentVal.value,
                        columnId,
                        author: columnId,
                        createdAt: new Date().toLocaleString()
                    }
                    if (imageId) {
                        newPost.image = imageId
                    }
                    // 做一个 创建/编辑 判断
                    const actionName = isEditMode ? 'updatePost' : 'createPost'
                    const sendData = isEditMode
                        ? {
                            id: route.query.id,
                            payload: newPost
                        }
                        : newPost
                    // store.dispatch('createPost', newPost).then(() => {
                    store.dispatch(actionName, sendData).then(() => {
                        createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
                        setTimeout(() => {
                            router.push({ name: 'column', params: { id: columnId } })
                        }, 2000)
                    })
                }
            }
        }
        const uploadCheck = (file: File) => {
            const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
            const { passed, error } = result
            if (error === 'size') {
                createMessage('上传图片大小不能超过1Mb', 'error')
            }
            if (error === 'format') {
                createMessage('上传图片只能是JPG/PNG格式', 'error')
            }
            return passed
        }
        // const uploadCheck = (file: File) => {
        // }
        return {
            titleRules,
            titleVal,
            contentVal,
            contentRules,
            onFormSubmit,
            // uploadCheck,
            handleFileUploaded,
            uploadedData,
            isEditMode,
            uploadCheck
        }
    }
})
</script>
  <style>
  .create-post-page .file-upload-container {
    height: 200px;
    cursor: pointer;
    overflow: hidden;
  }
  .create-post-page .file-upload-container img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .uploaded-area {
    position: relative;
  }
  .uploaded-area:hover h3 {
    display: block;
  }
  .uploaded-area h3 {
    display: none;
    position: absolute;
    color: #999;
    text-align: center;
    width: 100%;
    top: 50%;
  }
  </style>
