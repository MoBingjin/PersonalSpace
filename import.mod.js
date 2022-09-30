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
        js: ['https://cdn.staticfile.org/element-plus/2.0.1/index.full.js'],
        css: ['https://cdn.staticfile.org/element-plus/2.0.1/index.css']
    },

    // EIconPicker图标组件库
    eIconPicker: {
        js: [
            'https://npm.elemecdn.com/e-icon-picker@2.0.7/lib/index.umd.prod.js',
            'https://npm.elemecdn.com/e-icon-picker@2.0.7/lib/symbol.js'
        ],
        css: [
            // EIconPicker图标样式
            'https://npm.elemecdn.com/e-icon-picker@2.0.7/lib/index.css',
            // FontAwesome图标样式
            'https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.min.css',
            // ElementPlus图标样式
            'https://cdn.staticfile.org/element-plus/1.0.2-beta.42/theme-chalk/el-icon.css'
        ]
    },

    // Normalize 样式重置
    normalize: {
        css: ['https://cdn.staticfile.org/normalize/8.0.1/normalize.css']
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
