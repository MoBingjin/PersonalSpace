import service from '@/utils/request.mod.js';

const baseURL = service.defaults.baseURL;

/**
 * 图片接口地址
 */
export const imageApi = {
    /**
     * 上传
     */
    upload: `${baseURL}/image/upload/`
};
