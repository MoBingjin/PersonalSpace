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
                <md-editor-v3 v-model="articleData.content" :previewOnly="true" style="height: 100%" />
            </div>
        </div>
        <el-backtop />
    </div>
</template>

<script setup>

import { getCurrentInstance, ref  } from 'vue';
import { useRoute } from 'vue-router';
import storage from '@/utils/storage.mod.js';
import { formatDate } from '@/utils/date-utils.mod.js';
import MdEditorV3 from 'md-editor-v3.js';
import 'md-editor-v3/lib/style.css';

const api = storage.getObject('api');

// 获取真实路径函数
const getActualPath = getCurrentInstance().proxy.$getActualPath;
// 跳转路由对象
const route = useRoute();

// 用户
const user = storage.get('user');
// 头像路径
const avatarPath = storage.get('avatarImageURL') || getActualPath('static/img/avatar.png');
// 文章数据
const articleData = ref({});


/**
 * 获取文章数据
 * 
 * @param {string} articleId 文章ID
 */
const dataArticle = articleId => {
    fetch(api.dataArticleURL, {
        method: 'post',
        body: JSON.stringify({ articleId })
    })
        .then(res => res.json())
        .then(data => {
            if (data.code === 0) {
                articleData.value = data.data;
                setCover(data.data['cover'] || storage.getObject('defaultCoverImageURL') || getActualPath('static/img/default_cover.png'));
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
    const coverElement = window['document'].getElementsByClassName('mo-cover')[0];
    coverElement.style.background = `url('${coverPath}') center center / cover no-repeat`;
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
@media screen and (max-width: 960px) {

    .mo-cover {
        height: 280px;
    }

    .mo-cover>div {
        width: 95%;
        height: 100%;
    }

    .mo-article-title {
        font-size: 26px;
        padding-bottom: 30px;
    }

    .mo-content>div {
        width: 95%;
    }

    .el-backtop {
        right: 10px !important;
        bottom: 10px !important;
    }

}

@media screen and (min-width: 961px) {

    .mo-cover {
        height: 50vh;
    }

    .mo-cover>div {
        width: 60%;
        height: 100%;
        min-width: 800px;
    }

    .mo-article-title {
        font-size: 32px;
        padding-bottom: 50px;
    }

    .mo-content>div {
        width: 60%;
        min-width: 800px;
    }

    .el-backtop {
        right: 100px !important;
        bottom: 100px !important;
    }

}

.mo-cover {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.mo-cover>div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    font-family: 'HYWenHei-85W', 'Merriweather Sans', Helvetica, Tahoma, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', 'WenQuanYi Micro Hei', 'sans-serif';
    color: #ffffff;
    text-shadow: 2px 2px 10px #000;
}

.mo-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 25px;
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
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.el-backtop {
    width: 50px;
    height: 50px;
}
</style>
