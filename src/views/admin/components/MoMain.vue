<template>
  <div>
    <md-editor-v3 v-model="articleData" :previewOnly="true" style="height: 100%">
    </md-editor-v3>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import appConfig from 'app-config';
import MdEditorV3 from '@md-editor-v3.js';
import '@md-editor-v3.css';


// 文章数据
const articleData = ref('');


// 初始化操作
(() => {
  fetch(appConfig.params.markdownStatic + 'README.md')
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      articleData.value = data;
    });
})();

</script>