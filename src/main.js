import { esmComponents } from '../import.mod.js';

const Vue = window['Vue'];
const VueRouter = window['VueRouter'];
const ElementPlus = window['ElementPlus'];
const ElementPlusIconsVue = window['ElementPlusIconsVue'];
const ElementPlusLocaleZhCn = window['ElementPlusLocaleZhCn'];
const { loadModule } = window['vue3-sfc-loader'];

// 获取实际路径函数
const getActualPath = ((pathname) => {
    pathname = pathname.endsWith('index.html') ? pathname.substring(0, pathname.length - 10) : pathname;
    const rootPath = pathname.endsWith('/') ? pathname.substring(0, pathname.length - 1) : pathname;
    const isDev = new URL(import.meta.url).pathname.endsWith('main.js');
    const staticPath = isDev ? `${rootPath}/public` : rootPath;
    return (path) => {
        path = esmComponents[path] || path;
        if (path.startsWith('static/')) {
            path = staticPath + path.substring(6);
        } else if (path.startsWith('@/')) {
            path = '/src' + path.substring(1);
        } else if (path === 'root') {
            path = isDev ? `${rootPath}/index.html` : `${staticPath}/index.html`;
        }
        return path;
    };
})(new URL(window.location.href).pathname);

// 获取动态组件函数
const getAsyncComponent = (path) => {
    return loadModule(path, {
        // 模块缓存（定义后可以通过 import ... from [模块名] 方式导入）
        moduleCache: {
            vue: Vue,
            'vue-router': VueRouter,
            'element-plus': ElementPlus,
            '@element-plus/icons-vue': ElementPlusIconsVue
        },
        // 远程获取文件
        async getFile(url) {
            let res = await fetch(getActualPath(url));
            if (!res.ok) {
                throw Object.assign(new Error(res.statusText + ' ' + url), { res });
            }
            // 修改md-editor-v3内部cdn地址
            if (url === 'md-editor-v3.js') {
                res = new Response((await res.text()).replace('cdnjs.cloudflare.com/ajax/libs', 'cdn.staticfile.org'));
            }
            const getContentData = (asBinary) => (asBinary ? res.arrayBuffer() : res.text());
            return url.endsWith('.mod.js') ? { getContentData, type: '.mjs' } : { getContentData };
        },
        // 添加样式
        addStyle(textContent) {
            const style = Object.assign(document.createElement('style'), { textContent });
            const ref = document.head.getElementsByTagName('style')[0] || null;
            document.head.insertBefore(style, ref);
        },
        // 远程获取事件
        handleModule: async function (type, getContentData, path, options) {
            switch (type) {
                // 获取样式文件处理
                case '.css':
                    options.addStyle(await getContentData(false));
                    return null;
                // json文件处理
                case '.json':
                    return JSON.parse(await getContentData(false));
                // 获取图片文件处理
                case '.png':
                case '.jpg':
                case '.jpeg':
                case '.gif':
                    return path;
            }
        }
    });
};

// 创建一个Vue实例
const vm = Vue.createApp({
    components: {
        app: Vue.defineAsyncComponent(() => getAsyncComponent(getActualPath('@/App.vue')))
    },
    template: '<app></app>'
});

vm.use(ElementPlus, {
    locale: ElementPlusLocaleZhCn
});

// 获取实际路径函数全局挂载
vm.config.globalProperties.$getActualPath = getActualPath;
// 获取动态组件函数全局挂载
vm.config.globalProperties.$getAsyncComponent = getAsyncComponent;

vm.mount('#app');
