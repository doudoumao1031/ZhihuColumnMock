<template>
    <div class="file-upload">
        <!-- <button class="btn btn-primary" @click.prevent="triggerUpload">
            <span v-if="fileStatus === 'loading'">正在上传...</span>
            <span v-else-if="fileStatus === 'success'">上传成功</span>
            <span v-else>点击上传</span>
        </button> -->
        <!-- 自定义模板改造 -->
        <div class="file-upload-container" v-bind="$attrs" @click.prevent="triggerUpload">
            <slot name="loading" v-if="fileStatus === 'loading'">
                <button class="btn btn-primary">正在上传...</button>
            </slot>
            <slot name="uploaded" v-else-if="fileStatus === 'success'" :uploadedData="uploadedData">
                <button class="btn btn-primary">上传成功</button>
            </slot>
            <slot name="default" v-else>
                <button class="btn btn-primary">点击上传</button>
            </slot>
        </div>
        <input
            type="file"
            class="file-input d-none"
            ref="fileInput"
            @change="handleFileChange"
        >
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
import axios from 'axios'
type UploadStatus = 'ready'|'loading'|'success'|'error'
type CheckFunction = (file: File) => boolean
export default defineComponent({
    props: {
        action: {
            type: String,
            required: true
        },
        beforeUpload: {
            type: Function as PropType<CheckFunction>
        },
        uploaded: {
            type: Object
        }
    },
    emits: ['file-uploaded', 'file-uploaded-error'],
    setup (props, context) {
        const fileInput = ref<null | HTMLInputElement>(null)
        const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
        const uploadedData = ref(props.uploaded)
        watch(() => props.uploaded, (newValue) => {
            if (newValue) {
                fileStatus.value = 'success'
                uploadedData.value = newValue
            }
        })
        const triggerUpload = () => {
            if (fileInput.value) {
                fileInput.value.click()
            }
        }
        const handleFileChange = (e:Event) => {
            const currentTarget = e.target as HTMLInputElement
            if (currentTarget.files) {
                const files = Array.from(currentTarget.files) // 类数组对象转数组
                if (props.beforeUpload) {
                    const result = props.beforeUpload(files[0])
                    if (!result) {
                        return
                    }
                }
                fileStatus.value = 'loading'
                const formData = new FormData()
                formData.append('file', files[0]) // 只上传一个
                axios.post(props.action, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(resp => {
                    fileStatus.value = 'success'
                    uploadedData.value = resp.data
                    context.emit('file-uploaded', resp.data)
                }).catch((error) => {
                    fileStatus.value = 'error'
                    context.emit('file-uploaded-error', error)
                }).finally(() => {
                    if (fileInput.value) {
                        fileInput.value.value = ''
                    }
                })
            }
        }
        return {
            fileInput,
            triggerUpload,
            fileStatus,
            handleFileChange,
            uploadedData
        }
    }
})
</script>
<style>

</style>
