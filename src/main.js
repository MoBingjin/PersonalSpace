;
document.querySelector("#app").innerHTML = `
    <app></app>
`;

// 解析配置
const configRes = await fetch("./src/config.json");
window['MoConfig'] = await configRes.json();

// vue3-sfc-loader参数
const options = {
    moduleCache: {
        vue: Vue
    },
    async getFile(url) {
        url = url[0] === '@' ? window['MoConfig'].url[url] : url;
        const res = await fetch(url);
        if (!res.ok)
            throw Object.assign(new Error(res.statusText + ' ' + url), { res });
        return {
            getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
        }
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
        }
    }
};

const { loadModule } = window['vue3-sfc-loader'];

const mainDir = new URL(window.location.href).searchParams.has(window['MoConfig'].params.adminEntrance) ? 'admin' : 'home';
const mainPath = `./src/${mainDir}/App.vue`;

const vm = Vue.createApp({
    components: {
        'app': Vue.defineAsyncComponent(() => loadModule(mainPath, options))
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
