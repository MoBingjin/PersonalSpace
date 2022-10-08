import service from '@/utils/request.mod.js';

const baseURL = service.defaults.baseURL;

/**
 * 设置接口地址
 */
export const settingApi = {
    /**
     * 获取设置项
     */
    map: `${baseURL}/setting/map/`,

    /**
     * 更新设置项
     */
    update: `${baseURL}/setting/update/`
};

/**
 * 设置接口服务
 */
const settingService = {
    /**
     * 获取设置项
     *
     * @param {any} keys 设置项key数组
     * @returns Promise
     */
    map: async (keys) => service.post(settingApi.map, keys),

    /**
     * 更新设置项
     *
     * @param {any} keys 更新参数
     * @returns Promise
     */
    update: async (params) => service.post(settingApi.update, params)
};

export default settingService;
