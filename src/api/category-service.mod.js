import service from '@/utils/request.mod.js';
import appConfig from '@/app.config.mod.js';

/**
 * 分类接口服务
 */
const categoryService = {
    /**
     * 获取分类列表
     *
     * @param {any} params 参数
     * @param {number} page 页码
     * @param {number} size 每页数据条数
     * @returns Promise
     */
    list: async (params, page = 1, size = appConfig.pageSize['admin']) =>
        service.post(`/category/list?page=${page}&size=${size}`, params),

    /**
     * 获取分类信息
     *
     * @param {string} id 分类ID
     * @returns Promise
     */
    info: async (id) => service.get(`/category/info/${id}`),

    /**
     * 添加分类
     *
     * @param {any} params 参数
     * @returns Promise
     */
    add: async (params) => service.put('/category/add', params),

    /**
     * 更新分类
     *
     * @param {any} params 参数
     * @returns Promise
     */
    update: async (params) => service.post('/category/update', params),

    /**
     * 删除分类
     *
     * @param {string} id 分类ID
     * @returns Promise
     */
    remove: async (id) => service.delete(`/category/remove/${id}`),

    /**
     * 批量删除分类
     *
     * @param {Array<string>} ids 分类ID数组
     * @returns Promise
     */
    removeBatch: async (ids) => service.delete('/category/batch/remove', { data: ids }),

    /**
     * 修改分类状态
     *
     * @param {string} id 分类ID
     * @returns
     */
    status: async (id) => service.post(`/category/status/${id}`)
};

export default categoryService;
