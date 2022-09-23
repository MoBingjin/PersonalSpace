;
document.querySelector('#app').innerHTML = `
    <app></app>
`;

// 根路径
const rootPath = '/';

// 解析配置
const configRes = await fetch(`${rootPath}src/config.json`);
window['MoConfig'] = await configRes.json();
window['MoConfig'].params.rootPath = rootPath;

// vue3-sfc-loader参数
const options = {
    moduleCache: {
        'vue': window['Vue'],
        'vue-router': window["VueRouter"],
        'element-plus': window['ElementPlus'],
        'local-storage': window['localStorage'],
        'mo-config': window['MoConfig']
    },
    async getFile(url) {
        url = window['MoConfig'].url[url] || url;
        const res = await fetch(url);
        if (!res.ok) {
            throw Object.assign(new Error(res.statusText + ' ' + url), { res });
        }
        return { getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text() };
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
    }
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
    baseURL: window['MoConfig'].params.baseURL,
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
vm.config.globalProperties.$axiosInstance = axiosInstance;
