<template>
  <component :is="currentComponent" @change-page="changePage"></component>
</template>

<script setup>

const { markRaw, ref } = window["Vue"];
const { checkUserURL } = window["MoConfig"].api;
const localStorage = window["localStorage"];


// 当前子组件
const currentComponent = ref(null);


/**
 * 修改页面
 * 
 * @param {any} data 
 */
const changePage = data => import(`./${data["componentName"]}.vue`).then(component => currentComponent.value = markRaw(component));


// 初始化操作
(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetch(checkUserURL, {
      method: "post",
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === 0) {
          changePage({ componentName: "mo-panel" });
        } else {
          window["localStorage"].removeItem("token");
          changePage({ componentName: "mo-login" });
        }
      })
      .catch(() => changePage({ componentName: "../common/componets/404" }));
  } else {
    changePage({ componentName: "mo-login" });
  }
})();

</script>

