<template>
  <component :is="currentComponent"></component>
</template>

<script setup>

import { markRaw, ref } from 'vue';
import { params } from 'mo-config';


// 当前子组件
const currentComponent = ref(null);


// 初始化操作
(async () => {
  const mainDir = new URL(window.location.href).searchParams.has(params.adminEntrance) ? 'admin' : 'home';
  try {
    currentComponent.value = markRaw(await import(`./${mainDir}/App.vue`));
  } catch (error) {
    console.log(error);
    currentComponent.value = markRaw(await import('./common/components/404.vue'));
  }
})();

</script>

