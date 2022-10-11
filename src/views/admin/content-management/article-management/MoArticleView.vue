<template>
    <div class="mo-article-view">
        <span class="mo-article-view__title">{{ props.params.articleData.title }}</span>
        <p>
            类型：<el-tag type="danger" size="small">{{ props.params.articleData.type }}</el-tag>
        </p>
        <p>摘要：{{ props.params.articleData.description }}</p>
        <md-editor-v3 v-model="props.params.articleData.content" :previewOnly="true" />
        <el-backtop target=".mo-article-view" />
    </div>
</template>

<script setup>
import MdEditorV3 from 'md-editor-v3.js';
import 'md-editor-v3.css';

// 参数
const props = defineProps({
    params: {
        type: Object,
        default: () => ({})
    }
});
</script>

<style scoped>
@layer MoArticleView {
    * {
        --mo-article-view-title-font-size: 32px;
        --mo-article-view-title-font-weight: bold;
    }

    .mo-article-view {
        position: absolute;
        overflow: auto;
        width: 100%;
        height: 100%;
    }

    .mo-article-view__title {
        font-size: var(--mo-article-view-title-font-size);
        font-weight: var(--mo-article-view-title-font-weight);
    }
}
</style>
