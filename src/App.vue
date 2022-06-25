<template>
  <component :is="currentComponent"></component>
</template>

<script setup>

const { markRaw, ref } = window["Vue"];
const { adminEntrance } = window['MoConfig'].params;


// 当前子组件
const currentComponent = ref(null);


// 初始化操作
(async () => {
  const mainDir = new URL(window.location.href).searchParams.has(adminEntrance) ? 'admin' : 'home';
  try {
    currentComponent.value = markRaw(await import(`./${mainDir}/App.vue`));
  } catch (error) {
    console.log(error);
    currentComponent.value = markRaw(await import("./common/components/404.vue"));
  }
})();

</script>

