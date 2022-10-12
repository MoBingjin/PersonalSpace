<template>
    <div class="mo-article-management">
        <el-container class="mo-article-management__container">
            <el-header class="mo-article-management__header">
                <el-form class="mo-article-management__form" :model="form" :inline="true" @submit.native.prevent>
                    <el-form-item class="mo-article-management__form-item">
                        <el-date-picker
                            class="mo-article-management__date-picker"
                            v-model="form.yearMonth"
                            type="month"
                            placeholder="文章年月"
                            size="small"
                            :disabled-date="handleDisableDate"
                            value-format="YYYY-MM"
                        />
                    </el-form-item>
                    <el-form-item class="mo-article-management__form-item">
                        <el-select
                            class="mo-article-management__select"
                            v-model="form.categoryId"
                            placeholder="文章分类"
                            size="small"
                            clearable
                        >
                            <el-option
                                v-for="category in categoryList"
                                :key="category.id"
                                :label="category.name"
                                :value="category.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mo-article-management__form-item mo-article-management__form-item--input">
                        <el-input
                            class="mo-article-management__input"
                            v-model="form.key"
                            placeholder="请输入关键词"
                            maxlength="100"
                            size="small"
                            clearable
                            @keyup.enter.native="handleSearch(form)"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item class="mo-article-management__form-item">
                        <el-button type="primary" round @click="handleSearch(form)">
                            <e-icon icon-name="el-icon-search"></e-icon>
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-header>
            <el-main class="mo-article-management__main">
                <div v-if="listData.length > 0" v-for="articleInfo in listData" :key="articleInfo.id">
                    <mo-article-column
                        :model="articleInfo"
                        @view="handleView"
                        @edit="handleEdit"
                        @remove="handleRemove"
                    />
                </div>
                <div v-else>
                    <el-empty description="没有找到符合条件的数据！">
                        <el-button type="primary" @click="openTab('发布文章', 'MoPublishArticle', {})"
                            >发布文章</el-button
                        >
                    </el-empty>
                </div>
            </el-main>
            <el-footer class="mo-article-management__footer">
                <el-pagination
                    class="mo-article-management__pagination"
                    layout="prev, pager, next"
                    :page-size="model.pageSize"
                    :current-page="model.Page"
                    :total="model.total"
                    :hide-on-single-page="true"
                    @current-change="refresh"
                />
            </el-footer>
        </el-container>
    </div>
</template>

<script setup>
import MoArticleColumn from './components/MoArticleColumn.vue';
import { computed, reactive } from 'vue';
import articleService from '@/api/article-service.mod.js';
import categoryService from '@/api/category-service.mod.js';
import managementViewUtils from '@/utils/management-view-utils.mod.js';

// 回调对象
const emits = defineEmits(['menu-item']);

// 表单对象
const form = reactive({
    yearMonth: '',
    categoryId: '',
    key: '',
    startTime: computed(() => {
        if (!form.yearMonth) {
            return undefined;
        }
        return `${form.yearMonth}-01`;
    }),
    endTime: computed(() => {
        if (!form.yearMonth) {
            return undefined;
        }
        const yearMonth = form.yearMonth.split('-');
        let year;
        let month = Number(yearMonth[1]);
        month++;
        if (month > 12) {
            year = String(Number(yearMonth[0]) + 1);
            month = '01';
        } else {
            year = yearMonth[0];
            month = month > 9 ? String(month) : `0${month}`;
        }
        return `${year}-${month}-01`;
    })
});
// 文章分类选项列表
const categoryList = reactive([]);

const {
    // 页面数据
    model,
    // 文章信息列表
    listData,
    handleSearch,
    handleRemove,
    refresh
} = managementViewUtils.create({ service: articleService });

/**
 * 浏览文章事件
 *
 * @param {any} article 文章对象
 */
const handleView = (article) => {
    openTab(article.title, 'content-management/article-management/MoArticleView', { articleId: article.id });
};

/**
 * 编辑文章事件
 *
 * @param {string} articleId 文章ID
 */
const handleEdit = (articleId) => {
    // 获取文章数据
    fetch(api.dataArticleURL, {
        method: 'post',
        body: JSON.stringify({ articleId })
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.code === 0) {
                openTab('编辑文章', 'article-publish/MoPublishArticle', {
                    articleData: data.data
                });
            }
            console.log(data.message);
        })
        .catch((error) => {
            console.log(error);
        });
};

/**
 * 时间禁用事件
 *
 * @param {Date} date 时间
 */
const handleDisableDate = (date) => date.getTime() > Date.now();

/**
 * 加载文章分类选项列表
 */
const loadCategoryList = () => {
    categoryService
        .simpleList()
        .then((res) => {
            categoryList.splice(0, categoryList.length);
            res.data.map((category) => categoryList.push(category));
        })
        .catch((error) => {});
};

/**
 * 打开标签
 *
 * @param {string} title 菜单标题
 * @param {string} componentName 组件名称
 * @param {any} params 组件参数
 */
const openTab = (title, componentName, params) => emits('menu-item', { title, componentName, params });

// 初始化操作
(async () => {
    // 加载文章分类选项列表
    loadCategoryList();
    // 获取文章信息列表
    refresh(1);
})();
</script>

<style scoped>
@layer MoArticleManagement {
    * {
        --mo-article-management-header-height: 56px;
    }

    .mo-article-management {
        height: 100%;
    }
}

.mo-article-management__container.el-container {
    height: 100%;
}

.mo-article-management__header.el-header {
    height: var(--mo-article-management-header-height);
    padding: 10px 0;
    box-sizing: border-box;
}

.mo-article-management__form.el-form {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
}

.mo-article-management__form-item.el-form-item {
    margin-right: 10px;
    margin-bottom: 0;
}

.mo-article-management__form-item.el-form-item >>> .mo-article-management__date-picker.el-date-editor,
.mo-article-management__select.el-select {
    width: 130px;
}

.mo-article-management__form-item.mo-article-management__form-item--input.el-form-item {
    flex: 0.35;
}

.mo-article-management__input.el-input {
    min-width: 260px;
}

.mo-article-management__main.el-main,
.mo-article-management__footer.el-footer {
    padding: 0;
}

.mo-article-management__pagination.el-pagination {
    margin-top: 20px;
}
</style>
