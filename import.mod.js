/**
 * 加载组件配置
 */

// 标签式引入组件
const tagComponents = {
    // Vue3
    vue: {
        js: ['https://cdn.staticfile.org/vue/3.2.37/vue.global.js']
    },

    // Vue3 SFC 加载器
    vue3SfcLoader: {
        js: ['https://npm.elemecdn.com/vue3-sfc-loader@0.8.4/dist/vue3-sfc-loader.js']
    },

    // Vue路由
    vueRouter: {
        js: ['https://cdn.staticfile.org/vue-router/4.0.16/vue-router.global.js']
    },

    // ElementPlus组件库
    elementPlus: {
        js: [
            'https://cdn.staticfile.org/element-plus/2.2.18/index.full.js',
            // 图标
            'https://cdn.staticfile.org/element-plus-icons-vue/2.0.10/index.iife.min.js',
            // 语言包
            'https://cdn.staticfile.org/element-plus/2.2.18/locale/zh-cn.js'
        ],
        css: ['https://cdn.staticfile.org/element-plus/2.2.18/index.css']
    },

    // Normalize 样式重置
    normalize: {
        css: ['https://cdn.staticfile.org/normalize/8.0.1/normalize.css']
    },

    // 动画库
    animate: {
        css: ['https://cdn.staticfile.org/animate.css/4.1.1/animate.css']
    }
};

// ESM式引入组件（组件文件名必须加后缀）
const esmComponents = {
    // Axios 网络请求库
    'axios.js': 'https://cdn.staticfile.org/axios/0.27.2/axios.min.js',

    // Lodash JS库
    'lodash.js': 'https://cdn.staticfile.org/lodash.js/4.17.21/lodash.js',

    // MdEditor富文本插件
    'md-editor-v3.js': 'https://npm.elemecdn.com/md-editor-v3@2.1.2/lib/md-editor-v3.umd.js',
    'md-editor-v3.css': 'https://npm.elemecdn.com/md-editor-v3@2.1.2/lib/style.css'
};

export { tagComponents, esmComponents };
