import service from '@/utils/request.mod.js';

/**
 * 用户接口服务
 */
const userService = {
    /**
     * 登录
     *
     * @param {any} params 登录参数
     * @returns
     */
    login: (params) => service.post('/user/login', params)
};

export default userService;
