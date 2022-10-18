<template>
    <div class="mo-main">
        <div class="mo-main__background" />
        <div class="mo-main__welcome">
            <div class="mo-main__avatar">
                <img class="mo-main__avatar-img" :src="avatarURL" alt="头像" referrerpolicy="no-referrer" />
            </div>
            <div v-if="store.screenWidth > 960" class="mo-main__move-down" @click="toBody">
                <e-icon class="mo-main__down-icon" icon-name="fa fa-chevron-down" />
            </div>
            <div class="mo-main__wave" />
        </div>
        <div class="mo-main__body">
            <div class="mo-main__content">
                <div class="mo-main__article-list">
                    <div class="mo-main__article-item" v-for="item in articleInfoList" :key="item.id">
                        <mo-article-card :model="item" @view="view" />
                    </div>
                </div>
                <el-pagination
                    class="mo-main__article-pager"
                    background
                    layout="prev, pager, next"
                    :page-size="currentPageSize"
                    :current-page="currentPage"
                    :total="total"
                    :hide-on-single-page="true"
                    @current-change="listArticleInfoList"
                />
            </div>
            <el-backtop class="mo-main__backtop" />
        </div>
    </div>
</template>

<script setup>
import MoArticleCard from './components/MoArticleCard.vue';
import { getCurrentInstance, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils/date-utils.mod.js';
import storage from '@/utils/storage.mod.js';
import store from '@/store/store.mod.js';
import _ from 'lodash.js';

const api = storage.getObject('api');

// 获取真实路径函数
const getActualPath = getCurrentInstance().proxy.$getActualPath;
// 路由实例对象
const router = useRouter();

// 头像路径
const avatarURL = storage.get('avatarImageURL') || getActualPath('static/img/avatar.png');
// 文章信息列表
const articleInfoList = reactive([]);
// 分页每页数目
const currentPageSize = ref(storage.getObject('pageSize')['home']);
// 当前页
const currentPage = ref(1);
// 分页总数
const total = ref(0);
// 关键词
const key = ref('');
// 搜索条件
const searchParams = ref({});

// CSS变量
const cssVariable = reactive({
    // 背景图片路径
    backgroundURL: `url('${storage.get('backgroundImageURL') || getActualPath('static/img/background.png')}')`,
    // 波浪图片路径
    waveURL: `url('${getActualPath('static/img/wave.png')}')`
});

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
    searchParams.value['page'] = page;
    return new Promise((rev, rej) => {
        // 获取文章信息列表数据
        fetch(api.listArticleURL, {
            method: 'post',
            body: JSON.stringify(searchParams.value)
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 0) {
                    articleInfoList.splice(0, articleInfoList.length);
                    data.data.list.map((item) =>
                        articleInfoList.push({
                            id: item.articleId,
                            title: item.title,
                            description: item.description,
                            cover: '',
                            contentId: '',
                            categoryId: '',
                            categoryName: item.type,
                            tags: [],
                            views: 0,
                            topping: false,
                            status: 1,
                            createTime: formatDate(item.createTime, 'yyyy-MM-dd HH:mm:ss')
                        })
                    );
                    total.value = data.data.total;
                }
                console.log(data.message);
                rev(data.message);
            })
            .catch((error) => {
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
const view = (articleId) => router.push(`/article/${articleId}`);

/**
 * 搜索事件
 */
const search = async () => {
    // 搜索参数
    searchParams.value = { limit: currentPageSize.value };

    // 关键词
    const keyValue = key.value.trim();
    if (keyValue !== '') {
        searchParams.value['title'] = keyValue;
        searchParams.value['description'] = keyValue;
    }

    // 获取文章信息列表
    await listArticleInfoList(1, false);
};

/**
 * 移动至主体头部
 */
const toBody = _.debounce(
    () => {
        const targetTop = window['document'].getElementsByClassName('mo-main__body')[0].offsetTop;
        moveScroll(targetTop);
    },
    1000,
    { leading: true, trailing: false }
);

/**
 * 将滚动条移动至目标高度
 *
 * @param {number} targetTop 目标高度
 */
const moveScroll = (targetTop) => {
    let scrollTop = window['document'].documentElement.scrollTop;
    const direction = targetTop > scrollTop ? 1 : -1;
    const distance = Math.ceil(Math.abs(targetTop - scrollTop) / 100);
    const timer = setInterval(() => {
        if (Math.abs(targetTop - scrollTop) > distance) {
            scrollTop += direction * distance;
        } else {
            scrollTop = targetTop;
            clearInterval(timer);
        }
        window['document'].documentElement.scrollTop = scrollTop;
    }, 5);
};

//初始化操作
(async () => {
    // 获取文章信息列表
    await search();
})();
</script>

<style scoped>
@layer MoMain {
    .mo-main {
        --mo-main-background-image: v-bind(cssVariable.backgroundURL);
        --mo-main-wave-image: v-bind(cssVariable.waveURL);
    }

    * {
        --mo-main-avatar-animation: fadeInDown 1.5s 1;
        --mo-main-avatar-img-padding: 5px;
        --mo-main-avatar-img-transition: all 1s ease;
        --mo-main-avatar-img-transform: rotate(0);
        --mo-main-avatar-img-transform-hover: rotate(360deg);
        --mo-main-avatar-img-border-radius: 50%;
        --mo-main-avatar-img-box-shadow: inset 0 0 10px #000;
        --mo-main-move-down-font-size: 28px;
        --mo-main-move-down-width: 50px;
        --mo-main-move-down-height: 30px;
        --mo-main-move-down-transform: scale(1.5, 1);
        --mo-main-move-down-color: #fff;
        --mo-main-down-icon-animation: slideInDown 2s infinite linear alternate;
        --mo-main-body-background-color: #f5f5f5;
        --mo-main-content-width: 90%;
        --mo-main-content-min-width: 350px;
        --mo-main-content-max-width: 780px;
        --mo-main-article-pager-padding: 0 0 20px 0;
        --mo-main-backtop-width: 50px;
        --mo-main-backtop-height: 50px;
        --mo-main-backtop-icon-font-size: 20px;
    }

    @media screen and (max-width: 960px) {
        * {
            --mo-main-welcome-height: 300px;
            --mo-main-welcome-padding: 80px 0 0 0;
            --mo-main-background-height: var(--mo-main-welcome-height);
            --mo-main-background-position: center;
            --mo-main-avatar-img-width: 80px;
            --mo-main-avatar-img-height: 80px;
            --mo-main-wave-width: 150%;
            --mo-main-wave-height: 38px;
            --mo-main-wave-margin: 0 0 -18px 0;
            --mo-main-wave-border-radius: 50% 50% 0 0;
            --mo-main-wave-background: #f5f5f5;
            --mo-main-wave-animation: none;
            --mo-main-content-padding: 0;
            --mo-main-article-item-padding: 10px 0 10px 0;
            --mo-main-backtop-right: 10px;
            --mo-main-backtop-bottom: 10px;
        }
    }

    @media screen and (min-width: 961px) {
        * {
            --mo-main-welcome-height: 100vh;
            --mo-main-welcome-padding: 35vh 0 0 0;
            --mo-main-background-height: 100%;
            --mo-main-background-position: 0 -80px;
            --mo-main-avatar-img-width: 130px;
            --mo-main-avatar-img-height: 130px;
            --mo-main-wave-width: 100%;
            --mo-main-wave-height: 85px;
            --mo-main-wave-margin: 0;
            --mo-main-wave-border-radius: 0;
            --mo-main-wave-background: var(--mo-main-wave-image) repeat-x;
            --mo-main-wave-animation: waveMove 30s infinite linear;
            --mo-main-content-padding: 80px 0 0 0;
            --mo-main-article-item-padding: 20px 0 20px 0;
            --mo-main-backtop-right: 100px;
            --mo-main-backtop-bottom: 100px;
        }
    }

    .mo-main__background {
        position: fixed;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100vw;
        height: var(--mo-main-background-height);
        background-image: var(--mo-main-background-image);
        background-repeat: no-repeat;
        background-position: var(--mo-main-background-position);
        background-size: cover;
    }

    .mo-main__welcome {
        display: flex;
        overflow: hidden;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        height: var(--mo-main-welcome-height);
        padding: var(--mo-main-welcome-padding);
    }

    .mo-main__avatar {
        animation: var(--mo-main-avatar-animation);
    }

    .mo-main__avatar-img {
        width: var(--mo-main-avatar-img-height);
        height: var(--mo-main-avatar-img-height);
        padding: var(--mo-main-avatar-img-padding);
        transition: var(--mo-main-avatar-img-transition);
        transform: var(--mo-main-avatar-img-transform);
        border-radius: var(--mo-main-avatar-img-border-radius);
        box-shadow: var(--mo-main-avatar-img-box-shadow);
    }

    .mo-main__avatar-img:hover {
        transform: var(--mo-main-avatar-img-transform-hover);
    }

    .mo-main__move-down {
        font-size: var(--mo-main-move-down-font-size);
        display: flex;
        align-items: flex-end;
        flex: 1;
        justify-content: center;
        width: var(--mo-main-move-down-width);
        height: var(--mo-main-move-down-height);
        transform: var(--mo-main-move-down-transform);
        color: var(--mo-main-move-down-color);
    }

    .mo-main__move-down:hover {
        cursor: pointer;
    }

    .mo-main__down-icon {
        animation: var(--mo-main-down-icon-animation);
    }

    .mo-main__wave {
        width: var(--mo-main-wave-width);
        height: var(--mo-main-wave-height);
        margin: var(--mo-main-wave-margin);
        animation: var(--mo-main-wave-animation);
        border-radius: var(--mo-main-wave-border-radius);
        background: var(--mo-main-wave-background);
    }

    .mo-main__body {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        background-color: var(--mo-main-body-background-color);
    }

    .mo-main__content {
        width: var(--mo-main-content-width);
        min-width: var(--mo-main-content-min-width);
        max-width: var(--mo-main-content-max-width);
        padding: var(--mo-main-content-padding);
    }

    .mo-main__article-list {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
    }

    .mo-main__article-item {
        padding: var(--mo-main-article-item-padding);
    }
}

.mo-main__article-pager.el-pagination {
    padding: var(--mo-main-article-pager-padding);
}

.mo-main__article-pager.el-pagination.is-background >>> .btn-prev,
.mo-main__article-pager.el-pagination.is-background >>> .btn-next,
.mo-main__article-pager.el-pagination.is-background >>> .el-pager li {
    background-color: #fff;
}

.mo-main__backtop.el-backtop {
    width: var(--mo-main-backtop-width);
    height: var(--mo-main-backtop-height);
    right: var(--mo-main-backtop-right) !important;
    bottom: var(--mo-main-backtop-bottom) !important;
}

.mo-main__backtop.el-backtop >>> .el-icon {
    font-size: var(--mo-main-backtop-icon-font-size);
}
</style>
<style>
@keyframes waveMove {
    from {
        background-position-x: 0;
    }
    to {
        background-position-x: -997px;
    }
}
</style>
