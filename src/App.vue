<template>
    <component :is="currentComponent"></component>
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
    settingService
        .public([
            // 网站用户名
            'user',
            // 后台管理入口
            'adminEntrance',
            // 前台背景图片
            'backgroundImageURL',
            // 网站用户头像
            'avatarImageURL',
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

    // api
    storage.set('api', {
        checkUserURL: 'https://mine.mobingc.ml/user/check',
        uploadImageURL: 'https://mine.mobingc.ml/image/upload',
        publishArticleURL: 'https://mine.mobingc.ml/article/publish',
        listArticleURL: 'https://mine.mobingc.ml/article/list',
        dataArticleURL: 'https://mine.mobingc.ml/article/data',
        deleteArticleURL: 'https://mine.mobingc.ml/article/delete',
        archivesArticleURL: 'https://mine.mobingc.ml/article/archives'
    });

    const mainDir = new URL(window.location.href).searchParams.has(storage.get('adminEntrance')) ? 'admin' : 'home';
    try {
        currentComponent.value = markRaw(await import(`./views/${mainDir}/Main.vue`));
    } catch (error) {
        console.log(error);
        currentComponent.value = markRaw(await import('./views/common/404.vue'));
    }
})();
</script>

<style>
/* element plus 消息对话框图标错位修复 */
.el-message-box__status {
    position: absolute !important;
}

/* element plus 输入框一键清空按钮错位修复 */
.el-input__suffix-inner {
    align-items: center;
    justify-content: center;
}
</style>
