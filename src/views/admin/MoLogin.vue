<template>
    <div class="login-wrap">
        <div class="mo-login">
            <div class="mo-title">后台管理</div>
            <el-form :model="form" :rules="rules" ref="formComponent" label-width="0px" class="mo-content">
                <el-form-item prop="userName">
                    <el-input v-model="form.userName" placeholder="用户名">
                        <template #prepend>
                            <e-icon icon-name="fa fa-user" />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="form.password" @keyup.enter.native="login()">
                        <template #prepend>
                            <e-icon icon-name="fa fa-lock" />
                        </template>
                    </el-input>
                </el-form-item>
                <div class="mo-login-btn">
                    <el-button type="primary" @click="login()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup>

import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import appConfig from 'app-config';
import localStorage from 'local-storage';


// 回调对象
const emits = defineEmits(['change-page']);


// 表单对象
const form = reactive({
    userName: '',
    password: ''
});
// 校验规则
const rules = reactive({
    userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
});
// 表单组件
const formComponent = ref();


/**
 * 登录
 */
const login = () => {
    formComponent.value.validate(valid => {
        if (valid) {
            fetch(appConfig.api.checkUserURL, {
                method: 'post',
                body: JSON.stringify(form)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code === 0) {
                        ElMessage({ message: '登录成功！', type: 'success' });
                        localStorage.setItem('token', data.data);
                        emits('change-page', { componentName: 'mo-panel' });
                    } else {
                        ElMessage({ message: '用户名或密码有误！', type: 'error' });
                    }
                })
                .catch(() => ElMessage({ message: '登录异常！', type: 'error' }));
        }
    });
}

</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #f3f3f4;
}

.mo-login {
    position: absolute;
    left: 50%;
    top: 40%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.5);
    overflow: hidden;
    box-shadow: 0px 0px 10px #000;
}

.mo-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 30px;
    color: #000;
    border-bottom: 1px solid #ddd;
}

.mo-content {
    padding: 30px 30px;
}

.mo-login-btn {
    text-align: center;
}

.mo-login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
</style>
