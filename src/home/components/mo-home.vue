<template>
    <div>
        <div class="mo-top">
            <div><img class="mo-avatar" :src="avatarPath" alt="头像" /></div>
            <div>
                <div class="mo-down" @click="handleDown">
                    <e-icon icon-name="fa fa-chevron-down" />
                </div>
                <div class="mo-wave"></div>
            </div>
        </div>
        <div class="mo-body">
            <div class="mo-article-list">
                <div v-for="item in articleInfoList">
                    <div class="mo-article">
                        <el-row>
                            <el-col :span="10">
                                <div class="mo-article-cover" @click="view(item.articleId)">
                                    <img :src="item.cover || defaultCoverPath" alt="cover">
                                </div>
                            </el-col>
                            <el-col :span="14">
                                <div class="mo-article-info">
                                    <div>
                                        <div class="mo-article-title" @click="view(item.articleId)">{{ item.title }}
                                        </div>
                                        <div class="mo-article-description">{{ item.description }}</div>
                                    </div>
                                    <div class="mo-article-footer">
                                        <span class="mo-article-date">
                                            <e-icon icon-name="el-icon-time" />
                                            <span>{{ formatDate(item.createTime, "yyyy-MM-dd HH:mm:ss") }}</span>
                                        </span>
                                        <span class="mo-article-type">
                                            <e-icon icon-name="el-icon-price-tag" />
                                            <span>{{ item.type }}</span>
                                        </span>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import _ from "@lodash.js";
import { formatDate } from "../../common/js/utils.js";
const { reactive, ref } = window["Vue"];
const { useRouter } = window["VueRouter"];
const { listArticleURL } = window["MoConfig"].api;
const { avatarImageURL, defaultCoverImageURL, pageSize, rootPath } = window["MoConfig"].params;


// 路由实例对象
const router = useRouter();

// 文章信息列表
const articleInfoList = reactive([]);
// 头像路径
const avatarPath = avatarImageURL || `${rootPath}src/home/picture/avatar.png`;
// 默认封面路径
const defaultCoverPath = defaultCoverImageURL || `${rootPath}src/home/picture/default_cover.png`;
// 分页每页数目
const currentPageSize = ref(pageSize["home"]);
// 当前页
const currentPage = ref(1);
// 分页总数
const total = ref(0);
// 关键词
const key = ref("");
// 搜索条件
const searchParams = ref({});


/**
 * 获取文章信息列表
 * 
 * @param {number} page 当前页
 */
const listArticleInfoList = async (page = 1) => {
    currentPage.value = page;
    searchParams.value["page"] = page;
    return new Promise((rev, rej) => {
        // 获取文章信息列表数据
        fetch(listArticleURL, {
            method: "post",
            body: JSON.stringify(searchParams.value)
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 0) {
                    articleInfoList.splice(0, articleInfoList.length);
                    data.data.list.map(item => articleInfoList.push(item));
                    total.value = data.data.total;
                }
                console.log(data.message);
                rev(data.message);
            })
            .catch(error => {
                console.log(error);
                rej(error);
            });
    });
};

/**
 * 浏览文章
 * 
 * @param {string} articleId 文章ID
 */
const view = articleId => router.push(`/article/${articleId}`);

/**
 * 搜索事件
 */
const search = async () => {

    // 搜索参数
    searchParams.value = { limit: currentPageSize.value };

    // 关键词
    const keyValue = key.value.trim();
    if (keyValue !== "") {
        searchParams.value["title"] = keyValue;
        searchParams.value["description"] = keyValue;
    }

    // 获取文章信息列表
    await listArticleInfoList(1);
};

/**
 * 下移点击事件
 */
const handleDown = _.debounce(() => {
    let scrollTop = window["document"].documentElement.scrollTop;
    const targetTop = window["document"].getElementsByClassName("mo-body")[0].offsetTop;
    const distance = Math.ceil((targetTop - scrollTop) / 100);
    const timer = setInterval(() => {
        if ((targetTop - scrollTop) > distance) {
            scrollTop += distance;
        } else {
            scrollTop = targetTop;
            clearInterval(timer);
        }
        window["document"].documentElement.scrollTop = scrollTop;
    }, 5);
}, 1000, { leading: true, trailing: false });


//初始化操作
(async () => {

    // 动态样式设置
    setTimeout(() => {
        const waveElement = window["document"].getElementsByClassName("mo-wave")[0];
        waveElement.style.background = `url("${rootPath}src/home/picture/wave.png") repeat-x`;
        let backgroundPositionX = 0;
        setInterval(() => {
            waveElement.style.backgroundPositionX = `${--backgroundPositionX}px`;
        }, 30);
    }, 0);

    // 获取文章信息列表
    await search();
})();

</script>

<style scoped>
.mo-top {
    width: calc(100vw - 17px);
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.mo-top>div:first-child {
    margin-top: 35vh;
    animation: avatarDown 1.5s 1;
}

@keyframes avatarDown {
    from {
        margin-top: calc(35vh - 30px);
    }

    to {
        margin-top: 35vh;
    }
}

.mo-avatar {
    width: 130px;
    height: 130px;
    padding: 5px;
    border-radius: 50%;
    box-shadow: inset 0 0 10px #000;
    transform: rotate(0);
    transition: all ease 1s;
}

.mo-avatar:hover {
    transform: rotate(360deg);
}

.mo-top>div:last-child {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.mo-down {
    width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0px;
    font-size: 28px;
    color: #ffffff;
    transform: scale(1.5, 1);
    animation: downMove 2s infinite;
}

@keyframes downMove {
    10% {
        margin-bottom: 0px;
    }

    50% {
        margin-bottom: 8px;
    }

    100% {
        margin-bottom: 0px;
    }
}

.mo-down:hover {
    cursor: pointer;
}

.mo-wave {
    width: 100%;
    height: 85px;
}

.mo-body {
    width: calc(100vw - 17px);
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
}

.mo-article-list {
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-top: 100px;
}

.mo-article-list>div {
    padding: 20px 0 20px 0;
}

.mo-article {
    width: 780px;
    height: 210px;
    border-radius: 20px;
    box-shadow: 0 1px 20px -6px rgb(0 0 0 / 50%);
}

.mo-article:hover {
    box-shadow: 0 5px 10px 5px rgb(110 110 110 / 40%);
}

.mo-article:hover .mo-article-cover>img {
    transform: scale(1.1);
}

.el-row {
    height: 100%;
    width: 100%;
}

.mo-article-cover {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 20px 0 0 20px;
}

.mo-article-cover>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    user-select: none;
}

.mo-article-info {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    font-family: 'HYWenHei-85W', 'Merriweather Sans', Helvetica, Tahoma, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', 'WenQuanYi Micro Hei', 'sans-serif';
}

.mo-article-title,
.mo-article-description {
    width: calc(100% - 40px);
    padding: 20px 20px 0 20px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-wrap: break-word;
}

.mo-article-title {
    font-size: 24px;
    font-weight: 500;
    color: #504e4e;
}

.mo-article-title:hover {
    cursor: pointer;
    color: #fe9600;
}

.mo-article-description {
    font-size: 18px;
    color: #000000a8;
}

.mo-article-footer {
    font-size: 16px;
    color: #888888;
    padding: 0 0 20px 20px;
}

.mo-article-footer>span {
    padding-right: 20px;
}

.mo-article-footer>span>span {
    padding-left: 5px;
}
</style>
