# 基础

# 创建一个 Vue 应用

## 应用配置

应用实例会暴露一个 .config 对象允许我们配置一些应用级的选项，例如定义一个应用级的错误处理器，它将捕获所有由子组件上抛而未被处理的错误：
```
app.config.errorHandler = (err) => {
  /* 处理错误 */
}
```
应用实例还提供了一些方法来注册应用范围内可用的资源，例如注册一个组件：
```
app.component('TodoDeleteButton', TodoDeleteButton)
```
没有显式包含在列表中的全局对象将不能在模板内表达式中访问，例如用户附加在 window 上的属性。然而，你也可以自行在 app.config.globalProperties 上显式地添加它们，供所有的 Vue 表达式使用。
```
app.config.globalProperties.msg = 'hello'
```

# 模板语法

## v-html

内容将会被替换为 v-html 属性的值，插值为纯 HTML——数据绑定将会被忽略。动态渲染任意 HTML 是非常危险的，因为这非常容易造成 XSS 漏洞。确保安全使用

## 布尔型 Attribute

```
<button :disabled="isButtonDisabled">Button</button>
```

## 动态绑定多个值

```
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
<div v-bind="objectOfAttrs"></div>
```

## 使用 JavaScript 表达式

在 Vue 模板内，JavaScript 表达式可以被使用在如下场景上：

在文本插值中 (双大括号)

在任何 Vue 指令 (以 v- 开头的特殊 attribute) attribute 的值中
```
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```
绑定在表达式中的方法在组件每次更新时都会被重新调用，因此不应该产生任何副作用，比如改变数据或触发异步操作。

## 指令 Directives

指令 attribute 的期望值为一个 JavaScript 表达式 (除了少数几个例外，即v-for、v-on 和 v-slot)。一个指令的任务是在其表达式的值变化时响应式地更新 DOM。

## 动态参数

同样在指令参数上也可以使用一个 JavaScript 表达式，需要包含在一对方括号内：
动态参数中表达式的值应当是一个字符串，或者是 null。特殊值 null 意为显式移除该绑定。其他非字符串的值会触发警告。

```
<!--
注意，参数表达式有一些约束，
参见下面“动态参数值的限制”与“动态参数语法的限制”章节的解释
-->
<a v-bind:[attributeName]="url"> ... </a>

<!-- 简写 -->
<a :[attributeName]="url"> ... </a>
```

一个函数绑定到动态的事件名称上：
```
<a v-on:[eventName]="doSomething"> ... </a>

<!-- 简写 -->
<a @[eventName]="doSomething">

```
限制：
空格和引号，在 HTML attribute 名称中都是不合法的

当使用 DOM 内嵌模板 (直接写在 HTML 文件里的模板) 时，我们需要避免在名称中使用大写字母，因为浏览器会强制将其转换为小写，然后识别不出来（vue模板可以用）

# 响应式基础

## 声明响应式状态

Vue 在组件实例上暴露的内置 API 使用 $ 作为前缀。它同时也为内部属性保留 _ 前缀。因此，你应该避免在顶层 data 上使用任何以这些字符作前缀的属性。

在 Vue 3 中，数据是基于 JavaScript Proxy（代理） 实现响应式的。

```
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```
当你在赋值后再访问 this.someObject，此值已经是原来的 newObject 的一个响应式代理。与 Vue 2 不同的是，这里原始的 newObject 不会变为响应式：请确保始终通过 this 来访问响应式状态。

## 声明方法

别用箭头函数，不然会丢失this

## 更新时机

DOM更新非同步
若要等待一个状态改变后的 DOM 更新完成，你可以使用 nextTick() 这个全局 API：
```
import { nextTick } from 'vue'

export default {
  methods: {
    increment() {
      this.count++
      nextTick(() => {
        // 访问更新后的 DOM
      })
    }
  }
}
```

## 深层响应性
```
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // 以下都会按照期望工作
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

## 有状态方法
```
export default {
  created() {
    // 每个实例都有了自己的预置防抖的处理函数
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // 最好是在组件卸载时
    // 清除掉防抖计时器
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... 对点击的响应 ...
    }
  }
}
```

# 计算属性
https://cn.vuejs.org/guide/essentials/computed.html


