import appConfig from './app.config.mod.js';

// 根路径
const rootPath = new URL(window.location.href).pathname;
// static路径
const staticPath = rootPath === '/' ? '/public' : `${rootPath}/public`;
// src路径（@）
const srcPath = rootPath === '/' ? '/src' : `${rootPath}/src`;

// 获取实际路径函数
const getActualPath = (path) => {
    if (path.startsWith('static/')) {
        path = staticPath + path.substring(6);
    } else if (path.startsWith('@/')) {
        path = srcPath + path.substring(1);
    }
    return path;
}

// vue3-sfc-loader参数
const options = {
    moduleCache: {
        'vue': window['Vue'],
        'vue-router': window['VueRouter'],
        'element-plus': window['ElementPlus'],
        'axios': window['axios'],
        'local-storage': window['localStorage'],
        'app-config': appConfig
    },
    async getFile(url) {
        url = getActualPath(url);
        url = appConfig.url[url] || url;
        const res = await fetch(url);
        if (!res.ok) {
            throw Object.assign(new Error(res.statusText + ' ' + url), { res });
        }
        const getContentData = asBinary => asBinary ? res.arrayBuffer() : res.text();
        return url.endsWith('.mod.js') ? { getContentData, type: '.mjs' } : { getContentData };
    },
    addStyle(textContent) {
        const style = Object.assign(document.createElement('style'), { textContent });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },
    handleModule: async function (type, getContentData, path, options) {
        switch (type) {
            case '.css':
                options.addStyle(await getContentData(false));
                return null;
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
                return path;
        }
    }
};

const { loadModule } = window['vue3-sfc-loader'];

const vm = window['Vue'].createApp({
    components: {
        'app': window['Vue'].defineAsyncComponent(() => loadModule(`${rootPath}src/App.vue`, options))
    },
    template: '<app></app>'
});

vm.use(window['ElementPlus']);
vm.use(window['eIconPicker'], {
    FontAwesome: true,
    ElementUI: true,
    eIcon: true,
    eIconSymbol: true,
    addIconList: [],
    removeIconList: [],
    zIndex: 3100
});

vm.mount('#app');

// axios 配置
const axiosInstance = window['axios'].create({
    baseURL: appConfig.params.baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});
// 添加请求拦截器，配置登录认证token
axiosInstance.interceptors.request.use(config => {
    if (localStorage.getItem('token')) {
        config.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 配置axios的全局引用
vm.config.globalProperties.$getActualPath = getActualPath;
vm.config.globalProperties.$axiosInstance = axiosInstance;
