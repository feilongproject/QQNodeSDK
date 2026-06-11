import { Config, OpenAPIRequest, GroupAPI, GMessageToCreate, MediaUploadResponse, GCMessageResponse, FileToCreate } from '@src/types';
import { RestyResponse } from 'resty-client';
import { getURL } from './resource';

export default class Group implements GroupAPI {
    public request: OpenAPIRequest;
    public config: Config;
    constructor(request: OpenAPIRequest, config: Config) {
        this.request = request;
        this.config = config;
    }

    // 发送消息
    public postMessage(openID: string, message: GMessageToCreate): Promise<RestyResponse<GCMessageResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('groupMessagesURI'),
            rest: {
                openID,
            },
            data: message,
        };
        return this.request<GCMessageResponse>(options);
    }

    // 发送文件
    public postFile(openID: string, message: FileToCreate): Promise<RestyResponse<MediaUploadResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('groupFilesURI'),
            rest: {
                openID,
            },
            data: message,
        };
        return this.request<MediaUploadResponse>(options);
    }

    // 撤回消息
    public deleteMessage(openID: string, messageID: string): Promise<RestyResponse<any>> {
        const params = Object.create(null);
        const options = {
            method: 'DELETE' as const,
            url: getURL('groupMessageURI'),
            rest: {
                openID,
                messageID,
            },
            params,
        };
        return this.request(options);
    }
}
