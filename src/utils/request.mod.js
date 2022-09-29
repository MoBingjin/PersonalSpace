import { ElMessageBox } from 'element-plus';
import axios from 'axios.js';
import storage from '@/utils/storage.mod.js';

// 创建一个axios实例
const service = axios.create({
    // 基础路径
    baseURL: 'http://localhost:8233/',
    // 请求超时时间（毫秒）
    timeout: 300000,
    // header参数配置
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        const token = storage.get('token');
        if (token) {
            // 配置登录认证token
            config.headers.common['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        console.log(error);
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        console.log(res.message);
        if (res.code !== 0) {
            ElMessageBox.alert(`${res.message}: ${res.data.errorMessage}`, '系统提示', {
                confirmButtonText: '确定',
                type: 'error'
            });
            return Promise.reject(new Error(`${res.message}: ${res.data.errorMessage}` || 'Error'));
        }
        return res;
    },
    (error) => {
        console.log(error);
        ElMessageBox.alert(error.message, '系统提示', { confirmButtonText: '确定', type: 'error' });
        return Promise.reject(error);
    }
);

export default service;
