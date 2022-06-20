<template>
    <div>
        <el-scrollbar ref="scrollbar" @scroll="scrollHandle">
            <h1 class="mo-title">{{ props.params.articleData.title }}</h1>
            <p>类型：<el-tag type="danger" size="small">{{ props.params.articleData.type }}</el-tag>
            </p>
            <p>摘要：{{ props.params.articleData.description }}</p>
            <md-editor-v3 v-model="props.params.articleData.content" :previewOnly="true" style="height: 100%">
            </md-editor-v3>
        </el-scrollbar>
        <div v-if="scrollTopRef > 200" class="mo-go-top" title="返回顶部" @click="goTop">
            <e-icon icon-name="el-icon-caret-top" />
        </div>
    </div>
</template>

<script setup>

import MdEditorV3 from "@md-editor-v3.js";
import "@md-editor-v3.css";
const { ref } = window["Vue"];


// 参数
const props = defineProps({
    params: {
        type: Object,
        default: () => ({})
    },
});


// 滚动条
const scrollbar = ref();
// 滚动高度距离
const scrollTopRef = ref(0);
// 是否正在返回顶部
const isGoTop = ref(false);


/**
 * 滚动事件
 * 
 * @param {number} scrollTop 滚动高度
 */
const scrollHandle = ({ scrollTop }) => scrollTopRef.value = scrollTop;

/**
 * 返回顶部
 */
const goTop = () => {
    if (isGoTop.value) {
        return;
    }
    isGoTop.value = true;
    let scrollTop = scrollTopRef.value;
    const distance = Math.ceil(scrollTop / 100);
    const timer = setInterval(() => {
        if (scrollTop > distance) {
            scrollTop -= distance;
        } else {
            scrollTop = 0;
            clearInterval(timer);
            isGoTop.value = false;
        }
        scrollbar.value.setScrollTop(scrollTop);
    }, 5);
}

</script>

<style scoped>
.mo-title {
    font-size: 24px;
}

.el-scrollbar {
    margin: 0 auto;
    height: 84vh;
    width: 80vw;
}

.mo-go-top {
    position: fixed;
    right: 100px;
    bottom: 100px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #fff;
    padding: 10px;
    cursor: pointer;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    text-align: center;
    font-size: 22px;
    color: #409eff;
}

.mo-go-top:hover {
    background: #ebedf0;
}
</style>