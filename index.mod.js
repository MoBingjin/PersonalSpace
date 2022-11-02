import { tagComponents } from './import.mod.js';

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
script.type = 'module';
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
