<template>
    <div class="mo-image-uploader">
        <el-upload
            list-type="picture-card"
            :file-list="fileList"
            :action="imageApi.upload"
            :headers="headers"
            :multiple="multiple"
            :before-upload="handleBeforeUpload"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :style="!multiple ? singleStyleVariable : ''"
        >
            <e-icon icon-name="el-icon-plus" />
        </el-upload>
        <teleport to="body">
            <el-image-viewer v-if="dialogImageUrl !== ''" :url-list="[dialogImageUrl]" @close="dialogImageUrl = ''" />
        </teleport>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { imageApi } from '@/api/image-service.mod.js';
import storage from '@/utils/storage.mod.js';

// 参数
const props = defineProps({
    // 已上传图片列表
    imageFileList: {
        type: Array,
        default: []
    },
    // 是否支持多张图片
    multiple: {
        type: Boolean,
        default: false
    }
});

// 回调
const emits = defineEmits(['update:imageFileList']);

// 图片预览对话框图片路径
const dialogImageUrl = ref('');
// 上传请求headers
const headers = {
    Authorization: 'Bearer ' + storage.get('token')
};

// 文件列表
const fileList = computed({
    get: () => props.imageFileList,
    set: (value) => emits('update:imageFileList', value)
});

// 单文件组件样式变量
const singleStyleVariable = computed(
    () => `--mo-image-uploader-upload-display: ${props.imageFileList.length > 0 ? 'none' : 'inline-flex'}`
);

/**
 * 上传文件前事件
 *
 * @param {any} rawFile 上传文件
 */
const handleBeforeUpload = (rawFile) => {
    if (rawFile.size / 1024 / 1024 > 100) {
        ElMessage({ message: '图片文件不能大于100MB!', type: 'error' });
        return false;
    }
    return true;
};

/**
 * 请求过程事件
 *
 * @param {Event} event 上传过程事件
 * @param {any} uploadFile 上传文件信息
 * @param {any} uploadFiles 上传文件信息列表
 */
const handleProgress = (event, uploadFile, uploadFiles) => {
    fileList.value = uploadFiles;
};

/**
 * 请求成功事件
 *
 * @param {Response} response 请求响应对象
 * @param {any} uploadFile 上传文件信息
 * @param {any} uploadFiles 上传文件信息列表
 */
const handleSuccess = (response, uploadFile, uploadFiles) => {
    uploadFile.url2 = response.data.fileURL;
    fileList.value = uploadFiles;
};

/**
 * 请求失败事件
 *
 * @param {Error} error 错误
 * @param {any} uploadFile 上传文件信息
 * @param {any} uploadFiles 上传文件信息列表
 */
const handleError = (error, uploadFile, uploadFiles) => {
    console.log(error.message);
    ElMessage({ message: error.message, type: 'error' });
    fileList.value = uploadFiles;
};

/**
 * 图片预览事件
 *
 * @param {any} uploadFile 上传文件信息
 */
const handlePictureCardPreview = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url;
};

/**
 * 删除事件
 *
 * @param {any} uploadFile 上传文件信息
 * @param {any} uploadFiles 上传文件信息列表
 */
const handleRemove = (uploadFile, uploadFiles) => {
    fileList.value = uploadFiles;
};
</script>

<style scoped>
@layer MoImageUploader {
    * {
        --mo-image-uploader-upload-display: inline-flex;
    }
}

.mo-image-uploader >>> .el-upload-list.el-upload-list--picture-card .el-upload-list__item {
    width: 72px;
    height: 72px;
    margin: 0 4px 4px 0;
    transition: unset;
    vertical-align: bottom;
}

.mo-image-uploader >>> .el-upload.el-upload--picture-card {
    display: var(--mo-image-uploader-upload-display);
    width: 72px;
    height: 72px;
    margin: 0 4px 4px 0;
}
</style>
