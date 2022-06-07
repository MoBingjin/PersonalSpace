<template>
  <el-container>
    <!-- 导航 -->
    <el-header>
      <mo-head-menu></mo-head-menu>
    </el-header>
    <el-container>
      <!-- 菜单 -->
      <el-aside :width="asideWidth">
        <div>
          <span>
            <mo-left-menu
              :isCollapse="isCollapse"
              @menu-item="openTab"
            ></mo-left-menu>
          </span>
          <span class="mo-divider">
            <span
              :title="dividerTitle"
              v-html="dividerIcon"
              @click="isCollapse = !isCollapse"
            ></span>
          </span>
        </div>
      </el-aside>
      <!-- 显示主体 -->
      <el-main>
        <el-tabs
          v-model="editableTabsValue"
          type="border-card"
          closable
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.componentName"
            :label="item.title"
            :name="item.componentName"
          >
            <component :is="item.component"></component>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MoHeadMenu from "./components/mo-head-menu.vue";
import MoLeftMenu from "./components/mo-left-menu.vue";

const { markRaw } = Vue;

export default {
  components: {
    "mo-head-menu": MoHeadMenu,
    "mo-left-menu": MoLeftMenu,
  },
  data() {
    return {
      isCollapse: false,
      editableTabsValue: "",
      editableTabs: [],
      tabIndex: 0,
    };
  },
  computed: {
    asideWidth() {
      return this.isCollapse ? "73px" : "200px";
    },
    dividerTitle() {
      return this.isCollapse ? "展开" : "收起";
    },
    dividerIcon() {
      return this.isCollapse ? "&raquo;" : "&laquo;";
    },
  },
  created() {
    // 打开主页
    this.openTab({
      title: "主页",
      componentName: "mo-main",
    });
  },
  methods: {
    /**
     * 打开菜单对应标签页
     *
     * @param data 打开标签数据：data.title（标题）、data.componentName（组件名）
     */
    openTab(data) {
      const { title, componentName } = data;
      const tabs = this.editableTabs;
      import(`./components/${componentName}.vue`).then((component) => {
        if (!this.containsObject(tabs, { componentName })) {
          tabs.push({
            title,
            componentName,
            component: markRaw(component),
          });
        }
        this.editableTabsValue = componentName;
      });
    },
    /**
     * 删除标签页
     *
     * @param targetName 删除的目标标签页名称
     */
    removeTab(targetName) {
      const tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
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
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(
        (tab) => tab.componentName !== targetName
      );
    },
    /**
     * 判断数组arr中是否包含属性相同的对象
     *
     * @param arr 数组
     * @param obj 对象
     */
    containsObject(arr, obj) {
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
    },
  },
};
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
.el-aside > div {
  height: calc(100vh - 60px);
  display: flex;
  justify-content: space-between;
}
.el-aside > div > span:first-child {
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
.mo-divider > span {
  user-select: none;
  cursor: pointer;
}
</style>