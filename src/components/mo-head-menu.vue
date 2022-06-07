<template>
  <div class="mo-head">
    <span>个人空间</span>
    <!-- <e-icon icon-name="el-icon-cloudy" /> -->
    <!-- <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item index="1">Processing Center</el-menu-item>
      <el-sub-menu index="2">
        <template #title>Workspace</template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
        <el-sub-menu index="2-4">
          <template #title>item four</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-menu-item index="3" disabled>Info</el-menu-item>
      <el-menu-item index="4">Orders</el-menu-item>
    </el-menu> -->
  </div>
</template>

<script>
const { defineComponent, ref } = Vue;

export default defineComponent({
  setup() {
    const activeIndex = ref("1");
    const handleSelect = (key, keyPath) => {
      //console.log(key, keyPath);
    };
    return {
      activeIndex,
      handleSelect,
    };
  },
});
</script>

<style scoped>
.mo-head {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.mo-head > span {
  font-family: '宋体';
  color: #e6e6e6;
  font-size: 30px;
  margin-left: 30px;
  padding: 5px;
  border: 1px solid #f5f5f5;
  border-radius: 5px;
}
</style>