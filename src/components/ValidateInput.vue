<template>
    <div v-focus class="validate-input-container pb-3">
        <input type="text"
            v-if="tag!=='textarea'"
            class="form-control"
            :class="{'is-invalid': inputRef.error}"
            :value="modelValue"
            @blur="validateInput"
            @input="updateValue"
            v-bind="$attrs"
        >
        <textarea
            v-else
            class="form-control"
            :class="{'is-invalid': inputRef.error}"
            :value="modelValue"
            @blur="validateInput"
            @input="updateValue"
            v-bind="$attrs"
        >
        </textarea>
        <!-- {{`props.modelValue:${modelValue},props.modelValue:${modelValue}`}} -->
        <div v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, PropType, onMounted } from 'vue'
import { emitter } from './ValidateForm.vue'
const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
interface RuleProp{
    type: 'required' | 'email' | 'custom';
    message: string;
    validator?: ()=>boolean;
}
interface IinputRef{
    // val: string,
    error: boolean,
    message: string
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
    props: {
        rules: Array as PropType<RulesProp>,
        modelValue: String,
        tag: {
            type: String as PropType<TagType>,
            default: 'input'
        }
    },
    inheritAttrs: false,
    directives: {
        focus: {
            mounted: (el:any) => {
                // el.focus()
                console.log('vFocus', el)
                console.log('validate input props')
            }
        }
    },
    setup (props, context) {
        const inputRef:IinputRef = reactive({ // reactive() 也会隐式地从它的参数中推导类型：
            // val: props.modelValue || '',
            // val: props.modelValue as string,
            error: false,
            message: ''
        })
        // console.log('onCreated|inputref:', props.modelValue, 'modelvalue', props.modelValue)
        const updateValue = (e:Event) => {
            const targetValue = (e.target as HTMLInputElement).value
            // props.modelValue = targetValue
            context.emit('update:modelValue', targetValue)
            // console.log('onupdate|inputref:', props.modelValue, 'modelvalue', props.modelValue)
        }
        const validateInput = () => {
            if (props.rules) {
                const allPassed = props.rules.every(rule => {
                    let passed = true
                    // console.log('onValidate|inputref:', props.modelValue, 'modelvalue', props.modelValue) // 经测试reactive中props.modelValue和props.modelValue的响应式绑定没生效
                    inputRef.message = rule.message
                    switch (rule.type) {
                    case 'required':
                        // passed = (props.modelValue.trim() !== '')
                        passed = ((props.modelValue as string).trim() !== '')
                        break
                    case 'email':
                        // passed = emailReg.test(props.modelValue)
                        passed = emailReg.test(props.modelValue as string)
                        break
                    case 'custom':
                        // passed = emailReg.test(props.modelValue)
                        passed = rule.validator ? rule.validator() : true
                        break
                    default:
                        break
                    }
                    return passed
                })
                inputRef.error = !allPassed
                return allPassed
            }
            return true
        }
        onMounted(() => {
            emitter.emit('formItemCreated', validateInput)
            // console.log('onMounted|inputref:', props.modelValue, 'modelvalue', props.modelValue)
        })
        return {
            inputRef,
            validateInput,
            updateValue
        }
    }
})
</script>
