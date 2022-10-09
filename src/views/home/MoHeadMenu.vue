<template>
    <div class="mo-head">
        <span @click="goHome">{{ logo }}</span>
        <span>
            <el-menu :default-active="defaultActive" mode="horizontal" :ellipsis="false" :router="true">
                <el-menu-item v-for="item in menus" :index="item.index">
                    <e-icon :icon-name="item.icon" />
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </el-menu>
        </span>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import storage from '@/utils/storage.mod.js';

// 跳转路由对象
const route = useRoute();

// logo
const logo = storage.getObject('title')['home'];
// 菜单项
const menus = reactive([
    {
        index: '/main',
        icon: 'el-icon-s-home',
        name: '首页'
    },
    {
        index: '/archives',
        icon: 'el-icon-s-cooperation',
        name: '归档'
    },
    {
        index: '/about',
        icon: 'el-icon-info',
        name: '关于'
    }
]);
// 默认激活菜单项
const defaultActive = computed(() => {
    for (let menu of menus) {
        if (menu.index === route.path) {
            return route.path;
        }
    }
    return '/main';
});

/**
 * 回到主页
 */
const goHome = () => (window.location.href = '/');
</script>

<style scoped>
.mo-head {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.mo-head > span:first-child {
    font-family: 'HYWenHei-85W', 'Merriweather Sans', Helvetica, Tahoma, Arial, 'PingFang SC', 'Hiragino Sans GB',
        'Microsoft Yahei', 'WenQuanYi Micro Hei', 'sans-serif';
    color: #464646;
    font-size: 28px;
    font-weight: 800;
    margin-left: 10px;
    padding: 5px;
}

.mo-head > span:first-child:hover {
    color: #ffd04b;
    cursor: pointer;
    user-select: none;
}

.mo-head > span:last-child {
    margin-right: 30px;
}

.el-menu {
    --el-font-size-base: 16px;
    --el-menu-bg-color: #ffffff00;
    --el-menu-text-color: #666666;
    --el-menu-hover-text-color: #666666;
    --el-menu-active-color: #ffd04b;
    --el-color-primary-light-9: #ffffff00;
    border-bottom: none;
    user-select: none;
}

.el-menu > .el-menu-item:hover {
    background-color: #dddddd88;
}
</style>
