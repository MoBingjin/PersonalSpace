<template>
    <div class="mo-image-uploader">
        <el-upload
            list-type="picture-card"
            :file-list="imageFileList"
            :action="imageApi.upload"
            :headers="headers"
            :multiple="multiple"
            :before-upload="handleBeforeUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :style="!multiple ? uploadStyleVariable : ''"
        >
            <e-icon icon-name="el-icon-plus" />
        </el-upload>
        <teleport to="body">
            <el-image-viewer
                class="mo-image-uploader__preview"
                v-if="dialogImageUrl !== ''"
                :url-list="[dialogImageUrl]"
                @close="dialogImageUrl = ''"
            />
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
    // 已上传图片URL
    imageUrl: {
        type: String,
        default: ''
    },
    // 是否支持多张图片
    multiple: {
        type: Boolean,
        default: false
    }
});

// 回调
const emits = defineEmits(['update:imageUrl']);

// 图片预览对话框图片路径
const dialogImageUrl = ref('');
// 当multiple为false时, 判断是否存在文件
const existFileWhenNotMultiple = ref(false);
// 上传请求headers
const headers = {
    Authorization: 'Bearer ' + storage.get('token')
};

// 上传组件样式变量
const uploadStyleVariable = computed(() =>
    existFileWhenNotMultiple.value
        ? '--mo-image-uploader-upload-display: none'
        : '--mo-image-uploader-upload-display: inline-block'
);

// 图片文件列表
const imageFileList = computed({
    get: () => {
        if (!props.imageUrl) {
            existFileWhenNotMultiple.value = false;
            return [];
        }
        const imageUrl = props.imageUrl.trim();
        if (imageUrl === '') {
            existFileWhenNotMultiple.value = false;
            return [];
        }
        existFileWhenNotMultiple.value = true;
        const images = imageUrl.split(',');
        if (!props.multiple) {
            return [{ url: images[0] }];
        } else {
            return images.map((url) => ({ url }));
        }
    },
    set: (value) => {
        emits('update:imageUrl', value.map((image) => image.url).join(','));
    }
});

/**
 * 上传文件前事件
 *
 * @param {any} rawImageFile 上传文件
 */
const handleBeforeUpload = (rawImageFile) => {
    if (rawImageFile.size / 1024 / 1024 > 100) {
        ElMessage({ message: '图片文件不能大于100MB!', type: 'error' });
        return false;
    }
    existFileWhenNotMultiple.value = true;
    return true;
};

/**
 * 请求成功事件
 *
 * @param {Response} response 请求响应对象
 * @param {any} uploadImageFile 已上传图片文件信息
 * @param {any} uploadImageFiles 已上传图片文件信息列表
 */
const handleSuccess = async (response, uploadImageFile, uploadImageFiles) => {
    await fetch(response.data.fileURL, { mode: 'no-cors' });
    uploadImageFile.url = response.data.fileURL;
    imageFileList.value = uploadImageFiles;
};

/**
 * 请求失败事件
 *
 * @param {Error} error 错误
 */
const handleError = (error) => {
    console.log(error.message);
    ElMessage({ message: error.message, type: 'error' });
    existFileWhenNotMultiple.value = false;
};

/**
 * 图片预览事件
 *
 * @param {any} uploadImageFile 已上传图片文件信息
 */
const handlePictureCardPreview = (uploadImageFile) => {
    dialogImageUrl.value = uploadImageFile.url;
};

/**
 * 删除事件
 *
 * @param {any} uploadImageFile 删除的已上传图片文件信息
 * @param {any} uploadImageFiles 已上传图片文件信息列表
 */
const handleRemove = (uploadImageFile, uploadImageFiles) => {
    existFileWhenNotMultiple.value = false;
    imageFileList.value = uploadImageFiles;
};
</script>

<style scoped>
@layer MoImageUploader {
    * {
        --mo-image-uploader-upload-display: inline-block;
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

.mo-image-uploader >>> .el-upload.el-upload--picture-card i {
    font-size: 20px;
    margin-top: 26px;
}

.mo-image-uploader__preview.el-image-viewer__wrapper {
    z-index: 3000 !important;
}
</style>
