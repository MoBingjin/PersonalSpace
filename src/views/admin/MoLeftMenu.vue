<template>
  <div>
    <el-menu :collapse="isCollapse" :collapse-transition="false" active-text-color="#ffd04b" background-color="#545c64"
      class="el-menu-vertical-demo" default-active="1" text-color="#fff">
      <el-menu-item index="1" @click="openTab('首页', 'main/MoMain', {})">
        <el-icon>
          <e-icon icon-name="el-icon-s-home" />
        </el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="2" @click="openTab('发布文章', 'article-publish/MoPublishArticle', {})">
        <el-icon>
          <e-icon icon-name="el-icon-s-opportunity" />
        </el-icon>
        <span>发布文章</span>
      </el-menu-item>
      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <e-icon icon-name="el-icon-s-marketing" />
          </el-icon>
          <span>内容管理</span>
        </template>
        <el-menu-item index="3-1" @click="openTab('文章管理', 'content-management/article-management/MoArticleManagement', {})">
          <e-icon icon-name="el-icon-document" />
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="3-2" @click="openTab('标签管理', 'content-management/tag-management/MoTagManagement', {})">
          <e-icon icon-name="el-icon-price-tag" />
          <span>标签管理</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>

// 参数
defineProps({
  isCollapse: Boolean,
});


// 回调对象
const emits = defineEmits(['menu-item']);


/**
 * 打开标签
 * 
 * @param {string} title 菜单标题
 * @param {string} componentName 组件名称
 * @param {any} params 组件参数
 */
const openTab = (title, componentName, params) => emits('menu-item', { title, componentName, params });

</script>

<style scoped>
.el-menu {
  border-right-width: 0;
}
</style>