import {
    Config,
    OpenAPIRequest,
    MediaImagesAPI,
    MediaImagePreparePayload,
    IMediaImagePrepareResponse,
    MediaImageCompletePayload,
    IMediaImageCompleteResponse,
    MediaImageListPager,
    IMediaImageListResponse,
} from '@src/types';
import { RestyResponse } from 'resty-client';
import { getURL } from './resource';

export default class MediaImages implements MediaImagesAPI {
    public request: OpenAPIRequest;
    public config: Config;
    constructor(request: OpenAPIRequest, config: Config) {
        this.request = request;
        this.config = config;
    }

    /**
     * 申请图片上传
     * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#申请图片上传
     */
    public prepare(payload: MediaImagePreparePayload): Promise<RestyResponse<IMediaImagePrepareResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('mediaImagesPrepareURI'),
            data: payload,
        };
        return this.request<IMediaImagePrepareResponse>(options);
    }

    /**
     * 完成图片上传
     * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#完成图片上传
     */
    public complete(payload: MediaImageCompletePayload): Promise<RestyResponse<IMediaImageCompleteResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('mediaImagesCompleteURI'),
            data: payload,
        };
        return this.request<IMediaImageCompleteResponse>(options);
    }

    /**
     * 查询有效图片列表
     * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#查询有效图片
     */
    public list(pager?: MediaImageListPager): Promise<RestyResponse<IMediaImageListResponse>> {
        const options = {
            method: 'GET' as const,
            url: getURL('mediaImagesURI'),
            params: pager,
        };
        return this.request<IMediaImageListResponse>(options);
    }

    /**
     * 删除图片
     * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#删除图片
     */
    public delete(imageID: string): Promise<RestyResponse<any>> {
        const options = {
            method: 'DELETE' as const,
            url: getURL('mediaImageDeleteURI'),
            rest: {
                imageID,
            },
        };
        return this.request(options);
    }
}
