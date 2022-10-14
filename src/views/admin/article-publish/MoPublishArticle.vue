<template>
    <div class="mo-publish-article">
        <el-container class="mo-publish-article__container" v-loading="loading">
            <el-header class="mo-publish-article__header">
                <el-form :model="form" ref="formComponent" :rules="rules">
                    <el-form-item
                        class="mo-publish-article__form-item mo-publish-article__form-item--inline mo-publish-article__title"
                        prop="title"
                    >
                        <el-input
                            v-model="form.title"
                            placeholder="请输入标题（长度5~100）"
                            minlength="5"
                            maxlength="100"
                            :show-word-limit="true"
                            clearable
                        >
                            <template #prepend>标题</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        class="mo-publish-article__form-item mo-publish-article__form-item--inline mo-publish-article__category"
                    >
                        <el-select v-model="form.categoryId" placeholder="未分类">
                            <el-option
                                v-for="category in categoryList"
                                :key="category.id"
                                :label="category.name"
                                :value="category.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        class="mo-publish-article__form-item mo-publish-article__form-item--inline mo-publish-article__tag"
                    >
                        <el-select
                            v-model="form.tagIds"
                            :multiple-limit="3"
                            placeholder="无标签"
                            multiple
                            collapse-tags
                            collapse-tags-tooltip
                            clearable
                        >
                            <el-option v-for="tag in tagList" :key="tag.id" :label="tag.name" :value="tag.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mo-publish-article__form-item" prop="description">
                        <el-input
                            v-model="form.description"
                            placeholder="请输入摘要（长度5~300）"
                            type="textarea"
                            rows="4"
                            minlength="5"
                            maxlength="300"
                            :show-word-limit="true"
                        >
                            <template #prepend>摘要</template>
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-header>
            <el-main class="mo-publish-article__main">
                <md-editor-v3
                    class="mo-publish-article__md-editor"
                    v-model="form.content"
                    placeholder="请输入文章内容"
                    @onUploadImg="handleUploadImage"
                    @onSave="handleAddOrUpdate"
                ></md-editor-v3>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import articleService from '@/api/article-service.mod.js';
import categoryService from '@/api/category-service.mod.js';
import tagService from '@/api/tag-service.mod.js';
import imageService from '@/api/image-service.mod.js';
import MdEditorV3 from 'md-editor-v3.js';
import 'md-editor-v3.css';

// 参数
const props = defineProps({
    params: {
        type: Object,
        default: () => ({})
    },
    notSaved: {
        type: Boolean,
        default: false
    }
});

// 回调
const emits = defineEmits(['update:notSaved']);

// 表单组件
const formComponent = ref();
// 是否显示加载动画
const loading = ref(false);
// 表单对象
const form = reactive({
    id: '',
    title: '',
    description: '',
    cover: '',
    content: '',
    categoryId: '',
    tagIds: []
});
// 旧表单JSON字符串
const oldFormString = ref(JSON.stringify(form));
// 文章分类选项列表
const categoryList = reactive([]);
// 文章标签选项列表
const tagList = reactive([]);

// 表单校验
const rules = {
    title: [
        { required: true, message: '标题不能为空', trigger: 'blur' },
        { min: 5, max: 100, message: '标题长度应为5~100', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '摘要不能为空', trigger: 'blur' },
        { min: 5, max: 300, message: '摘要长度应为5~300', trigger: 'blur' }
    ]
};

// 监听是否存在修改
watch(form, (newValue) => {
    emits('update:notSaved', JSON.stringify(newValue) !== oldFormString.value);
});

/**
 * 添加或更新事件
 *
 * @param {string} value 文章内容文本
 */
const handleAddOrUpdate = (value) => {
    formComponent.value.validate(async (valid) => {
        if (valid) {
            if (!value) {
                const result = await ElMessageBox.confirm('当前没有文章内容，是否保存?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(() => 'cancel');
                if (result === 'cancel') {
                    return;
                }
            }
            // 显示加载动画
            loading.value = true;
            const action = !form.id ? articleService.add : articleService.update;
            action(form)
                .then((res) => {
                    // 关闭加载动画
                    loading.value = false;
                    ElMessage({
                        message: `文章${!form.id ? '添加' : '更新'}成功!`,
                        type: 'success',
                        duration: 2 * 1000
                    });
                    form.id = res.data.id;
                    oldFormString.value = JSON.stringify(form);
                })
                .catch((error) => {
                    // 关闭加载动画
                    loading.value = false;
                });
        }
    });
};

/**
 * 获取文章信息
 *
 * @param {String} id 文章ID
 */
const getArticleInfo = (id) => {
    articleService
        .info(id)
        .then((res) => {
            for (const key in res.data) {
                form[key] = res.data[key];
            }
            form.tagIds = res.data.tags.map((tag) => tag.id);
            oldFormString.value = JSON.stringify(form);
        })
        .catch((error) => {});
};

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
 * 加载文章标签选项列表
 */
const loadTagList = () => {
    tagService
        .simpleList()
        .then((res) => {
            tagList.splice(0, tagList.length);
            res.data.map((tag) => tagList.push(tag));
        })
        .catch((error) => {});
};

/**
 * 图片上传事件
 *
 * @param {Array<File>} files 图片文件集
 * @param {Function} callback 回调函数
 */
const handleUploadImage = async (files, callback) => {
    const resAll = await Promise.all(files.map((file) => imageService.upload(file)));
    const fileURLArray = resAll.map((res) => res.data.fileURL);
    // 预缓存图片
    await Promise.all(fileURLArray.map((fileURL) => fetch(fileURL, { mode: 'no-cors' })));
    callback(fileURLArray);
};

// 初始化操作
(() => {
    // 加载文章分类选项列表
    loadCategoryList();
    // 加载文章标签选项列表
    loadTagList();
    if (props.params.articleId) {
        // 获取文章信息
        getArticleInfo(props.params.articleId);
    }
})();
</script>

<style scoped>
@layer MoPublishArticle {
    * {
        --mo-publish-article-header-height: 166px;
    }

    .mo-publish-article {
        height: 100%;
    }
}

.mo-publish-article__container.el-container {
    height: 100%;
}

.mo-publish-article__header.el-header {
    height: var(--mo-publish-article-header-height);
    padding: 0;
}

.mo-publish-article__form-item.el-form-item {
    margin: 0 0 20px 0;
}

.mo-publish-article__form-item--inline.el-form-item {
    display: inline-block;
    margin-right: 10px;
}

.mo-publish-article__title.el-form-item {
    width: 40%;
    min-width: 400px;
}

.mo-publish-article__category.el-form-item {
    width: 130px;
}

.mo-publish-article__tag.el-form-item {
    width: 200px;
}

.mo-publish-article__main.el-main {
    padding: 0;
}

.mo-publish-article__md-editor {
    height: 100%;
}
</style>
