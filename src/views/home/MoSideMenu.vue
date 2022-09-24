<template>
    <div class="mo-side">
        <span>{{ logo }}</span>
        <span>
            <el-menu :ellipsis="false" :router="true">
                <el-menu-item v-for="item in menus" :index="item.index" @click="closeSideMenu">
                    <e-icon :icon-name="item.icon" />
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </el-menu>
        </span>
    </div>
</template>

<script setup>

import { reactive } from 'vue';
import appConfig from 'app-config';


// 回调对象
const emits = defineEmits(['close-side-menu']);


// logo
const logo = appConfig.title['home'];
// 菜单项
const menus = reactive([
    {
        index: '/home',
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


/**
 * 关闭侧边栏
 */
const closeSideMenu = () => emits('close-side-menu', {});

</script>

<style scoped>
.mo-side {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.mo-side>span:first-child {
    font-family: 'HYWenHei-85W', 'Merriweather Sans', Helvetica, Tahoma, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', 'WenQuanYi Micro Hei', 'sans-serif';
    color: #464646;
    font-size: 28px;
    font-weight: 800;
    padding-top: 200px;
    padding-bottom: 50px;
}

.el-menu {
    --el-font-size-base: 16px;
    --el-menu-bg-color: #ffffff00;
    --el-menu-text-color: #666666;
    --el-menu-hover-text-color: #666666;
    --el-menu-active-color: #ffd04b;
    --el-color-primary-light-9: #ffffff00;
    border-right: none;
    user-select: none;
}
</style>