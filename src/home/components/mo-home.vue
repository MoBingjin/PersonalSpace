<template>
    <div>
        <figure class="mo-home-background" :backgroundImg="backgroundImageURL">
            <div class="mo-top">
                <div><img class="mo-avatar" :src="avatarPath" alt="头像" referrerpolicy="no-referrer" /></div>
                <div>
                    <div class="mo-down" @click="toBody">
                        <e-icon icon-name="fa fa-chevron-down" />
                    </div>
                    <div class="mo-wave"></div>
                </div>
            </div>
        </figure>
        <div class="mo-body">
            <div class="mo-content">
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
                <div class="mo-home-pager">
                    <el-pagination background layout="prev, pager, next" :page-size="currentPageSize"
                        :current-page="currentPage" :total="total" :hide-on-single-page="true"
                        @current-change="listArticleInfoList" />
                </div>
            </div>
            <el-backtop />
        </div>
    </div>
</template>

<script setup>

import _ from "@lodash.js";
import { formatDate } from "../../common/js/utils.js";
const { reactive, ref } = window["Vue"];
const { useRouter } = window["VueRouter"];
const { listArticleURL } = window["MoConfig"].api;
const { avatarImageURL, backgroundImageURL, defaultCoverImageURL, pageSize, rootPath } = window["MoConfig"].params;


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
const listArticleInfoList = async (page = 1, isToBody = true) => {
    if (isToBody) {
        toBody();
    }
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
    await listArticleInfoList(1, false);
};

/**
 * 移动至主体头部
 */
const toBody = _.debounce(() => {
    const targetTop = window["document"].getElementsByClassName("mo-body")[0].offsetTop;
    moveScroll(targetTop);
}, 1000, { leading: true, trailing: false });

/**
 * 将滚动条移动至目标高度
 * 
 * @param {number} targetTop 目标高度
 */
const moveScroll = (targetTop) => {
    let scrollTop = window["document"].documentElement.scrollTop;
    const direction = targetTop > scrollTop ? 1 : -1;
    const distance = Math.ceil(Math.abs(targetTop - scrollTop) / 100);
    const timer = setInterval(() => {
        if (Math.abs(targetTop - scrollTop) > distance) {
            scrollTop += direction * distance;
        } else {
            scrollTop = targetTop;
            clearInterval(timer);
        }
        window["document"].documentElement.scrollTop = scrollTop;
    }, 5);
};


//初始化操作
(async () => {

    // 动态样式设置
    setTimeout(() => {

        // 主背景设置
        const backgroundElement = window["document"].getElementsByClassName("mo-home-background")[0];
        backgroundElement.style.setProperty("--mo-home-bg", `url(${backgroundImageURL})`);

        // 波浪背景设置
        const waveElement = window["document"].getElementsByClassName("mo-wave")[0];
        waveElement.style.setProperty("--mo-wave-bg", `url("${rootPath}src/home/picture/wave.png")`);
        let backgroundPositionX = 0;
        setInterval(() => {
            waveElement.style.setProperty("--mo-wave-position-x", `${--backgroundPositionX}px`);
        }, 30);

    }, 0);

    // 获取文章信息列表
    await search();
})();

</script>

<style>
@media screen and (max-width: 960px) {

    .mo-article .el-row .el-col-10,
    .mo-article .el-row .el-col-14 {
        max-width: 100%;
        max-height: 50%;
        flex: 0 0 100%;
    }

}

.mo-home-pager .el-pagination.is-background .btn-prev,
.mo-home-pager .el-pagination.is-background .btn-next,
.mo-home-pager .el-pagination.is-background .el-pager li {
    background-color: #ffffff;
}

