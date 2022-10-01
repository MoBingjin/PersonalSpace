<template>
    <div class="mo-management">
        <el-container>
            <el-header class="mo-management__header">
                <mo-toolbar
                    :model="model.toolbar"
                    @add="emits('add')"
                    @remove-batch="emits('remove-batch')"
                    @search="(params) => emits('search', params)"
                />
            </el-header>
            <el-main class="mo-management__main">
                <slot name="list"></slot>
            </el-main>
            <el-footer class="mo-management__footer">
                <el-pagination
                    layout="prev, pager, next"
                    :page-size="model.pageSize"
                    :current-page="model.page"
                    :total="model.total"
                    :hide-on-single-page="true"
                    @current-change="(page) => emits('change-page', page)"
                />
            </el-footer>
        </el-container>
        <slot name="dialog"></slot>
    </div>
</template>

<script setup>
import MoToolbar from './MoToolbar.vue';
import { reactive } from 'vue';
import appConfig from '@/app.config.mod.js';

//参数
defineProps({
    model: {
        type: Object,
        default: () =>
            reactive({
                toolbar: {
                    key: ''
                },
                pageSize: appConfig.pageSize['admin'],
                page: 1,
                total: 0
            })
    }
});

// 回调事件
const emits = defineEmits(['add', 'remove-batch', 'search', 'change-page']);
</script>

<style scoped>
@layer MoManagement {
    * {
        --mo-management-header-height: 56px;
    }
}

.mo-management__header.el-header {
    height: var(--mo-management-header-height);
    padding: 10px 5px;
}

.mo-management__main.el-main,
.mo-management__footer.el-footer {
    padding: 0;
}
</style>
