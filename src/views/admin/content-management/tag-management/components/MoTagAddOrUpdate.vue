<template>
    <div class="mo-tag-dialog">
        <el-dialog v-model="dialogFormVisible" :title="title" width="400px">
            <el-form :model="dataForm" ref="dataFormComponent" :rules="rules">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="请输入标签名称" maxlength="128" size="small" />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="dataForm.description" placeholder="请输入标签描述" maxlength="255" size="small" />
                </el-form-item>
                <el-form-item label="状态" prop="status" :label-width="'50px'" v-if="dataForm.id">
                    <el-switch v-model="dataForm.status" class="ml-2" size="small"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="confirm">{{title}}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>

import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import tagService from '@/api/tag-service.mod.js';

// 回调对象
const emits = defineEmits(['refresh']);

// 对话框是否显示
const dialogFormVisible = ref(false);
// 对话框标题
const title = ref('添加');
// 表单数据对象
const dataForm = reactive({
    id: null,
    name: '',
    description: '',
    status: true
});
// 表单校验
const rules = reactive({
    name: [
        { required: true, message: '标签名称不能为空!', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '标签描述不能为空!', trigger: 'blur' }
    ],
});
// 表单数据组件
const dataFormComponent = ref();


/**
 * 初始化操作
 */
const init = (id) => {
    clearDataForm();
    title.value = id ? '更新' : '添加';
    if (id) {
        // 获取标签数据
        tagService.infoTag(id)
            .then(res => {
                console.log(res.message);
                if (res.code === 0) {
                    dataForm.id = res.data.id;
                    dataForm.name = res.data.name;
                    dataForm.description = res.data.description;
                    dataForm.status = res.data.status;
                    dialogFormVisible.value = true;
                } else {
                    ElMessageBox.alert("获取标签信息失败!", '系统提示', { confirmButtonText: '确定' });
                }
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        dialogFormVisible.value = true;
    }
};

/**
 * 取消操作
 */
const cancel = () => {
    dialogFormVisible.value = false;
};

/**
 * 确定操作
 */
const confirm = () => {
    dataFormComponent.value.validate(async (valid) => {
        if (valid) {
            if (!dataForm.id) {
                // 添加
                add();
            } else {
                // 更新
                update();
            }
        }
    });
};

/**
 * 添加
 */
const add = async () => {
    tagService.addTag(dataForm)
        .then(res => {
            if (res.code === 0) {
                ElMessage({ message: '添加成功！', type: 'success' });
                refresh();
                dialogFormVisible.value = false;
            } else {
                ElMessageBox.alert(`添加失败！${res.message}: ${res.data.errorMessage}`, '系统提示', { confirmButtonText: '确定' });
            }
        })
        .catch(error => {
            console.log(error);
        });
};

/**
 * 更新
 */
const update = async () => {
    tagService.updateTag(dataForm)
        .then(res => {
            if (res.code === 0) {
                ElMessage({ message: '更新成功！', type: 'success' });
                refresh();
                dialogFormVisible.value = false;
            } else {
                ElMessageBox.alert(`更新失败！${res.message}: ${res.data.errorMessage}`, '系统提示', { confirmButtonText: '确定' });
            }
        })
        .catch(error => {
            console.log(error);
        });
};

/**
 * 清空表单数据
 */
const clearDataForm = () => {
    dataForm.id = null;
    dataForm.name = '';
    dataForm.description = '';
    dataForm.status = true;
};

/**
 * 刷新列表
 */
const refresh = () => emits('refresh');

// 暴露参数
defineExpose({
    dialogFormVisible,
    init
});

</script>

<style>
.mo-tag-dialog .el-dialog__body {
    padding-bottom: 5px;
}
</style>
