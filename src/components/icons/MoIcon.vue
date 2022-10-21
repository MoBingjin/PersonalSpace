<template>
    <svg :width="width" :height="height" :fill="fill">
        <use :xlink:href="iconLink" />
    </svg>
</template>

<script setup>
import { computed, ref } from 'vue';
import store from '@/store/store.mod.js';
import iconConfig from '@/assets/icons/icon.config.json';

// 参数
const prop = defineProps({
    // 图标名
    iconName: {
        type: String,
        default: ''
    },
    // 图标路径名
    iconPathName: {
        type: String,
        default: 'bootstrap'
    },
    // 宽度
    width: {
        type: Number,
        default: 16
    },
    // 高度
    height: {
        type: Number,
        default: 16
    },
    // 填充
    fill: {
        type: String,
        default: 'currentColor'
    }
});

// Blob图标地址
const blobIconURL = ref(store.blobIconURL?.[prop.iconPathName] ?? '');

// 图标地址
const iconURL = computed(() => iconConfig[prop.iconPathName]);
// 图标链接
const iconLink = computed(() => {
    return `${blobIconURL.value}#${prop.iconName}`;
});

// 初始化操作
(() => {
    if (blobIconURL.value === '') {
        // 获取图标Blob地址
        fetch(iconURL.value)
            .then((res) => res.blob())
            .then((blob) => {
                blobIconURL.value = URL.createObjectURL(blob);
                if (!store.blobIconURL) {
                    store.blobIconURL = {};
                }
                store.blobIconURL[prop.iconPathName] = blobIconURL.value;
            });
    }
})();
</script>
