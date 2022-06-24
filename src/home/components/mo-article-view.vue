<template>
    <div>
        <div class="mo-cover">
            <div>
                <div class="mo-article-title">{{ articleData.title }}</div>
                <div class="mo-info">
                    <span><a href="/"><img class="mo-avatar" src="../picture/avatar.png" alt="头像" /></a></span>
                    <span>{{ articleData.title ? user : "" }}</span>
                    <span>·</span>
                    <span>{{ articleData.createTime ? formatDate(articleData.createTime, "yyyy-MM-dd") : "" }}</span>
                </div>
            </div>
        </div>
        <div class="mo-content">
            <div>
                <md-editor-v3 v-model="articleData.content" :previewOnly="true" style="height: 100%">
                </md-editor-v3>
            </div>
        </div>
        <div v-if="scrollTopRef > 200" class="mo-go-top" title="返回顶部" @click="goTop">
            <e-icon icon-name="el-icon-caret-top" />
        </div>
    </div>
</template>

<script setup>

import MdEditorV3 from "@md-editor-v3.js";
import "@md-editor-v3.css";
import _ from "@lodash.js";
import { formatDate } from "../../common/js/utils.js";
const { ref } = window["Vue"];
const { useRoute } = window["VueRouter"];
const { rootPath, user } = window["MoConfig"].params;
const { dataArticleURL } = window["MoConfig"].api;


// 跳转路由对象
const route = useRoute();


// 文章数据
const articleData = ref({});
// 滚动高度距离
const scrollTopRef = ref(0);


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
                setCover(data.data["cover"] || `${rootPath}src/home/picture/default.png`);
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

/**
 * 返回顶部
 */
const goTop = _.debounce(() => {
    let scrollTop = scrollTopRef.value;
    const distance = Math.ceil(scrollTop / 100);
    const timer = setInterval(() => {
        if (scrollTop > distance) {
            scrollTop -= distance;
        } else {
            scrollTop = 0;
            clearInterval(timer);
        }
        window["document"].documentElement.scrollTop = scrollTop;
    }, 5);
}, 1000, { leading: true, trailing: false });


// 初始化操作
(() => {
    // 获取文章数据
    dataArticle(route.params.articleId);

    // 监听滚动条
    window.addEventListener("scroll", event => {
        scrollTopRef.value = event.target.documentElement.scrollTop;
    });
})();

</script>

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

.mo-go-top {
    position: fixed;
    right: 100px;
    bottom: 100px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #fff;
    padding: 10px;
    cursor: pointer;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    text-align: center;
    font-size: 22px;
    color: #409eff;
}

.mo-go-top:hover {
    background: #ebedf0;
}
</style>
