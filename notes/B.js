const count = {
    num: 3
}

function change () {
    count.num++ // 变量count + 1
    console.log('原count值为：', count) // 打印B.js模块中count的值
}
function addProp () {
    count.b = 'b'
}

module.exports = {
    count,
    change
}
