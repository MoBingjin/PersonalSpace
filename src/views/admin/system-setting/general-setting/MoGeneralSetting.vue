<template>
    <div class="mo-general-setting">
        <el-scrollbar class="mo-general-setting__scrollbar">
            <el-card class="mo-general-setting__box-card">
                <template #header>
                    <div class="mo-general-setting__card-header">
                        <span>常规设置</span>
                        <el-button type="primary" @click="handleSave">保存</el-button>
                    </div>
                </template>
                <el-form :model="form" ref="formComponent" :rules="rules" label-width="140px">
                    <el-form-item label="网站用户名" prop="user">
                        <el-input v-model="form.user" placeholder="网站用户名" />
                    </el-form-item>
                    <el-form-item label="网站用户头像">
                        <el-input
                            v-model="form.avatarImageURL"
                            placeholder="网站用户头像, 默认为/public/img/avatar.png"
                        />
                    </el-form-item>
                    <el-form-item label="前台背景图片">
                        <el-input
                            v-model="form.backgroundImageURL"
                            placeholder="前台背景图片, 默认为/public/img/background.png"
                        />
                    </el-form-item>
                    <el-form-item label="文章默认封面">
                        <el-input
                            v-model="form.defaultCoverImageURL"
                            placeholder="文章默认封面, 默认为/public/img/default_cover.png"
                        />
                    </el-form-item>
                    <el-form-item label="404页面图片">
                        <el-input v-model="form._404ImageURL" placeholder="404页面图片, 默认为/public/img/404.png" />
                    </el-form-item>
                    <el-form-item label="网页标题">
                        <el-input
                            class="mo-general-setting__sub-item"
                            v-model="form.title.home"
                            placeholder="前台网页标题"
                        >
                            <template #prepend>前台</template>
                        </el-input>
                        <el-input
                            class="mo-general-setting__sub-item"
                            v-model="form.title.admin"
                            placeholder="后台网页标题"
                        >
                            <template #prepend>后台</template>
                        </el-input>
                        <el-input
                            class="mo-general-setting__sub-item mo-general-setting__sub-item--last"
                            v-model="form.title._404"
                            placeholder="错误网页标题"
                        >
                            <template #prepend>错误</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="分页数据条数">
                        <el-input
                            class="mo-general-setting__sub-item"
                            v-model="form.pageSize.home"
                            type="number"
                            placeholder="前台分页数据条数"
                        >
                            <template #prepend>前台</template>
                        </el-input>
                        <el-input
                            class="mo-general-setting__sub-item mo-general-setting__sub-item--last"
                            v-model="form.pageSize.admin"
                            type="number"
                            placeholder="后台分页数据条数"
                        >
                            <template #prepend>后台</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="后台管理入口">
                        <el-input v-model="form.adminEntrance" placeholder="后台管理入口, 默认为admin" />
                    </el-form-item>
                </el-form>
            </el-card>
        </el-scrollbar>
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
    user: '',
    backgroundImageURL: '',
    avatarImageURL: '',
    defaultCoverImageURL: '',
    _404ImageURL: '',
    title: {
        home: '',
        admin: '',
        _404: ''
    },
    pageSize: {
        admin: '',
        home: ''
    },
    adminEntrance: ''
});

// 校验规则
const rules = {
    user: [{ required: true, message: '请输入网站用户名', trigger: 'blur' }]
};

/**
 * 初始化
 */
const init = () => {
    settingService
        .map([
            // 网站用户名
            'user',
            // 后台管理入口
            'adminEntrance',
            // 网站用户头像
            'avatarImageURL',
            // 前台背景图片
            'backgroundImageURL',
            // 文章默认封面
            'defaultCoverImageURL',
            // 404页面图片
            '_404ImageURL',
            // 网页标题
            'title',
            // 分页列表每页显示数据条数
            'pageSize'
        ])
        .then((res) => {
            form.user = res.data['user'];
            form.adminEntrance = res.data['adminEntrance'];
            form.avatarImageURL = res.data['avatarImageURL'];
            form.backgroundImageURL = res.data['backgroundImageURL'];
            form.defaultCoverImageURL = res.data['defaultCoverImageURL'];
            form._404ImageURL = res.data['_404ImageURL'];
            form.title = JSON.parse(res.data['title']);
            form.pageSize = JSON.parse(res.data['pageSize']);
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

<style scoped>
.mo-general-setting {
    flex: 1;
}

.mo-general-setting__scrollbar {
    position: absolute;
    box-sizing: border-box;
    padding: 15px;
}

.mo-general-setting__box-card {
    width: 60%;
    min-width: 850px;
}

.mo-general-setting__card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.mo-general-setting__sub-item {
    width: 60%;
    min-width: 500px;
    margin-bottom: 10px;
}

.mo-general-setting__sub-item--last {
    margin-bottom: 0;
}
</style>
