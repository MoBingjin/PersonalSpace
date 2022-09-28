<template>
  <component :is="currentComponent"></component>
</template>

<script setup>

import { markRaw, ref } from 'vue';
import appConfig from '@/app.config.mod.js';
import '@/style/theme.css';


// 当前子组件
const currentComponent = ref(null);


// 初始化操作
(async () => {
  const mainDir = new URL(window.location.href).searchParams.has(appConfig.adminEntrance) ? 'admin' : 'home';
  try {
    currentComponent.value = markRaw(await import(`./views/${mainDir}/Main.vue`));
  } catch (error) {
    console.log(error);
    currentComponent.value = markRaw(await import('./views/common/404.vue'));
  }
})();

</script>

<style>
/* element plus 消息对话框图标错位修复 */
.el-message-box__status {
  position: absolute !important;
}

/* element plus 输入框一键清空按钮错位修复 */
.el-input__suffix-inner {
  align-items: center;
  justify-content: center;
}
</style>
