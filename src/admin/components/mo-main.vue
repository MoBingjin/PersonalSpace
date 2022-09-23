<template>
  <div>
    <md-editor-v3 v-model="articleData" :previewOnly="true" style="height: 100%">
    </md-editor-v3>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { params } from 'mo-config';
import MdEditorV3 from '@md-editor-v3.js';
import '@md-editor-v3.css';


const { markdownStatic } = params;

// 文章数据
const articleData = ref('');


// 初始化操作
(() => {
  fetch(markdownStatic + 'README.md')
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      articleData.value = data;
    });
})();

</script>