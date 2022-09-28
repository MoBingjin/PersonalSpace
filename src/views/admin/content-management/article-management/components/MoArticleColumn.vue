<template>
  <div class="mo-article-column">
    <el-row class="mo-article-column__row">
      <el-col class="mo-article-column__left" :span="20">
        <div
          class="mo-article-column__title"
          @click="emits('view', model.articleId)"
          :title="model.title"
        >
          {{ model.title }}
        </div>
        <div>
          <el-tag type="danger" size="small">{{ model.type }}</el-tag>
        </div>
        <div class="mo-article-column__description" :title="model.description">
          {{ model.description }}
        </div>
      </el-col>
      <el-col class="mo-article-column__right" :span="4">
        <div class="mo-article-column__time">
          {{ formatDate(model.updateTime) }}
        </div>
        <div class="mo-article-column__action">
          <span
            class="mo-article-column__button"
            @click="emits('view', model.articleId)"
            >浏览</span
          >
          <span
            class="mo-article-column__button"
            @click="emits('edit', model.articleId)"
            >编辑</span
          >
          <span
            class="mo-article-column__button"
            @click="emits('remove', model)"
            >删除</span
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { formatDate } from '@/utils/date-utils.mod.js';

// 参数
defineProps({
  model: {
    type: Object,
    default: () => ({
      articleId: '',
      title: '',
      description: '',
      type: '',
      updateTime: ''
    })
  }
});

// 回调对象
const emits = defineEmits(['view', 'edit', 'remove']);
</script>

<style scoped>
@layer MoArticleColumn {
  * {
    --mo-article-column-height: 100px;
    --mo-article-column-row-border-radius: 10px;
    --mo-article-column-row-background-color-hover: #f5f7fa;
    --mo-article-column-title-font-size: 16px;
    --mo-article-column-title-font-weight: 500;
    --mo-article-column-title-color: #555666;
    --mo-article-column-title-color-hover: red;
    --mo-article-column-description-font-size: 14px;
    --mo-article-column-description-color: #999aaa;
    --mo-article-column-time-font-size: 14px;
    --mo-article-column-time-color: #999;
    --mo-article-column-action-font-size: 14px;
    --mo-article-column-action-color: #222226;
    --mo-article-column-button-hover: #666;
  }

  .mo-article-column {
    height: var(--mo-article-column-height);
    border-bottom: 1px dashed #dcdfe6;
  }

  .mo-article-column__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 10px 5px 10px 5px;
    border-radius: var(--mo-article-column-row-border-radius);
  }

  .mo-article-column__row:hover {
    background-color: var(--mo-article-column-row-background-color-hover);
  }

  .mo-article-column__left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .mo-article-column__title {
    font-size: var(--mo-article-column-title-font-size);
    font-weight: var(--mo-article-column-title-font-weight);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--mo-article-column-title-color);
  }

  .mo-article-column__title:hover {
    cursor: pointer;
    color: var(--mo-article-column-title-color-hover);
  }

  .mo-article-column__description {
    font-size: var(--mo-article-column-description-font-size);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--mo-article-column-description-color);
  }

  .mo-article-column__right {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .mo-article-column__time {
    font-size: var(--mo-article-column-time-font-size);
    text-align: right;
    color: var(--mo-article-column-time-color);
  }

  .mo-article-column__action {
    font-size: var(--mo-article-column-action-font-size);
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    color: var(--mo-article-column-action-font-size);
  }

  .mo-article-column__button {
    padding-left: 10px;
  }

  .mo-article-column__button:hover {
    cursor: pointer;
    color: var(--mo-article-column-button-hover);
  }
}
</style>
