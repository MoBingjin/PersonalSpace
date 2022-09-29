import service from '@/utils/request.mod.js';
import appConfig from '@/app.config.mod.js';

/**
 * 标签接口服务
 */
const tagService = {
    /**
     * 获取标签列表
     *
     * @param {any} params 参数
     * @param {number} page 页码
     * @param {number} size 每页数据条数
     * @returns Promise
     */
    list: async (params, page = 1, size = appConfig.pageSize['admin']) =>
        service.post(`/tag/list?page=${page}&size=${size}`, params),

    /**
     * 获取标签信息
     *
     * @param {string} id 标签ID
     * @returns Promise
     */
    info: async (id) => service.get(`/tag/info/${id}`),

    /**
     * 添加标签
     *
     * @param {any} params 参数
     * @returns Promise
     */
    add: async (params) => service.put('/tag/add', params),

    /**
     * 更新标签
     *
     * @param {any} params 参数
     * @returns Promise
     */
    update: async (params) => service.post('/tag/update', params),

    /**
     * 删除标签
     *
     * @param {string} id 标签ID
     * @returns Promise
     */
    remove: async (id) => service.delete(`/tag/remove/${id}`),

    /**
     * 批量删除标签
     *
     * @param {Array<string>} ids 标签ID数组
     * @returns Promise
     */
    removeBatch: async (ids) => service.delete('/tag/batch/remove', { data: ids }),

    /**
     * 修改标签状态
     *
     * @param {string} id 标签ID
     * @returns
     */
    status: async (id) => service.post(`/tag/status/${id}`)
};

export default tagService;
