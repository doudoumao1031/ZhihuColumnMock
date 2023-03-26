const count = require('./B.js').count
const change = require('./B.js').change
count.a = 'a'

console.log('改变前：', count)
change() // 调用模块B.js中的change方法，将原来的count + 1
console.log('改变后：', count)
