<template>
    <div class="mo-image-uploader">
        <el-upload
            :file-list="imageFileList"
            action=""
            list-type="picture-card"
            :multiple="multiple"
            :http-request="handleRequest"
            :on-success="handleSuccess"
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

// 上传组件样式变量
const visibleStyle = '--mo-image-uploader-upload-display: inline-block';
const hiddenStyle = '--mo-image-uploader-upload-display: none';
const uploadStyleVariable = computed(() =>
    !props.imageUrl || props.imageUrl.trim() === '' ? visibleStyle : hiddenStyle
);

// 图片文件列表
const imageFileList = computed({
    get: () => {
        if (!props.imageUrl) {
            return [];
        }
        const imageUrl = props.imageUrl.trim();
        if (imageUrl === '') {
            return [];
        }
        const images = imageUrl.split(',');
        if (!props.multiple) {
            return [{ url: images[0] }];
        } else {
            return images.map((url) => ({ url }));
        }
    },
    set: (value) => {
        let newImageUrl = value.map((image) => image.url).join(',');
        if (newImageUrl === '') {
            newImageUrl = ' ';
        }
        emits('update:imageUrl', newImageUrl);
    }
});

/**
 * 请求事件
 *
 * @param {any} options 请求参数
 */
const handleRequest = async (options) => {
    return new Response();
};

/**
 * 请求成功事件
 *
 * @param {Response} response 请求响应对象
 * @param {any} uploadFile 已上传图片文件信息
 * @param {any} uploadImageFiles 已上传图片文件信息列表
 */
const handleSuccess = (response, uploadImageFile, uploadImageFiles) => {
    imageFileList.value = uploadImageFiles;
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
    z-index: 2002 !important;
}
</style>
