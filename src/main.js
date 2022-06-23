;
document.querySelector('#app').innerHTML = `
    <app></app>
`;

// 根路径
const rootPath = "/";

// 解析配置
const configRes = await fetch(`${rootPath}src/config.json`);
window['MoConfig'] = await configRes.json();
window['MoConfig'].params.rootPath = rootPath;

// vue3-sfc-loader参数
const options = {
    moduleCache: {
        vue: window['Vue']
    },
    async getFile(url) {
        url = url.startsWith('@') ? window['MoConfig'].url[url] : url;
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
