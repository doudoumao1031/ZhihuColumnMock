<template>
    <div class="login-page mx-auto p-3 w-330">
        <!-- <column-list :list="list"></column-list> -->
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">电子邮件</label>
                <validate-input type="text" placeholder="请输入邮箱地址 123@qq.com" v-model="emailVal" :rules="emailRules" ref="inputRef"></validate-input>
                <validate-input type="password" placeholder="请输入密码 123" v-model="passwordVal" :rules="passwordRules"></validate-input>
                <!-- {{emailVal}} -->
            </div>
            <template #submit>
                <span class="btn btn-danger">Submit</span>
            </template>
        </validate-form>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
    name: 'LoginView',
    components: {
        ValidateInput,
        ValidateForm
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
        const store = useStore()
        const inputRef = ref<any>()
        const router = useRouter()
        const emailVal = ref('')
        const emailRules: RulesProp = [
            { type: 'required', message: '电子邮件不能为空' },
            { type: 'email', message: '请输入正确的电子邮件格式' }
        ]
        const passwordVal = ref('')
        const passwordRules: RulesProp = [
            { type: 'required', message: '密码不能为空' }
        ]
        const onFormSubmit = (result: boolean) => {
            // console.log(inputRef.value.validateInput()) // 调用子组件方法
            // console.log(context, context)
            // console.log('onFormSubmit', result)
            // context.contextShow()
            if (result) {
                // router.push({ name: 'column', params: { id: 1 } })
                const payload = {
                    email: emailVal.value,
                    password: passwordVal.value
                }
                store.dispatch('loginAndFetch', payload).then(data => {
                    // console.log(data)
                    createMessage('登陆成功，两秒后跳转首页', 'success')
                    setTimeout(() => {
                        router.push({ name: 'home' })
                    }, 2000)
                    // router.push({ name: 'home' })
                }).catch((e) => { console.log(e) })
            }
        }
        return {
            emailRules,
            emailVal,
            passwordRules,
            passwordVal,
            onFormSubmit,
            inputRef
        }
    }

})
</script>
