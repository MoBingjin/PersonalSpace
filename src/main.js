;
if (window['Vue'] === undefined
    || window['vue3-sfc-loader'] === undefined
    || window['ElementPlus'] === undefined
    || window['eIconPicker'] === undefined
    || window['MoAlasqlBuffer'] === undefined
    || window['MoFileSystem'] === undefined) {
    window.location.reload();
}

document.querySelector("#app").innerHTML = `
    <app></app>
`;

const appName = 'PersonalSpace';

const options = {
    moduleCache: {
        vue: Vue
    },
    async getFile(url) {
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
    }
};

const { loadModule } = window['vue3-sfc-loader'];

const mainPath = window.location.pathname.split('/')[1] === appName ? `/${appName}/src/App.vue` : '/src/App.vue';

const vm = Vue.createApp({
    components: {
        'app': Vue.defineAsyncComponent(() => loadModule(mainPath, options))
    }
});

vm.use(ElementPlus);
vm.use(eIconPicker, {
    FontAwesome: true,
    ElementUI: true,
    eIcon: true,
    eIconSymbol: true,
    addIconList: [],
    removeIconList: [],
    zIndex: 3100
});

vm.mount('#app');
