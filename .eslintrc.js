module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        // “off” 或 0 - 关闭规则
        // “warn” 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
        // “error” 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-multi-empty-lines': 'off', // 禁用连续空行
        indent: [2, 4], // 缩进2个空格
        semi: [2, 'never'], // 要求或禁止使用分号代替 ASI,即禁用行尾使用分号
        quotes: [2, 'single'], // 使用单引号
        'no-mixed-spaces-and-tabs': [2], // 禁止空格和 tab 的混合缩进
        'no-extra-semi': [2], // 禁止不必要的分号
        'comma-dangle': [2, 'never'], // 禁止末尾逗号
        // 'comma-dangle': [2, 'always'] // 禁止末尾逗号
        // 'vue/multi-word-component-names': ['error', {
        //     ignores: ['Home', 'Login']
        // }]
        'vue/multi-word-component-names': 0
    }
}
