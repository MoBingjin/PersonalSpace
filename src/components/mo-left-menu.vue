<template>
  <div>
    <el-menu
      :collapse="isCollapse"
      :collapse-transition="false"
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      default-active="2"
      text-color="#fff"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><e-icon icon-name="el-icon-menu" /></el-icon>
          <span>网页工具</span>
        </template>
        <el-menu-item
          index="1-1"
          @click="handleClick('文件查看', 'mo-file-view')"
        >
          <e-icon icon-name="el-icon-document" />
          <span>文件查看</span>
        </el-menu-item>
        <el-menu-item
          index="1-2"
          @click="handleClick('文本编辑', 'mo-text-edit')"
        >
          <e-icon icon-name="el-icon-document" />
          <span>文本编辑</span>
        </el-menu-item>
        <el-menu-item
          index="1-3"
          @click="handleClick('数据库', 'mo-database')"
        >
          <e-icon icon-name="el-icon-coin" />
          <span>&nbsp;数&nbsp;据&nbsp;库</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
const { defineComponent } = Vue;

export default defineComponent({
  props: {
    isCollapse: Boolean,
  },
  emits: {
    "menu-item": null,
  },
  methods: {
    handleClick(componentName) {
      this.currentComponentName = componentName;
    },
  },
  setup(props, context) {
    const handleClick = (title, componentName) => {
      context.emit("menu-item", { title, componentName });
    };
    return {
      handleClick,
    };
  },
});
</script>

<style scoped>
.el-menu {
  border-right-width: 0;
}
</style>