<template>
  <el-container>
    <!-- 导航 -->
    <el-header>
      <mo-head-menu @loginout="loginout"></mo-head-menu>
    </el-header>
    <el-container>
      <!-- 菜单 -->
      <el-aside :width="asideWidth">
        <div>
          <span>
            <mo-left-menu :isCollapse="isCollapse" @menu-item="openTab"></mo-left-menu>
          </span>
          <span class="mo-divider">
            <span :title="dividerTitle" v-html="dividerIcon" @click="isCollapse = !isCollapse"></span>
          </span>
        </div>
      </el-aside>
      <!-- 显示主体 -->
      <el-main>
        <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
          <el-tab-pane v-for="item in editableTabs" :key="item.componentName" :label="item.title"
            :name="item.componentName">
            <component :is="item.component" ref="childComponent" @menu-item="openTab" :params="childParams"></component>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>

import MoHeadMenu from './mo-head-menu.vue';
import MoLeftMenu from './mo-left-menu.vue';
import { computed, markRaw, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import localStorage from 'local-storage';


// 回调对象
const emits = defineEmits(['change-page']);


// 侧边栏是否展开
const isCollapse = ref(false);
// 当前活动标签值
const editableTabsValue = ref('');
// 标签数组
const editableTabs = ref([]);
// 子组件
const childComponent = ref();
// 子组件参数
const childParams = ref({});


// 侧边栏宽度
const asideWidth = computed(() => isCollapse.value ? '73px' : '200px');
// 侧边分界线标题
const dividerTitle = computed(() => isCollapse.value ? '展开' : '收起');
// 侧边分界线显示图标
const dividerIcon = computed(() => isCollapse.value ? '&raquo;' : '&laquo;');


/**
 * 打开菜单对应标签页
 *
 * @param {Object} data 打开标签数据：data.title（标题）、data.componentName（组件名）
 */
const openTab = data => {
  const { title, componentName, params } = data;
  const tabs = editableTabs.value;
  childParams.value = params || {};
  import(`./components/${componentName}.vue`).then((component) => {
    if (!containsObject(tabs, { componentName })) {
      tabs.push({
        title,
        componentName,
        component: markRaw(component)
      });
    }
    editableTabsValue.value = componentName;
  });
};

/**
 * 删除标签页
 *
 * @param {string} targetName 删除的目标标签页名称
 */
const removeTab = async (targetName) => {
  if (childComponent.value.notSaved) {
    const result = await ElMessageBox.confirm(
      '存在修改内容未保存，确定要关闭?',
      '系统提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    ).catch(() => 'cancel');
    if (result === 'cancel') {
      return;
    }
  }
  const tabs = editableTabs.value;
  let activeName = editableTabsValue.value;
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.componentName === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.componentName;
        }
      }
    });
  }
  editableTabsValue.value = activeName;
  editableTabs.value = tabs.filter((tab) => tab.componentName !== targetName);
};

/**
 * 判断数组arr中是否包含属性相同的对象
 *
 * @param {Array} arr 数组
 * @param {Object} obj 对象
 */
const containsObject = (arr, obj) => {
  const keys = Object.keys(obj);
  const index = arr.findIndex((item) => {
    for (const key of keys) {
      if (item[key] !== obj[key]) {
        return false;
      }
    }
    return true;
  });
  return index > -1;
}

/**
 * 退出登录
 */
const loginout = () => {
  localStorage.removeItem('token');
  emits('change-page', { componentName: 'mo-login' });
}


// 初始化操作
(() => {
  // 打开首页
  openTab({
    title: '首页',
    componentName: 'mo-main',
  });
})();

</script>

<style>
.el-tabs__nav .el-tabs__item:nth-child(1) i {
  display: none;
}
</style>
<style scoped>
.el-header {
  padding: 0;
  height: 60px;
  background-color: #505860;
  border-bottom: 1px solid #ffd04b;
}

.el-aside {
  background-color: #545c64;
}

.el-main {
  padding: 5px;
  background-color: #596172;
}

.el-tabs {
  height: 99.5%;
  border-radius: 5px;
}

.el-aside>div {
  height: calc(100vh - 60px);
  display: flex;
  justify-content: space-between;
}

.el-aside>div>span:first-child {
  width: 191px;
}

.mo-divider {
  width: 9px;
  height: 100%;
  background-color: #bebebe;
  display: flex;
  align-items: center;
  z-index: 999;
}

.mo-divider>span {
  user-select: none;
  cursor: pointer;
}
</style>

