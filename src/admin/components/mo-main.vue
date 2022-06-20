<template>
  <div v-html="html"></div>
</template>

<script setup>

import showdown from "@showdown.js";
const { ref } = window["Vue"];
const { markdownStatic } = window["MoConfig"].params;


// 显示html文本
const html = ref("");


// 初始化操作
(() => {
  fetch(markdownStatic + "README.md")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const converter = new showdown.Converter();
      html.value = converter.makeHtml(data);
    });
})();

</script>