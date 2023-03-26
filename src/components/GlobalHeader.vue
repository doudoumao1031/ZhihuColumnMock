<template>
    <nav class="navbar navbar-dark bg-primary mb-4">
        <div class="container-fluid">
            <a href="#" class="navbar-brand">豆豆猫专栏</a>
            <ul v-if="!user.isLogin" class="list-inline mb-0">
                <li class="list-inline-item"><router-link class="btn btn-outline-light" :to="{name: 'login'}">登陆</router-link></li>
                <li class="list-inline-item"><router-link class="btn btn-outline-light" :to="{name: 'signup'}">注册</router-link></li>
            </ul>
            <ul v-else class="list-inline mb-0">
                <!-- <li class="list-inline-item"><a href="#" class="btn btn-outline-light">你好！{{user.name}}</a></li> -->
                <dropdown :title="`你好!${user.name}`">
                    <dropdown-item><router-link class="dropdown-item" :to="{name: 'createpost'}">新建文章</router-link></dropdown-item>
                    <dropdown-item disabled><a href="#" class="dropdown-item">编辑资料</a></dropdown-item>
                    <dropdown-item><a href="#" class="dropdown-item">退出登录</a></dropdown-item>
                </dropdown>
            </ul>
        </div>
    </nav>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import { UserProps } from '../store'
export default defineComponent({
    name: 'GlobalHeader',
    components: {
        Dropdown,
        DropdownItem
    },
    props: {
        user: {
            type: Object as PropType<UserProps>,
            required: true
        }
    }
})
</script>
