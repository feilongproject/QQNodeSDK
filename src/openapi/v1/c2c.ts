import { Config, OpenAPIRequest, C2CAPI, CMessageToCreate, StreamMessageRequest, GCMessageResponse, FileToCreate, MediaUploadResponse } from '@src/types';
import { RestyResponse } from 'resty-client';
import { getURL } from './resource';
import { ChunkedUpload } from '@src/utils/chunked-upload';

export default class C2C implements C2CAPI {
    public request: OpenAPIRequest;
    public config: Config;
    private chunkedUpload: ChunkedUpload;
    constructor(request: OpenAPIRequest, config: Config) {
        this.request = request;
        this.config = config;
        this.chunkedUpload = new ChunkedUpload(request, config);
    }

    // 发送消息
    public postMessage(openID: string, message: CMessageToCreate): Promise<RestyResponse<GCMessageResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('c2cMessagesURI'),
            rest: {
                openID,
            },
            data: message,
        };
        return this.request<GCMessageResponse>(options);
    }

    // 流式发送单聊消息
    public postStreamingMessage(openID: string, message: StreamMessageRequest): Promise<RestyResponse<GCMessageResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('c2cStreamingMessagesURI'),
            rest: {
                openID,
            },
            data: message,
        };
        return this.request<GCMessageResponse>(options);
    }

    // 发送文件；useChunkedUpload = true 时启用分片上传
    public postFile(openID: string, message: FileToCreate, useChunkedUpload = false): Promise<RestyResponse<MediaUploadResponse>> {
        if (useChunkedUpload) {
            return this.chunkedUpload.uploadFile(
                openID,
                {
                    prepareURL: getURL('c2cUploadPrepareURI'),
                    partFinishURL: getURL('c2cUploadPartFinishURI'),
                    mergeURL: getURL('c2cFilesURI'),
                },
                message,
            );
        }
        const options = {
            method: 'POST' as const,
            url: getURL('c2cFilesURI'),
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
            url: getURL('c2cMessageURI'),
            rest: {
                openID,
                messageID,
            },
            params,
        };
        return this.request(options);
    }
}
