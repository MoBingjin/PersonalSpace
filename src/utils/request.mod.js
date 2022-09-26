import { ElMessage } from 'element-plus';
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
    config => {
        const token = storage.get('token');
        if (token) {
            // 配置登录认证token
            config.headers.common['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
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
    response => {
        const res = response.data;
        if (res.code !== 0) {
            console.log(res.message);
            ElMessage({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            });
            return Promise.reject(new Error(res.message || 'Error'));
        }
        return res;
    },
    error => {
        console.log(error);
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default service;