import { tagComponents, esmComponents } from './import.mod.js';

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
script.type = 'module';
script.async = false;
script.src = './src/main.js';
body.appendChild(script);

// 全局拦截img标签请求
// const imageNativeSet = Object.getOwnPropertyDescriptor(Image.prototype, 'src').set;
// Object.defineProperty(Image.prototype, 'src', {
//     set: async function (url) {
//         const pathname = new URL(url).pathname;
//         // 设置图片地址为解析后的地址
//         if (pathname.startsWith('/image/download/')) {
//             const res = await fetch(url).then((response) => response.json());
//             if (res.code === 0) {
//                 url = res.data.downloadURL;
//                 await fetch(url, { mode: 'no-cors' });
//             }
//         }
//         imageNativeSet.call(this, url);
//     }
// });
