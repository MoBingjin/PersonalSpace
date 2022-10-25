// 标签式引入组件
const tagComponents = {
    // Vue3
    vue: {
        js: ['https://cdn.staticfile.org/vue/3.2.37/vue.global.min.js']
    },

    // Vue3 SFC 加载器
    vue3SfcLoader: {
        js: ['https://npm.elemecdn.com/vue3-sfc-loader@0.8.4/dist/vue3-sfc-loader.js']
    },

    // Vue路由
    vueRouter: {
        js: ['https://cdn.staticfile.org/vue-router/4.0.16/vue-router.global.min.js']
    },

    // ElementPlus组件库
    elementPlus: {
        js: [
            'https://cdn.staticfile.org/element-plus/2.2.18/index.full.min.js',
            // 语言包
            'https://cdn.staticfile.org/element-plus/2.2.18/locale/zh-cn.min.js',
            // 图标
            'https://cdn.staticfile.org/element-plus-icons-vue/2.0.10/index.iife.min.js'
        ],
        css: ['https://cdn.staticfile.org/element-plus/2.2.18/index.css']
    },

    // Normalize 样式重置
    normalize: {
        css: ['https://cdn.staticfile.org/normalize/8.0.1/normalize.min.css']
    },

    // 动画库
    animate: {
        css: ['https://cdn.staticfile.org/animate.css/4.1.1/animate.min.css']
    }
};

// ESM式引入组件（组件文件名必须加后缀）
const esmComponents = {
    // Axios 网络请求库
    'axios.js': 'https://cdn.staticfile.org/axios/0.27.2/axios.min.js',

    // Lodash JS库
    'lodash.js': 'https://cdn.staticfile.org/lodash.js/4.17.21/lodash.min.js',

    // MdEditor富文本插件
    'md-editor-v3.js': 'https://npm.elemecdn.com/md-editor-v3@2.3.0/lib/md-editor-v3.umd.js',
    'md-editor-v3/lib/style.css': 'https://npm.elemecdn.com/md-editor-v3@2.3.0/lib/style.css'
};

// 基础路径信息
const rootPath = new URL(window.location.href).pathname;
window['BasePath'] = {
    // 根路径
    rootPath,

    // static路径
    staticPath: rootPath === '/' ? '/public' : `${rootPath}/public`,

    // src路径（@）
    srcPath: rootPath === '/' ? '/src' : `${rootPath}/src`,

    /**
     * 获取实际路径
     *
     * @param {string} path 自定义路径
     * @returns 实际路径
     */
    getActualPath: (path) => {
        path = esmComponents[path] || path;
        if (path.startsWith('static/')) {
            path = window['BasePath'].staticPath + path.substring(6);
        } else if (path.startsWith('@/')) {
            path = window['BasePath'].srcPath + path.substring(1);
        }
        return path;
    }
};

// 导入组件
const head = document.getElementsByTagName('head')[0];
for (const componentName in tagComponents) {
    const component = tagComponents[componentName];
    // 导入js
    const componentJS = component['js'];
    if (componentJS) {
        for (const url of componentJS) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = false;
            script.src = url;
            head.appendChild(script);
        }
    }
    // 导入css
    const componentCSS = component['css'];
    if (componentCSS) {
        for (const url of componentCSS) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            head.appendChild(link);
        }
    }
}

// 加载入口文件
const body = document.getElementsByTagName('body')[0];
const script = document.createElement('script');
script.async = false;
script.src = './src/main.js';
body.appendChild(script);

// 全局拦截img标签请求
const imageNativeSet = Object.getOwnPropertyDescriptor(Image.prototype, 'src').set;
Object.defineProperty(Image.prototype, 'src', {
    set: async function (url) {
        try {
            const pathname = new URL(url).pathname;
            if (pathname.startsWith('/image/download/')) {
                // 提前缓存图片，防止跳转跨域报错
                await fetch(url, { mode: 'no-cors' });
            }
        } catch (error) {}
        imageNativeSet.call(this, url);
    }
});
