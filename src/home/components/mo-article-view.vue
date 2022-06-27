<template>
    <div>
        <div class="mo-cover">
            <div v-if="articleData.title">
                <div class="mo-article-title">{{ articleData.title }}</div>
                <div class="mo-info">
                    <span><a href="/"><img class="mo-avatar" :src="avatarPath" alt="头像" /></a></span>
                    <span>{{ user }}</span>
                    <span>·</span>
                    <span>{{ formatDate(articleData.createTime) }}</span>
                </div>
            </div>
        </div>
        <div class="mo-content">
            <div>
                <md-editor-v3 v-model="articleData.content" :previewOnly="true" style="height: 100%">
                </md-editor-v3>
            </div>
        </div>
        <el-backtop :right="100" :bottom="100" style="width: 50px; height: 50px;" />
    </div>
</template>

<script setup>

import MdEditorV3 from "@md-editor-v3.js";
import "@md-editor-v3.css";
import { formatDate } from "../../common/js/utils.js";
const { ref } = window["Vue"];
const { useRoute } = window["VueRouter"];
const { dataArticleURL } = window["MoConfig"].api;
const { avatarImageURL, defaultCoverImageURL, rootPath, user } = window["MoConfig"].params;


// 跳转路由对象
const route = useRoute();


// 头像路径
const avatarPath = avatarImageURL || `${rootPath}src/home/picture/avatar.png`;
// 文章数据
const articleData = ref({});


/**
 * 获取文章数据
 * 
 * @param {string} articleId 文章ID
 */
const dataArticle = articleId => {
    fetch(dataArticleURL, {
        method: "post",
        body: JSON.stringify({ articleId })
    })
        .then(res => res.json())
        .then(data => {
            if (data.code === 0) {
                articleData.value = data.data;
                setCover(data.data["cover"] || defaultCoverImageURL || `${rootPath}src/home/picture/default.png`);
            }
            console.log(data.message);
        })
        .catch(error => {
            console.log(error);
        });
};

/**
 * 设置封面路径
 * 
 * @param {string} coverPath 封面路径
 */
const setCover = coverPath => {
    const coverElement = window["document"].getElementsByClassName("mo-cover")[0];
    coverElement.style.background = `url("${coverPath}") no-repeat`;
    coverElement.style.backgroundSize = "cover";
}


// 初始化操作
(() => {
    // 获取文章数据
    dataArticle(route.params.articleId);
})();

</script>

<style>
.el-backtop .el-icon {
    font-size: 20px;
}
</style>
<style scoped>
.mo-cover {
    width: calc(100vw - 17px);
    height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.mo-cover>div {
    width: 60vw;
    height: 100%;
    min-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    font-family: 'HYWenHei-85W', 'Merriweather Sans', Helvetica, Tahoma, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', 'WenQuanYi Micro Hei', 'sans-serif';
    color: #ffffff;
    text-shadow: 2px 2px 10px #000;
}

.mo-article-title {
    font-size: 32px;
    padding-bottom: 50px;
}

.mo-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 12px;
    font-size: 14px;
}

.mo-info>span {
    padding-right: 10px;
}

.mo-info>span:first-child>a {
    cursor: auto;
}

.mo-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #cccccc88;
    cursor: auto;
}

.mo-content {
    width: calc(100vw - 17px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.mo-content>div {
    width: 60vw;
    min-width: 800px;
}
</style>
