<template>
  <el-container v-loading="loading">
    <el-header>
      <el-form :model="form" ref="formComponent" :rules="rules">
        <el-form-item class="mo-inline-block" prop="title">
          <el-input class="mo-title-input" v-model="form.title" placeholder="请输入标题（长度5~100）" minlength="5"
            maxlength="100" :show-word-limit="true">
            <template #prepend>标题</template>
          </el-input>
        </el-form-item>
        <el-form-item class="mo-inline-block" prop="type">
          <el-select v-model="form.type" placeholder="请选择文章类型">
            <el-option v-for="item in typeList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item prop="description">
          <el-input v-model="form.description" placeholder="请输入摘要（长度5~300）" type="textarea" rows="4" minlength="5"
            maxlength="300" :show-word-limit="true">
            <template #prepend>摘要</template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <md-editor-v3 v-model="form.content" placeholder="请输入文章内容" @onUploadImg="onUploadImg" @onSave="onSave"
        style="height: 60vh"></md-editor-v3>
    </el-main>
  </el-container>
</template>

<script setup>

import { computed, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import storage from '@/utils/storage.mod.js';
import MdEditorV3 from 'md-editor-v3.js';
import 'md-editor-v3.css';

const api = storage.getObject('api');

// 参数
const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  },
});

// 表单默认值
const defaultForm = {
  articleId: '',
  title: '',
  type: '原创',
  description: '',
  content: ''
}

// 表单对象
const form = reactive(props.params['articleData'] || defaultForm);
// 旧表单JSON字符串
const oldForm = ref(JSON.stringify(props.params['articleData'] || defaultForm));
// 表单校验
const rules = reactive({
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度应为5~100', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '摘要不能为空', trigger: 'blur' },
    { min: 5, max: 300, message: '摘要长度应为5~300', trigger: 'blur' }
  ],
});
// 文章类型列表
const typeList = reactive(['原创', '转载', '其他']);
// 是否显示加载动画
const loading = ref(false);
// 表单组件
const formComponent = ref();


// 是否存在修改未保存
const notSaved = computed(() => oldForm.value !== JSON.stringify(form));


/**
 * 图片上传
 * 
 * @param {Array<File>} files 图片文件集
 * @param {Function} callback 回调函数
 */
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const type = file.name.substring(file.name.lastIndexOf('.') + 1);
        const reader = new FileReader();
        reader.onload = function () {
          const result = String(reader.result);
          const imageBase64 = result.substring(result.indexOf(',') + 1);
          fetch(api.uploadImageURL, {
            method: 'post',
            body: JSON.stringify({ type, imageBase64 }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then((res) => res.json())
            .then((data) => rev(data))
            .catch((error) => rej(error));
        };
        reader.readAsDataURL(file);
      });
    })
  );
  callback(res.map((item) => item.data.imageURL));
};


/**
 * 保存
 * 
 * @param {string} value 文章内容文本 
 */
const onSave = value => {
  formComponent.value.validate(async (valid) => {
    if (valid) {
      if (!value) {
        const result = await ElMessageBox.confirm('当前没有文章内容，是否保存?', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).catch(() => 'cancel');
        if (result === 'cancel') {
          return;
        }
      }
      // 显示加载动画
      loading.value = true;
      fetch(api.publishArticleURL, {
        method: 'post',
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((data) => {
          // 关闭加载动画
          loading.value = false;
          ElMessageBox.alert(`文章发布${data.code === 0 ? '成功' : '失败'}！`, '系统提示', { confirmButtonText: '确定' });
          form.articleId = data.data;
          oldForm.value = JSON.stringify(form);
          console.log(data.message);
        })
        .catch((error) => {
          // 关闭加载动画
          loading.value = false;
          ElMessageBox.alert('文章发布失败！', '系统提示', { confirmButtonText: '确定' });
          console.log(error);
        });
    }
  });
};


// 对外属性
defineExpose({ notSaved });

</script>

<style scoped>
.el-header {
  padding: 0;
  height: 176px;
}

.el-main {
  padding: 0;
}

.el-form-item {
  margin: 0 0 20px 0;
}

.el-select {
  width: 80px;
}

.mo-title-input {
  width: 40vw;
  margin-right: 10px;
}

.mo-inline-block {
  display: inline-block !important;
}
</style>