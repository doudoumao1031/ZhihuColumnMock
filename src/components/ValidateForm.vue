<template>
    <form class="validate-form-container">
        <slot name="default"></slot>
        <div class="submit-area" @click.prevent="submitForm">
            <slot name="submit">
                <button type="submit" class="btn btn-primary">提交</button>
            </slot>
        </div>
    </form>
</template>
<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt, { Handler } from 'mitt'

type ValidateFunc = () => boolean
// type Events = {
//   formItemCreated: string;
//   bar?: number;
// };
export const emitter = mitt()

export default defineComponent({
    emits: ['form-submit'],
    setup (props, context) {
        let funcArr: ValidateFunc[] = []
        const submitForm = () => {
            // const result = funcArr.every(func => func()) //Array.every 返回false会提前终止循环
            const result = funcArr.map(func => func()).every(result => result)
            context.emit('form-submit', result)
        }
        const callback = (func: ValidateFunc) => {
            funcArr.push(func)
        }
        // emitter.on('foo', (e) => { console.log(e) })
        emitter.on('formItemCreated', callback as Handler) // 报错不匹配
        onUnmounted(() => {
            // emitter.off('foo', (e) => { console.log(e) })
            emitter.off('formItemCreated', callback as Handler)
            funcArr = []
        })
        return {
            submitForm
        }
    }
    // mounted() {
    //     this.$on('item-created', ()=>{

    //     })
    // },
})
</script>