.el-backtop .el-icon {
    font-size: 20px;
}
</style>
<style scoped>
@media screen and (max-width: 960px) {

    .mo-home-background {
        height: 300px;
        background-attachment: scroll;
    }

    .mo-top>div:first-child {
        margin-top: 80px;
        animation: avatarDown 1.5s 1;
    }

    @keyframes avatarDown {
        from {
            margin-top: 50px;
        }

        to {
            margin-top: 80px;
        }
    }

    .mo-avatar {
        width: 80px;
        height: 80px;
    }

    .mo-down {
        display: none;
    }

    .mo-wave {
        width: 150%;
        height: 38px;
        margin-bottom: -18px;
        background: #f5f5f5;
        border-top-left-radius: 100%;
        border-top-right-radius: 100%;
    }

    .mo-content {
        padding-top: 0;
    }

    .mo-head::after {
        content: '';
        width: 150%;
        height: 38px;
        position: absolute;
        top: 262px;
        left: -25%;
        background: #f5f5f5;
        border-top-left-radius: 100%;
        border-top-right-radius: 100%;
        z-index: 4;
    }

    .el-row {
        flex-direction: column;
    }

    .mo-article-list>div {
        padding: 10px 0 10px 0;
    }

    .mo-article {
        height: 270px;
        border-radius: 10px;
    }

    .mo-article-cover {
        border-radius: 10px 10px 0 0;
    }

    .mo-article-title,
    .mo-article-description {
        width: calc(100% - 20px);
        padding: 10px 10px 0 10px;
    }

    .mo-article-title {
        font-size: 18px;
    }

    .mo-article-description {
        font-size: 15px;
    }

    .mo-article-footer {
        font-size: 12px;
        padding: 0 0 10px 10px;
    }

    .mo-article-footer>span {
        padding-right: 10px;
    }

    .mo-article-footer>span>span {
        padding-left: 3px;
    }

    .el-backtop {
        right: 10px !important;
        bottom: 10px !important;
    }

}

@media screen and (min-width: 961px) {
    .mo-home-background {
        height: 100vh;
        background-attachment: fixed;
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
        background-image: var(--mo-wave-bg);
        background-repeat: repeat-x;
        background-position-x: var(--mo-wave-position-x);
    }

    .mo-content {
        padding-top: 80px;
    }

    .mo-article-list>div {
        padding: 20px 0 20px 0;
    }

    .mo-article {
        height: 210px;
        border-radius: 20px;
    }

    .mo-article-cover {
        border-radius: 20px 0 0 20px;
    }

    .mo-article-title,
    .mo-article-description {
        width: calc(100% - 40px);
        padding: 20px 20px 0 20px;
    }

    .mo-article-title {
        font-size: 24px;
    }

    .mo-article-description {
        font-size: 18px;
    }

    .mo-article-footer {
        font-size: 16px;
        padding: 0 0 20px 20px;
    }

    .mo-article-footer>span {
        padding-right: 20px;
    }

    .mo-article-footer>span>span {
        padding-left: 5px;
    }

    .el-backtop {
        right: 100px !important;
        bottom: 100px !important;
    }

}

.mo-home-background {
    width: 100%;
    margin: 0;
    padding: 0;
    background-image: var(--mo-home-bg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    z-index: -1;
}

.mo-top {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
}

.mo-avatar {
    padding: 5px;
    border-radius: 50%;
    box-shadow: inset 0 0 10px #000;
    transform: rotate(0);
    transition: all ease 1s;
}

.mo-avatar:hover {
    transform: rotate(360deg);
}

.mo-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
}

.mo-content {
    width: 90%;
    max-width: 780px;
}

.mo-article-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.mo-article {
    width: 100%;
    box-shadow: 0 1px 20px -6px rgb(0 0 0 / 50%);
    background-color: #ffffff;
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

.mo-article-info>div:first-child {
    width: 100%;
}

.mo-article-title,
.mo-article-description {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-wrap: break-word;
}

.mo-article-title {
    font-weight: 550;
    color: #504e4e;
}

.mo-article-title:hover {
    cursor: pointer;
    color: #fe9600;
}

.mo-article-description {
    color: #000000a8;
}

.mo-article-footer {
    color: #888888;
}

.mo-home-pager {
    width: 100%;
    display: flex;
    align-items: center;
    justify-items: start;
}

.el-pagination {
    padding-bottom: 20px;
}

.el-backtop {
    width: 50px;
    height: 50px;
}
</style>
