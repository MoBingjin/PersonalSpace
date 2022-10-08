<template>
    <div class="mo-upload-setting">
        <el-form :model="form" ref="formComponent" :rules="rules" label-width="140px">
            <el-form-item label="用户登录ID" prop="yLogin">
                <el-input v-model="form.yLogin" />
            </el-form-item>
            <el-form-item label="PHP磁盘信息" prop="phpDiskInfo">
                <el-input v-model="form.phpDiskInfo" type="textarea" />
            </el-form-item>
            <el-form-item label="文件存储文件夹ID" prop="folderId">
                <el-input v-model="form.folderId" />
            </el-form-item>
            <el-form-item label="文件下载源站" prop="downloadOrigin">
                <el-input v-model="form.downloadOrigin" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSave">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import settingService from '@/api/setting-service.mod.js';

// 表单数据组件
const formComponent = ref();
// 表单数据对象
const form = reactive({
    yLogin: '',
    phpDiskInfo: '',
    folderId: '',
    downloadOrigin: ''
});

// 校验规则
const rules = {
    yLogin: [{ required: true, message: '请输入用户登录ID', trigger: 'blur' }],
    phpDiskInfo: [{ required: true, message: '请输入PHP磁盘信息', trigger: 'blur' }],
    folderId: [{ required: true, message: '请输入文件存储文件夹ID', trigger: 'blur' }],
    downloadOrigin: [{ required: true, message: '请输入文件下载源站', trigger: 'blur' }]
};

/**
 * 初始化
 */
const init = () => {
    settingService
        .map(['lanzou'])
        .then((res) => {
            const settings = JSON.parse(res.data['lanzou']);
            form.yLogin = settings['ylogin'];
            form.phpDiskInfo = settings['phpdisk_info'];
            form.folderId = settings['folder_id'];
            form.downloadOrigin = settings['download_origin'];
        })
        .catch((error) => {});
};

/**
 * 保存事件
 */
const handleSave = () => {
    formComponent.value.validate((valid) => {
        if (valid) {
            settingService
                .update({
                    lanzou: JSON.stringify({
                        ylogin: form.yLogin,
                        phpdisk_info: form.phpDiskInfo,
                        folder_id: form.folderId,
                        download_origin: form.downloadOrigin
                    })
                })
                .then((res) => {
                    ElMessage({ message: '保存成功!', type: 'success' });
                })
                .catch((error) => {});
        }
    });
};

// 初始化操作
(() => {
    init();
})();
</script>

<style scoped></style>
