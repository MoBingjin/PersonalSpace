<template>
    <component :is="currentComponent" @change-page="changePage"></component>
</template>

<script setup>
import { markRaw, ref } from 'vue';
import appConfig from '@/app.config.mod.js';
import storage from '@/utils/storage.mod.js';

// 当前子组件
const currentComponent = ref(null);

/**
 * 修改页面
 *
 * @param {any} data
 */
const changePage = (data) =>
    import(`./${data['componentName']}.vue`).then((component) => (currentComponent.value = markRaw(component)));

// 初始化操作
(() => {
    window['document'].getElementsByTagName('title')[0].innerHTML = appConfig.title['admin'];
    changePage({ componentName: 'MoPanel' });
    // const token = storage.get('token');
    // if (token) {
    //   fetch(appConfig.api.checkUserURL, {
    //     method: 'post',
    //     body: JSON.stringify({ token })
    //   })
    //     .then(res => res.json())
    //     .then(data => {
    //       if (data.code === 0) {
    //         changePage({ componentName: 'mo-panel' });
    //       } else {
    //         storage.remove('token');
    //         changePage({ componentName: 'mo-login' });
    //       }
    //     })
    //     .catch(() => changePage({ componentName: '../common/componets/404' }));
    // } else {
    //   changePage({ componentName: 'mo-login' });
    // }
})();
</script>
