<template>
    <div>
        {{route}}
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
    setup () {
        const route = useRoute()

        // const list = ref<ColumnProps[]>([
        //     {
        //         id: 1,
        //         title: 'PPT实验小学',
        //         avatar: 'https://pica.zhimg.com/v2-3c98b959c2582947850cd69f144d3f03_l.jpg?source=d16d100b',
        //         description: '各种稀奇古怪的装逼技能，或许你可以试试~'
        //     }
        // ])
        return {
            route
        }
    }
})
</script>
