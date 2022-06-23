<template>
    <div class="mo-head">
        <span @click="goHome">{{ logo }}</span>
        <span>
            <el-menu default-active="/home" mode="horizontal" :ellipsis="false" :router="true">
                <el-menu-item index="/home">
                    <e-icon icon-name="el-icon-s-home" />
                    <span>首页</span>
                </el-menu-item>
                <el-menu-item index="/archives">
                    <e-icon icon-name="el-icon-s-cooperation" />
                    <span>归档</span>
                </el-menu-item>
                <el-menu-item index="/about">
                    <e-icon icon-name="el-icon-info" />
                    <span>关于</span>
                </el-menu-item>
            </el-menu>
        </span>
    </div>
</template>

<script setup>

const { ref } = window["Vue"];


// logo
const logo = ref(window["MoConfig"].params.title["home"]);


/**
 * 回到主页
 */
const goHome = () => window.location.href = "/";

</script>

<style scoped>
.mo-head {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.mo-head>span:first-child {
    font-family: 'HYWenHei-85W', 'Merriweather Sans', Helvetica, Tahoma, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', 'WenQuanYi Micro Hei', 'sans-serif';
    color: #464646;
    font-size: 28px;
    font-weight: 800;
    margin-left: 10px;
    padding: 5px;
}

.mo-head>span:first-child:hover {
    color: #ffd04b;
    cursor: pointer;
    user-select: none;
}

.mo-head>span:last-child {
    margin-right: 30px;
}

.el-menu {
    --el-font-size-base: 16px;
    --el-menu-background-color: #ffffff00;
    --el-menu-text-color: #666666;
    --el-menu-hover-text-color: #666666;
    --el-menu-active-color: #ffd04b;
    --el-color-primary-light-9: #ffffff00;
    border-bottom: none;
    user-select: none;
}

.el-menu>.el-menu-item:hover {
    background-color: #dddddd88;
}
</style>