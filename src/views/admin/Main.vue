<template>
    <component :is="currentComponent" @change-page="changePage" />
</template>

<script setup>
import { markRaw, ref } from 'vue';
import service from '@/utils/request.mod.js';
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
    document.getElementsByTagName('title')[0].innerHTML = storage.getObject('title')['admin'];
    const token = storage.get('token');
    if (token) {
        fetch(service.defaults.baseURL, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then((response) => {
                if (response.status === 401) {
                    storage.remove('token');
                    changePage({ componentName: 'MoLogin' });
                } else {
                    changePage({ componentName: 'MoPanel' });
                }
            })
            .catch(() => changePage({ componentName: '@/views/common/404.vue' }));
    } else {
        changePage({ componentName: 'MoLogin' });
    }
})();
</script>
