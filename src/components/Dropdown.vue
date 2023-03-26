<template>
    <div class="dropdown" ref="dropdownRef">
        <a href="#" class="btn btn-outline-light dropdown-toggle" @click.prevent="toggleOpen">{{title}}</a>
        <!-- <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</a> -->
        <ul class="dropdown-menu" :style="{display:'block'}" v-if="isOpen">
            <slot></slot>
        </ul>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'
export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Dropdown',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    setup () {
        const isOpen = ref(false)
        const dropdownRef = ref<null | HTMLElement>(null)
        const isClickOutside = useClickOutside(dropdownRef)
        const toggleOpen = () => {
            isOpen.value = !isOpen.value
        }
        // isOpen.value = !isClickOutside.value    // 这段逻辑只能执行一次 监测变化用watch
        watch(isClickOutside, () => {
            if (isOpen.value && isClickOutside.value) {
                isOpen.value = false
            }
        })
        return {
            isOpen,
            toggleOpen,
            dropdownRef
        }
    }
})
</script>
