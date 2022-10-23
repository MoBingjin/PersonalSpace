<template>
    <component :is="currentComponent" />
</template>

<script setup>
import { markRaw, ref } from 'vue';
import settingService from '@/api/setting-service.mod.js';
import storage from '@/utils/storage.mod.js';
import '@/style/theme.css';

// 当前子组件
const currentComponent = ref(null);

// 初始化操作
(async () => {
    // 加载设置项
    await settingService
        .public([
            // 网站用户名
            'user',
            // 后台管理入口
            'adminEntrance',
            // 网站用户头像
            'avatarImageURL',
            // 前台背景图片
            'backgroundImageURL',
            // 关于封面
            'aboutCoverImageURL',
            // 文章默认封面
            'defaultCoverImageURL',
            // 404页面图片
            '_404ImageURL',
            // 网页标题
            'title',
            // 分页列表每页显示数据条数
            'pageSize'
        ])
        .then((res) => {
            for (const key in res.data) {
                storage.set(key, res.data[key]);
            }
        });

    const adminEntrance = storage.get('adminEntrance') || 'admin';
    const mainDir = new URL(window.location.href).searchParams.has(adminEntrance) ? 'admin' : 'home';
    try {
        currentComponent.value = markRaw(await import(`./views/${mainDir}/Main.vue`));
    } catch (error) {
        console.log(error);
        currentComponent.value = markRaw(await import('./views/common/404.vue'));
    }
})();
</script>

<style>
/* 修改全局滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-thumb {
    transition: all 0.2s ease-in-out;
    border-radius: 10px;
    background-color: #0003;
}
::-webkit-scrollbar-track {
    border-radius: 10px;
}
</style>
