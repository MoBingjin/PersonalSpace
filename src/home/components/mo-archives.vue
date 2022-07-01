<template>
    <div class="mo-archives">
        <el-timeline>
            <el-timeline-item v-for="item in archives" v-infinite-scroll="load" :class="item.isTime && 'mo-time'"
                placement="top" type="primary" :size="item.isTime ? 'large' : 'normal'" :hollow="!item.isTime"
                :timestamp="item.timestamp">
                <span v-if="item.isTime">{{ item.content }}</span>
                <router-link v-else :to="`/article/${item.articleId}`">{{ item.content }}</router-link>
            </el-timeline-item>
        </el-timeline>
        <span v-if="loading" class="mo-loading">加载中</span>
        <span v-if="noMore">没有更多数据了~</span>
    </div>
</template>

<script setup>

const { computed, reactive, ref } = window["Vue"];
const { pageSize } = window["MoConfig"].params;
const { archivesArticleURL } = window["MoConfig"].api;


// 当前页数
const page = ref(0);
// 分页每页数目
const currentPageSize = ref(pageSize["home"]);
// 分页总数
const total = ref(0);
// 归档信息列表
const archives = reactive([]);
// 是否加载中
const loading = ref(false);


// 是否没有更多数据
const noMore = computed(() => page.value * currentPageSize.value >= total.value && page.value > 0);


/**
 * 文章归档信息数据加载
 */
const load = () => {
    if (!noMore.value && !loading.value) {
        loading.value = true;
        fetch(archivesArticleURL, {
            method: "post",
            body: JSON.stringify({
                limit: currentPageSize.value,
                page: page.value + 1
            })
        })
            .then(res => res.json())
            .then(data => {
                loading.value = false;
                if (data.code === 0) {
                    if (archives.length === 0 && data.data.archives.length > 0) {
                        const item = data.data.archives[0];
                        archives.push({
                            content: item["yearAndMonth"],
                            yearAndMonth: item["yearAndMonth"],
                            isTime: true
                        });
                    }
                    data.data.archives.map(item => {
                        const lastItem = archives[archives.length - 1];
                        if (item["yearAndMonth"] !== lastItem["yearAndMonth"]) {
                            archives.push({
                                content: item["yearAndMonth"],
                                yearAndMonth: item["yearAndMonth"],
                                isTime: true
                            });
                        }
                        archives.push(item);
                    });
                    ++page.value;
                    total.value = data.data.total;
                }
                console.log(data.message);
            })
            .catch(error => {
                loading.value = false;
                console.log(error);
            });
    }
}


(() => {
    // 文章归档信息数据加载
    load();
})();

</script>

<style>
.mo-archives .el-timeline-item__wrapper {
    width: calc(100% - 28px);
}

.mo-time .el-timeline-item__wrapper {
    font-size: 16px;
    top: -17px;
    right: 130px;
}
</style>
<style scoped>
.mo-archives {
    width: 100%;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.el-timeline {
    width: 50%;
    min-width: 220px;
    padding: 0 50px 0 115px;
}

.el-timeline-item a {
    color: #303133;
    text-decoration: none;
}

.el-timeline-item a:hover {
    color: #ffd04b;
}

.mo-archives>span {
    width: calc(50% + 20px);
    min-width: 240px;
    font-size: 15px;
    padding: 0 0 20px 135px;
    color: #303133;
}

.mo-loading::after {
    content: ' . . .';
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% {
        content: ' ';
    }

    25% {
        content: ' .';
    }

    50% {
        content: ' . .';
    }

    75% {
        content: ' . . .';
    }

    100% {
        content: ' ';
    }
}
</style>